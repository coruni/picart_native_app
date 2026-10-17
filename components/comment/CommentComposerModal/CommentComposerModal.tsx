import { api, isAuthRedirectedError } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
import {
  KeyboardController,
  KeyboardEvents,
  useKeyboardState,
} from "react-native-keyboard-controller";
import type {
  RichTextContentItem,
  RichTextInputRef,
} from "react-native-rich-text-fabric";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EmojiPanel from "./EmojiPanel";
import RichComposerInput, {
  type RichComposerInputHandle,
} from "./RichComposerInput";
import {
  ARTICLE_NAV_HEIGHT,
  BACKDROP_EDGE_GUARD,
  COMPOSER_HEADER_HEIGHT,
  COMPOSER_INPUT_HEIGHT,
  COMPOSER_TOOLBAR_HEIGHT,
  DEFAULT_KEYBOARD_HEIGHT,
  KEYBOARD_HEIGHT_STORAGE_KEY,
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

let cachedKeyboardHeight = DEFAULT_KEYBOARD_HEIGHT;

type UploadedAttachment = {
  id: string;
  previewUri: string;
  progress: number;
  status: "uploading" | "uploaded";
  url?: string;
};

const ATTACHMENT_PREVIEW_HEIGHT = 150;

/**
 * 底部占位区的归属。键盘与功能面板互斥，且共用同一高度，
 * 用单一状态表达「现在是谁占着这块地方」，避免两个来源各算一遍高度。
 */
type DockMode = "none" | "keyboard" | "panel";

async function readPersistedKeyboardHeight(): Promise<number | null> {
  try {
    const raw = await SecureStore.getItemAsync(KEYBOARD_HEIGHT_STORAGE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= MIN_KEYBOARD_HEIGHT
      ? value
      : null;
  } catch {
    return null;
  }
}

async function persistKeyboardHeight(height: number): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYBOARD_HEIGHT_STORAGE_KEY, String(height));
  } catch {
    // This is only an optimization for the next open.
  }
}

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
  const inputBridgeRef = useRef<RichComposerInputHandle>(null);
  const cachedEmojiPayload = getCachedEmojiPayload();

  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
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
  /**
   * 底部占位区的归属，键盘与功能面板互斥。
   *
   * 二者共用同一个占位高度（都按实测键盘高度撑开），所以 dock 在
   * keyboard <-> panel 之间切换时 sheet 高度不变，只有内容互换。
   * 这是消除「键盘避让与面板互相抢高度」的关键：只让一个来源算高度。
   */
  const [dock, setDock] = useState<DockMode>("none");
  /** 面板打开过一次后常驻挂载，避免每次开关都重新挂载表情列表 */
  const [panelMounted, setPanelMounted] = useState(false);
  /** 已请求聚焦、正在等键盘升起；这段窗口内不要把 dock 回落成 none */
  const awaitingKeyboardRef = useRef(false);
  const isInputFocusedRef = useRef(false);

  const didAutoFocusOnOpenRef = useRef(false);
  const inputReadyRef = useRef(false);
  /** 「等键盘升起」状态的超时兜底，防止 focus 失败后 dock 卡在 keyboard */
  const awaitingKeyboardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const initialFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const focusRetryTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [panelKeyboardHeight, setPanelKeyboardHeight] =
    useState(cachedKeyboardHeight);

  const pendingSnapToIndexRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  /**
   * 下一次 snapToIndex 要用的动画时长。
   * 键盘收起时写入键盘自己的 duration，用一次就清掉 —— 用 ref 而不是参数，
   * 是因为 sheetHeight 变化会紧接着触发定位 effect，那个 effect 也要读到它。
   */
  const snapDurationRef = useRef<number | null>(null);
  /** 从系统相册返回后延迟还焦点，避免 sheet 还没 present 完就 focus 失败 */
  const pickerRestoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const keyboardState = useKeyboardState((s) => ({
    height: s.height,
    isVisible: s.isVisible,
  }));

  const rawKeyboardHeight =
    keyboardState.height > 0
      ? Math.max(0, keyboardState.height - insets.bottom)
      : 0;

  const keyboardVisible = keyboardState.isVisible && keyboardState.height > 0;

  // Android 的 adjustResize 会在键盘弹出时压缩 window.height。若直接拿它算
  // maxSheetHeight，「键盘正在收起、面板正在展开」的那几帧会把面板高度裁掉，
  // 表现为面板先变矮再弹回。所以只在键盘不可见时才采纳新的窗口高度（旋转/分屏）。
  const [layoutWindowHeight, setLayoutWindowHeight] = useState(windowHeight);
  useEffect(() => {
    if (keyboardVisible && windowHeight < layoutWindowHeight) return;
    if (windowHeight !== layoutWindowHeight) {
      setLayoutWindowHeight(windowHeight);
    }
  }, [keyboardVisible, layoutWindowHeight, windowHeight]);

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
  // 键盘/面板的可用高度按「不含附件条」的固定内容算，保证贴图之后
  // 工具栏仍不会被顶出可视区。
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
  // 键盘动画途中 isVisible 已经为 true 但 height 已到位，不会产生中间值抖动。
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

  const sheetHeight = Math.min(
    stableContentHeight + keyboardAvoidanceHeight,
    maxSheetHeight,
  );
  const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);

  // 强制 BottomSheet 重新定位。
  // 只保留「主动一次 + 兜底一次」，不再叠加多路键盘事件的补偿 —— 原来同一帧里
  // snapToIndex 会被调用 4~5 次，每次都触发一次 sheet 重新布局。
  const scheduleSnapToIndex = useCallback(() => {
    if (pendingSnapToIndexRef.current) {
      clearTimeout(pendingSnapToIndexRef.current);
    }
    pendingSnapToIndexRef.current = setTimeout(() => {
      pendingSnapToIndexRef.current = null;
      if (!modalRef.current || !isOpenRef.current) return;
      // 收起键盘时写入的时长：gorhom 见到 duration 会从 spring 切成 timing，
      // 这样 sheet 和键盘用同一段时长落下，不会出现「键盘走了 sheet 还在」。
      const duration = snapDurationRef.current;
      snapDurationRef.current = null;
      modalRef.current.snapToIndex(0, duration ? { duration } : undefined);
    }, 16);
  }, [modalRef]);

  useEffect(() => {
    if (!isOpenRef.current) return;
    scheduleSnapToIndex();
    const timer = setTimeout(scheduleSnapToIndex, 90);
    return () => clearTimeout(timer);
  }, [actualContentHeight, scheduleSnapToIndex, sheetHeight]);

  // 键盘收起且不是「正在等它升起」时，dock 回落到 none，
  // 否则 composer 底部会留一块和键盘等高的空白。
  useEffect(() => {
    if (keyboardVisible) {
      awaitingKeyboardRef.current = false;
      return;
    }
    if (awaitingKeyboardRef.current) return;
    setDock((current) => (current === "keyboard" ? "none" : current));
  }, [keyboardVisible]);

  // 键盘收起时 useKeyboardState 要等到 didHide（动画结束）才把 isVisible 置 false，
  // 于是 sheet 会在整段收起动画里保持原高度、动画结束后再瞬间掉下来 —— 这就是
  // 「收起键盘后要等一会儿高度才缩下去」的来源。
  //
  // 改由 willHide（动画开始）接管：立刻释放占位，并用键盘自己的动画时长把
  // sheet 一起收下去，两者同步。上面那个 effect 退化为平台不支持 willHide
  // （Android 11 以下）时的兜底。
  useEffect(() => {
    const subscription = KeyboardEvents.addListener(
      "keyboardWillHide",
      (event) => {
        if (!isOpenRef.current) return;
        // 正在主动请求键盘（面板 -> 键盘、选图后恢复）时，
        // 忽略上一次收起的迟到通知，否则会把刚举起的键盘又按下去。
        if (awaitingKeyboardRef.current) return;
        // dock 已经不是 keyboard 说明键盘是我们主动收的（面板接管了占位），
        // 高度不变，不需要再动 sheet。
        if (dock !== "keyboard") return;
        snapDurationRef.current =
          event.duration > 0
            ? event.duration
            : KEYBOARD_HIDE_ANIMATION_FALLBACK_MS;
        setDock("none");
        scheduleSnapToIndex();
      },
    );
    return () => subscription.remove();
  }, [dock, scheduleSnapToIndex]);

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

  const clearFocusRetryTimers = useCallback(() => {
    focusRetryTimersRef.current.forEach(clearTimeout);
    focusRetryTimersRef.current = [];
  }, []);

  const clearInitialFocusTimer = useCallback(() => {
    if (!initialFocusTimerRef.current) return;
    clearTimeout(initialFocusTimerRef.current);
    initialFocusTimerRef.current = null;
  }, []);

  const focusRichInput = useCallback(() => {
    clearFocusRetryTimers();
    inputBridgeRef.current?.setKeyboardTarget();
    KeyboardController.preload();

    const focusOnce = () => {
      inputBridgeRef.current?.setKeyboardTarget();
      inputRef.current?.focus();
    };

    // 三次重试足够覆盖 sheet 弹出与键盘动画期间的焦点丢失。
    // onFocus 一旦触发就会 clearFocusRetryTimers()，不会真的跑满 6 次
    // —— 原来 6 次 focus 会连带触发 6 次 onFocus -> 6 次 snapToIndex。
    focusRetryTimersRef.current = [0, 64, 200].map((delay) =>
      setTimeout(focusOnce, delay),
    );
    focusRetryTimersRef.current.push(
      setTimeout(() => {
        inputBridgeRef.current?.setKeyboardTarget();
        KeyboardController.setFocusTo("current");
        scheduleSnapToIndex();
      }, 260),
    );
  }, [clearFocusRetryTimers, scheduleSnapToIndex]);

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

  // 面板打开过一次就保持挂载：之后开关面板只是 display 切换，
  // 不会再重新挂载表情列表（原来 panelHeight > 0 的条件挂载会在收起动画
  // 一开始就卸载，导致收起时面板内容瞬间消失、再次打开时重新拉一遍图）。
  useEffect(() => {
    if (panelMode !== null) setPanelMounted(true);
  }, [panelMode]);

  // 记录真实键盘高度，供下次打开面板时复用（键盘与面板同高，切换才不会跳）。
  useEffect(() => {
    if (!keyboardVisible || rawKeyboardHeight < MIN_KEYBOARD_HEIGHT) return;
    const task = setTimeout(() => {
      setPanelKeyboardHeight((current) => {
        if (Math.abs(current - rawKeyboardHeight) < 1) return current;
        cachedKeyboardHeight = rawKeyboardHeight;
        void persistKeyboardHeight(rawKeyboardHeight);
        return rawKeyboardHeight;
      });
    }, 0);
    return () => clearTimeout(task);
  }, [rawKeyboardHeight, keyboardVisible]);

  // 打开时优先用持久化的键盘高度，避免首帧按默认值撑开再跳一次。
  useEffect(() => {
    let cancelled = false;
    readPersistedKeyboardHeight().then((height) => {
      if (cancelled || height === null) return;
      cachedKeyboardHeight = height;
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
      clearInitialFocusTimer();
      clearFocusRetryTimers();
      if (awaitingKeyboardTimerRef.current) {
        clearTimeout(awaitingKeyboardTimerRef.current);
      }
      if (pendingSnapToIndexRef.current) {
        clearTimeout(pendingSnapToIndexRef.current);
      }
      if (pickerRestoreTimerRef.current) {
        clearTimeout(pickerRestoreTimerRef.current);
      }
    };
  }, [clearFocusRetryTimers, clearInitialFocusTimer]);

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

  /** 请求键盘：标记「正在等键盘升起」，并给一个超时兜底 */
  const requestKeyboard = useCallback(() => {
    awaitingKeyboardRef.current = true;
    if (awaitingKeyboardTimerRef.current) {
      clearTimeout(awaitingKeyboardTimerRef.current);
    }
    awaitingKeyboardTimerRef.current = setTimeout(() => {
      awaitingKeyboardTimerRef.current = null;
      awaitingKeyboardRef.current = false;
    }, 900);
    focusRichInput();
  }, [focusRichInput]);

  /**
   * 系统相册是原生页面，打开后输入框必然失焦、键盘收起。
   * 返回后要把焦点还回去，否则用户选完图会卡在「既没有键盘也没有面板」
   * 的中间态 —— 表现为点开图库前键盘还在，回来后输入框怎么点都要再等一次。
   *
   * delay 用来等 sheet 重新 present 完成（Android 切 Activity 会把 modal 关掉）。
   */
  const restoreKeyboardAfterPicker = useCallback(
    (delay: number) => {
      if (pickerRestoreTimerRef.current) {
        clearTimeout(pickerRestoreTimerRef.current);
      }
      pickerRestoreTimerRef.current = setTimeout(() => {
        pickerRestoreTimerRef.current = null;
        if (!isOpenRef.current) return;
        setDock("keyboard");
        requestKeyboard();
      }, delay);
    },
    [requestKeyboard],
  );

  const requestInitialKeyboardFocus = useCallback(() => {
    if (didAutoFocusOnOpenRef.current || !isOpenRef.current) return;
    clearInitialFocusTimer();
    initialFocusTimerRef.current = setTimeout(() => {
      initialFocusTimerRef.current = null;
      if (
        didAutoFocusOnOpenRef.current ||
        !isOpenRef.current ||
        !inputReadyRef.current
      ) {
        return;
      }
      didAutoFocusOnOpenRef.current = true;
      setPanelMode(null);
      setDock("keyboard");
      if (!keyboardVisible) {
        requestKeyboard();
      }
    }, 16);
  }, [clearInitialFocusTimer, keyboardVisible, requestKeyboard]);

  const handleInputReady = useCallback(() => {
    inputReadyRef.current = true;
    requestInitialKeyboardFocus();
  }, [requestInitialKeyboardFocus]);

  /** 面板 -> 键盘：收起面板，把焦点交还输入框 */
  const focusKeyboardFromPanel = useCallback(() => {
    setPanelMode(null);
    setDock("keyboard");
    if (!keyboardVisible) {
      requestKeyboard();
    }
  }, [keyboardVisible, requestKeyboard]);

  /**
   * 键盘 -> 面板：先收键盘再撑开面板。
   * 二者共用同一个占位高度，所以高度不变、只有内容互换，不会出现
   * 「键盘先缩回去、面板再顶上来」的两次跳动。
   */
  const openPanel = useCallback(
    (mode: PanelMode) => {
      setPanelMode(mode);
      setPanelMounted(true);
      setDock("panel");
      if (keyboardVisible) {
        inputBridgeRef.current?.clearKeyboardTarget();
        void KeyboardController.dismiss({ keepFocus: true });
      }
    },
    [keyboardVisible],
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

    // 相册是原生页面，打开后输入框必然失焦、键盘收起。先记下当前是不是
    // 键盘态，返回后据此把键盘抬回来；否则用户选完图会停在「既没有键盘
    // 也没有面板」的中间态，得再点一次输入框。
    const shouldRestoreKeyboard =
      dock === "keyboard" || isInputFocusedRef.current;
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
    dock,
    isSubmitting,
    modalRef,
    restoreKeyboardAfterPicker,
    setSheetOpen,
    showToast,
    t,
  ]);

  const handleInputFocus = useCallback(() => {
    isInputFocusedRef.current = true;
    awaitingKeyboardRef.current = false;
    // 焦点已到位，停掉剩余重试：否则每次重试都会再触发一次 onFocus，
    // 连带多打几次 snapToIndex。
    clearFocusRetryTimers();
    inputBridgeRef.current?.setKeyboardTarget();
    // 焦点稳定后声明键盘目标，替代原来依赖定时器兜底的写法。
    requestAnimationFrame(() => {
      inputBridgeRef.current?.setKeyboardTarget();
      KeyboardController.setFocusTo("current");
    });
    // 键盘被外部唤起（例如系统手势）时面板还开着：必须让面板让位，
    // 否则键盘和面板会同时占据底部，sheet 高度来自两个来源。
    if (dock === "panel") {
      setPanelMode(null);
    }
    setDock("keyboard");
    scheduleSnapToIndex();
  }, [clearFocusRetryTimers, dock, scheduleSnapToIndex]);

  const handleInputBlur = useCallback(() => {
    isInputFocusedRef.current = false;
  }, []);

  const handleInputPress = useCallback(() => {
    // 面板开着时点输入框 = 关面板、抬键盘
    if (dock === "panel") {
      focusKeyboardFromPanel();
      return;
    }

    // 键盘已经在，只是重新点了一下输入框
    if (dock === "keyboard" && keyboardVisible) {
      inputBridgeRef.current?.setKeyboardTarget();
      scheduleSnapToIndex();
      requestAnimationFrame(() => KeyboardController.setFocusTo("current"));
      return;
    }

    setDock("keyboard");
    requestKeyboard();
  }, [
    dock,
    focusKeyboardFromPanel,
    keyboardVisible,
    requestKeyboard,
    scheduleSnapToIndex,
  ]);

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
        articleId: Number(articleId),
        parentId: parentId ? Number(parentId) : undefined,
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
      topInset={sheetTopInset}
      enablePanDownToClose
      enableContentPanningGesture={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={backdrop}
      handleComponent={null}
      onAnimate={(_, toIndex) => {
        const open = toIndex >= 0;
        if (!open && imagePickerActiveRef.current) return;
        const wasOpen = isOpenRef.current;
        setSheetOpen(open);
        if (open && !wasOpen) {
          requestInitialKeyboardFocus();
          setTimeout(() => scheduleSnapToIndex(), 100);
        }
      }}
      onChange={(index) => {
        if (index >= 0 && !isOpenRef.current) {
          requestInitialKeyboardFocus();
          scheduleSnapToIndex();
        }
      }}
      onDismiss={() => {
        if (imagePickerActiveRef.current) {
          restoreAfterImagePickerRef.current = true;
          return;
        }
        clearInitialFocusTimer();
        clearFocusRetryTimers();
        if (pendingSnapToIndexRef.current) {
          clearTimeout(pendingSnapToIndexRef.current);
        }
        if (pickerRestoreTimerRef.current) {
          clearTimeout(pickerRestoreTimerRef.current);
          pickerRestoreTimerRef.current = null;
        }
        snapDurationRef.current = null;
        if (awaitingKeyboardTimerRef.current) {
          clearTimeout(awaitingKeyboardTimerRef.current);
          awaitingKeyboardTimerRef.current = null;
        }
        awaitingKeyboardRef.current = false;
        inputBridgeRef.current?.clearKeyboardTarget();
        KeyboardController.dismiss();
        setSheetOpen(false);
        setPanelMode(null);
        setDock("none");
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
            ref={inputBridgeRef}
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
                          <HugeIcon icon={Cancel01Icon} size={18} color="#FFFFFF" />
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

          {/* 面板容器：打开过一次后常驻挂载，收起时只把高度归零并 display:none，
              避免每次开关都重新挂载表情列表（也保住了滚动位置）。 */}
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
