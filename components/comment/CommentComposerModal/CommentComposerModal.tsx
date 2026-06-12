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
import {
  Image as ImageIcon,
  Keyboard as KeyboardIcon,
  Smile,
  X,
} from "lucide-react-native";
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
  Animated,
  BackHandler,
  Easing,
  Image,
  Keyboard,
  Platform,
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
  MIN_KEYBOARD_HEIGHT,
  PANEL_HEIGHT_ANIMATION_MS,
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
  const pendingPanelModeRef = useRef<PanelMode | null>(null);
  const pendingKeyboardOpenRef = useRef(false);
  const shouldFocusKeyboardRef = useRef(false);
  const isInputFocusedRef = useRef(false);

  const didAutoFocusOnOpenRef = useRef(false);
  const inputReadyRef = useRef(false);
  const programmaticRefocusRef = useRef(false);

  const initialFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const focusRetryTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const keyboardDidShowFallbackRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [panelKeyboardHeight, setPanelKeyboardHeight] =
    useState(cachedKeyboardHeight);
  const panelKeyboardHeightRef = useRef(panelKeyboardHeight);
  panelKeyboardHeightRef.current = panelKeyboardHeight;
  const [reservedKeyboardHeight, setReservedKeyboardHeight] =
    useState(cachedKeyboardHeight);
  const reservedKeyboardHeightRef = useRef(reservedKeyboardHeight);
  reservedKeyboardHeightRef.current = reservedKeyboardHeight;

  const pendingSnapToIndexRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const keyboardHeightAnimationRef = useRef<Animated.CompositeAnimation | null>(
    null,
  );
  const keyboardHeightAnimatedValue = useRef(
    new Animated.Value(cachedKeyboardHeight),
  );
  const keyboardHeightAnimatedValueRef = useRef(cachedKeyboardHeight);
  const keyboardHeightListenerIdRef = useRef<string | null>(null);

  const keyboardState = useKeyboardState((s) => ({
    height: s.height,
    isVisible: s.isVisible,
  }));

  // FIX: Separate raw keyboard height from the "panel reserved" height.
  // rawKeyboardHeight is the actual current keyboard height (net of bottom inset).
  // panelKeyboardHeight is the persisted/cached value used for panel sizing.
  const rawKeyboardHeight =
    keyboardState.height > 0
      ? Math.max(0, keyboardState.height - insets.bottom)
      : 0;

  const keyboardVisible = keyboardState.isVisible && keyboardState.height > 0;

  const sheetTopInset = insets.top + ARTICLE_NAV_HEIGHT + SHEET_TOP_GAP;
  const maxSheetHeight = windowHeight - sheetTopInset;
  const attachmentPreviewHeight =
    attachments.length > 0 ? ATTACHMENT_PREVIEW_HEIGHT : 0;
  const fixedContentHeight =
    COMPOSER_HEADER_HEIGHT +
    COMPOSER_INPUT_HEIGHT +
    attachmentPreviewHeight +
    COMPOSER_TOOLBAR_HEIGHT +
    insets.bottom;
  // FIX: base maxAccessoryHeight on the minimum fixed content WITHOUT the
  // attachment preview strip. This ensures that when images are attached the
  // keyboard-avoidance budget is not reduced, preventing the toolbar from
  // being hidden behind the keyboard.
  const fixedContentHeightWithoutAttachment =
    COMPOSER_HEADER_HEIGHT +
    COMPOSER_INPUT_HEIGHT +
    COMPOSER_TOOLBAR_HEIGHT +
    insets.bottom;
  const maxAccessoryHeight = useMemo(
    () => Math.max(0, maxSheetHeight - fixedContentHeightWithoutAttachment),
    [fixedContentHeightWithoutAttachment, maxSheetHeight],
  );
  const pendingPanelMode = pendingPanelModeRef.current;
  const effectivePanelMode = pendingKeyboardOpenRef.current
    ? panelMode
    : pendingPanelMode !== null
      ? pendingPanelMode
      : panelMode;
  const reservedAccessoryHeight = Math.min(
    panelKeyboardHeight,
    maxAccessoryHeight,
  );

  const targetPanelHeight = effectivePanelMode
    ? Math.max(0, reservedAccessoryHeight)
    : 0;

  const targetPanelHeightRef = useRef(targetPanelHeight);
  const previousTargetRef = useRef(targetPanelHeight);

  const [animatedPanelHeight, setAnimatedPanelHeight] =
    useState(targetPanelHeight);
  const animatedPanelHeightRef = useRef(animatedPanelHeight);
  animatedPanelHeightRef.current = animatedPanelHeight;

  const animatedHeight = useRef(new Animated.Value(targetPanelHeight));
  const animatedHeightValueRef = useRef<number>(targetPanelHeight);
  const runningAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const isClosingPanelRef = useRef(false);

  const panelHeight = useMemo(() => {
    if (isClosingPanelRef.current && targetPanelHeight === 0) {
      return 0;
    }
    if (Math.abs(targetPanelHeight - animatedPanelHeight) > 30) {
      return targetPanelHeight;
    }
    return animatedPanelHeight;
  }, [targetPanelHeight, animatedPanelHeight]);

  const accessoryHeight = effectivePanelMode ? reservedAccessoryHeight : 0;

  const reservedKeyboardAvoidanceHeight = Math.min(
    reservedKeyboardHeight,
    maxAccessoryHeight,
  );

  // Use a cached/animated reserved keyboard height so the sheet follows the
  // system keyboard animation, instead of snapping through raw mid-frame values.
  const keyboardAvoidanceHeight =
    keyboardVisible && !effectivePanelMode
      ? reservedKeyboardAvoidanceHeight
      : 0;

  const stableContentHeight = fixedContentHeight + accessoryHeight;
  const actualContentHeight = stableContentHeight;

  const sheetHeight = Math.min(
    stableContentHeight + keyboardAvoidanceHeight,
    maxSheetHeight,
  );
  const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);

  // 强制 BottomSheet 重新定位（精简为单次，避免多次调用时序混乱）
  const scheduleSnapToIndex = useCallback(() => {
    if (pendingSnapToIndexRef.current) {
      clearTimeout(pendingSnapToIndexRef.current);
    }
    pendingSnapToIndexRef.current = setTimeout(() => {
      pendingSnapToIndexRef.current = null;
      if (modalRef.current && isOpenRef.current) {
        modalRef.current.snapToIndex(0);
      }
    }, 16);
  }, [modalRef]);

  useEffect(() => {
    if (!isOpenRef.current) return;
    scheduleSnapToIndex();
    const timer = setTimeout(scheduleSnapToIndex, 80);
    return () => clearTimeout(timer);
  }, [actualContentHeight, scheduleSnapToIndex, sheetHeight]);

  // 监听键盘显示/隐藏事件，触发重新定位
  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        scheduleSnapToIndex();
        const duration = Platform.OS === "ios" ? event.duration || 250 : 150;
        setTimeout(scheduleSnapToIndex, duration + 50);
      },
    );

    const hideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        scheduleSnapToIndex();
      },
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [scheduleSnapToIndex]);

  // 监听 keyboard-controller 事件
  useEffect(() => {
    const showSub = KeyboardEvents.addListener("keyboardDidShow", () => {
      scheduleSnapToIndex();
      setTimeout(scheduleSnapToIndex, 100);
    });

    const hideSub = KeyboardEvents.addListener("keyboardDidHide", () => {
      scheduleSnapToIndex();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scheduleSnapToIndex]);

  // 在 transition 变化时触发重新定位
  useEffect(() => {
    if (isOpenRef.current) {
      const timer = setTimeout(() => {
        scheduleSnapToIndex();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [panelMode, scheduleSnapToIndex]);

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

  const clearKeyboardDidShowFallback = useCallback(() => {
    if (!keyboardDidShowFallbackRef.current) return;
    clearTimeout(keyboardDidShowFallbackRef.current);
    keyboardDidShowFallbackRef.current = null;
  }, []);

  const clearPanelHeightAnimation = useCallback(() => {
    if (runningAnimationRef.current) {
      try {
        runningAnimationRef.current.stop();
      } catch {}
      runningAnimationRef.current = null;
    }
  }, []);

  const clearKeyboardHeightAnimation = useCallback(() => {
    if (!keyboardHeightAnimationRef.current) return;
    try {
      keyboardHeightAnimationRef.current.stop();
    } catch {}
    keyboardHeightAnimationRef.current = null;
    if (keyboardHeightListenerIdRef.current) {
      keyboardHeightAnimatedValue.current.removeListener(
        keyboardHeightListenerIdRef.current,
      );
      keyboardHeightListenerIdRef.current = null;
    }
  }, []);

  const animateReservedKeyboardHeight = useCallback(
    (nextHeight: number, duration = PANEL_HEIGHT_ANIMATION_MS) => {
      const toValue = Math.max(0, nextHeight);
      clearKeyboardHeightAnimation();

      if (Math.abs(keyboardHeightAnimatedValueRef.current - toValue) < 1) {
        keyboardHeightAnimatedValue.current.setValue(toValue);
        keyboardHeightAnimatedValueRef.current = toValue;
        setReservedKeyboardHeight(toValue);
        return;
      }

      keyboardHeightAnimationRef.current = Animated.timing(
        keyboardHeightAnimatedValue.current,
        {
          toValue,
          duration: Math.max(120, duration),
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        },
      );

      keyboardHeightListenerIdRef.current =
        keyboardHeightAnimatedValue.current.addListener(({ value }) => {
          keyboardHeightAnimatedValueRef.current = value;
          setReservedKeyboardHeight(value);
        });

      keyboardHeightAnimationRef.current.start(() => {
        if (keyboardHeightListenerIdRef.current) {
          keyboardHeightAnimatedValue.current.removeListener(
            keyboardHeightListenerIdRef.current,
          );
          keyboardHeightListenerIdRef.current = null;
        }
        keyboardHeightAnimationRef.current = null;
        keyboardHeightAnimatedValue.current.setValue(toValue);
        keyboardHeightAnimatedValueRef.current = toValue;
        setReservedKeyboardHeight(toValue);
      });
    },
    [clearKeyboardHeightAnimation],
  );

  const focusRichInput = useCallback(
    (forceRefocus = false) => {
      clearFocusRetryTimers();
      inputBridgeRef.current?.setKeyboardTarget();
      KeyboardController.preload();

      if (forceRefocus) {
        programmaticRefocusRef.current = true;
        inputRef.current?.blur();
      }

      const focusOnce = () => {
        inputBridgeRef.current?.setKeyboardTarget();
        inputRef.current?.focus();
        requestAnimationFrame(() => {
          inputBridgeRef.current?.setKeyboardTarget();
          KeyboardController.setFocusTo("current");
          scheduleSnapToIndex();
        });
      };

      focusRetryTimersRef.current = [0, 32, 96, 180, 320, 520].map((delay) =>
        setTimeout(focusOnce, delay),
      );
      focusRetryTimersRef.current.push(
        setTimeout(() => {
          programmaticRefocusRef.current = false;
        }, 360),
      );
    },
    [clearFocusRetryTimers, scheduleSnapToIndex],
  );

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
      isClosingPanelRef.current = false;
    }
  }, []);

  // 面板高度动画
  useEffect(() => {
    // stop any previous animation
    clearPanelHeightAnimation();
    const animatedPanelHeightValue = animatedHeight.current;

    const from = animatedHeightValueRef.current;
    const to = targetPanelHeight;
    targetPanelHeightRef.current = to;

    // immediate set if difference is tiny
    if (Math.abs(to - from) < 0.5) {
      animatedPanelHeightValue.setValue(to);
      animatedHeightValueRef.current = to;
      setAnimatedPanelHeight(to);
      previousTargetRef.current = to;
      return;
    }

    isClosingPanelRef.current = to === 0 && from > 0;

    // choose duration proportional to delta but capped
    const delta = Math.abs(to - from);
    const isOpeningPanel = to > from;
    const maxDuration = isOpeningPanel ? 120 : PANEL_HEIGHT_ANIMATION_MS;
    const minDuration = isOpeningPanel ? 90 : 120;
    const duration = Math.min(
      maxDuration,
      Math.max(
        minDuration,
        (PANEL_HEIGHT_ANIMATION_MS * delta) / Math.max(1, from),
      ),
    );

    runningAnimationRef.current = Animated.timing(animatedPanelHeightValue, {
      toValue: to,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    const id = animatedPanelHeightValue.addListener(({ value }) => {
      animatedHeightValueRef.current = value;
      setAnimatedPanelHeight(value);
    });

    runningAnimationRef.current.start(() => {
      animatedPanelHeightValue.removeListener(id);
      runningAnimationRef.current = null;
      animatedHeightValueRef.current = to;
      setAnimatedPanelHeight(to);
      previousTargetRef.current = to;
      isClosingPanelRef.current = false;
    });

    return () => {
      if (runningAnimationRef.current) {
        try {
          runningAnimationRef.current.stop();
        } catch {}
        runningAnimationRef.current = null;
      }
      try {
        animatedPanelHeightValue.removeAllListeners();
      } catch {}
    };
  }, [clearPanelHeightAnimation, targetPanelHeight]);

  // phase 变化副作用 —— 加 deps + prev === curr guard，避免每次 render 重复执行
  useEffect(() => {
    if (keyboardVisible) {
      shouldFocusKeyboardRef.current = false;
      if (pendingKeyboardOpenRef.current) {
        pendingKeyboardOpenRef.current = false;
        setPanelMode(null);
      } else if (panelMode !== null) {
        setPanelMode(null);
      }
      return;
    }

    if (pendingPanelModeRef.current !== null) {
      setPanelMode(pendingPanelModeRef.current);
      pendingPanelModeRef.current = null;
      shouldFocusKeyboardRef.current = false;
      return;
    }

    if (shouldFocusKeyboardRef.current) {
      shouldFocusKeyboardRef.current = false;
      focusRichInput();
    }
  }, [keyboardVisible, panelMode, focusRichInput]);

  useEffect(() => {
    const subscription = KeyboardEvents.addListener("keyboardDidShow", () => {
      clearKeyboardDidShowFallback();
    });
    return () => subscription.remove();
  }, [clearKeyboardDidShowFallback]);

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

  useEffect(() => {
    const showSub = KeyboardEvents.addListener("keyboardWillShow", (event) => {
      const nextHeight = Math.max(0, (event.height ?? 0) - insets.bottom);
      if (nextHeight < MIN_KEYBOARD_HEIGHT) return;
      animateReservedKeyboardHeight(
        nextHeight,
        event.duration ?? PANEL_HEIGHT_ANIMATION_MS,
      );
    });

    const hideSub = KeyboardEvents.addListener("keyboardWillHide", (event) => {
      animateReservedKeyboardHeight(
        panelKeyboardHeightRef.current,
        event.duration ?? PANEL_HEIGHT_ANIMATION_MS,
      );
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [animateReservedKeyboardHeight, insets.bottom]);

  useEffect(() => {
    let cancelled = false;
    readPersistedKeyboardHeight().then((height) => {
      if (cancelled || height === null) return;
      const next = height;
      cachedKeyboardHeight = height;
      setPanelKeyboardHeight((current) =>
        Math.abs(current - next) < 1 ? current : next,
      );
      keyboardHeightAnimatedValue.current.setValue(next);
      keyboardHeightAnimatedValueRef.current = next;
      setReservedKeyboardHeight((current) =>
        Math.abs(current - next) < 1 ? current : next,
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (keyboardVisible || panelMode !== null) return;
    if (Math.abs(reservedKeyboardHeightRef.current - panelKeyboardHeight) < 1) {
      return;
    }
    keyboardHeightAnimatedValue.current.setValue(panelKeyboardHeight);
    keyboardHeightAnimatedValueRef.current = panelKeyboardHeight;
    setReservedKeyboardHeight(panelKeyboardHeight);
  }, [keyboardVisible, panelKeyboardHeight, panelMode]);

  useEffect(() => {
    return () => {
      clearInitialFocusTimer();
      clearFocusRetryTimers();
      clearKeyboardDidShowFallback();
      clearPanelHeightAnimation();
      clearKeyboardHeightAnimation();
      if (pendingSnapToIndexRef.current) {
        clearTimeout(pendingSnapToIndexRef.current);
      }
    };
  }, [
    clearFocusRetryTimers,
    clearInitialFocusTimer,
    clearKeyboardDidShowFallback,
    clearPanelHeightAnimation,
    clearKeyboardHeightAnimation,
  ]);

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
      shouldFocusKeyboardRef.current = true;
      if (!keyboardVisible) {
        focusRichInput();
      }
    }, 16);
  }, [clearInitialFocusTimer, focusRichInput, keyboardVisible]);

  const handleInputReady = useCallback(() => {
    inputReadyRef.current = true;
    requestInitialKeyboardFocus();
  }, [requestInitialKeyboardFocus]);

  const handleEmojiPress = useCallback(() => {
    if (panelMode === "emoji") {
      shouldFocusKeyboardRef.current = true;
      if (!keyboardVisible) {
        focusRichInput();
      }
      return;
    }

    if (keyboardVisible) {
      pendingPanelModeRef.current = "emoji";
      inputBridgeRef.current?.clearKeyboardTarget();
      void KeyboardController.dismiss({ keepFocus: true });
    } else {
      setPanelMode("emoji");
    }
  }, [focusRichInput, keyboardVisible, panelMode]);

  const handleImagePress = useCallback(async () => {
    if (isSubmitting) return;

    imagePickerActiveRef.current = true;
    restoreAfterImagePickerRef.current = false;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      imagePickerActiveRef.current = false;
      if (restoreAfterImagePickerRef.current) {
        restoreAfterImagePickerRef.current = false;
        modalRef.current?.present();
        setSheetOpen(true);
      }
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
      imagePickerActiveRef.current = false;
      if (restoreAfterImagePickerRef.current) {
        restoreAfterImagePickerRef.current = false;
        modalRef.current?.present();
        setSheetOpen(true);
      }
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
      imagePickerActiveRef.current = false;
    }
  }, [isSubmitting, modalRef, setSheetOpen, showToast, t]);

  const handleInputFocus = useCallback(() => {
    isInputFocusedRef.current = true;
    inputBridgeRef.current?.setKeyboardTarget();
    scheduleSnapToIndex();
    if (panelMode !== null) {
      return;
    }
    if (!keyboardVisible) {
      requestAnimationFrame(() => {
        KeyboardController.setFocusTo("current");
        scheduleSnapToIndex();
      });
    }
  }, [keyboardVisible, panelMode, scheduleSnapToIndex]);

  const handleInputBlur = useCallback(() => {
    if (programmaticRefocusRef.current) return;
    isInputFocusedRef.current = false;
  }, []);

  const handleInputPress = useCallback(() => {
    if (panelMode === null && keyboardVisible && isInputFocusedRef.current) {
      inputBridgeRef.current?.setKeyboardTarget();
      scheduleSnapToIndex();
      requestAnimationFrame(() => KeyboardController.setFocusTo("current"));
      return;
    }

    if (panelMode !== null) {
      pendingKeyboardOpenRef.current = true;
      shouldFocusKeyboardRef.current = true;
      if (!keyboardVisible) {
        focusRichInput();
      }
      return;
    }

    if (!keyboardVisible) {
      shouldFocusKeyboardRef.current = false;
      focusRichInput();
      return;
    }

    shouldFocusKeyboardRef.current = true;
  }, [focusRichInput, keyboardVisible, panelMode, scheduleSnapToIndex]);

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

  const visiblePanelMode =
    effectivePanelMode !== null && !pendingKeyboardOpenRef.current
      ? effectivePanelMode
      : null;
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
          keyboardHeightAnimatedValue.current.setValue(
            panelKeyboardHeightRef.current,
          );
          keyboardHeightAnimatedValueRef.current =
            panelKeyboardHeightRef.current;
          setReservedKeyboardHeight(panelKeyboardHeightRef.current);
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
        clearKeyboardDidShowFallback();
        clearPanelHeightAnimation();
        clearKeyboardHeightAnimation();
        if (pendingSnapToIndexRef.current) {
          clearTimeout(pendingSnapToIndexRef.current);
        }
        inputBridgeRef.current?.clearKeyboardTarget();
        KeyboardController.dismiss();
        setSheetOpen(false);
        setPanelMode(null);
        pendingPanelModeRef.current = null;
        shouldFocusKeyboardRef.current = false;
        keyboardHeightAnimatedValue.current.setValue(
          panelKeyboardHeightRef.current,
        );
        keyboardHeightAnimatedValueRef.current = panelKeyboardHeightRef.current;
        setReservedKeyboardHeight(panelKeyboardHeightRef.current);
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
              <X size={22} color={theme.foreground} />
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
                          <X size={18} color="#FFFFFF" />
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
                <KeyboardIcon size={24} color={emojiIconColor} />
              ) : (
                <Smile size={24} color={emojiIconColor} />
              )}
            </Pressable>
            <Pressable
              style={styles.toolButton}
              onPress={handleImagePress}
              hitSlop={8}
            >
              <ImageIcon size={24} color={theme.secondary} />
            </Pressable>
            <View style={styles.toolbarSpacer} />
            <Pressable
              disabled={!canSubmit || isSubmitting}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit
                    ? colors.primary
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

          <View
            style={[
              styles.panel,
              {
                height: panelHeight,
                backgroundColor: theme.secondaryBackground,
              },
            ]}
          >
            {visiblePanelMode === "emoji" && panelHeight > 0 && (
              <EmojiPanel
                groups={emojiGroups}
                selectedGroupIndex={selectedEmojiGroupIndex}
                selectedItems={selectedEmojiItems}
                primaryColor={colors.primary}
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
