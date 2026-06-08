import { api } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetInternal,
} from "@gorhom/bottom-sheet";
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
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  findNodeHandle,
  Image,
  Pressable,
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
import {
  RichTextInput,
  type RichTextContentItem,
  type RichTextInputImageItem,
  type RichTextInputRef,
} from "react-native-rich-text-fabric";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ComposerMode = "keyboard" | "emoji" | "image";
type PanelMode = Exclude<ComposerMode, "keyboard">;

type Props = {
  articleId?: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

type RichComposerInputProps = {
  inputRef: React.RefObject<RichTextInputRef | null>;
  height: number;
  placeholder: string;
  placeholderTextColor: string;
  placeholderStyle: { fontSize: number; lineHeight: number; color: string };
  cursorColor: string;
  defaultTextStyle: { fontSize: number; lineHeight: number; color: string };
  defaultImageStyle: { width: number; height: number };
  backgroundColor: string;
  onContentChange: (content: RichTextContentItem[]) => void;
  onReady: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onPress: () => void;
};

type RichComposerInputHandle = {
  setKeyboardTarget: () => void;
  clearKeyboardTarget: () => void;
};

// ─────────────────────────────────────────────
// Transition state machine
//
// Describes what the composer is currently doing.
// Only one transition can be in flight at a time —
// a new request is enqueued and applied after the
// current one settles.
// ─────────────────────────────────────────────

type TransitionState =
  | { phase: "idle"; mode: ComposerMode }
  | { phase: "dismissing-keyboard"; pendingMode: PanelMode }
  | { phase: "raising-keyboard"; pendingKeyboardFocus: boolean };

type TransitionAction =
  | { type: "open-panel"; target: PanelMode }
  | { type: "show-keyboard"; fromPanel: boolean }
  | { type: "keyboard-hidden" } // keyboard became invisible
  | { type: "keyboard-visible" } // keyboard became visible
  | { type: "settle" }; // force-settle to idle (dismiss / reset)

function transitionReducer(
  state: TransitionState,
  action: TransitionAction,
): TransitionState {
  switch (action.type) {
    case "open-panel": {
      // Already showing that panel — toggle back to keyboard
      if (state.phase === "idle" && state.mode === action.target) {
        return { phase: "raising-keyboard", pendingKeyboardFocus: true };
      }
      // Already raising keyboard → ignore
      if (state.phase === "raising-keyboard") return state;
      // Already dismissing to same target → ignore
      if (
        state.phase === "dismissing-keyboard" &&
        state.pendingMode === action.target
      ) {
        return state;
      }
      // Currently in keyboard mode: need to dismiss keyboard first
      if (state.phase === "idle" && state.mode === "keyboard") {
        return { phase: "dismissing-keyboard", pendingMode: action.target };
      }
      // Currently in another panel: switch immediately (no keyboard involved)
      if (state.phase === "idle") {
        return { phase: "idle", mode: action.target };
      }
      // Switching panel while dismissing-keyboard: update target
      if (state.phase === "dismissing-keyboard") {
        return { phase: "dismissing-keyboard", pendingMode: action.target };
      }
      return state;
    }

    case "show-keyboard": {
      if (state.phase === "raising-keyboard") return state; // already in flight
      return {
        phase: "raising-keyboard",
        pendingKeyboardFocus: action.fromPanel,
      };
    }

    case "keyboard-hidden": {
      if (state.phase === "dismissing-keyboard") {
        // Keyboard is gone — safe to show panel now
        return { phase: "idle", mode: state.pendingMode };
      }
      return state;
    }

    case "keyboard-visible": {
      if (state.phase === "raising-keyboard") {
        return { phase: "idle", mode: "keyboard" };
      }
      return state;
    }

    case "settle": {
      const mode =
        state.phase === "idle"
          ? state.mode
          : state.phase === "dismissing-keyboard"
            ? state.pendingMode
            : "keyboard";
      return { phase: "idle", mode };
    }
  }
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const STICKERS = [
  { id: "1", url: "https://picsum.photos/80/80?random=1" },
  { id: "2", url: "https://picsum.photos/80/80?random=2" },
  { id: "3", url: "https://picsum.photos/80/80?random=3" },
  { id: "4", url: "https://picsum.photos/80/80?random=4" },
  { id: "5", url: "https://picsum.photos/80/80?random=5" },
  { id: "6", url: "https://picsum.photos/80/80?random=6" },
  { id: "7", url: "https://picsum.photos/80/80?random=7" },
  { id: "8", url: "https://picsum.photos/80/80?random=8" },
  { id: "9", url: "https://picsum.photos/80/80?random=9" },
  { id: "10", url: "https://picsum.photos/80/80?random=10" },
  { id: "11", url: "https://picsum.photos/80/80?random=11" },
  { id: "12", url: "https://picsum.photos/80/80?random=12" },
];

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😭",
  "👍",
  "❤️",
  "💓",
  "🎶",
  "🎀",
  "🙏",
  "😆",
  "😇",
  "😪",
  "👡",
  "👣",
  "NO",
  "☀️",
  "🤞",
  "💩",
  "✍️",
  "👥",
  "👉",
  "🤴",
];

const ARTICLE_NAV_HEIGHT = 60;
const SHEET_TOP_GAP = 8;
const COMPOSER_HEADER_HEIGHT = 48;
const COMPOSER_INPUT_HEIGHT = 154;
const COMPOSER_TOOLBAR_HEIGHT = 48;
const DEFAULT_KEYBOARD_HEIGHT = 300;
const KEYBOARD_HEIGHT_STORAGE_KEY = "commentComposer.keyboardHeight";
const MIN_KEYBOARD_HEIGHT = 180;
const KEYBOARD_DID_SHOW_FALLBACK_MS = 420;
const BACKDROP_EDGE_GUARD = 32;
const STICKER_SIZE = 80;

let cachedKeyboardHeight = DEFAULT_KEYBOARD_HEIGHT;

// ─────────────────────────────────────────────
// Keyboard height persistence
// ─────────────────────────────────────────────

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
    // optimization only — safe to ignore
  }
}

// ─────────────────────────────────────────────
// RichComposerInput
// ─────────────────────────────────────────────

const RichComposerInput = forwardRef<
  RichComposerInputHandle,
  RichComposerInputProps
>(function RichComposerInput(
  {
    inputRef,
    height,
    placeholder,
    placeholderTextColor,
    placeholderStyle,
    cursorColor,
    defaultTextStyle,
    defaultImageStyle,
    backgroundColor: _backgroundColor,
    onContentChange,
    onReady,
    onFocus,
    onBlur,
    onPress,
  },
  ref,
) {
  const wrapperRef = useRef<View>(null);
  const { animatedKeyboardState, textInputNodesRef } = useBottomSheetInternal();

  const getTarget = useCallback(() => {
    return findNodeHandle(wrapperRef.current) ?? undefined;
  }, []);

  const setKeyboardTarget = useCallback(() => {
    const target = getTarget();
    if (!target) return;
    textInputNodesRef.current.add(target);
    animatedKeyboardState.set((s) => ({ ...s, target }));
  }, [animatedKeyboardState, getTarget, textInputNodesRef]);

  const clearKeyboardTarget = useCallback(() => {
    const target = getTarget();
    if (!target) return;
    const ks = animatedKeyboardState.get();
    if (ks.target === target) {
      animatedKeyboardState.set((s) => ({ ...s, target: undefined }));
    }
    textInputNodesRef.current.delete(target);
  }, [animatedKeyboardState, getTarget, textInputNodesRef]);

  useEffect(() => {
    const target = getTarget();
    if (target) {
      textInputNodesRef.current.add(target);
      const t = setTimeout(onReady, 0);
      return () => {
        clearTimeout(t);
        clearKeyboardTarget();
      };
    }
    return () => clearKeyboardTarget();
  }, [clearKeyboardTarget, getTarget, onReady, textInputNodesRef]);

  useImperativeHandle(ref, () => ({ setKeyboardTarget, clearKeyboardTarget }), [
    clearKeyboardTarget,
    setKeyboardTarget,
  ]);

  const handleFocus = useCallback(() => {
    setKeyboardTarget();
    onFocus();
  }, [onFocus, setKeyboardTarget]);

  const handleBlur = useCallback(() => {
    clearKeyboardTarget();
    onBlur();
  }, [clearKeyboardTarget, onBlur]);

  const handlePress = useCallback(() => {
    setKeyboardTarget();
    onPress();
  }, [onPress, setKeyboardTarget]);

  return (
    <Pressable
      ref={wrapperRef}
      style={[styles.inputWrap, { height }]}
      onPress={handlePress}
    >
      <RichTextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        placeholderStyle={placeholderStyle}
        multiline
        onContentChange={onContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        cursorColor={cursorColor}
        inheritInsertedStyle={false}
        defaultTextStyle={defaultTextStyle}
        defaultImageStyle={defaultImageStyle}
        style={styles.input}
      />
    </Pressable>
  );
});

// ─────────────────────────────────────────────
// CommentComposerModal
// ─────────────────────────────────────────────

const CommentComposerModal = forwardRef<BottomSheetModal, Props>(
  function CommentComposerModal({ articleId, onClose, onSubmitted }, ref) {
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const inputRef = useRef<RichTextInputRef>(null);
    const inputBridgeRef = useRef<RichComposerInputHandle>(null);

    // ── Sheet open state ──────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(false);

    // ── Rich content state ────────────────────
    const [content, setContent] = useState<RichTextContentItem[]>([]);
    const [plainContent, setPlainContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ── Transition state machine ──────────────
    const [transition, dispatch] = useReducer(transitionReducer, {
      phase: "idle",
      mode: "keyboard",
    });
    // Mirror in a ref so event handlers always read current value
    const transitionRef = useRef(transition);
    transitionRef.current = transition;
    const lastPanelModeRef = useRef<PanelMode>("emoji");

    useEffect(() => {
      if (transition.phase === "idle" && transition.mode !== "keyboard") {
        lastPanelModeRef.current = transition.mode;
      }
    }, [transition]);

    const currentMode =
      transition.phase === "idle"
        ? transition.mode
        : transition.phase === "dismissing-keyboard"
          ? "keyboard" // still in keyboard mode visually until dismissed
          : "keyboard";

    // ── Focus / ready tracking ─────────────────
    const didAutoFocusOnOpenRef = useRef(false);
    const inputReadyRef = useRef(false);
    // Suppresses onBlur side-effects during programmatic blur-then-focus
    const programmaticRefocusRef = useRef(false);

    const initialFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const focusRetryTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const keyboardDidShowFallbackRef = useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

    // ── Keyboard height ───────────────────────
    const [panelKeyboardHeight, setPanelKeyboardHeight] =
      useState(cachedKeyboardHeight);
    const panelKeyboardHeightRef = useRef(panelKeyboardHeight);
    panelKeyboardHeightRef.current = panelKeyboardHeight;

    const keyboardState = useKeyboardState((s) => ({
      height: s.height,
      isVisible: s.isVisible,
    }));
    const keyboardHeight =
      keyboardState.height > 0
        ? Math.max(0, keyboardState.height - insets.bottom)
        : panelKeyboardHeight;
    const keyboardVisible = keyboardState.isVisible && keyboardState.height > 0;

    // ─────────────────────────────────────────
    // Dimensions
    // ─────────────────────────────────────────

    const sheetTopInset = insets.top + ARTICLE_NAV_HEIGHT + SHEET_TOP_GAP;
    const maxSheetHeight = windowHeight - sheetTopInset;
    const maxAccessoryHeight = useMemo(
      () =>
        Math.max(
          0,
          maxSheetHeight -
            COMPOSER_HEADER_HEIGHT -
            COMPOSER_INPUT_HEIGHT -
            COMPOSER_TOOLBAR_HEIGHT -
            insets.bottom,
        ),
      [insets.bottom, maxSheetHeight],
    );
    const reservedAccessoryHeight = Math.min(
      panelKeyboardHeight,
      maxAccessoryHeight,
    );

    // While the keyboard is rising back up (raising-keyboard phase), treat it
    // as covering the panel slot so the sheet doesn't jump.
    const isRaisingKeyboard = transition.phase === "raising-keyboard";
    const isReplacingPanelWithKeyboard =
      isRaisingKeyboard && transition.pendingKeyboardFocus;
    const keyboardCoverHeight =
      (isRaisingKeyboard ||
        (transition.phase === "idle" && currentMode === "keyboard")) &&
      keyboardVisible
        ? Math.min(keyboardHeight, reservedAccessoryHeight)
        : 0;

    // Panel is visible when we're in a non-keyboard idle mode, or we're
    // dismissing the keyboard (panel pre-allocated while keyboard disappears).
    const panelShouldBeOpen =
      transition.phase === "dismissing-keyboard" ||
      isReplacingPanelWithKeyboard ||
      (transition.phase === "idle" && transition.mode !== "keyboard");

    const panelHeight = panelShouldBeOpen
      ? Math.max(0, reservedAccessoryHeight - keyboardCoverHeight)
      : 0;

    // The rendered mode in the panel (keep showing old panel while animating out)
    const visiblePanelMode: PanelMode | null =
      transition.phase === "idle" && transition.mode !== "keyboard"
        ? (transition.mode as PanelMode)
        : transition.phase === "dismissing-keyboard"
          ? transition.pendingMode
          : isReplacingPanelWithKeyboard
            ? lastPanelModeRef.current
          : null;

    const actualContentHeight =
      COMPOSER_HEADER_HEIGHT +
      COMPOSER_INPUT_HEIGHT +
      COMPOSER_TOOLBAR_HEIGHT +
      panelHeight +
      insets.bottom;
    const maxDynamicContentSize = Math.min(actualContentHeight, maxSheetHeight);

    const richInputTextStyle = useMemo(
      () => ({ fontSize: 14, lineHeight: 22, color: theme.text }),
      [theme.text],
    );

    const canSubmit =
      !!articleId && hasRichContent(content, plainContent) && !submitting;

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────

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
      [clearFocusRetryTimers],
    );

    const resetComposerContent = useCallback(() => {
      inputRef.current?.clearContent();
      setContent([]);
      setPlainContent("");
    }, []);

    const setSheetOpen = useCallback((open: boolean) => {
      isOpenRef.current = open;
      setIsOpen(open);
      if (!open) didAutoFocusOnOpenRef.current = false;
    }, []);

    // ─────────────────────────────────────────
    // Transition-driven side effects
    // ─────────────────────────────────────────

    // When we enter "dismissing-keyboard", actually dismiss the keyboard
    const prevPhaseRef = useRef(transition.phase);
    useEffect(() => {
      const prev = prevPhaseRef.current;
      const curr = transition.phase;
      prevPhaseRef.current = curr;

      if (curr === "dismissing-keyboard" && prev !== "dismissing-keyboard") {
        clearKeyboardDidShowFallback();
        clearFocusRetryTimers();
        programmaticRefocusRef.current = false;
        inputBridgeRef.current?.clearKeyboardTarget();
        void KeyboardController.dismiss({ keepFocus: true });
      }

      if (curr === "raising-keyboard" && prev !== "raising-keyboard") {
        const fromPanel = transition.pendingKeyboardFocus ?? false;
        focusRichInput(fromPanel || !keyboardVisible);
        clearKeyboardDidShowFallback();
        keyboardDidShowFallbackRef.current = setTimeout(() => {
          keyboardDidShowFallbackRef.current = null;
          if (KeyboardController.isVisible()) {
            dispatch({ type: "keyboard-visible" });
          }
        }, KEYBOARD_DID_SHOW_FALLBACK_MS);
      }
    });

    // React to keyboard becoming hidden / visible
    useEffect(() => {
      if (!keyboardVisible) {
        dispatch({ type: "keyboard-hidden" });
      }
    }, [keyboardVisible]);

    useEffect(() => {
      const subscription = KeyboardEvents.addListener("keyboardDidShow", () => {
        clearKeyboardDidShowFallback();
        dispatch({ type: "keyboard-visible" });
      });
      return () => subscription.remove();
    }, [clearKeyboardDidShowFallback]);

    // Persist keyboard height
    useEffect(() => {
      if (!keyboardVisible || keyboardHeight < MIN_KEYBOARD_HEIGHT) return;
      const task = setTimeout(() => {
        setPanelKeyboardHeight((current) => {
          if (Math.abs(current - keyboardHeight) < 1) return current;
          const next = Math.min(keyboardHeight, maxAccessoryHeight);
          cachedKeyboardHeight = next;
          void persistKeyboardHeight(next);
          return next;
        });
      }, 0);
      return () => clearTimeout(task);
    }, [keyboardHeight, keyboardVisible, maxAccessoryHeight]);

    // Load persisted keyboard height on mount
    useEffect(() => {
      let cancelled = false;
      readPersistedKeyboardHeight().then((height) => {
        if (cancelled || height === null) return;
        const next = Math.min(height, maxAccessoryHeight);
        cachedKeyboardHeight = next;
        setPanelKeyboardHeight((current) =>
          Math.abs(current - next) < 1 ? current : next,
        );
      });
      return () => {
        cancelled = true;
      };
    }, [maxAccessoryHeight]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        clearInitialFocusTimer();
        clearFocusRetryTimers();
        clearKeyboardDidShowFallback();
      };
    }, [
      clearFocusRetryTimers,
      clearInitialFocusTimer,
      clearKeyboardDidShowFallback,
    ]);

    // ─────────────────────────────────────────
    // Auto-focus on open
    // ─────────────────────────────────────────

    const requestInitialKeyboardFocus = useCallback(() => {
      if (didAutoFocusOnOpenRef.current || !isOpenRef.current) return;
      clearInitialFocusTimer();
      initialFocusTimerRef.current = setTimeout(() => {
        initialFocusTimerRef.current = null;
        if (
          didAutoFocusOnOpenRef.current ||
          !isOpenRef.current ||
          !inputReadyRef.current
        )
          return;
        didAutoFocusOnOpenRef.current = true;
        dispatch({ type: "show-keyboard", fromPanel: false });
      }, 16);
    }, [clearInitialFocusTimer]);

    const handleInputReady = useCallback(() => {
      inputReadyRef.current = true;
      requestInitialKeyboardFocus();
    }, [requestInitialKeyboardFocus]);

    // ─────────────────────────────────────────
    // Toolbar handlers
    // ─────────────────────────────────────────

    const handleEmojiPress = useCallback(() => {
      dispatch({ type: "open-panel", target: "emoji" });
    }, []);

    const handleImagePress = useCallback(() => {
      dispatch({ type: "open-panel", target: "image" });
    }, []);

    // ─────────────────────────────────────────
    // Input event handlers
    // ─────────────────────────────────────────

    const handleInputFocus = useCallback(() => {
      inputBridgeRef.current?.setKeyboardTarget();
      // If we're in raising-keyboard phase, great — nothing extra needed.
      // If focus fires unexpectedly while in panel mode, ignore.
      if (
        transitionRef.current.phase === "idle" &&
        transitionRef.current.mode !== "keyboard"
      ) {
        return;
      }
      if (!keyboardVisible) {
        requestAnimationFrame(() => KeyboardController.setFocusTo("current"));
      }
    }, [keyboardVisible]);

    const handleInputBlur = useCallback(() => {
      // Suppress blur during programmatic blur-then-refocus sequence
      if (programmaticRefocusRef.current) return;
      // If we're raising keyboard, a spurious blur should not collapse the panel
    }, []);

    const handleInputPress = useCallback(() => {
      dispatch({
        type: "show-keyboard",
        fromPanel: currentMode !== "keyboard",
      });
    }, [currentMode]);

    // ─────────────────────────────────────────
    // Content handlers
    // ─────────────────────────────────────────

    const handleContentChange = useCallback((next: RichTextContentItem[]) => {
      setContent(next);
      setPlainContent(getRichPlainText(next));
    }, []);

    const handleEmojiSelect = useCallback((emoji: string) => {
      inputRef.current?.insertText(emoji);
    }, []);

    const handleStickerSelect = useCallback((stickerUrl: string) => {
      inputRef.current?.insertImage({
        type: "image",
        image: stickerUrl,
        imageStyle: { width: STICKER_SIZE, height: STICKER_SIZE },
      });
    }, []);

    // ─────────────────────────────────────────
    // Submit
    // ─────────────────────────────────────────

    const handleSubmit = useCallback(async () => {
      if (!canSubmit) return;
      setSubmitting(true);
      try {
        const nextContent = inputRef.current?.getContent() ?? content;
        await api.commentControllerCreate({
          articleId: Number(articleId),
          content: serializeRichContentToHtml(nextContent).trim(),
        });
        resetComposerContent();
        onSubmitted?.();
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
      } catch {
        showToast(t("article.actionFailed"));
      } finally {
        setSubmitting(false);
      }
    }, [
      articleId,
      canSubmit,
      content,
      onSubmitted,
      ref,
      resetComposerContent,
      showToast,
      t,
    ]);

    // ─────────────────────────────────────────
    // Backdrop / dismiss
    // ─────────────────────────────────────────

    const handleBackdropPress = useCallback(
      (event: GestureResponderEvent) => {
        const sheetTop = windowHeight - actualContentHeight;
        if (event.nativeEvent.pageY >= sheetTop - BACKDROP_EDGE_GUARD) return;
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
      },
      [actualContentHeight, ref, windowHeight],
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

    // ─────────────────────────────────────────
    // Derived icon state
    // ─────────────────────────────────────────

    const emojiPanelActive = currentMode === "emoji";
    const imagePanelActive = currentMode === "image";
    const emojiIconColor = emojiPanelActive ? colors.primary : theme.secondary;
    const imageIconColor = imagePanelActive ? colors.primary : theme.secondary;

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        maxDynamicContentSize={maxDynamicContentSize}
        topInset={sheetTopInset}
        enablePanDownToClose
        enableContentPanningGesture={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        backdropComponent={backdrop}
        handleComponent={null}
        onAnimate={(_, toIndex) => {
          const open = toIndex >= 0;
          setSheetOpen(open);
          if (open) requestInitialKeyboardFocus();
        }}
        onChange={(index) => {
          if (index >= 0) requestInitialKeyboardFocus();
        }}
        onDismiss={() => {
          clearInitialFocusTimer();
          clearFocusRetryTimers();
          clearKeyboardDidShowFallback();
          inputBridgeRef.current?.clearKeyboardTarget();
          KeyboardController.dismiss();
          setSheetOpen(false);
          dispatch({ type: "settle" });
          resetComposerContent();
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
        <BottomSheetView
          style={[styles.sheetContent, { height: actualContentHeight }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText size={14} fontWeight="500">
              发表评论
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

          {/* Input */}
          <RichComposerInput
            ref={inputBridgeRef}
            inputRef={inputRef}
            height={COMPOSER_INPUT_HEIGHT}
            placeholder="我有话要说..."
            placeholderTextColor={theme.secondary}
            placeholderStyle={{ ...richInputTextStyle, color: theme.secondary }}
            cursorColor={colors.primary}
            defaultTextStyle={richInputTextStyle}
            defaultImageStyle={styles.richInputImage}
            backgroundColor={theme.card}
            onContentChange={handleContentChange}
            onReady={handleInputReady}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onPress={handleInputPress}
          />

          {/* Toolbar */}
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
              {imagePanelActive ? (
                <KeyboardIcon size={24} color={imageIconColor} />
              ) : (
                <ImageIcon size={24} color={imageIconColor} />
              )}
            </Pressable>
            <View style={styles.toolbarSpacer} />
            <Pressable
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit
                    ? colors.primary
                    : theme.secondaryBackground,
                  opacity: submitting ? 0.65 : 1,
                },
              ]}
            >
              <ThemedText
                size={12}
                fontWeight="600"
                color={canSubmit ? "white" : theme.secondary}
              >
                发布
              </ThemedText>
            </Pressable>
          </View>

          {/* Panel */}
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
              <View style={styles.emojiGrid}>
                {EMOJIS.map((emoji, index) => (
                  <Pressable
                    key={`${emoji}-${index}`}
                    style={styles.emojiButton}
                    onPress={() => handleEmojiSelect(emoji)}
                  >
                    <ThemedText size={28}>{emoji}</ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
            {visiblePanelMode === "image" && panelHeight > 0 && (
              <View style={styles.stickerGrid}>
                {STICKERS.map((sticker) => (
                  <Pressable
                    key={sticker.id}
                    style={styles.stickerButton}
                    onPress={() => handleStickerSelect(sticker.url)}
                  >
                    <Image
                      source={{ uri: sticker.url }}
                      style={styles.stickerImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.safeAreaBottom, { height: insets.bottom }]} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CommentComposerModal;

// ─────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────

function hasRichContent(
  items: RichTextContentItem[],
  plainContent: string,
): boolean {
  return plainContent.trim().length > 0 || items.some(isRichImageItem);
}

function getRichPlainText(items: RichTextContentItem[]): string {
  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (item.type === "text") return item.text;
      if (item.type === "image") return "[image]";
      return "";
    })
    .join("");
}

function serializeRichContentToHtml(items: RichTextContentItem[]): string {
  return items
    .map((item) => {
      if (typeof item === "string") return escapeHtml(item);
      if (item.type === "text") return escapeHtml(item.text);
      if (item.type === "image") {
        const src = getImageSource(item);
        if (!src) return "";
        return `<img class="ql-emoji-embed__img" src="${escapeHtml(src)}" />`;
      }
      return "";
    })
    .join("");
}

function isRichImageItem(
  item: RichTextContentItem,
): item is RichTextInputImageItem {
  return typeof item === "object" && item !== null && item.type === "image";
}

function getImageSource(item: RichTextInputImageItem): string {
  if (typeof item.image === "string") return item.image;
  if (
    typeof item.image === "object" &&
    item.image !== null &&
    "uri" in item.image &&
    typeof item.image.uri === "string"
  ) {
    return item.image.uri;
  }
  return "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  sheetContent: {
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
  inputWrap: {
    paddingHorizontal: 16,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  input: {
    height: "100%",
    minHeight: COMPOSER_INPUT_HEIGHT,
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    textAlignVertical: "top",
  },
  richInputImage: {
    width: 24,
    height: 24,
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
  emojiGrid: {
    paddingHorizontal: 18,
    paddingTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  emojiButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  stickerGrid: {
    paddingHorizontal: 18,
    paddingTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  stickerButton: {
    width: STICKER_SIZE,
    height: STICKER_SIZE,
    borderRadius: 8,
    overflow: "hidden",
  },
  stickerImage: {
    width: "100%",
    height: "100%",
  },
});
