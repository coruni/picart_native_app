import { api, isAuthRedirectedError } from "@/api";
import type { CreateArticleDtoTypeEnum } from "@/api/generated";
import ArticleRichTextInput from "@/components/publish/ArticleRichTextInput";
import ArticleRichTextToolbar from "@/components/publish/ArticleRichTextToolbar";
import ImageCropperSheet, {
  type ImageCropperSheetRef,
} from "@/components/media/ImageCropperSheet";
import PublishSettingsSheet, {
  DEFAULT_PUBLISH_SETTINGS,
  type PublishSettings,
  type PublishSettingsSheetRef,
} from "@/components/publish/PublishSettingsSheet";
import VideoFrameSheet, {
  type VideoFrameSheetRef,
} from "@/components/publish/VideoFrameSheet";
import SectionPickerSheet, {
  type SectionPickerSheetRef,
} from "@/components/publish/SectionPickerSheet";
import TopicPickerSheet, {
  type PublishTopic,
  type TopicPickerSheetRef,
} from "@/components/publish/TopicPickerSheet";
import { useArticleRichText } from "@/components/publish/useArticleRichText";
import AsyncImage from "@/components/ui/AsyncImage";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import HugeIcon, { TOPIC_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import {
  getEditorContentWidth,
  prepareArticleHtml,
  toArticleHtml,
} from "@/lib/editorHtml";
import { normalizeImageUrl } from "@/lib/image";
import { uploadSingleImage, uploadSingleVideo } from "@/lib/uploadImage";
import type { ImageData } from "@/types/api";
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
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import Video01Icon from "@hugeicons/core-free-icons/Video01Icon";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEvent,
} from "react-native";
import type { OnChangeSelectionEvent } from "react-native-enriched-html";
import {
  KeyboardAvoidingView,
  KeyboardController,
  KeyboardEvents,
  useKeyboardState,
} from "react-native-keyboard-controller";
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
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br/>")}</p>`,
    )
    .join("");
}

/** 富文本编辑器空内容常是 `<p><br></p>`，不能只用 trim 判断 */
function htmlHasContent(html: string): boolean {
  if (!html) return false;
  if (/<img\b/i.test(html)) return true;

  return (
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .trim().length > 0
  );
}

/** 编辑纯文本文章时把已有 HTML 还原成文本，段落间用空行隔开 */
function htmlToPlainText(html: string): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .trim();
}

export default function PublishScreen() {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn, hasHydrated } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // 带 id 进来就是编辑已有文章
  const params = useLocalSearchParams<{ id?: string }>();
  const editId = typeof params.id === "string" && params.id ? params.id : null;
  const isEditing = editId !== null;

  const [type, setType] = useState<PublishType>("image");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [video, setVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  // 封面：本地裁剪后的 uri 或远端地址，空串表示没有
  const [cover, setCover] = useState("");
  // 发布设置（权限 / 付费）
  const [settings, setSettings] = useState<PublishSettings>(
    DEFAULT_PUBLISH_SETTINGS,
  );
  // 编辑模式下首次回填完成前不渲染表单，避免闪烁
  const [loadingArticle, setLoadingArticle] = useState(isEditing);
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
  // 富文本正文的纯文本本体放 ref，不放 state：
  // 每敲一个字 setState 会把整个发布页（工具栏 + 一堆 sheet）重渲染一遍。
  // 只有「有内容 ↔ 空」翻转时才打断渲染——发布按钮的可用性只看这个。
  const richTextPlainRef = useRef("");
  const [hasRichTextPlain, setHasRichTextPlain] = useState(false);
  const handleRichTextChange = useCallback((text: string) => {
    richTextBodyLengthRef.current = text.length;
    richTextPlainRef.current = text;
    const hasText = text.trim().length > 0;
    setHasRichTextPlain((prev) => (prev === hasText ? prev : hasText));
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
  const settingsSheetRef = useRef<PublishSettingsSheetRef>(null);
  const cropperRef = useRef<ImageCropperSheetRef>(null);
  const videoFrameSheetRef = useRef<VideoFrameSheetRef>(null);
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
  // 工具栏上的表情面板 / 链接面板打开时，键盘会先收起，
  // 靠这个标记让工具栏继续挂载，否则面板会跟着一起被卸载
  const [toolbarOverlayOpen, setToolbarOverlayOpen] = useState(false);
  const overlayReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  /**
   * 用 keyboardWillShow / keyboardWillHide 自己维护键盘显隐，
   * 而不是 useKeyboardState —— 后者只监听 willShow 和 didHide，
   * 收起时要等动画播完才变 false，工具栏会比键盘慢一拍才消失。
   */
  const [keyboardShown, setKeyboardShown] = useState(() =>
    KeyboardController.isVisible(),
  );
  useEffect(() => {
    const subscriptions = [
      KeyboardEvents.addListener("keyboardWillShow", () =>
        setKeyboardShown(true),
      ),
      KeyboardEvents.addListener("keyboardWillHide", () =>
        setKeyboardShown(false),
      ),
    ];
    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  /**
   * 关闭表情 / 链接面板后会重新聚焦正文、键盘随之弹回。
   * 键盘的 willShow 要下一帧才到，这里留一小段缓冲再释放挂载，
   * 否则工具栏会「消失一下又回来」。
   */
  const handleToolbarOverlayChange = useCallback((open: boolean) => {
    if (overlayReleaseTimerRef.current) {
      clearTimeout(overlayReleaseTimerRef.current);
      overlayReleaseTimerRef.current = null;
    }
    if (open) {
      setToolbarOverlayOpen(true);
      return;
    }
    overlayReleaseTimerRef.current = setTimeout(() => {
      overlayReleaseTimerRef.current = null;
      setToolbarOverlayOpen(false);
    }, 300);
  }, []);

  useEffect(
    () => () => {
      if (overlayReleaseTimerRef.current) {
        clearTimeout(overlayReleaseTimerRef.current);
      }
    },
    [],
  );

  const editorFocused = type === "mixed" ? richText.focused : plainBodyFocused;

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

  // 只记录内容高度，键盘展开时用它补一次滚动。
  // 回车不再自动跟底：原来每按一次回车编辑区就平滑滑一下，写着写着很晃
  const handleEditorContentSizeChange = useCallback(
    (_contentWidth: number, contentHeight: number) => {
      lastContentHeightRef.current = contentHeight;
    },
    [],
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

  // 富文本选区变化：顺便记录光标是否在末尾，键盘弹起时才需要补滚动
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
        mixedPlainRef.current = richTextPlainRef.current;
        // 富文本的纯文本交给纯文本输入框，切过去文字不丢
        setBody(richTextPlainRef.current);
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

  const pickCover = useCallback(() => {
    // 走裁剪面板：选图后按 16:9 裁切，和文章卡片的封面比例一致
    cropperRef.current?.present();
  }, []);

  const handleCoverCropped = useCallback((uri: string) => {
    setCover(uri);
  }, []);

  // 视频类型可以从前面的视频里抽一帧当封面
  const pickCoverFromVideo = useCallback(() => {
    if (!video) return;
    videoFrameSheetRef.current?.present();
  }, [video]);

  const removeCover = useCallback(() => {
    setCover("");
  }, []);

  // 编辑模式：拉一次文章详情回填表单
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;

    (async () => {
      try {
        const { data: res } = await api.articleControllerFindOne(editId);
        if (cancelled) return;
        const article = res.data;

        setTitle(article.title ?? "");
        setCover(article.cover ?? "");
        setSettings({
          requireLogin: article.requireLogin ?? false,
          requireFollow: article.requireFollow ?? false,
          requireMembership: article.requireMembership ?? false,
          requirePayment: article.requirePayment ?? false,
          viewPrice: Number(article.viewPrice) || 0,
        });
        setCategoryId(
          article.category?.id != null ? String(article.category.id) : null,
        );
        setTopics(
          (article.tags ?? []).map((tag) => ({
            id: tag.id,
            name: tag.name,
          })) as PublishTopic[],
        );

        const nextType: PublishType =
          article.type === "mixed" || article.type === "video"
            ? article.type
            : "image";
        setType(nextType);

        // images 只属于图片类型（图集）；文章类型的图片在 content 的 HTML 里，
        // 再从数组回填一遍会和正文里的图重复。
        // 取 url 不取 original：original 是归档原图，体积大且不在展示链路上。
        // 后端返回 { url, width, height, thumbnails } 对象，老数据还是纯字符串。
        const remoteImages =
          nextType === "image"
            ? ((article.images ?? []) as (string | ImageData)[])
            : [];
        setImages(
          remoteImages
            .map((item) => {
              const uri = normalizeImageUrl(
                typeof item === "string" ? item : item.url,
              );
              if (!uri) return null;
              return typeof item === "string"
                ? ({ uri } as ImagePicker.ImagePickerAsset)
                : ({
                    uri,
                    width: item.width,
                    height: item.height,
                  } as ImagePicker.ImagePickerAsset);
            })
            .filter((asset): asset is ImagePicker.ImagePickerAsset => !!asset),
        );
        if (nextType === "video" && article.videoUrl) {
          setVideo({ uri: article.videoUrl } as ImagePicker.ImagePickerAsset);
        }

        const html = article.content ?? "";
        if (nextType === "mixed") {
          // web 存的 HTML 里图片没有尺寸，原生会排成 0×0，回填前统一补齐
          const prepared = await prepareArticleHtml(
            html,
            getEditorContentWidth(Dimensions.get("window").width),
          );
          if (cancelled) return;
          setEditorInitialHtml(prepared);
          resetRichTextHistory(prepared);
        } else {
          setBody(htmlToPlainText(html));
        }
      } catch (error) {
        if (isAuthRedirectedError(error)) return;
        console.error("Failed to load article for editing:", error);
        toast.show(t("article.actionFailed"));
      } finally {
        if (!cancelled) setLoadingArticle(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editId, resetRichTextHistory, t]);

  const removeTopic = useCallback((id: number) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  }, []);

  const trimmedTitle = title.trim();
  const canSubmit =
    !inlineImageUploading &&
    !!categoryId &&
    trimmedTitle.length > 0 &&
    (type === "image"
      ? images.length > 0
      : type === "mixed"
        ? hasRichTextPlain
        : !!video);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting || !categoryId) return;

    setSubmitting(true);
    try {
      let imageUrls: string[] | undefined;
      let videoUrl = "";

      if (type === "image") {
        // 编辑时回填的是远端地址，不用再传一遍
        imageUrls = await Promise.all(
          images.map((asset) =>
            /^https?:\/\//i.test(asset.uri)
              ? asset.uri
              : uploadSingleImage(asset.uri),
          ),
        );
      } else if (type === "video" && video) {
        videoUrl = /^https?:\/\//i.test(video.uri)
          ? video.uri
          : await uploadSingleVideo(video.uri, video.mimeType);
      }

      // 选了新封面就上传，远端地址直接沿用
      const nextCover =
        cover && !/^https?:\/\//i.test(cover)
          ? await uploadSingleImage(cover)
          : cover;

      // 文章正文直接用富文本编辑器产出的 HTML，纯文本兜底。
      // 富文本的纯文本存在 ref 里，这里现取，避免拿到渲染期的旧快照
      const plainBody = (
        type === "mixed" ? richTextPlainRef.current : body
      ).trim();
      let content = plainBody ? plainTextToHtml(plainBody) : "";
      if (type === "mixed") {
        const html = (await getRichTextHTML()).trim();
        if (htmlHasContent(html)) content = toArticleHtml(html);
      }

      const payload = {
        title: trimmedTitle,
        content,
        // 只有文章和视频带封面，图片类型忽略
        cover: type === "image" ? undefined : nextCover || undefined,
        images: imageUrls,
        videoUrl,
        sort: 0,
        categoryId: Number(categoryId),
        // 生成类型把 tagIds 标成了 string[]，后端实际按数字校验，运行时保持数字
        tagIds: topics.map((topic) => topic.id) as unknown as string[],
        status: "PUBLISHED" as const,
        requireLogin: settings.requireLogin,
        requireFollow: settings.requireFollow,
        requirePayment: settings.requirePayment,
        requireMembership: settings.requireMembership,
        // 列表页是否也要登录，跟随正文的登录限制
        listRequireLogin: settings.requireLogin,
        viewPrice: settings.requirePayment ? settings.viewPrice : 0,
        type: type as CreateArticleDtoTypeEnum,
      };

      if (editId) {
        await api.articleControllerUpdate(editId, payload);
      } else {
        await api.articleControllerCreate(payload);
      }

      toast.show(isEditing ? t("publish.updateSuccess") : t("publish.success"));
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
    cover,
    editId,
    getRichTextHTML,
    images,
    isEditing,
    settings,
    submitting,
    t,
    topics,
    body,
    trimmedTitle,
    type,
    video,
  ]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.root, { backgroundColor: theme.card }]}
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
          {isEditing ? t("publish.editTitle") : t("publish.title")}
        </ThemedText>
        <View style={[styles.headerSide, styles.headerRight]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("publish.settings.title")}
            hitSlop={10}
            onPress={() => settingsSheetRef.current?.present()}
            style={styles.settingsButton}
          >
            <HugeIcon
              icon={Settings01Icon}
              size={22}
              color={theme.foreground}
            />
          </Pressable>
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
        {loadingArticle ? (
          <View style={styles.editLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <>
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

          {/* 封面：只有文章和视频需要，图片类型不显示 */}
          {type === "image" ? null : (
            <View style={[styles.coverRow, { backgroundColor: theme.muted }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                cover ? t("publish.changeCover") : t("publish.addCover")
              }
              onPress={pickCover}
              style={styles.coverPick}
            >
              {cover ? (
                <AsyncImage
                  source={{ uri: cover }}
                  style={styles.coverPreview}
                  contentFit="cover"
                  showLoading={false}
                />
              ) : (
                <HugeIcon
                  icon={ImageAdd01Icon}
                  size={18}
                  color={theme.mutedForeground}
                />
              )}
              <ThemedText
                size={13}
                color={cover ? theme.foreground : theme.mutedForeground}
                style={styles.coverLabel}
                numberOfLines={1}
              >
                {cover ? t("publish.changeCover") : t("publish.addCover")}
              </ThemedText>
            </Pressable>
            {cover ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("publish.removeCover")}
                hitSlop={10}
                onPress={removeCover}
              >
                <HugeIcon
                  icon={Cancel01Icon}
                  size={16}
                  color={theme.mutedForeground}
                />
              </Pressable>
            ) : null}
            </View>
          )}

          {/* 视频类型：可以直接从视频里抽一帧当封面 */}
          {type === "video" && video ? (
            <Pressable
              accessibilityRole="button"
              onPress={pickCoverFromVideo}
              style={[styles.coverRow, { backgroundColor: theme.muted }]}
            >
              <HugeIcon
                icon={Video01Icon}
                size={18}
                color={theme.mutedForeground}
              />
              <ThemedText size={13} color={theme.mutedForeground}>
                {t("publish.videoFrame.entry")}
              </ThemedText>
            </Pressable>
          ) : null}

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
                    style={[styles.videoCard, { backgroundColor: theme.muted }]}
                  >
                    <View
                      style={[
                        styles.videoIconWrap,
                        { backgroundColor: colors.primary + "1A" },
                      ]}
                    >
                      <HugeIcon
                        icon={Video01Icon}
                        size={24}
                        color={colors.primary}
                      />
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
                  onLinkDetected={richText.handleLinkDetected}
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

            {type === "mixed" &&
            editorEngaged &&
            (keyboardShown || toolbarOverlayOpen) ? (
              // 工具栏要贴边铺满，抵消掉 editorArea 的左右内边距
              <View style={styles.toolbarBleed}>
                <ArticleRichTextToolbar
                  editorRef={richTextInputRef}
                  selectionRef={richTextSelectionRef}
                  activeState={richText.activeState}
                  activeLink={richText.activeLink}
                  canUndo={richText.historyState.canUndo}
                  canRedo={richText.historyState.canRedo}
                  onUndo={richText.undo}
                  onRedo={richText.redo}
                  onContentChanged={markRichContentChanged}
                  onUploadingChange={setInlineImageUploading}
                  onOverlayChange={handleToolbarOverlayChange}
                />
              </View>
            ) : null}
          </KeyboardAvoidingView>

          {/* 键盘展开或表情/sheet 顶替键盘时话题栏让位，收起后再恢复 */}
          {keyboardVisible || toolbarOverlayOpen ? null : (
            <View style={styles.topicSection}>
              <View style={styles.topicRow}>
                <Pressable
                  onPress={() => topicSheetRef.current?.present()}
                  style={[styles.topicButton, { backgroundColor: theme.muted }]}
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.typeScroll}
            contentContainerStyle={styles.typeScrollContent}
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
                  <ThemedText
                    size={15}
                    fontWeight={active ? "600" : "400"}
                    color={active ? colors.primary : theme.mutedForeground}
                  >
                    {item.label}
                  </ThemedText>
                  <View
                    style={[
                      styles.typeIndicator,
                      {
                        backgroundColor: colors.primary,
                        // 用透明度切换选中态：Android 上改 backgroundColor
                        // 会重建背景 drawable，把 borderRadius 丢掉
                        opacity: active ? 1 : 0,
                      },
                    ]}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
          </>
        )}
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
        onConfirm={setTopics}
      />

      <PublishSettingsSheet
        ref={settingsSheetRef}
        value={settings}
        onChange={setSettings}
      />

      {/* 封面裁剪：和文章卡片一致的 16:9 */}
      <ImageCropperSheet
        ref={cropperRef}
        mode="banner"
        bannerSize={{ width: 1600, height: 900 }}
        shape="rect"
        onCrop={handleCoverCropped}
      />

      {/* 视频取帧：从当前视频里均匀抽几帧让用户挑 */}
      <VideoFrameSheet
        ref={videoFrameSheetRef}
        videoUri={video?.uri ?? ""}
        duration={video?.duration ?? 0}
        onSelect={handleCoverCropped}
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
  /** 编辑模式载入详情时的占位 */
  editLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  /** 顶部栏右侧：设置 + 发布按钮 */
  settingsButton: {
    marginRight: 12,
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
  /** 封面：和分类选择同一套胶囊外观，选好后显示缩略图 */
  coverRow: {
    height: 40,
    marginTop: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    gap: 8,
    paddingHorizontal: 12,
  },
  coverPick: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coverPreview: {
    width: 24,
    height: 24,
    borderRadius: 8,
  },
  coverLabel: {
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
    // 和富文本编辑器同一套正文排版：16 / 26（1.6 倍），
    // 两种模式切换时字号和行距不会跳
    fontSize: 16,
    lineHeight: 26,
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
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  /** 横向滚动，类型多了可以左右滑 */
  typeScroll: {
    flexGrow: 0,
  },
  typeScrollContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    paddingHorizontal: 16,
  },
  typeItem: {
    alignItems: "center",
    justifyContent: "center",
    // 给底部的胶囊指示器留出位置，和项目 tab 的 bottom: 4 对应
    paddingBottom: 14,
  },
  /** 和 app/(tabs) 的 tabIndicator 一致：20×4 主色胶囊，贴底居中 */
  typeIndicator: {
    position: "absolute",
    bottom: 4,
    left: "50%",
    marginLeft: -10,
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
