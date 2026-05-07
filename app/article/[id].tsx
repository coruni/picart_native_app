import { api, ArticleControllerFindOne200ResponseData } from "@/api";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleSwiper from "@/components/article/ArticleSwiper";
import { ArticleCache } from "@/hooks/useArticleCache";
import { useTheme } from "@/hooks/useTheme";
import { useLocalSearchParams, useNavigation } from "expo-router";

import AsyncImage from "@/components/ui/AsyncImage";
import Loading from "@/components/ui/Loading";
import RenderHtmlComponent from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import type { ImageData } from "@/types/api";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Animated, ScrollView, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ArticleData = Omit<
  ArticleControllerFindOne200ResponseData,
  "images"
> & {
  images: string[] | ImageData[];
};

const PADDING_H = 12;

export default function ArticleScreen() {
  const { id, author } = useLocalSearchParams();
  const articleId = id as string;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const contentWidth = width - PADDING_H * 2;

  const [, startTransition] = useTransition();

  const [loading, setLoading] = useState(false);
  // RenderHtml 首次 onLayout 触发后置 true
  const [renderReady, setRenderReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const hasFadedIn = useRef(false);

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

      // 未命中缓存：显示 Loading，内容保持透明
      setLoading(true);

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
      } finally {
        setLoading(false);
      }
    },

    [articleId],
  );

  useEffect(() => {
    // 切换文章时重置状态
    setRenderReady(false);
    hasFadedIn.current = false;
    fadeAnim.setValue(0);
    fetchArticleData();
  }, [articleId, fadeAnim, fetchArticleData]);

  const handleRenderReady = useCallback(() => {
    // onLayout 可能触发多次，只处理第一次
    if (hasFadedIn.current) return;
    hasFadedIn.current = true;
    setRenderReady(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  // 仅在「网络请求中且还没有任何内容」时展示，有缓存时直接跳过
  const showLoading = loading && !article;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.card }}>
      <ArticleHeader
        data={article ?? ({} as ArticleData)}
        author={articleAuthor}
      />

      {showLoading && (
        <View style={{ flex: 1 }} pointerEvents="none">
          <Loading loading />
        </View>
      )}

      {!showLoading && (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
          }}
          pointerEvents={renderReady ? "auto" : "none"}
        >
          <ScrollView style={{ flex: 1, backgroundColor: theme.card }}>
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
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
