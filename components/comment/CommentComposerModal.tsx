import { api } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
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
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  KeyboardController,
  useKeyboardState,
} from "react-native-keyboard-controller";
import {
  RichTextInput,
  type RichTextContentItem,
  type RichTextInputImageItem,
  type RichTextInputRef,
} from "react-native-rich-text-fabric";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ComposerMode = "keyboard" | "emoji" | "image";
type PanelMode = Exclude<ComposerMode, "keyboard">;

type Props = {
  articleId?: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

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
const STICKER_SIZE = 80;

const CommentComposerModal = forwardRef<BottomSheetModal, Props>(
  function CommentComposerModal({ articleId, onClose, onSubmitted }, ref) {
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const inputRef = useRef<RichTextInputRef>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<RichTextContentItem[]>([]);
    const [plainContent, setPlainContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState<ComposerMode>("keyboard");
    const [panelKeyboardHeight, setPanelKeyboardHeight] = useState(
      DEFAULT_KEYBOARD_HEIGHT,
    );
    const [keyboardFocusPending, setKeyboardFocusPending] = useState(false);
    const modeRef = useRef<ComposerMode>("keyboard");
    const isOpenRef = useRef(false);
    const didAutoFocusOnOpenRef = useRef(false);
    const pendingKeyboardFocusRef = useRef(false);

    const keyboardState = useKeyboardState((state) => ({
      height: state.height,
      isVisible: state.isVisible,
    }));
    const keyboardHeight =
      keyboardState.height > 0
        ? Math.max(0, keyboardState.height - insets.bottom)
        : DEFAULT_KEYBOARD_HEIGHT;
    const keyboardVisible = keyboardState.isVisible && keyboardState.height > 0;

    const canSubmit =
      !!articleId && hasRichContent(content, plainContent) && !submitting;
    const richInputTextStyle = useMemo(
      () => ({
        fontSize: 14,
        lineHeight: 22,
        color: theme.text,
      }),
      [theme.text],
    );

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
      keyboardFocusPending && keyboardVisible
        ? Math.min(keyboardHeight, reservedAccessoryHeight)
        : 0;
    const panelHeight =
      mode !== "keyboard" || keyboardFocusPending
        ? Math.max(0, reservedAccessoryHeight - keyboardCoverHeight)
        : 0;
    const actualContentHeight =
      COMPOSER_HEADER_HEIGHT +
      COMPOSER_INPUT_HEIGHT +
      COMPOSER_TOOLBAR_HEIGHT +
      panelHeight +
      insets.bottom;
    const maxDynamicContentSize = Math.min(actualContentHeight, maxSheetHeight);

    const setComposerMode = useCallback((next: ComposerMode) => {
      modeRef.current = next;
      setMode(next);
    }, []);

    const setSheetOpen = useCallback((open: boolean) => {
      isOpenRef.current = open;
      setIsOpen(open);
      if (!open) didAutoFocusOnOpenRef.current = false;
    }, []);

    const resetComposerContent = useCallback(() => {
      inputRef.current?.clearContent();
      setContent([]);
      setPlainContent("");
    }, []);

    const handleContentChange = useCallback((next: RichTextContentItem[]) => {
      setContent(next);
      setPlainContent(getRichPlainText(next));
    }, []);

    const showKeyboard = useCallback(() => {
      if (modeRef.current !== "keyboard") {
        pendingKeyboardFocusRef.current = true;
        setKeyboardFocusPending(true);
      } else {
        pendingKeyboardFocusRef.current = false;
        setKeyboardFocusPending(false);
      }

      KeyboardController.preload();
      inputRef.current?.focus();
      requestAnimationFrame(() => {
        KeyboardController.setFocusTo("current");
      });
    }, []);

    useEffect(() => {
      if (!keyboardFocusPending || !keyboardVisible) return;
      pendingKeyboardFocusRef.current = false;
      setKeyboardFocusPending(false);
      setComposerMode("keyboard");
    }, [keyboardFocusPending, keyboardVisible, setComposerMode]);

    useEffect(() => {
      if (!keyboardVisible) return;
      setPanelKeyboardHeight((current) =>
        Math.abs(current - keyboardHeight) < 1 ? current : keyboardHeight,
      );
    }, [keyboardHeight, keyboardVisible]);

    const openPanel = useCallback(
      (next: PanelMode) => {
        if (modeRef.current === next) {
          showKeyboard();
          return;
        }

        if (modeRef.current !== "keyboard") {
          setComposerMode(next);
          return;
        }

        setPanelKeyboardHeight(keyboardHeight);
        setComposerMode(next);
        void KeyboardController.dismiss({ keepFocus: true });
      },
      [keyboardHeight, setComposerMode, showKeyboard],
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

    const handleEmojiPress = useCallback(() => {
      if (modeRef.current === "emoji") {
        showKeyboard();
        return;
      }
      openPanel("emoji");
    }, [openPanel, showKeyboard]);

    const handleImagePress = useCallback(() => {
      if (modeRef.current === "image") {
        showKeyboard();
        return;
      }
      openPanel("image");
    }, [openPanel, showKeyboard]);

    const handleInputFocus = useCallback(() => {
      if (!pendingKeyboardFocusRef.current) {
        setComposerMode("keyboard");
      }
    }, [setComposerMode]);

    const handleEmojiSelect = useCallback((emoji: string) => {
      inputRef.current?.insertText(emoji);
    }, []);

    const handleStickerSelect = useCallback((stickerUrl: string) => {
      inputRef.current?.insertImage({
        type: "image",
        image: stickerUrl,
        imageStyle: {
          width: STICKER_SIZE,
          height: STICKER_SIZE,
        },
      });
    }, []);

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

    const backdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const emojiPanelActive = mode === "emoji";
    const imagePanelActive = mode === "image";
    const emojiIconColor = useMemo(
      () => (emojiPanelActive ? colors.primary : theme.secondary),
      [colors.primary, emojiPanelActive, theme.secondary],
    );
    const imageIconColor = useMemo(
      () => (imagePanelActive ? colors.primary : theme.secondary),
      [colors.primary, imagePanelActive, theme.secondary],
    );

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
        onAnimate={(_, toIndex) => setSheetOpen(toIndex >= 0)}
        onChange={(index) => {
          if (index >= 0 && !didAutoFocusOnOpenRef.current) {
            didAutoFocusOnOpenRef.current = true;
            showKeyboard();
          }
        }}
        onDismiss={() => {
          KeyboardController.dismiss();
          pendingKeyboardFocusRef.current = false;
          setKeyboardFocusPending(false);
          setSheetOpen(false);
          setComposerMode("keyboard");
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

          <View
            style={[
              styles.inputWrap,
              {
                bottom: insets.bottom + panelHeight + COMPOSER_TOOLBAR_HEIGHT,
                height: COMPOSER_INPUT_HEIGHT,
              },
            ]}
          >
            <RichTextInput
              ref={inputRef}
              placeholder="我有话要说..."
              placeholderTextColor={theme.secondary}
              multiline
              onContentChange={handleContentChange}
              onFocus={handleInputFocus}
              cursorColor={colors.primary}
              inheritInsertedStyle={false}
              defaultTextStyle={richInputTextStyle}
              defaultImageStyle={styles.richInputImage}
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.toolbar,
              {
                bottom: insets.bottom + panelHeight,
                borderTopColor: theme.border,
              },
            ]}
          >
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

          <View
            style={[
              styles.panel,
              {
                height: panelHeight,
                bottom: insets.bottom,
                backgroundColor: theme.secondaryBackground,
              },
            ]}
          >
            {mode === "emoji" && panelHeight > 0 && (
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
            {mode === "image" && panelHeight > 0 && (
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

const styles = StyleSheet.create({
  sheetContent: {
    overflow: "hidden",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: COMPOSER_HEADER_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  input: {
    height: "100%",
    minHeight: COMPOSER_INPUT_HEIGHT,
    padding: 0,
  },
  richInputImage: {
    width: 24,
    height: 24,
  },
  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
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
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  safeAreaBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
