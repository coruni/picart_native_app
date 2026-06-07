import { api } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { Image as ImageIcon, Smile, X } from "lucide-react-native";
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
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInputContentSizeChangeEventData,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ComposerMode = "keyboard" | "emoji" | "image";

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
  "🥳",
  "😭",
  "👍",
  "❤️",
  "💔",
  "🎂",
  "🎉",
  "🙏",
  "😇",
  "😈",
  "😣",
  "👊",
  "👌",
  "NO",
  "☕",
  "🥤",
  "💨",
  "✌️",
  "👎",
  "👉",
  "🤏",
];

const ARTICLE_NAV_HEIGHT = 60;
const SHEET_TOP_GAP = 8;
const COMPOSER_HEADER_HEIGHT = 48;
const COMPOSER_INPUT_MIN_HEIGHT = 154;
const COMPOSER_INPUT_MAX_HEIGHT = 260;
const COMPOSER_TOOLBAR_HEIGHT = 48;
const DEFAULT_KEYBOARD_HEIGHT = 300;

const CommentComposerModal = forwardRef<BottomSheetModal, Props>(
  function CommentComposerModal({ articleId, onClose, onSubmitted }, ref) {
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const inputRef =
      useRef<React.ElementRef<typeof BottomSheetTextInput>>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState<ComposerMode>("keyboard");
    const modeRef = useRef<ComposerMode>("keyboard");
    const isOpenRef = useRef(false);
    const didAutoFocusOnOpenRef = useRef(false);
    const keyboardHeightRef = useRef(DEFAULT_KEYBOARD_HEIGHT);
    const keyboardVisibleRef = useRef(false);

    const [rawInputHeight, setRawInputHeight] = useState(
      COMPOSER_INPUT_MIN_HEIGHT,
    );
    const [keyboardHeight, setKeyboardHeight] = useState(
      DEFAULT_KEYBOARD_HEIGHT,
    );
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const canSubmit = !!articleId && !!content.trim() && !submitting;

    // ─── 尺寸计算 ─────────────────────────────────────────────────
    const sheetTopInset = insets.top + ARTICLE_NAV_HEIGHT + SHEET_TOP_GAP;
    const maxSheetHeight = windowHeight - sheetTopInset;

    // 使用 ref 值计算，避免闭包问题
    const panelHeight = useMemo(() => {
      if (mode === "keyboard") return 0;
      return Math.min(
        keyboardHeight,
        maxSheetHeight -
          COMPOSER_HEADER_HEIGHT -
          COMPOSER_INPUT_MIN_HEIGHT -
          COMPOSER_TOOLBAR_HEIGHT -
          insets.bottom,
      );
    }, [mode, keyboardHeight, maxSheetHeight, insets.bottom]);

    const availableHeight = keyboardVisible
      ? maxSheetHeight - keyboardHeight
      : maxSheetHeight;

    const inputMaxHeight = Math.min(
      COMPOSER_INPUT_MAX_HEIGHT,
      Math.max(
        COMPOSER_INPUT_MIN_HEIGHT,
        availableHeight -
          COMPOSER_HEADER_HEIGHT -
          COMPOSER_TOOLBAR_HEIGHT -
          panelHeight -
          insets.bottom,
      ),
    );
    const inputHeight = Math.min(rawInputHeight, inputMaxHeight);

    const actualContentHeight =
      COMPOSER_HEADER_HEIGHT +
      inputHeight +
      COMPOSER_TOOLBAR_HEIGHT +
      panelHeight +
      insets.bottom;

    const maxDynamicContentSize = Math.min(actualContentHeight, maxSheetHeight);

    // ─── helpers ──────────────────────────────────────────────────
    const setComposerMode = useCallback((next: ComposerMode) => {
      modeRef.current = next;
      setMode(next);
    }, []);

    const setSheetOpen = useCallback((open: boolean) => {
      isOpenRef.current = open;
      setIsOpen(open);
      if (!open) didAutoFocusOnOpenRef.current = false;
    }, []);

    const focusInput = useCallback(() => {
      if (modeRef.current !== "keyboard") {
        setComposerMode("keyboard");
      }
      // 延迟聚焦确保面板切换完成
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }, [setComposerMode]);

    // ─── 键盘监听 ─────────────────────────────────────────────────
    useEffect(() => {
      const onShow = (e: { endCoordinates?: { height?: number } }) => {
        const h = e.endCoordinates?.height;
        if (h && h > 0) {
          const height = Math.max(240, h - insets.bottom);
          keyboardHeightRef.current = height;
          setKeyboardHeight(height);
        }
        keyboardVisibleRef.current = true;
        setKeyboardVisible(true);
      };
      const onHide = () => {
        keyboardVisibleRef.current = false;
        setKeyboardVisible(false);
      };

      const s1 = Keyboard.addListener("keyboardWillShow", onShow);
      const s2 = Keyboard.addListener("keyboardDidShow", onShow);
      const s3 = Keyboard.addListener("keyboardDidHide", onHide);
      return () => {
        s1.remove();
        s2.remove();
        s3.remove();
      };
    }, [insets.bottom]);

    // ─── 硬件返回键 ───────────────────────────────────────────────
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

    // ─── input 内容高度 ────────────────────────────────────────────
    const handleInputContentSizeChange = useCallback(
      (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const next = Math.max(
          COMPOSER_INPUT_MIN_HEIGHT,
          Math.ceil(e.nativeEvent.contentSize.height),
        );
        setRawInputHeight((cur) => (Math.abs(cur - next) < 1 ? cur : next));
      },
      [],
    );

    // ─── emoji / image 切换 ────────────────────────────────────────
    const handleEmojiPress = useCallback(() => {
      if (modeRef.current === "emoji") {
        // 再次点击切回键盘
        focusInput();
        return;
      }
      // 先设置模式，再关闭键盘，避免高度计算时序问题
      setComposerMode("emoji");
      Keyboard.dismiss();
      inputRef.current?.blur();
    }, [focusInput, setComposerMode]);

    const handleImagePress = useCallback(() => {
      if (modeRef.current === "image") {
        // 再次点击切回键盘
        focusInput();
        return;
      }
      // 先设置模式，再关闭键盘
      setComposerMode("image");
      Keyboard.dismiss();
      inputRef.current?.blur();
    }, [focusInput, setComposerMode]);

    // 点击输入区域打开键盘
    const handleInputPress = useCallback(() => {
      if (modeRef.current !== "keyboard") {
        focusInput();
      }
    }, [focusInput]);

    // 插入 emoji 或表情包后自动切回键盘
    const handleEmojiSelect = useCallback(
      (emoji: string) => {
        setContent((v) => `${v}${emoji}`);
        focusInput();
      },
      [focusInput],
    );

    const handleStickerSelect = useCallback(
      (stickerId: string) => {
        setContent((v) => `${v}[sticker:${stickerId}]`);
        focusInput();
      },
      [focusInput],
    );

    // ─── 提交 ──────────────────────────────────────────────────────
    const handleSubmit = useCallback(async () => {
      if (!canSubmit) return;
      setSubmitting(true);
      try {
        await api.commentControllerCreate({
          articleId: Number(articleId),
          content: content.trim(),
        });
        setContent("");
        setRawInputHeight(COMPOSER_INPUT_MIN_HEIGHT);
        onSubmitted?.();
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
      } catch {
        showToast(t("article.actionFailed"));
      } finally {
        setSubmitting(false);
      }
    }, [articleId, canSubmit, content, onSubmitted, ref, showToast, t]);

    // ─── backdrop ─────────────────────────────────────────────────
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

    const emojiIconColor = useMemo(
      () => (mode === "emoji" ? colors.primary : theme.secondary),
      [colors.primary, mode, theme.secondary],
    );
    const imageIconColor = useMemo(
      () => (mode === "image" ? colors.primary : theme.secondary),
      [colors.primary, mode, theme.secondary],
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
            focusInput();
          }
        }}
        onDismiss={() => {
          Keyboard.dismiss();
          setSheetOpen(false);
          setKeyboardVisible(false);
          keyboardVisibleRef.current = false;
          setComposerMode("keyboard");
          setContent("");
          setRawInputHeight(COMPOSER_INPUT_MIN_HEIGHT);
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
        <BottomSheetView>
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
          <Pressable
            style={[styles.inputWrap, { height: inputHeight }]}
            onPress={handleInputPress}
          >
            <BottomSheetTextInput
              ref={inputRef}
              value={content}
              onChangeText={setContent}
              placeholder="我有话要说..."
              placeholderTextColor={theme.secondary}
              multiline
              scrollEnabled={inputHeight >= inputMaxHeight}
              textAlignVertical="top"
              style={[styles.input, { color: theme.text }]}
              onFocus={() => setComposerMode("keyboard")}
              onContentSizeChange={handleInputContentSizeChange}
            />
          </Pressable>

          {/* Toolbar */}
          <View style={[styles.toolbar, { borderTopColor: theme.border }]}>
            <Pressable
              style={styles.toolButton}
              onPress={handleEmojiPress}
              hitSlop={8}
            >
              <Smile size={24} color={emojiIconColor} />
            </Pressable>
            <Pressable
              style={styles.toolButton}
              onPress={handleImagePress}
              hitSlop={8}
            >
              <ImageIcon size={24} color={imageIconColor} />
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
                    onPress={() => handleStickerSelect(sticker.id)}
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

          {/* 底部安全区 */}
          <View style={{ height: insets.bottom }} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CommentComposerModal;

const styles = StyleSheet.create({
  header: {
    height: COMPOSER_HEADER_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrap: {
    paddingHorizontal: 16,
  },
  input: {
    height: "100%",
    fontSize: 14,
    lineHeight: 22,
    padding: 0,
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
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  stickerImage: {
    width: "100%",
    height: "100%",
  },
});
