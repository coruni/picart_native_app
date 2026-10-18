import { api, isAuthRedirectedError } from "@/api";
import type { CreateArticleDtoTypeEnum } from "@/api/generated";
import ArticleRichTextInput from "@/components/publish/ArticleRichTextInput";
import ArticleRichTextToolbar from "@/components/publish/ArticleRichTextToolbar";
import { useArticleRichText } from "@/components/publish/useArticleRichText";
import AsyncImage from "@/components/ui/AsyncImage";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import HugeIcon, { TOPIC_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import SectionPickerSheet, {
  type SectionPickerSheetRef,
} from "@/components/publish/SectionPickerSheet";
import TopicPickerSheet, {
  type PublishTopic,
  type TopicPickerSheetRef,
} from "@/components/publish/TopicPickerSheet";
import { toast } from "@/hooks/useToast";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { uploadSingleImage, uploadSingleVideo } from "@/lib/uploadImage";
import {
  getCachedCategories,
  prefetchCategories,
  type ParentCategory,
} from "@/store/categoryStore";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import GridViewIcon from "@hugeicons/core-free-icons/GridViewIcon";
import HashtagIcon from "@hugeicons/core-free-icons/HashtagIcon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import Video01Icon from "@hugeicons/core-free-icons/Video01Icon";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { OnChangeSelectionEvent } from "react-native-enriched-html";
import {
  KeyboardAvoidingView,
  useKeyboardState,
} from "react-native-keyboard-controller";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEvent,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type PublishType = "image" | "mixed" | "video";

const MAX_IMAGES = 9;
const BODY_MIN_HEIGHT = 120;
const ARTICLE_BODY_MIN_HEIGHT = 220;
const GRID_GAP = 8;
const PAGE_PADDING = 16;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 纯文本正文转成文章详情使用的 HTML 段落 */
function plainTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

/** 富文本编辑器空内容常是 `<p><br></p>`，不能只用 trim 判断 */
function htmlHasContent(html: string): boolean {
  if (!html) return false;
  if (/<img\b/i.test(html)) return true;

  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim().length > 0;
}

export default function PublishScreen() {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn, hasHydrated } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [type, setType] = useState<PublishType>("image");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [video, setVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [categories, setCategories] = useState<ParentCategory[]>(
    () => getCachedCategories() ?? [],
  );
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [topics, setTopics] = useState<PublishTopic[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // 正文编辑器高度随内容增长，换行时外层容器一起撑开
  const [bodyHeight, setBodyHeight] = useState(BODY_MIN_HEIGHT);
  // 富文本编辑器挂载时的初始 HTML：在文章 / 图片 / 视频之间切换时用它还原排版
  const [editorInitialHtml, setEditorInitialHtml] = useState("");
  // 正文内嵌图片上传中：此时 HTML 还没写进编辑器，发布要等一下
  const [inlineImageUploading, setInlineImageUploading] = useState(false);
  // 富文本纯文本长度：判断光标是否在末尾时不用等 React 状态更新
  const richTextBodyLengthRef = useRef(0);
  // 离开文章模式时缓存 HTML 和当时的纯文本，切回来可以无损还原
  const mixedHtmlRef = useRef("");
  const mixedPlainRef = useRef("");
  // 富文本正文的纯文本内容，用于校验和切换发布类型时保留文字
  const handleRichTextChange = useCallback((text: string) => {
    richTextBodyLengthRef.current = text.length;
    setBody(text);
  }, []);
  const richText = useArticleRichText({ onChangeText: handleRichTextChange });
  const {
    inputRef: richTextInputRef,
    selectionRef: richTextSelectionRef,
    handleSelectionChange: handleRichSelectionChangeBase,
    markContentChanged: markRichContentChanged,
    getHTML: getRichTextHTML,
    resetHistory: resetRichTextHistory,
  } = richText;

  const sectionSheetRef = useRef<SectionPickerSheetRef>(null);
  const topicSheetRef = useRef<TopicPickerSheetRef>(null);
  const editorScrollRef = useRef<ScrollView>(null);
  // 滚动容器可视高度，用于计算内容末尾的位置
  const viewportHeightRef = useRef(0);
  // 记录上一次的滚动内容高度，只在内容变高时才向下跟随
  const lastContentHeightRef = useRef(0);
  // 光标是否在正文末尾（换行、继续输入时才会自动滚动）
  const caretAtEndRef = useRef(false);

  const keyboardVisible = useKeyboardState((state) => state.isVisible);
  const [plainBodyFocused, setPlainBodyFocused] = useState(false);
  // 富文本编辑器是否处于编辑状态：只在键盘收起时复位，
  // 这样点工具栏、开链接弹窗时工具栏不会被卸载
  const [editorEngaged, setEditorEngaged] = useState(false);
  const editorFocused =
    type === "mixed" ? richText.focused : plainBodyFocused;

  // 圈子页的已选版区可能还没写进缓存，这里补一次预加载
  useEffect(() => {
    if (getCachedCategories()?.length) return;

    let active = true;
    void prefetchCategories().then(() => {
      if (active) setCategories(getCachedCategories() ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  // 直接打开发布页时也要兜住登录态
  useEffect(() => {
    if (hasHydrated && !isLoggedIn) {
      router.replace("/auth");
    }
  }, [hasHydrated, isLoggedIn]);

  // 当前选中的版区（子分类），用于顶部版区入口的展示。
  // 分类数量很小，直接算比 useMemo 更省事，也不会让 React Compiler 放弃优化。
  let selectedSection: { name: string; avatar?: string | null } | null = null;
  if (categoryId) {
    for (const parent of categories) {
      if (String(parent.id) === categoryId) {
        selectedSection = { name: parent.name, avatar: parent.avatar };
        break;
      }

      const child = parent.children?.find(
        (item) => String(item.id) === categoryId,
      );
      if (child) {
        selectedSection = {
          name: child.name,
          avatar: child.avatar || parent.avatar,
        };
        break;
      }
    }
  }

  const imageTileSize = Math.floor(
    (width - PAGE_PADDING * 2 - GRID_GAP * 2) / 3,
  );

  const bodyMinHeight =
    type === "mixed" ? ARTICLE_BODY_MIN_HEIGHT : BODY_MIN_HEIGHT;

  // 多行输入默认会在内部滚动、外层容器不跟着长；这里按内容高度撑开
  const handleBodyContentSizeChange = useCallback(
    (event: TextInputContentSizeChangeEvent) => {
      const nextHeight = Math.max(
        bodyMinHeight,
        Math.ceil(event.nativeEvent.contentSize.height) + 16,
      );
      setBodyHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    },
    [bodyMinHeight],
  );

  // 内容变高（换行/自动换行）且光标在末尾时，平滑跟到新的底部
  const handleEditorContentSizeChange = useCallback(
    (_contentWidth: number, contentHeight: number) => {
      const previousHeight = lastContentHeightRef.current;
      lastContentHeightRef.current = contentHeight;

      if (!keyboardVisible || !editorFocused || !caretAtEndRef.current) return;

      const delta = contentHeight - previousHeight;
      if (delta <= 0) return;

      const maxOffset = Math.max(
        contentHeight - viewportHeightRef.current,
        0,
      );
      editorScrollRef.current?.scrollTo({ y: maxOffset, animated: true });
    },
    [editorFocused, keyboardVisible],
  );

  // 键盘展开压缩可视区域后，光标在末尾时补一次滚动（等动画结束再算高度）
  useEffect(() => {
    if (!keyboardVisible || !editorFocused) return;

    const timer = setTimeout(() => {
      if (!caretAtEndRef.current) return;

      const maxOffset = Math.max(
        lastContentHeightRef.current - viewportHeightRef.current,
        0,
      );
      editorScrollRef.current?.scrollTo({ y: maxOffset, animated: true });
    }, 350);

    return () => clearTimeout(timer);
  }, [editorFocused, keyboardVisible]);

  // 富文本选区变化：顺便记录光标是否在末尾，长文输入时才能自动跟随滚动
  const handleRichSelectionChange = useCallback(
    (event: NativeSyntheticEvent<OnChangeSelectionEvent>) => {
      handleRichSelectionChangeBase(event);
      const { start, end } = event.nativeEvent;
      caretAtEndRef.current =
        start === end && end >= richTextBodyLengthRef.current - 1;
    },
    [handleRichSelectionChangeBase],
  );

  // 切换发布类型：离开文章模式前先缓存 HTML，切回来按需还原排版
  const handleSelectType = useCallback(
    async (next: PublishType) => {
      if (next === type) return;

      if (type === "mixed") {
        mixedPlainRef.current = body;
        try {
          mixedHtmlRef.current = (await getRichTextHTML()) ?? "";
        } catch {
          mixedHtmlRef.current = "";
        }
      }

      let initialHtml = "";
      if (next === "mixed") {
        const plainNow = body.trim();
        initialHtml =
          mixedHtmlRef.current && body === mixedPlainRef.current
            ? mixedHtmlRef.current
            : plainNow
              ? plainTextToHtml(plainNow)
              : "";
      }

      setEditorInitialHtml(initialHtml);
      setType(next);
      setEditorEngaged(false);
      resetRichTextHistory(initialHtml);
    },
    [body, getRichTextHTML, resetRichTextHistory, type],
  );

  const types = useMemo(
    () => [
      { value: "image" as const, label: t("publish.image") },
      { value: "mixed" as const, label: t("publish.article") },
      { value: "video" as const, label: t("publish.video") },
    ],
    [t],
  );

  const pickImages = useCallback(async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.show(t("article.actionFailed"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.9,
    });
    if (result.canceled) return;

    setImages((prev) => [...prev, ...result.assets].slice(0, MAX_IMAGES));
  }, [images.length, t]);

  const pickVideo = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.show(t("article.actionFailed"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsMultipleSelection: false,
      quality: 1,
    });
    if (result.canceled) return;

    setVideo(result.assets[0] ?? null);
  }, [t]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeTopic = useCallback((id: number) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  }, []);

  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const canSubmit =
    !inlineImageUploading &&
    !!categoryId &&
    trimmedTitle.length > 0 &&
    (type === "image"
      ? images.length > 0
      : type === "mixed"
        ? trimmedBody.length > 0
        : !!video);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting || !categoryId) return;

    setSubmitting(true);
    try {
      let imageUrls: string[] | undefined;
      let videoUrl = "";

      if (type === "image") {
        imageUrls = await Promise.all(
          images.map((asset) => uploadSingleImage(asset.uri)),
        );
      } else if (type === "video" && video) {
        videoUrl = await uploadSingleVideo(video.uri, video.mimeType);
      }

      // 文章正文直接用富文本编辑器产出的 HTML，纯文本兜底
      let content = trimmedBody ? plainTextToHtml(trimmedBody) : "";
      if (type === "mixed") {
        const html = (await getRichTextHTML()).trim();
        if (htmlHasContent(html)) content = html;
      }

      await api.articleControllerCreate({
        title: trimmedTitle,
        content,
        images: imageUrls,
        videoUrl,
        sort: 0,
        categoryId: Number(categoryId),
        // 生成类型把 tagIds 标成了 string[]，后端实际按数字校验，运行时保持数字
        tagIds: topics.map((topic) => topic.id) as unknown as string[],
        status: "PUBLISHED",
        requireLogin: false,
        requireFollow: false,
        requirePayment: false,
        requireMembership: false,
        listRequireLogin: false,
        viewPrice: 0,
        type: type as CreateArticleDtoTypeEnum,
      });

      toast.show(t("publish.success"));
      router.back();
    } catch (error) {
      if (isAuthRedirectedError(error)) return;
      console.error("Failed to publish article:", error);
      toast.show(t("publish.failed"));
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    categoryId,
    getRichTextHTML,
    images,
    submitting,
    t,
    topics,
    trimmedBody,
    trimmedTitle,
    type,
    video,
  ]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.root, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerSide}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("publish.back")}
            hitSlop={10}
            onPress={() => router.back()}
          >
            <HugeIcon
              icon={ArrowLeft01Icon}
              size={24}
              color={theme.foreground}
            />
          </Pressable>
        </View>
        <ThemedText size={18} fontWeight="600">
          {t("publish.title")}
        </ThemedText>
        <View style={[styles.headerSide, styles.headerRight]}>
          <Button
            size="sm"
            shape="pill"
            label={t("publish.submit")}
            disabled={!canSubmit}
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>
      </View>

      <View style={styles.flex}>
        <View style={styles.editorArea}>
          <Pressable
            accessibilityRole="button"
            onPress={() => sectionSheetRef.current?.present()}
            style={[styles.sectionRow, { backgroundColor: theme.muted }]}
          >
            {selectedSection?.avatar ? (
              <AsyncImage
                source={{ uri: selectedSection.avatar }}
                style={styles.sectionAvatar}
                contentFit="cover"
                showLoading={false}
              />
            ) : (
              <HugeIcon
                icon={GridViewIcon}
                size={18}
                color={theme.mutedForeground}
              />
            )}
            <ThemedText
              size={13}
              color={selectedSection ? theme.foreground : theme.mutedForeground}
              style={styles.sectionLabel}
              numberOfLines={1}
            >
              {selectedSection?.name ?? t("publish.selectSection")}
            </ThemedText>
            <HugeIcon
              icon={ArrowDown01Icon}
              size={16}
              color={theme.mutedForeground}
            />
          </Pressable>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior="padding"
            automaticOffset
          >
            <ScrollView
              ref={editorScrollRef}
              style={styles.flex}
              contentContainerStyle={styles.editorContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onLayout={(event) => {
                viewportHeightRef.current = event.nativeEvent.layout.height;
              }}
              onContentSizeChange={handleEditorContentSizeChange}
            >
              {type === "image" ? (
                <View style={styles.imageGrid}>
                  {images.map((asset, index) => (
                    <View
                      key={`${asset.assetId ?? asset.uri}-${index}`}
                      style={{ width: imageTileSize, height: imageTileSize }}
                    >
                      <AsyncImage
                        source={{ uri: asset.uri }}
                        style={styles.imageTile}
                        contentFit="cover"
                        showLoading={false}
                      />
                      <Pressable
                        hitSlop={6}
                        onPress={() => removeImage(index)}
                        style={styles.removeButton}
                      >
                        <HugeIcon
                          icon={Cancel01Icon}
                          size={14}
                          color="#ffffff"
                        />
                      </Pressable>
                    </View>
                  ))}
                  {images.length < MAX_IMAGES ? (
                    <Pressable
                      onPress={pickImages}
                      style={[
                        styles.addTile,
                        {
                          width: imageTileSize,
                          height: imageTileSize,
                          backgroundColor: theme.muted,
                        },
                      ]}
                    >
                      <HugeIcon
                        icon={PlusSignIcon}
                        size={24}
                        color={theme.mutedForeground}
                      />
                      <ThemedText size={12} color={theme.mutedForeground}>
                        {t("publish.addImage")}
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}

              {type === "video" ? (
                video ? (
                  <View
                    style={[
                      styles.videoCard,
                      { backgroundColor: theme.muted },
                    ]}
                  >
                    <View
                      style={[
                        styles.videoIconWrap,
                        { backgroundColor: colors.primary + "1A" },
                      ]}
                    >
                      <HugeIcon icon={Video01Icon} size={24} color={colors.primary} />
                    </View>
                    <View style={styles.videoBody}>
                      <ThemedText size={14} numberOfLines={1}>
                        {video.fileName ?? t("publish.video")}
                      </ThemedText>
                      <Pressable
                        hitSlop={6}
                        onPress={pickVideo}
                        style={styles.videoAction}
                      >
                        <ThemedText size={12} color={colors.primary}>
                          {t("publish.changeVideo")}
                        </ThemedText>
                      </Pressable>
                    </View>
                    <Pressable hitSlop={10} onPress={() => setVideo(null)}>
                      <HugeIcon
                        icon={Cancel01Icon}
                        size={18}
                        color={theme.mutedForeground}
                      />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={pickVideo}
                    style={[styles.videoAdd, { backgroundColor: theme.muted }]}
                  >
                    <HugeIcon
                      icon={Video01Icon}
                      size={24}
                      color={theme.mutedForeground}
                    />
                    <ThemedText size={13} color={theme.mutedForeground}>
                      {t("publish.selectVideo")}
                    </ThemedText>
                  </Pressable>
                )
              ) : null}

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t("publish.titlePlaceholder")}
                placeholderTextColor={theme.mutedForeground}
                maxLength={200}
                onFocus={() => setEditorEngaged(false)}
                style={[
                  styles.titleInput,
                  {
                    color: theme.foreground,
                    borderBottomColor: theme.border,
                  },
                ]}
              />

              {type === "mixed" ? (
                <ArticleRichTextInput
                  ref={richTextInputRef}
                  // 编辑器是非受控的；切换类型后重新挂载时用缓存的 HTML 还原排版
                  defaultValue={editorInitialHtml}
                  placeholder={t("publish.articleBodyPlaceholder")}
                  onChangeText={richText.handleChangeText}
                  onFocus={() => {
                    setEditorEngaged(true);
                    richText.handleFocus();
                  }}
                  onBlur={richText.handleBlur}
                  onChangeSelection={handleRichSelectionChange}
                  onChangeState={richText.handleStateChange}
                />
              ) : (
                <TextInput
                  value={body}
                  onChangeText={setBody}
                  placeholder={t("publish.bodyPlaceholder")}
                  placeholderTextColor={theme.mutedForeground}
                  multiline
                  scrollEnabled={false}
                  onFocus={() => {
                    setPlainBodyFocused(true);
                    setEditorEngaged(false);
                  }}
                  onBlur={() => setPlainBodyFocused(false)}
                  onSelectionChange={(event) => {
                    const { start, end } = event.nativeEvent.selection;
                    caretAtEndRef.current = start === end && end >= body.length;
                  }}
                  onContentSizeChange={handleBodyContentSizeChange}
                  textAlignVertical="top"
                  style={[
                    styles.bodyInput,
                    {
                      color: theme.foreground,
                      height: Math.max(bodyHeight, bodyMinHeight),
                    },
                  ]}
                />
              )}

            </ScrollView>

            {type === "mixed" && keyboardVisible && editorEngaged ? (
              // 工具栏要贴边铺满，抵消掉 editorArea 的左右内边距
              <View style={styles.toolbarBleed}>
                <ArticleRichTextToolbar
                  editorRef={richTextInputRef}
                  selectionRef={richTextSelectionRef}
                  activeState={richText.activeState}
                  canUndo={richText.historyState.canUndo}
                  canRedo={richText.historyState.canRedo}
                  onUndo={richText.undo}
                  onRedo={richText.redo}
                  onContentChanged={markRichContentChanged}
                  onUploadingChange={setInlineImageUploading}
                />
              </View>
            ) : null}
          </KeyboardAvoidingView>

          {/* 键盘展开时话题栏让位给正文和工具栏，收起键盘再恢复 */}
          {keyboardVisible ? null : (
            <View style={styles.topicSection}>
              <View style={styles.topicRow}>
                <Pressable
                  onPress={() => topicSheetRef.current?.present()}
                  style={[
                    styles.topicButton,
                    { backgroundColor: theme.muted },
                  ]}
                >
                  <HugeIcon
                    icon={HashtagIcon}
                    size={16}
                    color={colors.primary}
                    strokeWidth={TOPIC_STROKE_WIDTH}
                  />
                  <ThemedText size={13} color={theme.mutedForeground}>
                    {t("publish.addTopic")}
                  </ThemedText>
                  <HugeIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    color={theme.mutedForeground}
                  />
                </Pressable>
              </View>

              {topics.length > 0 ? (
                <View style={styles.topicChips}>
                  {topics.map((topic) => (
                    <Chip
                      key={topic.id}
                      size="sm"
                      selected
                      label={`#${topic.name}`}
                      style={styles.topicChip}
                      onClose={() => removeTopic(topic.id)}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          )}
        </View>

        <View
          style={[
            styles.typeBar,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ]}
        >
          {types.map((item) => {
            const active = item.value === type;

            return (
              <Pressable
                key={item.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  void handleSelectType(item.value);
                }}
                style={styles.typeItem}
              >
                <View style={styles.typeLabelRow}>
                  <ThemedText
                    size={15}
                    fontWeight={active ? "600" : "400"}
                    color={active ? colors.primary : theme.mutedForeground}
                  >
                    {item.label}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.typeIndicator,
                    {
                      backgroundColor: active
                        ? colors.primary
                        : "transparent",
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionPickerSheet
        ref={sectionSheetRef}
        parents={categories}
        selectedValue={categoryId}
        onSelect={setCategoryId}
      />

      <TopicPickerSheet
        ref={topicSheetRef}
        selectedTopics={topics}
        maxSelected={5}
        onConfirm={setTopics}
      />

      {submitting ? (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    justifyContent: "flex-end",
  },
  editorArea: {
    flex: 1,
    paddingHorizontal: PAGE_PADDING,
  },
  editorContent: {
    paddingTop: 16,
    paddingBottom: 16,
    gap: 20,
  },
  /** 工具栏贴满屏宽：抵消 editorArea 的 PAGE_PADDING */
  toolbarBleed: {
    marginHorizontal: -PAGE_PADDING,
  },
  sectionRow: {
    height: 40,
    marginTop: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    gap: 8,
    paddingHorizontal: 12,
  },
  sectionAvatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
  },
  sectionLabel: {
    flexShrink: 1,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  imageTile: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  addTile: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
  },
  videoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  videoBody: {
    flex: 1,
    gap: 6,
  },
  videoAction: {
    alignSelf: "flex-start",
  },
  videoAdd: {
    height: 120,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "700",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bodyInput: {
    fontSize: 15,
    lineHeight: 21,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  topicSection: {
    gap: 12,
    paddingVertical: 12,
  },
  topicRow: {
    flexDirection: "row",
  },
  topicButton: {
    height: 32,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
  },
  topicChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  topicChip: {
    maxWidth: "100%",
  },
  typeBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  typeItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  typeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
