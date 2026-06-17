import {
  api,
  ArticleControllerFindOne200ResponseData,
  isAuthRedirectedError,
} from "@/api";
import ArticleBottomBar from "@/components/article/ArticleBottomBar";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleSwiper from "@/components/article/ArticleSwiper";
import ArticleVideoPlayer from "@/components/article/ArticleVideoPlayer";
import ArticleActions from "@/components/article/ReactionsStats";
import { ArticleCache } from "@/hooks/useArticleCache";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useTranslate } from "@/hooks/useTranslate";
import { translateHtml } from "@/lib/translate";
import { resolveLanguage, useSettingsStore } from "@/store/settingsStore";
import { useLocalSearchParams } from "expo-router";

import MicroSoftPng from "@/assets/images/microsoft-color.png";
import ArticleCommentList, {
  ArticleCommentListLabel,
  type CommentSortKey,
} from "@/components/comment/ArticleCommentList";
import AsyncImage from "@/components/ui/AsyncImage";
import Loading from "@/components/ui/Loading";
import RenderHtmlComponent from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { formatRelativeTime } from "@/lib/time";
import { useAuthStore } from "@/store/authStore";
import type { ImageData } from "@/types/api";
import { Ban, Clock, Eye, Forward } from "lucide-react-native";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
export type ArticleData = Omit<
  ArticleControllerFindOne200ResponseData,
  "images"
> & {
  images: string[] | ImageData[];
};

const PADDING_H = 16;

function getComparableArticleImageValue(image: ArticleData["images"][number]) {
  if (typeof image === "string") {
    return image;
  }

  return {
    url: image.url,
    width: image.width,
    height: image.height,
    size: image.size,
    thumbnails: image.thumbnails,
  };
}

function getArticleRenderSignature(article?: Partial<ArticleData>) {
  if (!article) return "";

  return JSON.stringify({
    title: article.title ?? "",
    content: article.content ?? "",
    type: article.type ?? "",
    cover: article.cover ?? "",
    videoUrl: article.videoUrl ?? "",
    imageCount: article.imageCount ?? 0,
    images: (article.images ?? []).map(getComparableArticleImageValue),
  });
}

function getArticleAuthorSignature(author?: ArticleData["author"]) {
  if (!author) return "";

  return JSON.stringify({
    id: author.id,
    username: author.username,
    nickname: author.nickname,
    avatar: author.avatar,
    isFollowed: author.isFollowed,
    equippedDecorations: author.equippedDecorations,
  });
}

function mergeArticlePreservingContent(
  current: ArticleData | undefined,
  incoming: ArticleData,
) {
  if (!current || String(current.id) !== String(incoming.id)) {
    return incoming;
  }

  const hasSameRenderContent =
    getArticleRenderSignature(current) === getArticleRenderSignature(incoming);
  const hasSameAuthor =
    getArticleAuthorSignature(current.author) ===
    getArticleAuthorSignature(incoming.author);

  if (!hasSameRenderContent && !hasSameAuthor) {
    return incoming;
  }

  const merged: ArticleData = {
    ...incoming,
    ...(hasSameRenderContent
      ? {
          title: current.title,
          content: current.content,
          type: current.type,
          cover: current.cover,
          videoUrl: current.videoUrl,
          imageCount: current.imageCount,
          images: current.images,
        }
      : {}),
    ...(hasSameAuthor ? { author: current.author } : {}),
  };

  return JSON.stringify(current) === JSON.stringify(merged) ? current : merged;
}

export default function ArticleScreen() {
  const { id, author } = useLocalSearchParams();
  const articleId = id as string;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = width - PADDING_H * 2;
  const profile = useAuthStore((state) => state.user);
  const currentUserId = profile?.id;

  const [, startTransition] = useTransition();

  const [refreshing, setRefreshing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [commentRefreshSignal, setCommentRefreshSignal] = useState(0);
  const [commentSortKey, setCommentSortKey] = useState<CommentSortKey>("all");
  const [commentStickyHeaderHeight, setCommentStickyHeaderHeight] =
    useState(44);
  // RenderHtml 首次 onLayout 触发后置 true
  const [renderReady, setRenderReady] = useState(false);

  const [fadeAnim] = useState(() => new Animated.Value(1));
  const hasFadedIn = useRef(false);
  const htmlReadyRef = useRef(false);
  const activeArticleIdRef = useRef(articleId);
  const previousArticleIdRef = useRef(articleId);
  const scrollViewRef = useRef<ScrollView>(null);
  const commentSectionY = useRef(0);
  const [stableTopInset] = useState(() => insets.top);

  const tryFadeIn = useCallback(() => {
    if (hasFadedIn.current) return;
    if (!htmlReadyRef.current) return;
    hasFadedIn.current = true;
    setRenderReady(true);
  }, []);

  const cachedAuthor = useMemo(() => {
    if (articleId && ArticleCache.has(articleId)) {
      return ArticleCache.get(articleId)!.author;
    }
    try {
      return JSON.parse(author as string);
    } catch {
      return undefined;
    }
  }, [articleId, author]);

  const [articleAuthor, setArticleAuthor] =
    useState<ArticleData["author"]>(cachedAuthor);

  const [article, setArticle] = useState<ArticleData | undefined>(() => {
    if (articleId && ArticleCache.has(articleId)) {
      return ArticleCache.get(articleId);
    }
    return undefined;
  });
  const articleStateRef = useRef<ArticleData | undefined>(article);
  const currentArticle =
    article && String(article.id) === String(articleId) ? article : undefined;

  // 进入详情页自动翻译标题
  const {
    displayText: translatedTitle,
    translated: titleTranslation,
    toggle: toggleTitle,
    reset: resetTitle,
  } = useTranslate(currentArticle?.title ?? "", { auto: true });

  // 自动翻译 HTML 正文
  const autoTranslate = useSettingsStore((s) => s.autoTranslate);
  const appLang = useSettingsStore((s) => resolveLanguage(s.language));
  const [translatedContent, setTranslatedContent] = useState<string | null>(
    null,
  );
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [translateStatus, setTranslateStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  // 用户手动切换到原文视图（不清缓存，可随时切回译文）
  const [showingOriginal, setShowingOriginal] = useState(false);

  // 文章语言和当前 UI 语言相同时不需要显示已翻译 banner
  const articleLangMatchesUi =
    detectedLang !== null
      ? appLang.startsWith(detectedLang) || detectedLang.startsWith(appLang)
      : false;
  const showTranslateBanner =
    (titleTranslation !== null || translateStatus === "done") &&
    !articleLangMatchesUi;
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const translatingContentRef = useRef<string | null>(null);

  useEffect(() => {
    const html = currentArticle?.content;

    // 开关关闭或文章未加载：还原原文
    if (!html || !autoTranslate) {
      setTranslatedContent(null);
      setDetectedLang(null);
      setTranslateStatus("idle");
      setShowingOriginal(false);
      translatingContentRef.current = null;
      contentFadeAnim.setValue(1);
      return;
    }

    // 同一篇文章已在翻译中或已完成，跳过
    if (translatingContentRef.current === html) return;
    translatingContentRef.current = html;
    setShowingOriginal(false);

    // 淡出原内容，显示 loading
    setTranslateStatus("loading");
    Animated.timing(contentFadeAnim, {
      toValue: 0.3,
      duration: 150,
      useNativeDriver: true,
    }).start();

    void translateHtml(html)
      .then(({ html: translated, detectedLang: detected }) => {
        if (translatingContentRef.current !== html) return;
        setTranslatedContent(translated);
        setDetectedLang(detected);
        setTranslateStatus("done");
      })
      .catch(() => {
        if (translatingContentRef.current !== html) return;
        // 失败立即回到原文
        setTranslateStatus("error");
      })
      .finally(() => {
        // 无论成功失败，淡入显示
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
  }, [
    currentArticle?.content,
    autoTranslate,
    contentFadeAnim,
    setShowingOriginal,
  ]);

  useEffect(() => {
    articleStateRef.current = article;
  }, [article]);

  const applyIncomingArticle = useCallback(
    (incoming: ArticleData) => {
      const mergedArticle = mergeArticlePreservingContent(
        articleStateRef.current,
        incoming,
      );

      articleStateRef.current = mergedArticle;
      ArticleCache.set(articleId, mergedArticle);

      startTransition(() => {
        setArticle((prev) => (prev === mergedArticle ? prev : mergedArticle));
        setArticleAuthor((prev) =>
          prev === mergedArticle.author ? prev : mergedArticle.author,
        );
      });
    },
    [articleId, startTransition],
  );

  const fetchArticleData = useCallback(
    async (forceRefresh = false) => {
      if (!articleId) return;

      // 命中缓存：直接更新数据，等 RenderHtml onLayout 触发后淡入
      if (!forceRefresh && ArticleCache.has(articleId)) {
        const cached = ArticleCache.get(articleId)!;
        if (activeArticleIdRef.current !== articleId) return;
        applyIncomingArticle(cached);
        return;
      }

      // 未命中缓存：仅触发数据请求，overlay 由 renderReady 控制
      try {
        const { data } = await api.articleControllerFindOne(articleId);
        if (activeArticleIdRef.current !== articleId) return;
        if (data.data) {
          applyIncomingArticle(data.data as ArticleData);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    },

    [applyIncomingArticle, articleId],
  );

  useEffect(() => {
    const hasArticleChanged = previousArticleIdRef.current !== articleId;
    previousArticleIdRef.current = articleId;
    activeArticleIdRef.current = articleId;
    const cachedArticle =
      articleId && ArticleCache.has(articleId)
        ? ArticleCache.get(articleId)
        : undefined;

    if (hasArticleChanged) {
      setRenderReady(false);
      setArticle(cachedArticle);
      setArticleAuthor(cachedArticle?.author ?? cachedAuthor);
      articleStateRef.current = cachedArticle;
      hasFadedIn.current = false;
      htmlReadyRef.current = false;
    }

    fetchArticleData();
  }, [articleId, cachedAuthor, fadeAnim, fetchArticleData]);

  const handleRenderReady = useCallback(() => {
    if (!currentArticle) return;
    if (htmlReadyRef.current) return;
    htmlReadyRef.current = true;
    tryFadeIn();
  }, [currentArticle, tryFadeIn]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchArticleData(true);
      setCommentRefreshSignal((prev) => prev + 1);
    } finally {
      setRefreshing(false);
    }
  }, [fetchArticleData]);

  const renderCover = useCallback(
    () => (
      <View style={{ aspectRatio: 16 / 9 }}>
        <AsyncImage
          cachePolicy={"disk"}
          source={{ uri: currentArticle?.cover }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </View>
    ),
    [currentArticle?.cover],
  );

  const handleScrollToComments = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      y: commentSectionY.current,
      animated: true,
    });
  }, []);

  const handleCommentSubmitted = useCallback(() => {
    setCommentRefreshSignal((prev) => prev + 1);
    setArticle((prev) => {
      if (!prev) return prev;
      const nextArticle = {
        ...prev,
        commentCount: (prev.commentCount || 0) + 1,
      };
      articleStateRef.current = nextArticle;
      if (articleId) ArticleCache.set(articleId, nextArticle);
      return nextArticle;
    });
    requestAnimationFrame(() => {
      handleScrollToComments();
    });
  }, [articleId, handleScrollToComments]);

  const handleCommentLabelLayout = useCallback((event: LayoutChangeEvent) => {
    setCommentStickyHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const handleArticleInteractionChange = useCallback(
    (
      updates: Partial<
        Pick<
          ArticleData,
          | "isLiked"
          | "likes"
          | "isFavorited"
          | "favoriteCount"
          | "commentCount"
          | "reactionStats"
          | "userReaction"
        >
      >,
    ) => {
      setArticle((prev) => {
        if (!prev) {
          return prev;
        }

        const nextArticle = {
          ...prev,
          ...updates,
        };
        articleStateRef.current = nextArticle;
        if (articleId) {
          ArticleCache.set(articleId, nextArticle);
        }
        return nextArticle;
      });
    },
    [articleId],
  );

  const updateAuthorFollowState = useCallback(
    (isFollowed: boolean) => {
      setArticleAuthor((prev) => (prev ? { ...prev, isFollowed } : prev));
      setArticle((prev) => {
        if (!prev?.author) return prev;
        const nextArticle = {
          ...prev,
          author: {
            ...prev.author,
            isFollowed,
          },
        };
        articleStateRef.current = nextArticle;
        if (articleId) ArticleCache.set(articleId, nextArticle);
        return nextArticle;
      });
    },
    [articleId],
  );

  const handleToggleFollow = useCallback(async () => {
    if (Number(currentUserId) === Number(articleAuthor?.id)) {
      showToast(t("article.cannotFollowSelf"));
      return;
    }
    if (!articleAuthor?.id || followLoading) return;

    const nextFollowed = !articleAuthor.isFollowed;
    setFollowLoading(true);
    updateAuthorFollowState(nextFollowed);

    try {
      if (nextFollowed) {
        await api.userControllerFollow(String(articleAuthor.id));
      } else {
        await api.userControllerUnfollow(String(articleAuthor.id));
      }
    } catch (error) {
      updateAuthorFollowState(!nextFollowed);
      if (isAuthRedirectedError(error)) return;
      showToast(t("article.actionFailed"));
    } finally {
      setFollowLoading(false);
    }
  }, [
    articleAuthor,
    currentUserId,
    followLoading,
    showToast,
    t,
    updateAuthorFollowState,
  ]);

  const renderArticleMedia = () => {
    if (currentArticle?.type === "image" && currentArticle.images) {
      return (
        <ArticleSwiper
          article={currentArticle}
          images={currentArticle.images}
          onCommentSubmitted={handleCommentSubmitted}
          onArticleInteractionChange={handleArticleInteractionChange}
        />
      );
    }

    if (currentArticle?.type === "video") {
      return (
        <View
          style={{
            position: "sticky",
            top: 0,
          }}
        >
          <ArticleVideoPlayer
            videoUrl={currentArticle.videoUrl}
            cover={currentArticle.cover}
          />
        </View>
      );
    }

    if (currentArticle?.type === "mixed" && currentArticle.cover) {
      return renderCover();
    }

    return null;
  };

  // Loading stays until article data is ready AND any auto-translation has settled.
  const showLoading =
    !currentArticle || (autoTranslate && translateStatus === "loading");

  // 视频文章：视频作为固定头部置于 ScrollView 上方（始终吸顶），
  // 此时 ScrollView 内少了媒体子节点，评论标签索引由 5 变为 4
  const isVideoArticle = currentArticle?.type === "video";
  const stickyHeaderIndices = useMemo(
    () => (isVideoArticle ? [4] : [5]),
    [isVideoArticle],
  );

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.card }}
    >
      <ArticleHeader
        data={currentArticle ?? ({} as ArticleData)}
        author={articleAuthor}
        followLoading={followLoading}
        onToggleFollow={handleToggleFollow}
        onFollowChange={updateAuthorFollowState}
        topInset={stableTopInset}
      />

      <View style={{ flex: 1, position: "relative" }}>
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
          }}
          pointerEvents={currentArticle && renderReady ? "auto" : "none"}
        >
          {/* 视频文章：媒体区作为固定头部始终吸顶 */}
          {isVideoArticle ? (
            <View style={{ backgroundColor: theme.card, zIndex: 2 }}>
              {renderArticleMedia()}
            </View>
          ) : null}

          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, backgroundColor: theme.card }}
            stickyHeaderIndices={stickyHeaderIndices}
            stickyHeaderHiddenOnScroll={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.primary}
                colors={[theme.primary]}
              />
            }
          >
            {/* 非视频文章：媒体区在 ScrollView 内随内容滚动 */}
            {isVideoArticle ? null : (
              <View style={{ backgroundColor: theme.card, zIndex: 2 }}>
                {renderArticleMedia()}
              </View>
            )}

            <View style={{ padding: PADDING_H }}>
              {/* 翻译标语：有缓存译文时持续显示，按钮在原文/译文间切换 */}
              {showTranslateBanner && (
                <View style={translateBannerStyles.wrap}>
                  <Image
                    source={MicroSoftPng}
                    style={translateBannerStyles.logo}
                    resizeMode="contain"
                  />
                  <ThemedText size={12} color={theme.secondary}>
                    {" "}
                    已翻译
                  </ThemedText>
                  {showingOriginal ? (
                    <Pressable
                      hitSlop={8}
                      onPress={() => {
                        toggleTitle();
                        setShowingOriginal(false);
                      }}
                    >
                      <ThemedText
                        size={12}
                        color={theme.primary}
                        style={translateBannerStyles.viewOriginal}
                      >
                        查看译文
                      </ThemedText>
                    </Pressable>
                  ) : (
                    <Pressable
                      hitSlop={8}
                      onPress={() => {
                        resetTitle();
                        setShowingOriginal(true);
                      }}
                    >
                      <ThemedText
                        size={12}
                        color={theme.primary}
                        style={translateBannerStyles.viewOriginal}
                      >
                        查看原文
                      </ThemedText>
                    </Pressable>
                  )}
                </View>
              )}

              <View style={{ marginBottom: 8 }}>
                <ThemedText size={18} fontWeight={500}>
                  {translatedTitle || currentArticle?.title}
                </ThemedText>
              </View>

              <Animated.View style={{ opacity: contentFadeAnim }}>
                <RenderHtmlComponent
                  article={currentArticle}
                  selectable
                  source={{
                    html:
                      (translateStatus === "done" && !showingOriginal
                        ? translatedContent
                        : null) ??
                      currentArticle?.content ??
                      "",
                  }}
                  contentWidth={contentWidth}
                  onReady={handleRenderReady}
                  onCommentSubmitted={handleCommentSubmitted}
                  onArticleInteractionChange={handleArticleInteractionChange}
                />
              </Animated.View>
            </View>
            {/* 统计 */}

            <View
              style={{
                paddingHorizontal: PADDING_H,
                gap: 6,
                paddingVertical: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Clock size={14} color={theme.secondary} />
                  <ThemedText size={12} color={theme.secondary}>
                    {formatRelativeTime(currentArticle?.createdAt, t)}
                  </ThemedText>
                </View>
                <ThemedText
                  size={12}
                  color={theme.secondary}
                  style={{ marginHorizontal: 8 }}
                >
                  ·
                </ThemedText>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Eye size={14} color={theme.secondary} />
                  <ThemedText size={12} color={theme.secondary}>
                    {currentArticle?.views ?? 0}
                  </ThemedText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {currentArticle?.allowReprint ? (
                  <Forward size={14} color={theme.secondary} />
                ) : (
                  <Ban size={14} color={theme.secondary} />
                )}
                <ThemedText size={12} color={theme.secondary}>
                  {currentArticle?.allowReprint
                    ? t("article.allowReprint")
                    : t("article.notAllowReprint")}
                </ThemedText>
              </View>
            </View>

            <ArticleActions
              article={currentArticle}
              onArticleInteractionChange={handleArticleInteractionChange}
            />

            <View style={{ height: 8, backgroundColor: theme.border }} />

            <ArticleCommentListLabel
              sortKey={commentSortKey}
              onSortKeyChange={setCommentSortKey}
              onLayout={handleCommentLabelLayout}
            />

            {/* Comment List */}
            <View
              onLayout={(e) => {
                commentSectionY.current =
                  e.nativeEvent.layout.y - commentStickyHeaderHeight;
              }}
            >
              <ArticleCommentList
                articleId={articleId}
                articleAuthorId={articleAuthor?.id}
                refreshSignal={commentRefreshSignal}
                hideHeader
                sortKey={commentSortKey}
                onSortKeyChange={setCommentSortKey}
              />
            </View>
          </ScrollView>
        </Animated.View>
        {showLoading && (
          <View
            style={{
              flex: 1,
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: theme.card,
            }}
            pointerEvents="none"
          >
            <Loading loading />
          </View>
        )}
      </View>
      {currentArticle && !showLoading && (
        <ArticleBottomBar
          key={`${currentArticle.id}-${currentArticle.isLiked}-${currentArticle.likes}-${currentArticle.isFavorited}-${currentArticle.favoriteCount}-${currentArticle.commentCount}`}
          article={currentArticle}
          onScrollToComments={handleScrollToComments}
          onCommentSubmitted={handleCommentSubmitted}
          onArticleInteractionChange={handleArticleInteractionChange}
        />
      )}
    </SafeAreaView>
  );
}

const translateBannerStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 14,
    height: 14,
  },
  viewOriginal: {
    marginLeft: 8,
  },
});
