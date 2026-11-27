import { api, isAuthRedirectedError } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  getCachedKeyboardHeight,
  getLiveKeyboardSnapshot,
  loadPersistedKeyboardHeight,
  persistKeyboardHeight,
  reconcileLiveKeyboard,
  subscribeLiveKeyboard,
  type LiveKeyboardSnapshot,
} from "@/lib/keyboard-height";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import SmileIcon from "@hugeicons/core-free-icons/SmileIcon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import KeyboardIcon from "@hugeicons/core-free-icons/KeyboardIcon";
import Image01Icon from "@hugeicons/core-free-icons/Image01Icon";
import HugeIcon from "@/components/ui/HugeIcon";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
} from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import type {
  RichTextContentItem,
  RichTextInputRef,
} from "react-native-rich-text-fabric";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EmojiPanel from "./EmojiPanel";
import RichComposerInput from "./RichComposerInput";
import {
  ARTICLE_NAV_HEIGHT,
  BACKDROP_EDGE_GUARD,
  COMPOSER_HEADER_HEIGHT,
  COMPOSER_INPUT_HEIGHT,
  COMPOSER_TOOLBAR_HEIGHT,
  KEYBOARD_HIDE_ANIMATION_FALLBACK_MS,
  MIN_KEYBOARD_HEIGHT,
  PICKER_RESTORE_FOCUS_DELAY_MS,
  SHEET_TOP_GAP,
} from "./composerConstants";
import type {
  CommentComposerModalProps,
  EmojiGroup,
  EmojiItem,
  PanelMode,
} from "./composerTypes";
import { getCachedEmojiPayload, readEmojiCache } from "./emojiCache";
import { uploadCommentImages } from "./imageUpload";
import {
  createEmojiImageItem,
  getRichPlainText,
  hasRichContent,
  serializeRichContentToHtml,
} from "./richContent";

type UploadedAttachment = {
  id: string;
  previewUri: string;
  progress: number;
  status: "uploading" | "uploaded";
  url?: string;
};

const ATTACHMENT_PREVIEW_HEIGHT = 150;
const AWAITING_KEYBOARD_TIMEOUT_MS = 1000;
const PANEL_DISMISS_GUARD_MS = 600;
const STALE_HIDE_GRACE_MS = 350;

// 底部占位区的归属。键盘与功能面板互斥，且共用同一高度，用单一状态表达「现在是谁占着这块地方」，避免两个来源各算一遍高度。
type DockMode = "none" | "keyboard" | "panel";

const CommentComposerModal = forwardRef<
  BottomSheetModal,
  CommentComposerModalProps
>(function CommentComposerModal(
  { articleId, parentId, replyToName, onClose, onSubmitted },
  ref,
) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const modalRef = ref as React.RefObject<BottomSheetModal>;
  const inputRef = useRef<RichTextInputRef>(null);
  const cachedEmojiPayload = getCachedEmojiPayload();

  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const isClosingRef = useRef(false);
  /** 每次打开/关闭递增，用于隔离跨次开关残留的定时器与异步回调 */
  const openSessionRef = useRef(0);
  const imagePickerActiveRef = useRef(false);
  const restoreAfterImagePickerRef = useRef(false);

  const [content, setContent] = useState<RichTextContentItem[]>([]);
  const [plainContent, setPlainContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [emojiGroups, setEmojiGroups] = useState<EmojiGroup[]>(
    cachedEmojiPayload?.groups ?? [],
  );
  const [selectedEmojiGroupIndex, setSelectedEmojiGroupIndex] = useState(0);

  const [panelMode, setPanelMode] = useState<PanelMode | null>(null);
  // 底部占位区的归属，键盘与功能面板互斥。
  const [dock, setDock] = useState<DockMode>("keyboard");
  const dockRef = useRef<DockMode>("keyboard");
  /** 键盘收起动画时长，同步给 BottomSheet 的 animationConfigs，收完归零 */
  const [hideAnimDuration, setHideAnimDuration] = useState<number | null>(null);
  /** 面板打开过一次后常驻挂载，避免每次开关都重新挂载表情列表 */
  const [panelMounted, setPanelMounted] = useState(false);

  /** 已请求聚焦、正在等键盘升起；这段窗口内忽略上一次关闭的迟到 hide 事件 */
  const awaitingKeyboardRef = useRef(false);
  const retriedAfterStaleHideRef = useRef(false);
  /** 正在主动收键盘切表情面板，避免把切面板瞬间的残留 didShow 当成重新抬键盘 */
  const dismissingKeyboardForPanelRef = useRef(false);
  const lastKeyboardShowAtRef = useRef(0);
  const sawWillHideSinceShowRef = useRef(false);
  const isInputFocusedRef = useRef(false);

  const didAutoFocusOnOpenRef = useRef(false);
  const inputReadyRef = useRef(false);

  const awaitingKeyboardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const panelDismissGuardTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const staleHideVerifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const initialFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const focusRetryTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pendingSnapToIndexRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pickerRestoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [panelKeyboardHeight, setPanelKeyboardHeight] = useState(() =>
    getCachedKeyboardHeight(),
  );
  const [liveKeyboard, setLiveKeyboard] = useState<LiveKeyboardSnapshot>(() =>
    getLiveKeyboardSnapshot(),
  );

  const updateDock = useCallback((next: DockMode) => {
    dockRef.current = next;
    setDock(next);
  }, []);

  useEffect(() => {
    dockRef.current = dock;
  }, [dock]);

  const rawKeyboardHeight =
    liveKeyboard.isVisible && liveKeyboard.height > 0
      ? Math.max(0, liveKeyboard.height - insets.bottom)
      : 0;

  const keyboardVisible = liveKeyboard.isVisible && liveKeyboard.height > 0;

  // Android 的 adjustResize 会在键盘弹出时压缩 window.height。
  const [layoutWindowHeight, setLayoutWindowHeight] = useState(windowHeight);
  useEffect(() => {
    if (
      (keyboardVisible || dock === "keyboard") &&
      windowHeight < layoutWindowHeight
    ) {
      return;
    }
    if (windowHeight !== layoutWindowHeight) {
      setLayoutWindowHeight(windowHeight);
    }
  }, [dock, keyboardVisible, layoutWindowHeight, windowHeight]);

  const sheetTopInset = insets.top + ARTICLE_NAV_HEIGHT + SHEET_TOP_GAP;
  const maxSheetHeight = layoutWindowHeight - sheetTopInset;
  const attachmentPreviewHeight =
    attachments.length > 0 ? ATTACHMENT_PREVIEW_HEIGHT : 0;
  const fixedContentHeight =
    COMPOSER_HEADER_HEIGHT +
    COMPOSER_INPUT_HEIGHT +
    attachmentPreviewHeight +
    COMPOSER_TOOLBAR_HEIGHT +
    insets.bottom;
  // 键盘/面板的可用高度按「不含附件条」的固定内容算，保证贴图之后工具栏仍不会被顶出可视区。
  const fixedContentHeightWithoutAttachment =
    COMPOSER_HEADER_HEIGHT +
    COMPOSER_INPUT_HEIGHT +
    COMPOSER_TOOLBAR_HEIGHT +
    insets.bottom;
  const maxAccessoryHeight = useMemo(
    () => Math.max(0, maxSheetHeight - fixedContentHeightWithoutAttachment),
    [fixedContentHeightWithoutAttachment, maxSheetHeight],
  );

  /** 键盘与面板共用的占位高度，取上次实测的键盘高度 */
  const dockReserve = Math.min(panelKeyboardHeight, maxAccessoryHeight);
  const panelOpen = dock === "panel" && panelMode !== null;

  // 键盘真正弹起后改用它的实测高度，避免首次打开时按默认值撑开再跳一次。
  const keyboardReserve =
    keyboardVisible && rawKeyboardHeight >= MIN_KEYBOARD_HEIGHT
      ? Math.min(rawKeyboardHeight, maxAccessoryHeight)
      : dockReserve;

  const accessoryHeight = panelOpen ? dockReserve : 0;
  const keyboardAvoidanceHeight = dock === "keyboard" ? keyboardReserve : 0;
  /** 面板容器高度；0 表示收起，渲染时用 display:none 跳过布局 */
  const panelHeight = accessoryHeight;

  const stableContentHeight = fixedContentHeight + accessoryHeight;
  const actualContentHeight = stableContentHeight;

  // 取整避免非整数密度设备上与原生布局测量出现 0.36px 误差。
  const sheetHeight = Math.round(
    Math.min(stableContentHeight + keyboardAvoidanceHeight, maxSheetHeight),
  );
  const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);
  const sheetAnimationConfigs = useMemo(
    () => (hideAnimDuration ? { duration: hideAnimDuration } : undefined),
    [hideAnimDuration],
  );

  const clearFocusRetryTimers = useCallback(() => {
    focusRetryTimersRef.current.forEach(clearTimeout);
    focusRetryTimersRef.current = [];
  }, []);

  const clearInitialFocusTimer = useCallback(() => {
    if (!initialFocusTimerRef.current) return;
    clearTimeout(initialFocusTimerRef.current);
    initialFocusTimerRef.current = null;
  }, []);

  const clearAwaitingKeyboard = useCallback(() => {
    awaitingKeyboardRef.current = false;
    retriedAfterStaleHideRef.current = false;
    if (awaitingKeyboardTimerRef.current) {
      clearTimeout(awaitingKeyboardTimerRef.current);
      awaitingKeyboardTimerRef.current = null;
    }
  }, []);

  const clearPanelDismissGuard = useCallback(() => {
    dismissingKeyboardForPanelRef.current = false;
    if (panelDismissGuardTimerRef.current) {
      clearTimeout(panelDismissGuardTimerRef.current);
      panelDismissGuardTimerRef.current = null;
    }
  }, []);

  const clearStaleHideVerifyTimer = useCallback(() => {
    if (staleHideVerifyTimerRef.current) {
      clearTimeout(staleHideVerifyTimerRef.current);
      staleHideVerifyTimerRef.current = null;
    }
  }, []);

  const clearPendingSnapTimer = useCallback(() => {
    if (pendingSnapToIndexRef.current) {
      clearTimeout(pendingSnapToIndexRef.current);
      pendingSnapToIndexRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearInitialFocusTimer();
    clearFocusRetryTimers();
    clearAwaitingKeyboard();
    clearPanelDismissGuard();
    clearStaleHideVerifyTimer();
    clearPendingSnapTimer();
    if (pickerRestoreTimerRef.current) {
      clearTimeout(pickerRestoreTimerRef.current);
      pickerRestoreTimerRef.current = null;
    }
  }, [
    clearAwaitingKeyboard,
    clearFocusRetryTimers,
    clearInitialFocusTimer,
    clearPanelDismissGuard,
    clearPendingSnapTimer,
    clearStaleHideVerifyTimer,
  ]);

  const scheduleSnapToIndex = useCallback(() => {
    clearPendingSnapTimer();
    const session = openSessionRef.current;
    pendingSnapToIndexRef.current = setTimeout(() => {
      pendingSnapToIndexRef.current = null;
      if (
        openSessionRef.current !== session ||
        !modalRef.current ||
        !isOpenRef.current ||
        isClosingRef.current
      ) {
        return;
      }
      modalRef.current.snapToIndex(0);
    }, 32);
  }, [clearPendingSnapTimer, modalRef]);

  useEffect(() => {
    if (!isOpenRef.current || isClosingRef.current) return;
    const session = openSessionRef.current;
    const timer = setTimeout(() => {
      if (
        openSessionRef.current !== session ||
        !isOpenRef.current ||
        isClosingRef.current
      ) {
        return;
      }
      scheduleSnapToIndex();
    }, 90);
    return () => clearTimeout(timer);
  }, [actualContentHeight, scheduleSnapToIndex, sheetHeight]);

  const richInputTextStyle = useMemo(
    () => ({ fontSize: 14, lineHeight: 22, color: theme.text }),
    [theme.text],
  );

  const placeholderStyle = useMemo(
    () => ({ ...richInputTextStyle, color: theme.secondary }),
    [richInputTextStyle, theme.secondary],
  );

  const createEmojiImage = useCallback((emoji: EmojiItem) => {
    return createEmojiImageItem(emoji);
  }, []);

  const canSubmit =
    !!articleId &&
    (hasRichContent(content, plainContent) ||
      attachments.some((attachment) => attachment.url)) &&
    !isSubmitting &&
    !attachments.some((attachment) => attachment.status === "uploading");
  const selectedEmojiItems = useMemo(() => {
    if (selectedEmojiGroupIndex === 0) {
      return emojiGroups.flatMap((group) => group.items);
    }
    return emojiGroups[selectedEmojiGroupIndex - 1]?.items ?? [];
  }, [emojiGroups, selectedEmojiGroupIndex]);

  const focusRichInput = useCallback(() => {
    clearFocusRetryTimers();
    const session = openSessionRef.current;
    KeyboardController.preload();

    const focusOnce = () => {
      if (
        openSessionRef.current !== session ||
        !isOpenRef.current ||
        isClosingRef.current ||
        dockRef.current !== "keyboard"
      ) {
        return;
      }
      // 先让新的 RichTextInput 获取焦点
      inputRef.current?.focus();
      if (isInputFocusedRef.current) {
        KeyboardController.setFocusTo("current");
      }
    };

    focusRetryTimersRef.current = [0, 64, 180].map((delay) =>
      setTimeout(focusOnce, delay),
    );
    focusRetryTimersRef.current.push(
      setTimeout(() => {
        if (
          openSessionRef.current !== session ||
          !isOpenRef.current ||
          isClosingRef.current ||
          dockRef.current !== "keyboard"
        ) {
          return;
        }
        const latest = reconcileLiveKeyboard();
        if (!latest.isVisible) {
          inputRef.current?.focus();
          KeyboardController.setFocusTo("current");
        }
        scheduleSnapToIndex();
      }, 280),
    );
  }, [clearFocusRetryTimers, scheduleSnapToIndex]);

  const armAwaitingKeyboard = useCallback(
    (session: number) => {
      awaitingKeyboardRef.current = true;
      retriedAfterStaleHideRef.current = false;
      if (awaitingKeyboardTimerRef.current) {
        clearTimeout(awaitingKeyboardTimerRef.current);
      }
      awaitingKeyboardTimerRef.current = setTimeout(() => {
        awaitingKeyboardTimerRef.current = null;
        if (
          openSessionRef.current !== session ||
          !isOpenRef.current ||
          isClosingRef.current
        ) {
          awaitingKeyboardRef.current = false;
          return;
        }
        awaitingKeyboardRef.current = false;
        // 超时前先向原生侧核对一次真实键盘状态：如果键盘其实已经可见（例如快速重开或跨输入切换时未触发新的 willShow），必须保持 dock="keyboard"，不能掉底。
        const latest = reconcileLiveKeyboard();
        if (latest.isVisible && latest.height > 0) {
          setLiveKeyboard(latest);
          return;
        }
        if (dockRef.current === "keyboard") {
          updateDock("none");
        }
      }, AWAITING_KEYBOARD_TIMEOUT_MS);
    },
    [updateDock],
  );

  const armPanelDismissGuard = useCallback(() => {
    dismissingKeyboardForPanelRef.current = true;
    if (panelDismissGuardTimerRef.current) {
      clearTimeout(panelDismissGuardTimerRef.current);
    }
    panelDismissGuardTimerRef.current = setTimeout(() => {
      panelDismissGuardTimerRef.current = null;
      dismissingKeyboardForPanelRef.current = false;
    }, PANEL_DISMISS_GUARD_MS);
  }, []);

  // 仅在弹窗打开或准备打开时订阅全局键盘状态机（避免评论列表里几十个关闭态 CommentComposerModal 在每次弹键盘时集体无意义重渲染）。
  const isComposerActive = isOpen || Boolean(articleId);
  useEffect(() => {
    if (!isComposerActive) return;

    const syncTask = setTimeout(() => {
      const current = reconcileLiveKeyboard();
      setLiveKeyboard((prev) =>
        prev.updatedAt === current.updatedAt &&
        prev.isVisible === current.isVisible &&
        prev.height === current.height &&
        prev.phase === current.phase
          ? prev
          : current,
      );
    }, 0);

    const unsubscribe = subscribeLiveKeyboard((snapshot, eventType) => {
      setLiveKeyboard(snapshot);

      if (!isOpenRef.current || isClosingRef.current) return;

      if (eventType === "willShow" || eventType === "didShow") {
        if (snapshot.height <= 0) return;

        // 切面板刚调用 dismiss({ keepFocus: true }) 时可能收到上一段 show 的尾事件
        if (eventType === "didShow" && dismissingKeyboardForPanelRef.current) {
          return;
        }

        lastKeyboardShowAtRef.current = snapshot.updatedAt;
        sawWillHideSinceShowRef.current = false;
        clearStaleHideVerifyTimer();
        clearPanelDismissGuard();
        clearFocusRetryTimers();
        clearAwaitingKeyboard();
        setHideAnimDuration(null);
        setPanelMode(null);
        updateDock("keyboard");
        return;
      }

      if (eventType === "willHide") {
        // 正在主动拉起键盘（刚打开、面板切键盘、选图返回）时忽略上一次关闭的迟到 hide
        if (awaitingKeyboardRef.current) return;
        if (dockRef.current !== "keyboard") return;

        sawWillHideSinceShowRef.current = true;
        setHideAnimDuration(
          snapshot.duration > 0
            ? snapshot.duration
            : KEYBOARD_HIDE_ANIMATION_FALLBACK_MS,
        );
        updateDock("none");
        return;
      }

      if (eventType === "didHide") {
        clearPanelDismissGuard();
        setHideAnimDuration(null);

        // 上一次关闭残留的 didHide 在本次打开聚焦窗口内到达：绝不把 dock 归零
        if (awaitingKeyboardRef.current) {
          if (!retriedAfterStaleHideRef.current) {
            retriedAfterStaleHideRef.current = true;
            focusRichInput();
          }
          return;
        }

        // 若刚刚收到过 willShow/didShow 且中间并未收到 willHide，说明这是一条打断动画的迟到 didHide，延迟核对原生状态后再决定是否回落
        const sinceLastShow = Date.now() - lastKeyboardShowAtRef.current;
        if (
          !sawWillHideSinceShowRef.current &&
          sinceLastShow < STALE_HIDE_GRACE_MS &&
          isInputFocusedRef.current
        ) {
          clearStaleHideVerifyTimer();
          const session = openSessionRef.current;
          staleHideVerifyTimerRef.current = setTimeout(() => {
            staleHideVerifyTimerRef.current = null;
            if (
              openSessionRef.current !== session ||
              !isOpenRef.current ||
              isClosingRef.current
            ) {
              return;
            }
            const latest = reconcileLiveKeyboard();
            if (latest.isVisible && latest.height > 0) {
              setLiveKeyboard(latest);
              updateDock("keyboard");
              return;
            }
            if (!awaitingKeyboardRef.current && dockRef.current === "keyboard") {
              updateDock("none");
            }
          }, 140);
          return;
        }

        if (dockRef.current === "keyboard") {
          updateDock("none");
        }
      }
    });

    return () => {
      clearTimeout(syncTask);
      unsubscribe();
    };
  }, [
    clearAwaitingKeyboard,
    clearFocusRetryTimers,
    clearPanelDismissGuard,
    clearStaleHideVerifyTimer,
    focusRichInput,
    isComposerActive,
    updateDock,
  ]);

  const resetComposerContent = useCallback(() => {
    inputRef.current?.clearContent();
    setContent([]);
    setPlainContent("");
  }, []);

  const setSheetOpen = useCallback((open: boolean) => {
    isOpenRef.current = open;
    setIsOpen(open);
    if (!open) {
      didAutoFocusOnOpenRef.current = false;
    }
  }, []);

  // 记录真实键盘高度，供下次打开与切换表情面板时复用（键盘与面板同高，切换才不会跳）。
  useEffect(() => {
    if (!keyboardVisible || rawKeyboardHeight < MIN_KEYBOARD_HEIGHT) return;
    const task = setTimeout(() => {
      setPanelKeyboardHeight((current) => {
        if (Math.abs(current - rawKeyboardHeight) < 1) return current;
        void persistKeyboardHeight(rawKeyboardHeight);
        return rawKeyboardHeight;
      });
    }, 0);
    return () => clearTimeout(task);
  }, [rawKeyboardHeight, keyboardVisible]);

  // 共享 lib/keyboard-height 的单例读取，列表里多个评论项不会重复读 SecureStore。
  useEffect(() => {
    let cancelled = false;
    void loadPersistedKeyboardHeight().then((height) => {
      if (cancelled) return;
      setPanelKeyboardHeight((current) =>
        Math.abs(current - height) < 1 ? current : height,
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  useEffect(() => {
    let cancelled = false;
    readEmojiCache().then((payload) => {
      if (cancelled || !payload) return;
      setEmojiGroups(payload.groups);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** 请求键盘：标记「正在等键盘升起」，并给一个带原生状态核对的超时兜底 */
  const requestKeyboard = useCallback(() => {
    clearPanelDismissGuard();
    clearStaleHideVerifyTimer();
    setHideAnimDuration(null);
    armAwaitingKeyboard(openSessionRef.current);
    focusRichInput();
  }, [
    armAwaitingKeyboard,
    clearPanelDismissGuard,
    clearStaleHideVerifyTimer,
    focusRichInput,
  ]);

  // 返回后要把焦点还回去，否则用户选完图会卡在「既没有键盘也没有面板」的中间态 —— 表现为点开图库前键盘还在，回来后输入框怎么点都要再等一次。
  const restoreKeyboardAfterPicker = useCallback(
    (delay: number) => {
      if (pickerRestoreTimerRef.current) {
        clearTimeout(pickerRestoreTimerRef.current);
      }
      const session = openSessionRef.current;
      pickerRestoreTimerRef.current = setTimeout(() => {
        pickerRestoreTimerRef.current = null;
        if (
          openSessionRef.current !== session ||
          !isOpenRef.current ||
          isClosingRef.current
        ) {
          return;
        }
        updateDock("keyboard");
        requestKeyboard();
      }, delay);
    },
    [requestKeyboard, updateDock],
  );

  const requestInitialKeyboardFocus = useCallback(() => {
    if (
      didAutoFocusOnOpenRef.current ||
      !isOpenRef.current ||
      isClosingRef.current
    ) {
      return;
    }
    clearInitialFocusTimer();
    const session = openSessionRef.current;
    initialFocusTimerRef.current = setTimeout(() => {
      initialFocusTimerRef.current = null;
      if (
        openSessionRef.current !== session ||
        didAutoFocusOnOpenRef.current ||
        !isOpenRef.current ||
        isClosingRef.current ||
        !inputReadyRef.current
      ) {
        return;
      }
      didAutoFocusOnOpenRef.current = true;
      setPanelMode(null);
      updateDock("keyboard");
      // 无论当前 liveKeyboard.isVisible 是 true 还是 false 都必须主动 requestKeyboard()：快速关闭再打开时
      requestKeyboard();
    }, 16);
  }, [clearInitialFocusTimer, requestKeyboard, updateDock]);

  const handleInputReady = useCallback(() => {
    inputReadyRef.current = true;
    requestInitialKeyboardFocus();
  }, [requestInitialKeyboardFocus]);

  const handleInputUnmount = useCallback(() => {
    inputReadyRef.current = false;
    isInputFocusedRef.current = false;
  }, []);

  /** 面板 -> 键盘：收起面板，把焦点交还输入框 */
  const focusKeyboardFromPanel = useCallback(() => {
    setPanelMode(null);
    updateDock("keyboard");
    requestKeyboard();
  }, [requestKeyboard, updateDock]);

  // 键盘 -> 面板：先收键盘再撑开面板。
  const openPanel = useCallback(
    (mode: PanelMode) => {
      clearAwaitingKeyboard();
      clearFocusRetryTimers();
      clearStaleHideVerifyTimer();
      setHideAnimDuration(null);
      setPanelMode(mode);
      setPanelMounted(true);
      updateDock("panel");
      if (getLiveKeyboardSnapshot().isVisible || keyboardVisible) {
        armPanelDismissGuard();
        void KeyboardController.dismiss({ keepFocus: true });
      }
    },
    [
      armPanelDismissGuard,
      clearAwaitingKeyboard,
      clearFocusRetryTimers,
      clearStaleHideVerifyTimer,
      keyboardVisible,
      updateDock,
    ],
  );

  const handleEmojiPress = useCallback(() => {
    if (panelMode === "emoji" && dock === "panel") {
      focusKeyboardFromPanel();
      return;
    }
    openPanel("emoji");
  }, [dock, focusKeyboardFromPanel, openPanel, panelMode]);

  const handleImagePress = useCallback(async () => {
    if (isSubmitting) return;

    // 否则用户选完图会停在「既没有键盘也没有面板」的中间态，得再点一次输入框。
    const shouldRestoreKeyboard =
      dockRef.current === "keyboard" ||
      isInputFocusedRef.current ||
      getLiveKeyboardSnapshot().isVisible;
    /** 相册期间 sheet 被系统关掉过（Android 切 Activity），需要重新 present */
    let representedSheet = false;

    imagePickerActiveRef.current = true;
    restoreAfterImagePickerRef.current = false;

    /** 相册返回后的统一收尾：必要时重新 present，再还焦点。只跑一次 */
    let settled = false;
    const settleAfterPicker = () => {
      if (settled) return;
      settled = true;
      imagePickerActiveRef.current = false;
      if (restoreAfterImagePickerRef.current) {
        restoreAfterImagePickerRef.current = false;
        isClosingRef.current = false;
        const session = openSessionRef.current + 1;
        openSessionRef.current = session;
        if (shouldRestoreKeyboard) {
          updateDock("keyboard");
          armAwaitingKeyboard(session);
        }
        modalRef.current?.present();
        setSheetOpen(true);
        representedSheet = true;
      }
      if (shouldRestoreKeyboard) {
        // 重新 present 时多等一段，让 sheet 动画走完再 focus
        restoreKeyboardAfterPicker(
          representedSheet
            ? PICKER_RESTORE_FOCUS_DELAY_MS + 120
            : PICKER_RESTORE_FOCUS_DELAY_MS,
        );
      }
    };

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      settleAfterPicker();
      showToast(t("article.actionFailed"));
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 1,
      });
      settleAfterPicker();
      if (result.canceled || !result.assets[0]?.uri) return;

      const uploadId = `${Date.now()}-${Math.random()}`;
      const nextAttachments = result.assets.map((asset, index) => ({
        id: `${uploadId}-${index}`,
        previewUri: asset.uri,
        progress: 0,
        status: "uploading" as const,
      }));
      const ids = nextAttachments.map((attachment) => attachment.id);

      setAttachments((current) => [...current, ...nextAttachments]);

      try {
        const urls = await uploadCommentImages(result.assets, (progress) => {
          setAttachments((current) =>
            current.map((attachment) =>
              ids.includes(attachment.id)
                ? { ...attachment, progress }
                : attachment,
            ),
          );
        });

        setAttachments((current) =>
          current.map((attachment) => {
            const index = ids.indexOf(attachment.id);
            if (index === -1) return attachment;
            return {
              ...attachment,
              progress: 100,
              status: "uploaded",
              url: urls[index],
            };
          }),
        );
      } catch (error) {
        console.error("[comment-upload] failed to upload images", error);
        if (isAuthRedirectedError(error)) return;
        setAttachments((current) =>
          current.filter((attachment) => !ids.includes(attachment.id)),
        );
        showToast(t("article.actionFailed"));
      }
    } catch (error) {
      console.error("[comment-upload] failed to upload images", error);
      if (isAuthRedirectedError(error)) return;
      showToast(t("article.actionFailed"));
    } finally {
      // 正常路径已经在拿到相册结果时收尾过，这里兜住异常路径（settled 保证幂等）
      settleAfterPicker();
    }
  }, [
    armAwaitingKeyboard,
    isSubmitting,
    modalRef,
    restoreKeyboardAfterPicker,
    setSheetOpen,
    showToast,
    t,
    updateDock,
  ]);

  const handleInputFocus = useCallback(() => {
    isInputFocusedRef.current = true;
    if (!isOpenRef.current || isClosingRef.current) return;

    // 注意：此处不要清 awaitingKeyboardRef！
    clearFocusRetryTimers();
    const session = openSessionRef.current;

    requestAnimationFrame(() => {
      if (
        openSessionRef.current !== session ||
        !isOpenRef.current ||
        isClosingRef.current ||
        dockRef.current !== "keyboard"
      ) {
        return;
      }
      KeyboardController.setFocusTo("current");
    });

    // 焦点到位但键盘动画被旧关闭动画吞掉时的单次兜底补拉
    if (!getLiveKeyboardSnapshot().isVisible) {
      focusRetryTimersRef.current = [
        setTimeout(() => {
          if (
            openSessionRef.current !== session ||
            !isOpenRef.current ||
            isClosingRef.current ||
            dockRef.current !== "keyboard"
          ) {
            return;
          }
          const latest = reconcileLiveKeyboard();
          if (!latest.isVisible) {
            KeyboardController.setFocusTo("current");
            inputRef.current?.focus();
          }
        }, 260),
      ];
    }

    if (dockRef.current === "panel") {
      clearPanelDismissGuard();
      setPanelMode(null);
    }
    setHideAnimDuration(null);
    updateDock("keyboard");
    scheduleSnapToIndex();
  }, [
    clearFocusRetryTimers,
    clearPanelDismissGuard,
    scheduleSnapToIndex,
    updateDock,
  ]);

  const handleInputBlur = useCallback(() => {
    isInputFocusedRef.current = false;
  }, []);

  const handleInputPress = useCallback(() => {
    // 面板开着时点输入框 = 关面板、抬键盘
    if (dockRef.current === "panel") {
      focusKeyboardFromPanel();
      return;
    }

    // 键盘已经在，只是重新点了一下输入框
    if (dockRef.current === "keyboard" && getLiveKeyboardSnapshot().isVisible) {
      scheduleSnapToIndex();
      requestAnimationFrame(() => KeyboardController.setFocusTo("current"));
      return;
    }

    setHideAnimDuration(null);
    updateDock("keyboard");
    requestKeyboard();
  }, [focusKeyboardFromPanel, requestKeyboard, scheduleSnapToIndex, updateDock]);

  const handleSheetOpened = useCallback(() => {
    if (isOpenRef.current) return;
    isClosingRef.current = false;
    const session = openSessionRef.current + 1;
    openSessionRef.current = session;
    setSheetOpen(true);
    setHideAnimDuration(null);
    setPanelMode(null);
    updateDock("keyboard");
    // 在 onReady 之前就开启保护窗口，拦截上一次关闭尚未结束的 hide 事件
    armAwaitingKeyboard(session);
    if (inputReadyRef.current) {
      requestInitialKeyboardFocus();
    }
    scheduleSnapToIndex();
  }, [
    armAwaitingKeyboard,
    requestInitialKeyboardFocus,
    scheduleSnapToIndex,
    setSheetOpen,
    updateDock,
  ]);

  const handleSheetClosing = useCallback(() => {
    if (imagePickerActiveRef.current) return;
    isClosingRef.current = true;
    openSessionRef.current += 1;
    clearAllTimers();
    setSheetOpen(false);
    // 随 sheet 关闭动画同步收起键盘，避免键盘滞后 250ms 才开始收起并在下次打开时串台
    inputRef.current?.blur();
    void KeyboardController.dismiss();
  }, [clearAllTimers, setSheetOpen]);

  const handleContentChange = useCallback((next: RichTextContentItem[]) => {
    setContent(next);
    setPlainContent(getRichPlainText(next));
  }, []);

  const handleEmojiSelect = useCallback(
    (emoji: EmojiItem) => {
      inputRef.current?.insertImage(createEmojiImage(emoji));
    },
    [createEmojiImage],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const nextContent = inputRef.current?.getContent() ?? content;
      await api.commentControllerCreate({
        article_id: String(articleId),
        parent_id: parentId != null ? String(parentId) : undefined,
        content: serializeRichContentToHtml(nextContent, {
          emojiGroups,
        }).trim(),
        images: attachments
          .map((attachment) => attachment.url)
          .filter((url): url is string => Boolean(url)),
      });
      resetComposerContent();
      setAttachments([]);
      await onSubmitted?.();
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    } catch (error) {
      if (isAuthRedirectedError(error)) return;
      showToast(t("article.actionFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    articleId,
    attachments,
    canSubmit,
    content,
    emojiGroups,
    onSubmitted,
    parentId,
    ref,
    resetComposerContent,
    showToast,
    t,
  ]);

  const handleBackdropPress = useCallback(
    (event: GestureResponderEvent) => {
      // 用 sheetHeight 判断点击区域，避免动画中判断位置偏移
      const sheetTop = windowHeight - sheetHeight;
      if (event.nativeEvent.pageY >= sheetTop - BACKDROP_EDGE_GUARD) return;
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    },
    [sheetHeight, ref, windowHeight],
  );

  const backdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="none"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />
      </BottomSheetBackdrop>
    ),
    [handleBackdropPress],
  );

  useFocusEffect(
    useCallback(() => {
      if (!isOpen) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        return true;
      });
      return () => sub.remove();
    }, [isOpen, ref]),
  );

  const visiblePanelMode = panelOpen ? panelMode : null;
  const emojiPanelActive = visiblePanelMode === "emoji";
  const emojiIconColor = emojiPanelActive ? colors.primary : theme.secondary;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      topInset={sheetTopInset}
      enablePanDownToClose
      enableContentPanningGesture={false}
      keyboardBehavior="extend"
      keyboardBlurBehavior="none"
      android_keyboardInputMode="adjustResize"
      animationConfigs={sheetAnimationConfigs}
      backdropComponent={backdrop}
      handleComponent={null}
      onAnimate={(_, toIndex) => {
        if (toIndex >= 0) {
          handleSheetOpened();
        } else {
          handleSheetClosing();
        }
      }}
      onChange={(index) => {
        if (index >= 0 && !isOpenRef.current) {
          handleSheetOpened();
        }
      }}
      onDismiss={() => {
        if (imagePickerActiveRef.current) {
          restoreAfterImagePickerRef.current = true;
          return;
        }
        isClosingRef.current = false;
        openSessionRef.current += 1;
        clearAllTimers();
        inputReadyRef.current = false;
        isInputFocusedRef.current = false;
        if (getLiveKeyboardSnapshot().isVisible) {
          void KeyboardController.dismiss();
        }
        setSheetOpen(false);
        setHideAnimDuration(null);
        setPanelMode(null);
        // 卸载后恢复为默认键盘占位态，保证下一次 present 首帧即在键盘上方展开
        updateDock("keyboard");
        resetComposerContent();
        setAttachments([]);
        onClose();
      }}
      backgroundStyle={{
        backgroundColor: theme.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 18,
      }}
    >
      <BottomSheetView style={[styles.sheetContent, { height: sheetHeight }]}>
        <View style={[styles.visibleContent, { height: actualContentHeight }]}>
          <View style={styles.header}>
            <ThemedText variant="caption" fontWeight="500">
              {replyToName
                ? t("commentComposer.replyTitle", { name: replyToName })
                : t("commentComposer.title")}
            </ThemedText>
            <Pressable
              hitSlop={12}
              onPress={() =>
                (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
              }
            >
              <HugeIcon icon={Cancel01Icon} size={22} color={theme.foreground} />
            </Pressable>
          </View>

          <RichComposerInput
            inputRef={inputRef}
            height={COMPOSER_INPUT_HEIGHT}
            placeholder={t("commentComposer.placeholder")}
            placeholderTextColor={theme.secondary}
            placeholderStyle={placeholderStyle}
            cursorColor={colors.primary}
            defaultTextStyle={richInputTextStyle}
            defaultImageStyle={styles.richInputImage}
            onContentChange={handleContentChange}
            onReady={handleInputReady}
            onUnmount={handleInputUnmount}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onPress={handleInputPress}
          />

          {attachments.length > 0 && (
            <View style={styles.attachmentSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.attachmentList}
              >
                {attachments.map((attachment) => {
                  const isUploading = attachment.status === "uploading";
                  return (
                    <View key={attachment.id} style={styles.attachmentCard}>
                      <Image
                        source={{
                          uri: attachment.url || attachment.previewUri,
                        }}
                        style={[
                          styles.attachmentImage,
                          isUploading && styles.attachmentImageUploading,
                        ]}
                      />
                      <View style={styles.attachmentControl}>
                        {isUploading && (
                          <View style={styles.uploadProgress}>
                            <ActivityIndicator color="#FFFFFF" size="small" />
                            <ThemedText color="#FFFFFF" size={11}>
                              {attachment.progress}%
                            </ThemedText>
                          </View>
                        )}
                        <Pressable
                          hitSlop={8}
                          style={styles.removeAttachmentButton}
                          onPress={() =>
                            setAttachments((current) =>
                              current.filter(
                                (item) => item.id !== attachment.id,
                              ),
                            )
                          }
                        >
                          <HugeIcon icon={Cancel01Icon} size={20} color="#FFFFFF" />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={[styles.toolbar, { borderTopColor: theme.border }]}>
            <Pressable
              style={styles.toolButton}
              onPress={handleEmojiPress}
              hitSlop={8}
            >
              {emojiPanelActive ? (
                <HugeIcon icon={KeyboardIcon} size={24} color={emojiIconColor} />
              ) : (
                <HugeIcon icon={SmileIcon} size={24} color={emojiIconColor} />
              )}
            </Pressable>
            <Pressable
              style={styles.toolButton}
              onPress={handleImagePress}
              hitSlop={8}
            >
              <HugeIcon icon={Image01Icon} size={24} color={theme.secondary} />
            </Pressable>
            <View style={styles.toolbarSpacer} />
            <Pressable
              disabled={!canSubmit || isSubmitting}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit
                    ? theme.primary
                    : theme.secondaryBackground,
                  opacity: isSubmitting ? 0.65 : 1,
                },
              ]}
            >
              <ThemedText
                size={12}
                fontWeight="600"
                color={canSubmit ? "white" : theme.secondary}
              >
                {isSubmitting
                  ? t("commentComposer.submitting")
                  : t("commentComposer.submit")}
              </ThemedText>
            </Pressable>
          </View>

          {/* 面板容器：打开过一次后常驻挂载，收起时只把高度归零并 display:none，避免每次开关都重新挂载表情列表（也保住了滚动位置）。 */}
          <View
            style={[
              styles.panel,
              {
                height: panelHeight,
                display: panelHeight > 0 ? "flex" : "none",
                backgroundColor: theme.secondaryBackground,
              },
            ]}
            pointerEvents={panelHeight > 0 ? "auto" : "none"}
          >
            {panelMounted && (
              <EmojiPanel
                groups={emojiGroups}
                selectedGroupIndex={selectedEmojiGroupIndex}
                selectedItems={selectedEmojiItems}
                primaryColor={theme.primary}
                secondaryColor={theme.secondary}
                borderColor={theme.border}
                cardColor={theme.card}
                secondaryBackgroundColor={theme.secondaryBackground}
                onSelectGroup={setSelectedEmojiGroupIndex}
                onSelectEmoji={handleEmojiSelect}
              />
            )}
          </View>

          <View style={[styles.safeAreaBottom, { height: insets.bottom }]} />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default CommentComposerModal;

const styles = StyleSheet.create({
  sheetContent: {
    overflow: "hidden",
    flexDirection: "column",
  },
  visibleContent: {
    overflow: "hidden",
    flexDirection: "column",
  },
  header: {
    height: COMPOSER_HEADER_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  richInputImage: {
    width: 24,
    height: 24,
  },
  attachmentSection: {
    height: ATTACHMENT_PREVIEW_HEIGHT,
    justifyContent: "center",
  },
  attachmentList: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "center",
  },
  attachmentCard: {
    width: 130,
    height: ATTACHMENT_PREVIEW_HEIGHT,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#D9D9D9",
  },
  attachmentImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  attachmentImageUploading: {
    opacity: 0.72,
  },
  attachmentControl: {
    position: "absolute",
    top: 8,
    right: 8,
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.72)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 4,
  },
  uploadProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeAttachmentButton: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    height: COMPOSER_TOOLBAR_HEIGHT,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  toolButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabledTool: {
    opacity: 0.45,
  },
  toolbarSpacer: { flex: 1 },
  submitButton: {
    minWidth: 66,
    height: 32,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  panel: {
    overflow: "hidden",
  },
  safeAreaBottom: {
    flexShrink: 0,
  },
});
