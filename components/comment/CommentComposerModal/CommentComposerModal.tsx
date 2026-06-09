import { api, isAuthRedirectedError } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
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
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
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
  KEYBOARD_DID_SHOW_FALLBACK_MS,
  KEYBOARD_HEIGHT_STORAGE_KEY,
  MIN_KEYBOARD_HEIGHT,
  PANEL_HEIGHT_ANIMATION_MS,
  SHEET_TOP_GAP,
} from "./composerConstants";
import {
  initialTransitionState,
  transitionReducer,
} from "./composerTransition";
import type {
  CommentComposerModalProps,
  EmojiGroup,
  EmojiItem,
  PanelMode,
} from "./composerTypes";
import {
  getCachedEmojiPayload,
  readEmojiCache,
} from "./emojiCache";
import { uploadCommentImages } from "./imageUpload";
import {
  createEmojiImageItem,
  getRichPlainText,
  hasRichContent,
  serializeRichContentToHtml,
} from "./richContent";

let cachedKeyboardHeight = DEFAULT_KEYBOARD_HEIGHT;

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
>(function CommentComposerModal({ articleId, onClose, onSubmitted }, ref) {
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
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [emojiGroups, setEmojiGroups] = useState<EmojiGroup[]>(
    cachedEmojiPayload?.groups ?? [],
  );
  const [selectedEmojiGroupIndex, setSelectedEmojiGroupIndex] = useState(0);

  const [transition, dispatch] = useReducer(
    transitionReducer,
    initialTransitionState,
  );
  const transitionRef = useRef(transition);
  transitionRef.current = transition;

  const currentMode =
    transition.phase === "idle"
      ? transition.mode
      : transition.phase === "dismissing-keyboard"
        ? "keyboard"
        : "keyboard";

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

  const keyboardState = useKeyboardState((s) => ({
    height: s.height,
    isVisible: s.isVisible,
  }));
  const keyboardHeight =
    keyboardState.height > 0
      ? Math.max(0, keyboardState.height - insets.bottom)
      : panelKeyboardHeight;
  const keyboardVisible = keyboardState.isVisible && keyboardState.height > 0;

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

  const keyboardCoverHeight =
    transition.phase === "idle" && currentMode === "keyboard" && keyboardVisible
      ? Math.min(keyboardHeight, reservedAccessoryHeight)
      : 0;

  const panelShouldBeOpen =
    transition.phase === "dismissing-keyboard" ||
    (transition.phase === "idle" && transition.mode !== "keyboard");

  const targetPanelHeight = panelShouldBeOpen
    ? Math.max(0, reservedAccessoryHeight - keyboardCoverHeight)
    : 0;
  const [animatedPanelHeight, setAnimatedPanelHeight] =
    useState(targetPanelHeight);
  const animatedPanelHeightRef = useRef(animatedPanelHeight);
  animatedPanelHeightRef.current = animatedPanelHeight;
  const panelHeightAnimationRef = useRef<number | null>(null);
  const panelHeight = animatedPanelHeight;

  const visiblePanelMode: PanelMode | null =
    transition.phase === "idle" && transition.mode !== "keyboard"
      ? (transition.mode as PanelMode)
      : transition.phase === "dismissing-keyboard"
        ? transition.pendingMode
        : null;

  const requestedPanelMode: PanelMode | null =
    transition.phase === "idle" && transition.mode !== "keyboard"
      ? (transition.mode as PanelMode)
      : transition.phase === "dismissing-keyboard"
        ? transition.pendingMode
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
    !!articleId &&
    (hasRichContent(content, plainContent) || uploadedImageUrls.length > 0) &&
    !submitting &&
    !uploadingImage;
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
    if (panelHeightAnimationRef.current === null) return;
    cancelAnimationFrame(panelHeightAnimationRef.current);
    panelHeightAnimationRef.current = null;
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

  useEffect(() => {
    clearPanelHeightAnimation();
    const from = animatedPanelHeightRef.current;
    const to = targetPanelHeight;
    const distance = Math.abs(to - from);

    if (distance < 1) {
      setAnimatedPanelHeight(to);
      return;
    }

    const startedAt = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(1, elapsed / PANEL_HEIGHT_ANIMATION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (to - from) * eased;

      setAnimatedPanelHeight(next);
      if (progress < 1) {
        panelHeightAnimationRef.current = requestAnimationFrame(tick);
      } else {
        panelHeightAnimationRef.current = null;
        setAnimatedPanelHeight(to);
      }
    };

    panelHeightAnimationRef.current = requestAnimationFrame(tick);
    return clearPanelHeightAnimation;
  }, [clearPanelHeightAnimation, targetPanelHeight]);

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

  useEffect(() => {
    return () => {
      clearInitialFocusTimer();
      clearFocusRetryTimers();
      clearKeyboardDidShowFallback();
      clearPanelHeightAnimation();
    };
  }, [
    clearFocusRetryTimers,
    clearInitialFocusTimer,
    clearKeyboardDidShowFallback,
    clearPanelHeightAnimation,
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
      dispatch({ type: "show-keyboard", fromPanel: false });
    }, 16);
  }, [clearInitialFocusTimer]);

  const handleInputReady = useCallback(() => {
    inputReadyRef.current = true;
    requestInitialKeyboardFocus();
  }, [requestInitialKeyboardFocus]);

  const handleEmojiPress = useCallback(() => {
    dispatch({ type: "open-panel", target: "emoji" });
  }, []);

  const handleImagePress = useCallback(async () => {
    if (uploadingImage) return;
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

      setUploadingImage(true);
      const urls = await uploadCommentImages(result.assets);
      setUploadedImageUrls((current) => [...current, ...urls]);
    } catch (error) {
      console.error("[comment-upload] failed to upload images", error);
      if (isAuthRedirectedError(error)) return;
      showToast(t("article.actionFailed"));
    } finally {
      imagePickerActiveRef.current = false;
      setUploadingImage(false);
    }
  }, [modalRef, setSheetOpen, showToast, t, uploadingImage]);

  const handleInputFocus = useCallback(() => {
    inputBridgeRef.current?.setKeyboardTarget();
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
    if (programmaticRefocusRef.current) return;
  }, []);

  const handleInputPress = useCallback(() => {
    dispatch({
      type: "show-keyboard",
      fromPanel: currentMode !== "keyboard",
    });
  }, [currentMode]);

  const handleContentChange = useCallback((next: RichTextContentItem[]) => {
    setContent(next);
    setPlainContent(getRichPlainText(next));
  }, []);

  const handleEmojiSelect = useCallback((emoji: EmojiItem) => {
    inputRef.current?.insertImage(createEmojiImageItem(emoji));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const nextContent = inputRef.current?.getContent() ?? content;
      await api.commentControllerCreate({
        articleId: Number(articleId),
        content: serializeRichContentToHtml(nextContent, {
          emojiGroups,
        }).trim(),
        images: uploadedImageUrls,
      });
      resetComposerContent();
      setUploadedImageUrls([]);
      onSubmitted?.();
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    } catch (error) {
      if (isAuthRedirectedError(error)) return;
      showToast(t("article.actionFailed"));
    } finally {
      setSubmitting(false);
    }
  }, [
    articleId,
    canSubmit,
    content,
    emojiGroups,
    onSubmitted,
    ref,
    resetComposerContent,
    showToast,
    t,
    uploadedImageUrls,
  ]);

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

  const emojiPanelActive = requestedPanelMode === "emoji";
  const emojiIconColor = emojiPanelActive ? colors.primary : theme.secondary;

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
        if (!open && imagePickerActiveRef.current) return;
        setSheetOpen(open);
        if (open) requestInitialKeyboardFocus();
      }}
      onChange={(index) => {
        if (index >= 0) requestInitialKeyboardFocus();
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
        inputBridgeRef.current?.clearKeyboardTarget();
        KeyboardController.dismiss();
        setSheetOpen(false);
        dispatch({ type: "reset" });
        resetComposerContent();
        setUploadedImageUrls([]);
        setUploadingImage(false);
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
        <View style={styles.header}>
          <ThemedText size={14} fontWeight="500">
            {t("commentComposer.title")}
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
          placeholderStyle={{ ...richInputTextStyle, color: theme.secondary }}
          cursorColor={colors.primary}
          defaultTextStyle={richInputTextStyle}
          defaultImageStyle={styles.richInputImage}
          onContentChange={handleContentChange}
          onReady={handleInputReady}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onPress={handleInputPress}
        />

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
            disabled={uploadingImage}
            style={[styles.toolButton, uploadingImage && styles.disabledTool]}
            onPress={handleImagePress}
            hitSlop={8}
          >
            <ImageIcon size={24} color={theme.secondary} />
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
              {t("commentComposer.submit")}
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
