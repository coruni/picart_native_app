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
import {
  BODY_EMOJI_SIZE,
  EDITOR_BASE_FONT_SIZE,
  EDITOR_FONT_SIZES,
  EDITOR_HIGHLIGHT_COLORS,
  EDITOR_TEXT_COLORS,
  stepFontSize,
} from "@/constants/editorTextStyles";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import {
  ARTICLE_IMAGE_EDGE_GAP,
  getEditorContentWidth,
  isImageAloneInParagraph,
} from "@/lib/editorHtml";
import { prepareContentImage, uploadSingleImage } from "@/lib/uploadImage";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";
import File02Icon from "@hugeicons/core-free-icons/File02Icon";
import SeparatorHorizontalIcon from "@hugeicons/core-free-icons/SeparatorHorizontalIcon";
import HighlighterIcon from "@hugeicons/core-free-icons/HighlighterIcon";
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import KeyboardIcon from "@hugeicons/core-free-icons/KeyboardIcon";
import ListChecksIcon from "@hugeicons/core-free-icons/ListChecksIcon";
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
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type TextStyle,
} from "react-native";
import {
  KeyboardController,
  useKeyboardState,
} from "react-native-keyboard-controller";
import type {
  EnrichedTextInputInstance,
  OnChangeStateEvent,
  OnLinkDetected,
} from "react-native-enriched-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputSheet, { type InputSheetRef } from "./InputSheet";
import InlinePostSheet, { type InlinePost, type InlinePostSheetRef } from "./InlinePostSheet";
import type { RichTextSelection } from "./useArticleRichText";

/** default：第一层工具栏；format：点「Aa」后展开的第二层格式栏 */
type ToolbarMode = "default" | "format";
type HeadingLevel = 1 | 2 | 3 | 4;
type PanelKey =
  | "more"
  | "align"
  | "list"
  | "color"
  | "highlight"
  | "size";

interface ArticleRichTextToolbarProps {
  editorRef: RefObject<EnrichedTextInputInstance | null>;
  selectionRef: RefObject<RichTextSelection>;
  activeState: OnChangeStateEvent | null;
  /** 光标当前所在的链接，用来精确摘链 */
  activeLink: OnLinkDetected | null;
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

/** 表情按正文字号的 1.25 倍插入，和阅读端同一个来源 */
const EMOJI_INSERT_SIZE = BODY_EMOJI_SIZE;
/** 键盘高度低于该值视为「没弹出」 */
const MIN_KEYBOARD_HEIGHT = 180;

/** 原生编辑器没有 <hr>，分割线用一段横线字符表示 */
const DIVIDER_TEXT = "──────────────";
/** 分割线借链接插入时的临时地址；提交前由 toArticleHtml 兜底剥掉 */
const DIVIDER_LINK = "#";
/** 内联帖子落进正文时的链接，和分享出去的地址保持一致 */
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? "";
const postLink = (id: string) => `${WEB_URL}/article/${id}`;

/** 只提供 h1–h4：移动端字号阶梯够用，h5/h6 与正文差不开 */
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

/** 色板里的一格：选中时描主色边，方便看出当前用的是哪个色 */
function SwatchButton({
  color,
  label,
  active,
  onPress,
}: {
  color: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme, colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
      // 视觉 26，热区凑到 44（色板密排，热区轻微重叠是可接受的取舍）
      hitSlop={9}
      onPress={onPress}
      style={[
        styles.swatch,
        {
          backgroundColor: color,
          borderColor: active ? colors.primary : theme.border,
          borderWidth: active ? 2 : 1,
        },
      ]}
    />
  );
}

/** 色板一格宽 26，一行 8 格正好一组色系，和 web 端色板的分组一致 */
const SWATCHES_PER_ROW = 8;

/**
 * 一行 = 一个色系。读屏不能念 `rgb(230, 230, 230)`，
 * 用「色系 + 第几档」描述，一档由浅到深。
 */
const SWATCH_HUE_KEYS = [
  "gray",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
] as const;

function chunkSwatches(swatches: string[]) {
  const rows: string[][] = [];
  for (let i = 0; i < swatches.length; i += SWATCHES_PER_ROW) {
    rows.push(swatches.slice(i, i + SWATCHES_PER_ROW));
  }
  return rows;
}

const TEXT_COLOR_ROWS = chunkSwatches(EDITOR_TEXT_COLORS);
const HIGHLIGHT_COLOR_ROWS = chunkSwatches(EDITOR_HIGHLIGHT_COLORS);

function SwatchGrid({
  rows,
  onSelect,
}: {
  rows: string[][];
  onSelect: (color: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.swatchGrid}>
      {rows.map((row, rowIndex) => {
        const hue = SWATCH_HUE_KEYS[rowIndex];
        const hueName = hue
          ? t(`publish.editor.colorHues.${hue}`)
          : t("publish.editor.textColor");
        return (
          <View key={row[0] ?? rowIndex} style={styles.swatchRow}>
            {row.map((color, colIndex) => (
              <SwatchButton
                key={color}
                color={color}
                label={`${hueName} ${colIndex + 1}`}
                onPress={() => onSelect(color)}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

/** 色板有 9 行，限高后滚动，避免面板把正文挤没 */
function SwatchPanel({
  rows,
  onSelect,
}: {
  rows: string[][];
  onSelect: (color: string) => void;
}) {
  return (
    <ScrollView
      style={styles.swatchScroller}
      contentContainerStyle={styles.swatchScrollerContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <SwatchGrid rows={rows} onSelect={onSelect} />
    </ScrollView>
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
  activeLink,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onContentChanged,
  onUploadingChange,
  onOverlayChange,
}: ArticleRichTextToolbarProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<ToolbarMode>("default");
  const [panel, setPanel] = useState<PanelKey | null>(null);
  /** T 被选中后，第二行的 A⁺ / A⁻ 让位给 H1–H4 */
  const [headingMode, setHeadingMode] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [emojiGroups, setEmojiGroups] = useState<EmojiGroup[]>(
    () => getCachedEmojiPayload()?.groups ?? [],
  );
  const [emojiGroupIndex, setEmojiGroupIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const linkSheetRef = useRef<InputSheetRef>(null);
  const videoSheetRef = useRef<InputSheetRef>(null);
  const inlinePostSheetRef = useRef<InlinePostSheetRef>(null);
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
  // 工具栏自身占的高度，面板要减掉它，两者加起来才正好顶替键盘
  const [rowsHeight, setRowsHeight] = useState(0);

  // 记住最近一次实测的键盘高度，面板高度与它对齐，切换时不跳动
  if (keyboardVisible && Math.abs(keyboardState.height - panelReserve) >= 1) {
    setPanelReserve(keyboardState.height);
  }

  const panelBase =
    panelReserve > 0 ? panelReserve : Math.round(height * 0.38);
  const panelHeight = Math.max(
    0,
    Math.min(panelBase, Math.round(height * 0.5)) - rowsHeight,
  );

  const handleRowsLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const next = event.nativeEvent.layout.height;
      setRowsHeight((prev) => (Math.abs(prev - next) >= 1 ? next : prev));
    },
    [],
  );

  // 表情面板和 sheet 都需要先收键盘，把「有浮层」告诉父级，工具栏才不会被一起卸载
  useEffect(() => {
    onOverlayChange?.(emojiOpen || sheetOpen);
  }, [emojiOpen, onOverlayChange, sheetOpen]);

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
        toast.show(t("publish.editor.photoPermission"));
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
      // 相机原图动辄几 MB，先按长边 1600 压一道再传
      const preparedUri = await prepareContentImage(
        asset.uri,
        asset.width,
        asset.height,
      );
      const url = await uploadSingleImage(preparedUri);

      // 编辑区宽度要再减去右边一截空白：图片铺满整行后这一行点不到，
      // 光标进不去就插不了字、改不了行
      const maxWidth = Math.max(
        getEditorContentWidth(width) - ARTICLE_IMAGE_EDGE_GAP,
        120,
      );
      const ratio = asset.width > 0 ? asset.height / asset.width : 0.72;
      const editor = editorRef.current;
      if (editor) {
        focusWithSelection(editor, selection);
        editor.setImage(
          url,
          Math.round(maxWidth),
          Math.round(maxWidth * ratio),
        );
        // 图片没有块级概念，只会落在当前段里；这一段只有图时把整段居中，
        // 跟 web 端 ql-image-wrapper 的居中一致。段里还有正文就不动，
        // 否则会把正文一起居中。
        const inserted = await editor.getHTML().catch(() => "");
        if (isImageAloneInParagraph(inserted, url)) {
          editor.setTextAlignment("center");
        }
        onContentChanged?.();
        setTimeout(() => editorRef.current?.focus(), 120);
      }
    } catch (error) {
      console.error("Failed to insert article image:", error);
      toast.show(t("publish.editor.imageUploadFailed"));
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

  // 颜色 / 背景 / 字号都作用在当前选区上，命令由原生编辑器落到 span 上。
  // 面板不关闭，方便连续试色后再继续写。
  const applyTextColor = useCallback(
    (color: string) => {
      runCommand((editor) => editor.setTextColor(color));
    },
    [runCommand],
  );

  const applyHighlight = useCallback(
    (color: string) => {
      runCommand((editor) => editor.setTextBackgroundColor(color));
    },
    [runCommand],
  );

  // 原生不会回传当前字号，只能记住最近一次设置的值给 A⁺ / A⁻ 当起点
  const [fontSize, setFontSize] = useState<number>(EDITOR_BASE_FONT_SIZE);
  const applyFontSize = useCallback(
    (size: number) => {
      setFontSize(size > 0 ? size : EDITOR_BASE_FONT_SIZE);
      runCommand((editor) => editor.setTextFontSize(String(size)));
    },
    [runCommand],
  );

  const stepFontSizeBy = useCallback(
    (step: 1 | -1) => {
      applyFontSize(stepFontSize(fontSize, step));
    },
    [applyFontSize, fontSize],
  );

  const handleLinkPress = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(false);
    setSheetOpen(true);
    linkSheetRef.current?.present();
  }, [rememberSelection]);

  const handleVideoPress = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(false);
    setSheetOpen(true);
    videoSheetRef.current?.present();
  }, [rememberSelection]);

  const handleArticlePress = useCallback(() => {
    rememberSelection();
    setPanel(null);
    setEmojiOpen(false);
    setSheetOpen(true);
    inlinePostSheetRef.current?.present();
  }, [rememberSelection]);

  /**
   * 分割线：原生编辑器没有 <hr>，
   * 借 setLink 在光标处落一段横线文本，再立刻把链接样式摘掉。
   */
  const insertDivider = useCallback(() => {
    // 面板不会抢焦点，这里必须读实时选区。
    // 之前读的是 savedSelectionRef，它只在开 sheet / 表情面板时才更新，
    // 直接点「分割线」时还是初始值 0，线会永远插到文首。
    const { start } = selectionRef.current;
    const pos = Math.max(0, start);
    setPanel(null);
    runCommand((editor) => {
      focusWithSelection(editor, { start: pos, end: pos, text: "" });
      editor.setLink(pos, pos, DIVIDER_TEXT, DIVIDER_LINK);
    });
    setTimeout(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.removeLink(pos, pos + DIVIDER_TEXT.length);
      editor.focus();
      editor.setSelection(pos + DIVIDER_TEXT.length, pos + DIVIDER_TEXT.length);
      // 摘链是第二次修改，撤销栈要再记一次，否则只能撤回到「带链接」的中间态
      onContentChanged?.();
    }, 200);
  }, [
    editorRef,
    focusWithSelection,
    onContentChanged,
    runCommand,
    selectionRef,
  ]);

  /**
   * 内联帖子：选中的帖子按顺序插成内部链接，手填的外链接在最后。
   * 每插一段就把光标往后推，避免多条都落在同一个位置。
   */
  const handleArticleConfirm = useCallback(
    ({ posts, link }: { posts: InlinePost[]; link: string }) => {
      let cursor = Math.max(0, savedSelectionRef.current.start);

      const append = (label: string, url: string) => {
        const at = cursor;
        runCommand((editor) => editor.setLink(at, at, label, url));
        cursor += label.length;
      };

      posts.forEach((post) => {
        append(`📄 ${post.title}`, postLink(String(post.id)));
      });

      const value = link.trim();
      if (value) {
        const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(value)
          ? value
          : `https://${value}`;
        append(`📄 ${normalized}`, normalized);
      }

      const end = cursor;
      setTimeout(() => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        editor.setSelection(end, end);
      }, 200);
    },
    [editorRef, runCommand],
  );

  /** sheet 关闭后把焦点交还正文，键盘和工具栏一起回来 */
  const handleSheetDismiss = useCallback(() => {
    setSheetOpen(false);
    editorRef.current?.focus();
  }, [editorRef]);

  /**
   * 链接 / 视频 / 内联帖子：原生编辑器只支持超链接，
   * 三者统一以链接形式插入，视频和帖子带上对应前缀，阅读端仍可点击跳转。
   */
  const insertAsLink = useCallback(
    (raw: string, prefix = "", customLabel = "") => {
      const value = raw.trim();
      if (!value) return;
      const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(value)
        ? value
        : `https://${value}`;
      const { start, end, text } = savedSelectionRef.current;
      const safeStart = Math.max(0, start);
      const safeEnd = Math.max(safeStart, end);
      const selected = safeStart !== safeEnd ? text : "";
      // 用户填了显示文本就用它，否则用选中的文字，再否则用地址本身
      const typed = customLabel.trim();
      const label =
        typed || (selected ? `${prefix}${selected}` : `${prefix}${normalized}`);

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
    (value: string, text: string) => insertAsLink(value, "", text),
    [insertAsLink],
  );

  const handleVideoSubmit = useCallback(
    (value: string) => insertAsLink(value, "▶ "),
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
    (kind: "ordered" | "unordered" | "checkbox") => {
      setPanel(null);
      runCommand((editor) => {
        if (kind === "ordered") editor.toggleOrderedList();
        else if (kind === "unordered") editor.toggleUnorderedList();
        else editor.toggleCheckboxList(false);
      });
    },
    [runCommand],
  );

  const panelBg = {
    backgroundColor: theme.muted,
    borderTopColor: theme.border,
  };

  return (
    <View
      style={[
        styles.root,
        // 打开 sheet 时工具栏整体收起，只留下挂载着的 sheet，
        // 输入期间不占用屏幕、也不和键盘抢位置
        sheetOpen && styles.rootCollapsed,
        { backgroundColor: theme.card, borderTopColor: theme.border },
      ]}
    >
      {sheetOpen ? null : (
        <>
        <HistoryPill
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          labelUndo={t("publish.editor.undo")}
          labelRedo={t("publish.editor.redo")}
        />

        <View style={styles.rowsWrap} onLayout={handleRowsLayout}>
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
                active={panel === "size"}
                onPress={() => togglePanel("size")}
              />
              <ToolbarTextButton
                label="T"
                accessibilityLabel={t("publish.editor.heading")}
                active={headingMode}
                onPress={() => {
                  setPanel(null);
                  setHeadingMode((prev) => !prev);
                }}
              />
              <ToolbarTextButton
                label="A"
                accessibilityLabel={t("publish.editor.textColor")}
                textStyle={styles.underlinedLabel}
                active={panel === "color"}
                onPress={() => togglePanel("color")}
              />
              <ToolbarIconButton
                icon={HighlighterIcon}
                label={t("publish.editor.background")}
                active={panel === "highlight"}
                onPress={() => togglePanel("highlight")}
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

            {/*
              第二行是可横向滚动的格式条：字号 / 标题 / 对齐 / 列表 / B I S U 都在里面，
              行内代码 <> 固定在条尾，不参与滚动。
            */}
            <View style={styles.row}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.rowScroll}
                contentContainerStyle={styles.rowScrollContent}
              >
                {/* T 选中后 A⁺ / A⁻ 换成 H1–H4，同一行直接选标题级别 */}
                {headingMode ? (
                  <>
                    {HEADING_OPTIONS.map((level) => (
                      <ToolbarTextButton
                        key={level}
                        label={`H${level}`}
                        accessibilityLabel={`${t("publish.editor.heading")} ${level}`}
                        active={activeHeading === level}
                        onPress={() => applyHeading(level)}
                      />
                    ))}
                    <ToolbarTextButton
                      label="P"
                      accessibilityLabel={t("publish.editor.paragraph")}
                      active={activeHeading === null}
                      onPress={() => applyHeading(null)}
                    />
                  </>
                ) : (
                  <>
                    <ToolbarTextButton
                      label="A⁺"
                      accessibilityLabel={t("publish.editor.fontSizeUp")}
                      onPress={() => stepFontSizeBy(1)}
                    />
                    <ToolbarTextButton
                      label="A⁻"
                      accessibilityLabel={t("publish.editor.fontSizeDown")}
                      onPress={() => stepFontSizeBy(-1)}
                    />
                  </>
                )}

                {/* 点对齐后，三个对齐方式直接出现在这条里 */}
                {panel === "align" ? (
                  <>
                    <RowSeparator />
                    <ToolbarIconButton
                      icon={TextAlignLeftIcon}
                      label={t("publish.editor.alignLeft")}
                      // 库默认返回 "auto"，同样按左对齐高亮
                      active={alignment === "left" || alignment === "auto"}
                      onPress={() => applyAlignment("left")}
                    />
                    <ToolbarIconButton
                      icon={TextAlignCenterIcon}
                      label={t("publish.editor.alignCenter")}
                      active={alignment === "center"}
                      onPress={() => applyAlignment("center")}
                    />
                    <ToolbarIconButton
                      icon={TextAlignRightIcon}
                      label={t("publish.editor.alignRight")}
                      active={alignment === "right"}
                      onPress={() => applyAlignment("right")}
                    />
                  </>
                ) : null}

                {/* 点列表后，有序 / 无序 / 待办直接出现在这条里 */}
                {panel === "list" ? (
                  <>
                    <RowSeparator />
                    <ToolbarIconButton
                      icon={LeftToRightListNumberIcon}
                      label={t("publish.editor.orderedList")}
                      active={activeListType === "ordered"}
                      onPress={() => toggleList("ordered")}
                    />
                    <ToolbarIconButton
                      icon={LeftToRightListBulletIcon}
                      label={t("publish.editor.unorderedList")}
                      active={activeListType === "unordered"}
                      onPress={() => toggleList("unordered")}
                    />
                    <ToolbarIconButton
                      icon={ListChecksIcon}
                      label={t("publish.editor.checkboxList")}
                      active={activeListType === "checkbox"}
                      onPress={() => toggleList("checkbox")}
                    />
                  </>
                ) : null}

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
              </ScrollView>
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

        </View>

        {/* 面板一律挂在工具栏下方，不遮住正文上方的工具按钮 */}
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
                setFontSize(EDITOR_BASE_FONT_SIZE);
                runCommand((editor) => {
                  if (activeState?.bold.isActive) editor.toggleBold();
                  if (activeState?.italic.isActive) editor.toggleItalic();
                  if (activeState?.underline.isActive) editor.toggleUnderline();
                  if (activeState?.strikeThrough.isActive)
                    editor.toggleStrikeThrough();
                  if (activeState?.inlineCode.isActive)
                    editor.toggleInlineCode();
                  // 颜色 / 背景 / 字号不在 activeState 里，直接清一遍
                  editor.setTextColor("");
                  editor.setTextBackgroundColor("");
                  editor.setTextFontSize("0");
                  editor.setTextAlignment("left");
                });
              }}
            />
            <PanelChip
              icon={SeparatorHorizontalIcon}
              label={t("publish.editor.divider")}
              onPress={insertDivider}
            />
            <PanelChip
              icon={File02Icon}
              label={t("publish.editor.inlineArticle")}
              onPress={handleArticlePress}
            />
            <PanelChip
              icon={Link01Icon}
              label={t("publish.editor.removeLink")}
              // 光标不在链接里就没什么可摘的
              disabled={!activeLink}
              onPress={() => {
                if (!activeLink) return;
                setPanel(null);
                runCommand((editor) =>
                  editor.removeLink(activeLink.start, activeLink.end),
                );
              }}
            />
          </View>
        ) : null}

        {/* 文字颜色 / 背景色：一组色系一行，选完收起面板 */}
        {panel === "color" ? (
          <View style={[styles.panel, panelBg]}>
            <PanelChip
              label={t("publish.editor.colorDefault")}
              onPress={() => {
                applyTextColor("");
                setPanel(null);
              }}
            />
            <SwatchPanel
              rows={TEXT_COLOR_ROWS}
              onSelect={(color) => {
                applyTextColor(color);
                setPanel(null);
              }}
            />
          </View>
        ) : null}

        {panel === "highlight" ? (
          <View style={[styles.panel, panelBg]}>
            <PanelChip
              label={t("publish.editor.backgroundNone")}
              onPress={() => {
                applyHighlight("");
                setPanel(null);
              }}
            />
            <SwatchPanel
              rows={HIGHLIGHT_COLOR_ROWS}
              onSelect={(color) => {
                applyHighlight(color);
                setPanel(null);
              }}
            />
          </View>
        ) : null}

        {panel === "size" ? (
          <View style={[styles.panel, panelBg]}>
            <PanelChip
              label={t("publish.editor.fontSizeDefault")}
              active={fontSize === EDITOR_BASE_FONT_SIZE}
              onPress={() => applyFontSize(0)}
            />
            {EDITOR_FONT_SIZES.map((size) => (
              <PanelChip
                key={size}
                label={String(size)}
                active={fontSize === size}
                onPress={() => applyFontSize(size)}
              />
            ))}
          </View>
        ) : null}

        {/* 表情面板顶替键盘，固定在工具栏最下方 */}
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
        </>
      )}

      <InputSheet
        ref={linkSheetRef}
        title={t("publish.editor.addLink")}
        placeholder={t("publish.editor.linkPlaceholder")}
        textPlaceholder={t("publish.editor.linkTextPlaceholder")}
        onSubmit={handleLinkSubmit}
        onDismiss={handleSheetDismiss}
      />

      <InputSheet
        ref={videoSheetRef}
        title={t("publish.editor.insertVideo")}
        placeholder={t("publish.editor.videoPlaceholder")}
        onSubmit={handleVideoSubmit}
        onDismiss={handleSheetDismiss}
      />

      <InlinePostSheet
        ref={inlinePostSheetRef}
        onConfirm={handleArticleConfirm}
        onDismiss={handleSheetDismiss}
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
  /** 包住工具栏各行的容器：只为量高度，不影响布局 */
  rowsWrap: {
    width: "100%",
  },
  /** sheet 打开时把工具栏收成零高，只保留挂载状态让 sheet 不被卸载 */
  rootCollapsed: {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    borderTopWidth: 0,
    overflow: "hidden",
  },
  /** 第二行横向滚动：占满剩余宽度，内容超宽时左右滑 */
  rowScroll: {
    flex: 1,
  },
  rowScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingRight: 4,
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
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // 面板挂在工具栏下方，分隔线画在上边
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  panelChip: {
    // 32 → 36：配上 hitSlop 4 正好 44 的点击高度
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  /** 色板圆点：和 panelChip 同高，横向排在面板里 */
  swatchScroller: {
    width: "100%",
    maxHeight: 168,
  },
  swatchScrollerContent: {
    gap: 6,
  },
  swatchGrid: {
    width: "100%",
    gap: 6,
  },
  swatchRow: {
    flexDirection: "row",
    gap: 6,
  },
  swatch: {
    width: 26,
    height: 26,
    borderRadius: 6,
  },
  emojiPanel: {
    marginHorizontal: -8,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
