import { api, ArticleControllerFindOne200ResponseData } from "@/api";
import ArticleBottomBar from "@/components/article/ArticleBottomBar";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleSwiper from "@/components/article/ArticleSwiper";
import { ArticleCache } from "@/hooks/useArticleCache";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useLocalSearchParams, useNavigation } from "expo-router";

import ArticleCommentList from "@/components/comment/ArticleCommentList";
import AsyncImage from "@/components/ui/AsyncImage";
import Loading from "@/components/ui/Loading";
import RenderHtmlComponent from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { formatRelativeTime } from "@/lib/time";
import { useAuthStore } from "@/store/authStore";
import type { ImageData } from "@/types/api";
import { Clock, Eye } from "lucide-react-native";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export type ArticleData = Omit<
  ArticleControllerFindOne200ResponseData,
  "images"
> & {
  images: string[] | ImageData[];
};

const PADDING_H = 14;

export default function ArticleScreen() {
  const { id, author } = useLocalSearchParams();
  const articleId = id as string;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const contentWidth = width - PADDING_H * 2;
  const profile = useAuthStore((state) => state.user);

  const [, startTransition] = useTransition();

  const [refreshing, setRefreshing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [commentRefreshSignal, setCommentRefreshSignal] = useState(0);
  // RenderHtml 首次 onLayout 触发后置 true
  const [renderReady, setRenderReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasFadedIn = useRef(false);
  const htmlReadyRef = useRef(false);
  const commentReadyRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const commentSectionY = useRef(0);

  const tryFadeIn = useCallback(() => {
    if (hasFadedIn.current) return;
    if (!htmlReadyRef.current || !commentReadyRef.current) return;
    hasFadedIn.current = true;
    setRenderReady(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchArticleData = useCallback(
    async (forceRefresh = false) => {
      if (!articleId) return;

      // 命中缓存：直接更新数据，等 RenderHtml onLayout 触发后淡入
      if (!forceRefresh && ArticleCache.has(articleId)) {
        const cached = ArticleCache.get(articleId)!;
        startTransition(() => {
          setArticle(cached);
          setArticleAuthor(cached.author);
        });
        return;
      }

      // 未命中缓存：仅触发数据请求，overlay 由 renderReady 控制
      try {
        const { data } = await api.articleControllerFindOne(articleId);
        if (data.data) {
          ArticleCache.set(articleId, data.data as ArticleData);
          startTransition(() => {
            setArticle(data.data as ArticleData);
            setArticleAuthor(data.data.author);
          });
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    },

    [articleId],
  );

  useEffect(() => {
    // 切换文章时重置状态
    setRenderReady(false);
    hasFadedIn.current = false;
    htmlReadyRef.current = false;
    commentReadyRef.current = false;
    fadeAnim.setValue(0);
    fetchArticleData();
  }, [articleId, fadeAnim, fetchArticleData]);

  const handleRenderReady = useCallback(() => {
    if (htmlReadyRef.current) return;
    htmlReadyRef.current = true;
    tryFadeIn();
  }, [tryFadeIn]);

  const handleCommentReady = useCallback(() => {
    if (commentReadyRef.current) return;
    commentReadyRef.current = true;
    tryFadeIn();
  }, [tryFadeIn]);

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
          source={{ uri: article?.cover }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </View>
    ),
    [article?.cover],
  );

  const handleScrollToComments = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      y: commentSectionY.current,
      animated: true,
    });
  }, []);

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
        if (articleId) ArticleCache.set(articleId, nextArticle);
        return nextArticle;
      });
    },
    [articleId],
  );

  const handleToggleFollow = useCallback(async () => {
    console.log("handleToggleFollow", profile?.id, articleAuthor?.id);
    if (Number(profile?.id) === Number(articleAuthor?.id)) {
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
    } catch {
      updateAuthorFollowState(!nextFollowed);
      showToast(t("article.actionFailed"));
    } finally {
      setFollowLoading(false);
    }
  }, [
    articleAuthor?.id,
    articleAuthor?.isFollowed,
    followLoading,
    showToast,
    t,
    updateAuthorFollowState,
  ]);

  // overlay는 HTML 렌더링 + 댓글 첫 로드 둘 다 완료될 때까지 유지
  const showLoading = !renderReady;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.card }}>
      <ArticleHeader
        data={article ?? ({} as ArticleData)}
        author={articleAuthor}
        followLoading={followLoading}
        onToggleFollow={handleToggleFollow}
      />

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          position: "relative",
        }}
        pointerEvents={renderReady ? "auto" : "none"}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: theme.card }}
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
          {article?.type === "image" && article.images && (
            <ArticleSwiper images={article.images} />
          )}
          {article?.type === "mixed" && article.cover && renderCover()}

          <View style={{ padding: PADDING_H }}>
            <View style={{ marginBottom: 8 }}>
              <ThemedText size={18} fontWeight={500}>
                {article?.title}
              </ThemedText>
            </View>

            <RenderHtmlComponent
              source={{ html: article?.content ?? "" }}
              contentWidth={contentWidth}
              onReady={handleRenderReady}
            />
          </View>
          {/* 统计 */}
          <View
            style={{
              paddingHorizontal: PADDING_H,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={14} color={theme.secondary} />
              <ThemedText
                size={12}
                color={theme.secondary}
                style={{ marginLeft: 4 }}
              >
                {formatRelativeTime(article?.createdAt, t)}
              </ThemedText>
            </View>
            <ThemedText
              size={12}
              color={theme.secondary}
              style={{ marginHorizontal: 8 }}
            >
              ·
            </ThemedText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Eye size={14} color={theme.secondary} />
              <ThemedText
                size={12}
                color={theme.secondary}
                style={{ marginLeft: 4 }}
              >
                {article?.views ?? 0}
              </ThemedText>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: theme.border }} />

          {/* Comment List */}
          <View
            onLayout={(e) => {
              commentSectionY.current = e.nativeEvent.layout.y;
            }}
          >
            <ArticleCommentList
              articleId={articleId}
              articleAuthorId={articleAuthor?.id}
              refreshSignal={commentRefreshSignal}
              onReady={handleCommentReady}
            />
          </View>
        </ScrollView>
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
      </Animated.View>
      {!showLoading && (
        <ArticleBottomBar
          article={article}
          onScrollToComments={handleScrollToComments}
        />
      )}
    </SafeAreaView>
  );
}
