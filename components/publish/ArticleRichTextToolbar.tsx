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
import Button from "@/components/ui/Button";
import HugeIcon, { type HugeIconData } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { toast } from "@/hooks/useToast";
import { useTheme } from "@/hooks/useTheme";
import { uploadSingleImage } from "@/lib/uploadImage";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import CheckListIcon from "@hugeicons/core-free-icons/CheckListIcon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";
import CodeSimpleIcon from "@hugeicons/core-free-icons/CodeSimpleIcon";
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import KeyboardIcon from "@hugeicons/core-free-icons/KeyboardIcon";
import LeftToRightListBulletIcon from "@hugeicons/core-free-icons/LeftToRightListBulletIcon";
import LeftToRightListNumberIcon from "@hugeicons/core-free-icons/LeftToRightListNumberIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import QuoteDownIcon from "@hugeicons/core-free-icons/QuoteDownIcon";
import Redo02Icon from "@hugeicons/core-free-icons/Redo02Icon";
import SmileIcon from "@hugeicons/core-free-icons/SmileIcon";
import TextAlignCenterIcon from "@hugeicons/core-free-icons/TextAlignCenterIcon";
import TextAlignLeftIcon from "@hugeicons/core-free-icons/TextAlignLeftIcon";
import TextAlignRightIcon from "@hugeicons/core-free-icons/TextAlignRightIcon";
import Undo02Icon from "@hugeicons/core-free-icons/Undo02Icon";
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
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type TextStyle,
} from "react-native";
import type {
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from "react-native-enriched-html";

import type { RichTextSelection } from "./useArticleRichText";

type ToolbarMode = "default" | "format";
type HeadingLevel = 1 | 2 | 3 | 4;

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
}

const EMOJI_PANEL_HEIGHT = 220;
const EMOJI_INSERT_SIZE = 22;

function ToolbarIconButton({
  icon,
  label,
  active,
  disabled,
  onPress,
}: {
  icon: HugeIconData;
  label: string;
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
        styles.iconButton,
        active && { backgroundColor: colors.primary + "1A" },
        disabled && styles.disabled,
      ]}
    >
      <HugeIcon
        icon={icon}
        size={20}
        color={active ? colors.primary : theme.secondary}
      />
    </Pressable>
  );
}

function ToolbarTextButton({
  label,
  accessibilityLabel,
  active,
  onPress,
  textStyle,
}: {
  label: string;
  accessibilityLabel: string;
  active?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
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
        fontWeight="600"
        color={active ? colors.primary : theme.secondary}
        style={textStyle}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ToolbarDivider() {
  const { theme } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: theme.border }]} />
  );
}

function HistoryButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: HugeIconData;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={[styles.historyButton, disabled && styles.disabled]}
    >
      <HugeIcon icon={icon} size={16} color={theme.background} />
    </Pressable>
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
  const { width } = useWindowDimensions();

  const [mode, setMode] = useState<ToolbarMode>("default");
  const [headingOpen, setHeadingOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiGroups, setEmojiGroups] = useState<EmojiGroup[]>(
    () => getCachedEmojiPayload()?.groups ?? [],
  );
  const [emojiGroupIndex, setEmojiGroupIndex] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  // 选中的是一段已有链接时，弹窗里可以直接移除
  const [linkCanRemove, setLinkCanRemove] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const linkInputRef = useRef<TextInput>(null);
  // 链接弹窗会抢走输入焦点，打开时先把选区存下来
  const linkSelectionRef = useRef<RichTextSelection>({
    start: 0,
    end: 0,
    text: "",
  });

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
    setHeadingOpen(false);
    setMoreOpen(false);
    setEmojiOpen(false);
  }, []);

  const handleDismissKeyboard = useCallback(() => {
    editorRef.current?.blur();
    Keyboard.dismiss();
  }, [editorRef]);

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

  // 表情面板 / 选图会短暂抢走焦点，插入前把光标还原到原来的位置
  const focusWithSelection = useCallback(
    (editor: EnrichedTextInputInstance, selection: RichTextSelection) => {
      const start = Math.max(0, selection.start);
      const end = Math.max(start, selection.end);
      editor.focus();
      editor.setSelection(start, end);
    },
    [],
  );

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
      setHeadingOpen(false);
      runCommand((editor) => {
        if (level === null) {
          if (activeState?.h1.isActive) editor.toggleH1();
          else if (activeState?.h2.isActive) editor.toggleH2();
          else if (activeState?.h3.isActive) editor.toggleH3();
          else if (activeState?.h4.isActive) editor.toggleH4();
          return;
        }

        if (level === 1) editor.toggleH1();
        else if (level === 2) editor.toggleH2();
        else if (level === 3) editor.toggleH3();
        else editor.toggleH4();
      });
    },
    [activeState, runCommand],
  );

  const alignment = activeState?.alignment ?? "left";
  const alignmentIcon =
    alignment === "center"
      ? TextAlignCenterIcon
      : alignment === "right"
        ? TextAlignRightIcon
        : TextAlignLeftIcon;

  const cycleAlignment = useCallback(() => {
    const next =
      alignment === "left"
        ? "center"
        : alignment === "center"
          ? "right"
          : "left";
    runCommand((editor) => editor.setTextAlignment(next));
  }, [alignment, runCommand]);

  const openLinkModal = useCallback(() => {
    closePanels();
    const selection = selectionRef.current;
    linkSelectionRef.current = selection;
    setLinkCanRemove(
      selection.start !== selection.end && !!activeState?.link.isActive,
    );
    setLinkUrl("");
    setLinkOpen(true);
  }, [activeState, closePanels, selectionRef]);

  const closeLinkModal = useCallback(() => {
    setLinkOpen(false);
    setLinkUrl("");
    setLinkCanRemove(false);
  }, []);

  const applyLink = useCallback(() => {
    const value = linkUrl.trim();
    if (!value) return;

    const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(value)
      ? value
      : `https://${value}`;
    const { start, end, text } = linkSelectionRef.current;
    const safeStart = Math.max(0, start);
    const safeEnd = Math.max(safeStart, end);
    const label = safeStart !== safeEnd && text ? text : normalized;

    runCommand((editor) => editor.setLink(safeStart, safeEnd, label, normalized));
    setLinkOpen(false);
    setLinkUrl("");
    setLinkCanRemove(false);
    setTimeout(() => editorRef.current?.focus(), 120);
  }, [editorRef, linkUrl, runCommand]);

  const removeLink = useCallback(() => {
    const { start, end } = linkSelectionRef.current;
    const safeStart = Math.max(0, start);
    const safeEnd = Math.max(safeStart, end);
    if (safeStart === safeEnd) return;

    runCommand((editor) => editor.removeLink(safeStart, safeEnd));
    setLinkOpen(false);
    setLinkUrl("");
    setLinkCanRemove(false);
    setTimeout(() => editorRef.current?.focus(), 120);
  }, [editorRef, runCommand]);

  const headingOptions = useMemo(
    () => [
      { level: null as HeadingLevel | null, label: t("publish.editor.paragraph") },
      { level: 1 as HeadingLevel, label: "H1" },
      { level: 2 as HeadingLevel, label: "H2" },
      { level: 3 as HeadingLevel, label: "H3" },
      { level: 4 as HeadingLevel, label: "H4" },
    ],
    [t],
  );

  const panelChipStyle = useMemo(
    () => [styles.panelChip, { backgroundColor: theme.muted }],
    [theme.muted],
  );

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.card, borderTopColor: theme.border },
      ]}
    >
      <View style={styles.historyWrap} pointerEvents="box-none">
        <View
          style={[styles.historyPill, { backgroundColor: theme.foreground }]}
        >
          <HistoryButton
            icon={Undo02Icon}
            label={t("publish.editor.undo")}
            disabled={!canUndo}
            onPress={onUndo}
          />
          <View
            style={[
              styles.historyPillDivider,
              { backgroundColor: theme.background + "33" },
            ]}
          />
          <HistoryButton
            icon={Redo02Icon}
            label={t("publish.editor.redo")}
            disabled={!canRedo}
            onPress={onRedo}
          />
        </View>
      </View>

      {headingOpen ? (
        <View
          style={[styles.panel, { borderBottomColor: theme.border }]}
        >
          {headingOptions.map((option) => {
            const active = activeHeading === option.level;
            return (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => applyHeading(option.level)}
                style={[
                  panelChipStyle,
                  active && { backgroundColor: colors.primary + "1A" },
                ]}
              >
                <ThemedText
                  size={13}
                  fontWeight={active ? "600" : "400"}
                  color={active ? colors.primary : theme.secondary}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {moreOpen ? (
        <View style={[styles.panel, { borderBottomColor: theme.border }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              runCommand((editor) => editor.toggleBlockQuote());
              setMoreOpen(false);
            }}
            style={[
              panelChipStyle,
              activeState?.blockQuote.isActive && {
                backgroundColor: colors.primary + "1A",
              },
            ]}
          >
            <HugeIcon icon={QuoteDownIcon} size={16} color={theme.secondary} />
            <ThemedText size={13} color={theme.secondary}>
              {t("publish.editor.quote")}
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              runCommand((editor) => editor.toggleCodeBlock());
              setMoreOpen(false);
            }}
            style={[
              panelChipStyle,
              activeState?.codeBlock.isActive && {
                backgroundColor: colors.primary + "1A",
              },
            ]}
          >
            <HugeIcon icon={CodeIcon} size={16} color={theme.secondary} />
            <ThemedText size={13} color={theme.secondary}>
              {t("publish.editor.codeBlock")}
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              runCommand((editor) => editor.toggleCheckboxList(false));
              setMoreOpen(false);
            }}
            style={[
              panelChipStyle,
              activeState?.checkboxList.isActive && {
                backgroundColor: colors.primary + "1A",
              },
            ]}
          >
            <HugeIcon icon={CheckListIcon} size={16} color={theme.secondary} />
            <ThemedText size={13} color={theme.secondary}>
              {t("publish.editor.checkboxList")}
            </ThemedText>
          </Pressable>
        </View>
      ) : null}

      {emojiOpen ? (
        <View
          style={[
            styles.emojiPanel,
            {
              height: EMOJI_PANEL_HEIGHT,
              borderBottomColor: theme.border,
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
          <View style={styles.group}>
            <ToolbarIconButton
              icon={SmileIcon}
              label={t("publish.editor.emoji")}
              active={emojiOpen}
              onPress={() => {
                setHeadingOpen(false);
                setMoreOpen(false);
                setEmojiOpen((prev) => !prev);
              }}
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
              icon={Link01Icon}
              label={t("publish.editor.link")}
              active={activeState?.link.isActive}
              onPress={openLinkModal}
            />
            <ToolbarDivider />
            <ToolbarTextButton
              label="A"
              accessibilityLabel={t("publish.editor.formatting")}
              onPress={() => {
                closePanels();
                setMode("format");
              }}
            />
            <ToolbarIconButton
              icon={PlusSignIcon}
              label={t("publish.editor.more")}
              active={moreOpen}
              onPress={() => {
                setHeadingOpen(false);
                setEmojiOpen(false);
                setMoreOpen((prev) => !prev);
              }}
            />
          </View>
          <View style={styles.group}>
            {uploadingImage ? (
              <View style={styles.iconButton}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null}
            <ToolbarIconButton
              icon={KeyboardIcon}
              label={t("publish.editor.dismissKeyboard")}
              onPress={handleDismissKeyboard}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.group}>
              <ToolbarTextButton
                label="Aa"
                accessibilityLabel={t("publish.editor.heading")}
                active={headingOpen || activeHeading !== null}
                onPress={() => {
                  setMoreOpen(false);
                  setEmojiOpen(false);
                  setHeadingOpen((prev) => !prev);
                }}
              />
              <ToolbarIconButton
                icon={QuoteDownIcon}
                label={t("publish.editor.quote")}
                active={activeState?.blockQuote.isActive}
                onPress={() => runCommand((editor) => editor.toggleBlockQuote())}
              />
              <ToolbarIconButton
                icon={CodeIcon}
                label={t("publish.editor.codeBlock")}
                active={activeState?.codeBlock.isActive}
                onPress={() => runCommand((editor) => editor.toggleCodeBlock())}
              />
              <ToolbarIconButton
                icon={LeftToRightListNumberIcon}
                label={t("publish.editor.orderedList")}
                active={activeState?.orderedList.isActive}
                onPress={() => runCommand((editor) => editor.toggleOrderedList())}
              />
              <ToolbarIconButton
                icon={LeftToRightListBulletIcon}
                label={t("publish.editor.unorderedList")}
                active={activeState?.unorderedList.isActive}
                onPress={() => runCommand((editor) => editor.toggleUnorderedList())}
              />
              <ToolbarIconButton
                icon={alignmentIcon}
                label={t("publish.editor.alignment")}
                active={alignment === "center" || alignment === "right"}
                onPress={cycleAlignment}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("publish.editor.hideFormatting")}
              hitSlop={6}
              onPress={() => {
                closePanels();
                setMode("default");
              }}
              style={[
                styles.collapseButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <HugeIcon icon={ArrowDown01Icon} size={18} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.row}>
            <View style={styles.group}>
              <ToolbarTextButton
                label="B"
                accessibilityLabel={t("publish.editor.bold")}
                active={activeState?.bold.isActive}
                textStyle={styles.boldLabel}
                onPress={() => runCommand((editor) => editor.toggleBold())}
              />
              <ToolbarTextButton
                label="I"
                accessibilityLabel={t("publish.editor.italic")}
                active={activeState?.italic.isActive}
                textStyle={styles.italicLabel}
                onPress={() => runCommand((editor) => editor.toggleItalic())}
              />
              <ToolbarTextButton
                label="S"
                accessibilityLabel={t("publish.editor.strike")}
                active={activeState?.strikeThrough.isActive}
                textStyle={styles.strikeLabel}
                onPress={() => runCommand((editor) => editor.toggleStrikeThrough())}
              />
              <ToolbarTextButton
                label="U"
                accessibilityLabel={t("publish.editor.underline")}
                active={activeState?.underline.isActive}
                textStyle={styles.underlineLabel}
                onPress={() => runCommand((editor) => editor.toggleUnderline())}
              />
              <ToolbarDivider />
              <ToolbarIconButton
                icon={CodeSimpleIcon}
                label={t("publish.editor.inlineCode")}
                active={activeState?.inlineCode.isActive}
                onPress={() => runCommand((editor) => editor.toggleInlineCode())}
              />
              <ToolbarIconButton
                icon={CheckListIcon}
                label={t("publish.editor.checkboxList")}
                active={activeState?.checkboxList.isActive}
                onPress={() =>
                  runCommand((editor) => editor.toggleCheckboxList(false))
                }
              />
            </View>
          </View>
        </>
      )}

      <Modal
        visible={linkOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeLinkModal}
      >
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeLinkModal} />
          <View
            style={[styles.modalCard, { backgroundColor: theme.card }]}
          >
            <ThemedText size={15} fontWeight="600">
              {t("publish.editor.addLink")}
            </ThemedText>
            <TextInput
              ref={linkInputRef}
              value={linkUrl}
              onChangeText={setLinkUrl}
              placeholder={t("publish.editor.linkPlaceholder")}
              placeholderTextColor={theme.mutedForeground}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="done"
              onSubmitEditing={applyLink}
              style={[
                styles.linkInput,
                {
                  backgroundColor: theme.muted,
                  color: theme.foreground,
                },
              ]}
            />
            <View style={styles.modalActions}>
              {linkCanRemove ? (
                <Button
                  variant="ghost"
                  tone="danger"
                  size="sm"
                  label={t("publish.editor.removeLink")}
                  onPress={removeLink}
                />
              ) : null}
              <View style={styles.modalActionsRight}>
                <Button
                  variant="secondary"
                  size="sm"
                  label={t("cancel")}
                  onPress={closeLinkModal}
                />
                <Button
                  size="sm"
                  label={t("confirm")}
                  disabled={!linkUrl.trim()}
                  onPress={applyLink}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
  },
  historyWrap: {
    position: "absolute",
    top: -40,
    right: 12,
    zIndex: 20,
  },
  historyPill: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    paddingHorizontal: 4,
    borderRadius: 999,
  },
  historyButton: {
    width: 30,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  historyPillDivider: {
    width: StyleSheet.hairlineWidth,
    height: 14,
    marginHorizontal: 2,
  },
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexShrink: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    marginHorizontal: 4,
  },
  collapseButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  boldLabel: {
    fontWeight: "800",
  },
  italicLabel: {
    fontStyle: "italic",
  },
  strikeLabel: {
    textDecorationLine: "line-through",
  },
  underlineLabel: {
    textDecorationLine: "underline",
  },
  panel: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  panelChip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emojiPanel: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  linkInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalActionsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: "auto",
  },
});
