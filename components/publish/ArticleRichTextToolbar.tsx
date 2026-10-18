import EmojiPanel from "@/components/comment/CommentComposerModal/EmojiPanel";
import type {
  EmojiGroup,
  EmojiItem,
} from "@/components/comment/CommentComposerModal/composerTypes";
import {
  getCachedEmojiPayload,
  primeEmojiCache,
  readEmojiCache,
} from "@/components/comment/CommentComposerModal/emojiCache";
import HugeIcon, { type HugeIconData } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { uploadSingleImage } from "@/lib/uploadImage";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";
import File02Icon from "@hugeicons/core-free-icons/File02Icon";
import HighlighterIcon from "@hugeicons/core-free-icons/HighlighterIcon";
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import KeyboardIcon from "@hugeicons/core-free-icons/KeyboardIcon";
import LeftToRightListBulletIcon from "@hugeicons/core-free-icons/LeftToRightListBulletIcon";
import LeftToRightListNumberIcon from "@hugeicons/core-free-icons/LeftToRightListNumberIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import QuoteDownIcon from "@hugeicons/core-free-icons/QuoteDownIcon";
import Redo02Icon from "@hugeicons/core-free-icons/Redo02Icon";
import RemoveFormattingIcon from "@hugeicons/core-free-icons/RemoveFormattingIcon";
import SmileIcon from "@hugeicons/core-free-icons/SmileIcon";
import TextAlignCenterIcon from "@hugeicons/core-free-icons/TextAlignCenterIcon";
import TextAlignLeftIcon from "@hugeicons/core-free-icons/TextAlignLeftIcon";
import TextAlignRightIcon from "@hugeicons/core-free-icons/TextAlignRightIcon";
import TextBoldIcon from "@hugeicons/core-free-icons/TextBoldIcon";
import TextItalicIcon from "@hugeicons/core-free-icons/TextItalicIcon";
import TextStrikethroughIcon from "@hugeicons/core-free-icons/TextStrikethroughIcon";
import TextUnderlineIcon from "@hugeicons/core-free-icons/TextUnderlineIcon";
import Undo02Icon from "@hugeicons/core-free-icons/Undo02Icon";
import Video01Icon from "@hugeicons/core-free-icons/Video01Icon";
import * as ImagePicker from "expo-image-picker";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type TextStyle,
} from "react-native";
import {
  KeyboardController,
  useKeyboardState,
} from "react-native-keyboard-controller";
import type {
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from "react-native-enriched-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputSheet, { type InputSheetRef } from "./InputSheet";
import type { RichTextSelection } from "./useArticleRichText";

/** default：第一层工具栏；format：点「Aa」后展开的第二层格式栏 */
type ToolbarMode = "default" | "format";
type HeadingLevel = 1 | 2 | 3 | 4;
type PanelKey = "more" | "align" | "list" | "heading";

interface ArticleRichTextToolbarProps {
  editorRef: RefObject<EnrichedTextInputInstance | null>;
  selectionRef: RefObject<RichTextSelection>;
  activeState: OnChangeStateEvent | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** 工具栏命令只改 HTML 不改纯文本，需要主动通知撤销栈记录一次 */
  onContentChanged?: () => void;
  /** 正文内嵌图片上传中，发布按钮需要一起置灰 */
  onUploadingChange?: (uploading: boolean) => void;
  /**
   * 表情面板 / 链接面板打开时为 true。
   * 这些面板需要先收起键盘，父级要据此保持工具栏挂载，否则面板会随键盘一起被卸载。
   */
  onOverlayChange?: (open: boolean) => void;
}

const EMOJI_INSERT_SIZE = 22;
/** 键盘高度低于该值视为「没弹出」 */
const MIN_KEYBOARD_HEIGHT = 180;

const HEADING_OPTIONS: HeadingLevel[] = [1, 2, 3, 4];

/** 按级别调用对应的 toggle 命令（编辑器 API 没有带参数的版本） */
function toggleHeadingLevel(
  editor: EnrichedTextInputInstance,
  level: HeadingLevel,
) {
  if (level === 1) editor.toggleH1();
  else if (level === 2) editor.toggleH2();
  else if (level === 3) editor.toggleH3();
  else editor.toggleH4();
}

function ToolbarIconButton({
  icon,
  label,
  active,
  disabled,
  onPress,
  badge,
}: {
  icon: HugeIconData;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
  /** 右下角小箭头：提示点击后还有子菜单 */
  badge?: boolean;
}) {
  const { theme, colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active, disabled: !!disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={[
        styles.iconButton,
        active && { backgroundColor: colors.primary + "1A" },
        disabled && styles.disabled,
      ]}
    >
      <HugeIcon
        icon={icon}
        size={22}
        color={active ? colors.primary : theme.secondary}
      />
      {badge ? (
        <View style={styles.iconBadge} pointerEvents="none">
          <HugeIcon
            icon={ChevronDownIcon}
            size={10}
            color={theme.mutedForeground}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

function ToolbarTextButton({
  label,
  accessibilityLabel,
  active,
  onPress,
  textStyle,
  badge,
}: {
  label: string;
  accessibilityLabel: string;
  active?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
  badge?: boolean;
}) {
  const { theme, colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: !!active }}
      hitSlop={4}
      onPress={onPress}
      style={[
        styles.iconButton,
        active && { backgroundColor: colors.primary + "1A" },
      ]}
    >
      <ThemedText
        size={16}
        fontWeight="700"
        color={active ? colors.primary : theme.secondary}
        style={textStyle}
      >
        {label}
      </ThemedText>
      {badge ? (
        <View style={styles.iconBadge} pointerEvents="none">
          <HugeIcon
            icon={ChevronDownIcon}
            size={10}
            color={theme.mutedForeground}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

function PanelChip({
  label,
  icon,
  active,
  disabled,
  onPress,
}: {
  label: string;
  icon?: HugeIconData;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { theme, colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active, disabled: !!disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={[
        styles.panelChip,
        { backgroundColor: theme.card },
        active && { backgroundColor: colors.primary + "1A" },
        disabled && styles.disabled,
      ]}
    >
      {icon ? (
        <HugeIcon
          icon={icon}
          size={16}
          color={active ? colors.primary : theme.secondary}
        />
      ) : null}
      <ThemedText
        size={13}
        fontWeight={active ? "600" : "400"}
        color={active ? colors.primary : theme.secondary}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function RowSeparator() {
  const { theme } = useTheme();
  return (
    <View style={[styles.rowSeparator, { backgroundColor: theme.border }]} />
  );
}

/** 悬浮在工具栏上方的撤销 / 重做胶囊 */
function HistoryPill({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  labelUndo,
  labelRedo,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  labelUndo: string;
  labelRedo: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.historyWrap} pointerEvents="box-none">
      <View style={[styles.historyPill, { backgroundColor: theme.foreground }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={labelUndo}
          accessibilityState={{ disabled: !canUndo }}
          disabled={!canUndo}
          hitSlop={6}
          onPress={onUndo}
          style={styles.historyButton}
        >
          <HugeIcon
            icon={Undo02Icon}
            size={17}
            color={canUndo ? theme.background : theme.background + "66"}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={labelRedo}
          accessibilityState={{ disabled: !canRedo }}
          disabled={!canRedo}
          hitSlop={6}
          onPress={onRedo}
          style={styles.historyButton}
        >
          <HugeIcon
            icon={Redo02Icon}
            size={17}
            color={canRedo ? theme.background : theme.background + "66"}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function ArticleRichTextToolbar({
  editorRef,
  selectionRef,
  activeState,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onContentChanged,
  onUploadingChange,
}: ArticleRichTextToolbarProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<ToolbarMode>("default");
  const [panel, setPanel] = useState<PanelKey | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiGroups, setEmojiGroups] = useState<EmojiGroup[]>(
    () => getCachedEmojiPayload()?.groups ?? [],
  );
  const [emojiGroupIndex, setEmojiGroupIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const linkSheetRef = useRef<InputSheetRef>(null);
  const videoSheetRef = useRef<InputSheetRef>(null);
  const articleSheetRef = useRef<InputSheetRef>(null);
  // 弹窗会抢走输入焦点，打开前先把选区存下来
  const savedSelectionRef = useRef<RichTextSelection>({
    start: 0,
    end: 0,
    text: "",
  });

  // 键盘高度：展开表情 / 面板时用它撑开占位，和评论输入框「面板顶替键盘」一致
  const keyboardState = useKeyboardState((state) => ({
    height: state.height,
    isVisible: state.isVisible,
  }));
  const rawKeyboardHeight =
    keyboardState.height > 0
      ? Math.max(0, keyboardState.height - insets.bottom)
      : 0;
  const keyboardVisible =
    keyboardState.isVisible && rawKeyboardHeight >= MIN_KEYBOARD_HEIGHT;
  const [panelReserve, setPanelReserve] = useState(0);

  // 记住最近一次实测的键盘高度，面板高度与它对齐，切换时不跳动
  if (keyboardVisible && Math.abs(rawKeyboardHeight - panelReserve) >= 1) {
    setPanelReserve(rawKeyboardHeight);
  }

  const panelHeight = Math.min(
    panelReserve > 0 ? panelReserve : Math.round(height * 0.38),
    Math.round(height * 0.5),
  );

  useEffect(() => {
    if (!emojiOpen) return;

    let active = true;
    void readEmojiCache().then((payload) => {
      if (active && payload) setEmojiGroups(payload.groups);
    });
    void primeEmojiCache().then(() => {
      if (!active) return;
      const payload = getCachedEmojiPayload();
      if (payload) setEmojiGroups(payload.groups);
    });

    return () => {
      active = false;
    };
  }, [emojiOpen]);

  const emojiItems = useMemo(
    () =>
      emojiGroupIndex === 0
        ? emojiGroups.flatMap((group) => group.items)
        : (emojiGroups[emojiGroupIndex - 1]?.items ?? []),
    [emojiGroupIndex, emojiGroups],
  );

  const closePanels = useCallback(() => {
    setPanel(null);
    setEmojiOpen(false);
  }, []);

  const handleDismissKeyboard = useCallback(() => {
    closePanels();
    editorRef.current?.blur();
    Keyboard.dismiss();
  }, [closePanels, editorRef]);

  // 所有格式命令统一走这里：执行命令后通知撤销栈记录一次。
  // 只靠 onChangeText 记不到加粗、标题、对齐这类「只改 HTML」的操作。
  const runCommand = useCallback(
    (command: (editor: EnrichedTextInputInstance) => void) => {
      const editor = editorRef.current;
      if (!editor) return;
      command(editor);
      onContentChanged?.();
    },
    [editorRef, onContentChanged],
  );

  // 表情面板 / 选图 / sheet 会短暂抢走焦点，插入前把光标还原到原位置
  const focusWithSelection = useCallback(
    (editor: EnrichedTextInputInstance, selection: RichTextSelection) => {
      const start = Math.max(0, selection.start);
      const end = Math.max(start, selection.end);
      editor.focus();
      editor.setSelection(start, end);
    },
    [],
  );

  const rememberSelection = useCallback(() => {
    savedSelectionRef.current = selectionRef.current;
  }, [selectionRef]);

  const handleSelectEmoji = useCallback(
    (emoji: EmojiItem) => {
      const editor = editorRef.current;
      if (!editor) return;

      focusWithSelection(editor, selectionRef.current);
      editor.setImage(emoji.url, EMOJI_INSERT_SIZE, EMOJI_INSERT_SIZE);
      onContentChanged?.();
    },
    [editorRef, focusWithSelection, onContentChanged, selectionRef],
  );

  /**
   * 打开表情面板：和评论输入框一样「面板顶替键盘」。
   * 先记下选区再收键盘（保留焦点），点表情时能把光标还原回去，
   * 也避免键盘和面板同时占位。
   */
  const openEmojiPanel = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(true);
    void KeyboardController.dismiss({ keepFocus: true });
  }, [rememberSelection]);

  /** 关闭面板：把焦点交还正文，键盘随之弹回 */
  const closeEmojiPanel = useCallback(() => {
    setEmojiOpen(false);
    editorRef.current?.focus();
  }, [editorRef]);

  const handleToggleEmoji = useCallback(() => {
    if (emojiOpen) closeEmojiPanel();
    else openEmojiPanel();
  }, [closeEmojiPanel, emojiOpen, openEmojiPanel]);

  const handlePickImage = useCallback(async () => {
    closePanels();
    // 打开系统相册后原生编辑器会失焦，先记下当前光标/选区
    const selection = selectionRef.current;
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show(t("article.actionFailed"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      setUploadingImage(true);
      onUploadingChange?.(true);
      const url = await uploadSingleImage(asset.uri);

      const maxWidth = Math.max(width - 32, 120);
      const ratio = asset.width > 0 ? asset.height / asset.width : 0.72;
      const editor = editorRef.current;
      if (editor) {
        focusWithSelection(editor, selection);
        editor.setImage(
          url,
          Math.round(maxWidth),
          Math.round(maxWidth * ratio),
        );
        onContentChanged?.();
        setTimeout(() => editorRef.current?.focus(), 120);
      }
    } catch (error) {
      console.error("Failed to insert article image:", error);
      toast.show(t("article.actionFailed"));
    } finally {
      setUploadingImage(false);
      onUploadingChange?.(false);
    }
  }, [
    closePanels,
    editorRef,
    focusWithSelection,
    onContentChanged,
    onUploadingChange,
    selectionRef,
    t,
    width,
  ]);

  const activeHeading = useMemo<HeadingLevel | null>(() => {
    if (activeState?.h1.isActive) return 1;
    if (activeState?.h2.isActive) return 2;
    if (activeState?.h3.isActive) return 3;
    if (activeState?.h4.isActive) return 4;
    return null;
  }, [activeState]);

  const applyHeading = useCallback(
    (level: HeadingLevel | null) => {
      setPanel(null);
      runCommand((editor) => {
        const current = activeHeading;
        // 点击当前级别 → 退回正文
        if (current === level) {
          if (current !== null) toggleHeadingLevel(editor, current);
          return;
        }
        // 先退掉已有标题，再套目标级别（target 为 null 即只退不退进）
        if (current !== null) toggleHeadingLevel(editor, current);
        if (level !== null) toggleHeadingLevel(editor, level);
      });
    },
    [activeHeading, runCommand],
  );

  const alignment = activeState?.alignment ?? "left";

  const applyAlignment = useCallback(
    (next: "left" | "center" | "right") => {
      setPanel(null);
      runCommand((editor) => editor.setTextAlignment(next));
    },
    [runCommand],
  );

  // 原生编辑器没有颜色 / 字号 / 视频节点，相关按钮点击后给出明确反馈
  const notifyUnsupported = useCallback(() => {
    toast.show(t("publish.editor.formatUnsupported"));
  }, [t]);

  const handleLinkPress = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(false);
    linkSheetRef.current?.present();
  }, [rememberSelection]);

  const handleVideoPress = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(false);
    videoSheetRef.current?.present();
  }, [rememberSelection]);

  const handleArticlePress = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(false);
    articleSheetRef.current?.present();
  }, [rememberSelection]);

  /**
   * 链接 / 视频 / 内联帖子：原生编辑器只支持超链接，
   * 三者统一以链接形式插入，视频和帖子带上对应前缀，阅读端仍可点击跳转。
   */
  const insertAsLink = useCallback(
    (raw: string, prefix = "") => {
      const value = raw.trim();
      if (!value) return;
      const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(value)
        ? value
        : `https://${value}`;
      const { start, end, text } = savedSelectionRef.current;
      const safeStart = Math.max(0, start);
      const safeEnd = Math.max(safeStart, end);
      const selected = safeStart !== safeEnd ? text : "";
      const label = selected
        ? `${prefix}${selected}`
        : `${prefix}${normalized}`;

      runCommand((editor) =>
        editor.setLink(safeStart, safeEnd, label, normalized),
      );
      setTimeout(() => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        if (selected) editor.setSelection(safeEnd, safeEnd);
      }, 160);
    },
    [editorRef, runCommand],
  );

  const handleLinkSubmit = useCallback(
    (value: string) => insertAsLink(value),
    [insertAsLink],
  );

  const handleVideoSubmit = useCallback(
    (value: string) => insertAsLink(value, "▶ "),
    [insertAsLink],
  );

  const handleArticleSubmit = useCallback(
    (value: string) => insertAsLink(value, "📄 "),
    [insertAsLink],
  );

  const togglePanel = useCallback((next: PanelKey) => {
    setEmojiOpen(false);
    setPanel((prev) => (prev === next ? null : next));
  }, []);

  const activeListType = activeState?.orderedList.isActive
    ? "ordered"
    : activeState?.unorderedList.isActive
      ? "unordered"
      : activeState?.checkboxList.isActive
        ? "checkbox"
        : null;

  const toggleList = useCallback(
    (kind: "ordered" | "unordered") => {
      setPanel(null);
      runCommand((editor) => {
        if (kind === "ordered") editor.toggleOrderedList();
        else editor.toggleUnorderedList();
      });
    },
    [runCommand],
  );

  const panelBg = {
    backgroundColor: theme.muted,
    borderBottomColor: theme.border,
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.card, borderTopColor: theme.border },
      ]}
    >
      <HistoryPill
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        labelUndo={t("publish.editor.undo")}
        labelRedo={t("publish.editor.redo")}
      />

      {panel === "heading" ? (
        <View style={[styles.panel, panelBg]}>
          <PanelChip
            label={t("publish.editor.paragraph")}
            active={activeHeading === null}
            onPress={() => applyHeading(null)}
          />
          {HEADING_OPTIONS.map((level) => (
            <PanelChip
              key={level}
              label={`H${level}`}
              active={activeHeading === level}
              onPress={() => applyHeading(level)}
            />
          ))}
        </View>
      ) : null}

      {panel === "align" ? (
        <View style={[styles.panel, panelBg]}>
          <PanelChip
            label={t("publish.editor.alignLeft")}
            icon={TextAlignLeftIcon}
            // 库默认返回 "auto"，同样按左对齐高亮
            active={alignment === "left" || alignment === "auto"}
            onPress={() => applyAlignment("left")}
          />
          <PanelChip
            label={t("publish.editor.alignCenter")}
            icon={TextAlignCenterIcon}
            active={alignment === "center"}
            onPress={() => applyAlignment("center")}
          />
          <PanelChip
            label={t("publish.editor.alignRight")}
            icon={TextAlignRightIcon}
            active={alignment === "right"}
            onPress={() => applyAlignment("right")}
          />
        </View>
      ) : null}

      {panel === "list" ? (
        <View style={[styles.panel, panelBg]}>
          <PanelChip
            label={t("publish.editor.orderedList")}
            icon={LeftToRightListNumberIcon}
            active={activeListType === "ordered"}
            onPress={() => toggleList("ordered")}
          />
          <PanelChip
            label={t("publish.editor.unorderedList")}
            icon={LeftToRightListBulletIcon}
            active={activeListType === "unordered"}
            onPress={() => toggleList("unordered")}
          />
        </View>
      ) : null}

      {panel === "more" ? (
        <View style={[styles.panel, panelBg]}>
          <PanelChip
            icon={QuoteDownIcon}
            label={t("publish.editor.quote")}
            active={activeState?.blockQuote.isActive}
            onPress={() => {
              setPanel(null);
              runCommand((editor) => editor.toggleBlockQuote());
            }}
          />
          <PanelChip
            icon={CodeIcon}
            label={t("publish.editor.codeBlock")}
            active={activeState?.codeBlock.isActive}
            onPress={() => {
              setPanel(null);
              runCommand((editor) => editor.toggleCodeBlock());
            }}
          />
          <PanelChip
            icon={RemoveFormattingIcon}
            label={t("publish.editor.clean")}
            onPress={() => {
              setPanel(null);
              runCommand((editor) => {
                if (activeState?.bold.isActive) editor.toggleBold();
                if (activeState?.italic.isActive) editor.toggleItalic();
                if (activeState?.underline.isActive) editor.toggleUnderline();
                if (activeState?.strikeThrough.isActive)
                  editor.toggleStrikeThrough();
                if (activeState?.inlineCode.isActive)
                  editor.toggleInlineCode();
                editor.setTextAlignment("left");
              });
            }}
          />
          <PanelChip
            icon={File02Icon}
            label={t("publish.editor.inlineArticle")}
            onPress={handleArticlePress}
          />
        </View>
      ) : null}

      {emojiOpen ? (
        <View
          style={[
            styles.emojiPanel,
            {
              height: panelHeight,
              backgroundColor: theme.muted,
              borderTopColor: theme.border,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <EmojiPanel
            groups={emojiGroups}
            selectedGroupIndex={emojiGroupIndex}
            selectedItems={emojiItems}
            primaryColor={colors.primary}
            secondaryColor={theme.secondary}
            borderColor={theme.border}
            cardColor={theme.card}
            secondaryBackgroundColor={theme.muted}
            onSelectGroup={setEmojiGroupIndex}
            onSelectEmoji={handleSelectEmoji}
          />
        </View>
      ) : null}

      {mode === "default" ? (
        <View style={styles.row}>
          <ToolbarIconButton
            icon={emojiOpen ? KeyboardIcon : SmileIcon}
            label={
              emojiOpen
                ? t("publish.editor.dismissKeyboard")
                : t("publish.editor.emoji")
            }
            active={emojiOpen}
            onPress={handleToggleEmoji}
          />
          <ToolbarIconButton
            icon={ImageAdd01Icon}
            label={t("publish.editor.image")}
            disabled={uploadingImage}
            onPress={() => {
              void handlePickImage();
            }}
          />
          <ToolbarIconButton
            icon={Video01Icon}
            label={t("publish.editor.video")}
            onPress={handleVideoPress}
          />
          <ToolbarIconButton
            icon={Link01Icon}
            label={t("publish.editor.link")}
            onPress={handleLinkPress}
          />
          <ToolbarTextButton
            label="Aa"
            accessibilityLabel={t("publish.editor.formatting")}
            onPress={() => {
              closePanels();
              setMode("format");
            }}
          />
          <ToolbarIconButton
            icon={PlusSignIcon}
            label={t("publish.editor.more")}
            active={panel === "more"}
            onPress={() => togglePanel("more")}
          />
          <View style={styles.rowSpacer} />
          <RowSeparator />
          <ToolbarIconButton
            icon={KeyboardIcon}
            label={t("publish.editor.dismissKeyboard")}
            onPress={handleDismissKeyboard}
          />
          {uploadingImage ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.row}>
            <ToolbarTextButton
              label="Aa"
              accessibilityLabel={t("publish.editor.fontSize")}
              onPress={notifyUnsupported}
            />
            <ToolbarTextButton
              label="T"
              accessibilityLabel={t("publish.editor.heading")}
              active={panel === "heading"}
              badge
              onPress={() => togglePanel("heading")}
            />
            <ToolbarTextButton
              label="A"
              accessibilityLabel={t("publish.editor.textColor")}
              textStyle={styles.underlinedLabel}
              onPress={notifyUnsupported}
            />
            <ToolbarIconButton
              icon={HighlighterIcon}
              label={t("publish.editor.background")}
              onPress={notifyUnsupported}
            />
            <ToolbarIconButton
              icon={LeftToRightListBulletIcon}
              label={t("publish.editor.list")}
              active={panel === "list" || !!activeListType}
              badge
              onPress={() => togglePanel("list")}
            />
            <ToolbarIconButton
              icon={TextAlignLeftIcon}
              label={t("publish.editor.align")}
              active={panel === "align"}
              badge
              onPress={() => togglePanel("align")}
            />
            <View style={styles.rowSpacer} />
            <RowSeparator />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("publish.editor.hideFormatting")}
              hitSlop={6}
              onPress={() => {
                closePanels();
                setMode("default");
              }}
              style={[styles.collapseButton, { backgroundColor: colors.primary }]}
            >
              <HugeIcon icon={ArrowDown01Icon} size={16} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.row}>
            <ToolbarTextButton
              label="A⁺"
              accessibilityLabel={t("publish.editor.fontSizeUp")}
              onPress={notifyUnsupported}
            />
            <ToolbarTextButton
              label="A⁻"
              accessibilityLabel={t("publish.editor.fontSizeDown")}
              onPress={notifyUnsupported}
            />
            <RowSeparator />
            <ToolbarIconButton
              icon={TextBoldIcon}
              label={t("publish.editor.bold")}
              active={activeState?.bold.isActive}
              onPress={() => runCommand((editor) => editor.toggleBold())}
            />
            <ToolbarIconButton
              icon={TextItalicIcon}
              label={t("publish.editor.italic")}
              active={activeState?.italic.isActive}
              onPress={() => runCommand((editor) => editor.toggleItalic())}
            />
            <ToolbarIconButton
              icon={TextStrikethroughIcon}
              label={t("publish.editor.strike")}
              active={activeState?.strikeThrough.isActive}
              onPress={() => runCommand((editor) => editor.toggleStrikeThrough())}
            />
            <ToolbarIconButton
              icon={TextUnderlineIcon}
              label={t("publish.editor.underline")}
              active={activeState?.underline.isActive}
              onPress={() => runCommand((editor) => editor.toggleUnderline())}
            />
            <View style={styles.rowSpacer} />
            <RowSeparator />
            <ToolbarIconButton
              icon={CodeIcon}
              label={t("publish.editor.inlineCode")}
              active={activeState?.inlineCode.isActive}
              onPress={() => runCommand((editor) => editor.toggleInlineCode())}
            />
          </View>
        </>
      )}

      <InputSheet
        ref={linkSheetRef}
        title={t("publish.editor.addLink")}
        placeholder={t("publish.editor.linkPlaceholder")}
        onSubmit={handleLinkSubmit}
      />

      <InputSheet
        ref={videoSheetRef}
        title={t("publish.editor.insertVideo")}
        placeholder={t("publish.editor.videoPlaceholder")}
        onSubmit={handleVideoSubmit}
      />

      <InputSheet
        ref={articleSheetRef}
        title={t("publish.editor.insertArticle")}
        placeholder={t("publish.editor.articlePlaceholder")}
        onSubmit={handleArticleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    alignSelf: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 4,
    // 撤销/重做胶囊悬在顶部，不允许被裁剪
    overflow: "visible",
  },
  row: {
    width: "100%",
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  /** 把右侧的收起按钮和键盘按钮推到行尾，工具栏才会铺满整行 */
  rowSpacer: {
    flex: 1,
    minWidth: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    position: "absolute",
    right: 1,
    bottom: 1,
  },
  disabled: {
    opacity: 0.35,
  },
  underlinedLabel: {
    textDecorationLine: "underline",
  },
  rowSeparator: {
    width: StyleSheet.hairlineWidth,
    height: 22,
    marginHorizontal: 2,
  },
  collapseButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  historyWrap: {
    position: "absolute",
    top: -44,
    right: 12,
    // 胶囊整个悬在工具栏上方，必须保证不会被父级裁剪
    zIndex: 10,
    elevation: 10,
  },
  historyPill: {
    flexDirection: "row",
    alignItems: "center",
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 4,
    gap: 2,
  },
  historyButton: {
    width: 34,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: -8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  panelChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emojiPanel: {
    marginHorizontal: -8,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
