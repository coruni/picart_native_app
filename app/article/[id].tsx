import { api, ArticleControllerFindOne200ResponseData } from "@/api";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleSwiper from "@/components/article/ArticleSwiper";
import { useTheme } from "@/hooks/useTheme";
import { useLocalSearchParams, useNavigation } from "expo-router";

import type { ImageData } from "@/types/api";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export type ArticleData = Omit<
  ArticleControllerFindOne200ResponseData,
  "images"
> & {
  images: string[] | ImageData[];
};
export default function ArticleScreen() {
  const { id, author } = useLocalSearchParams();
  const [articleAuthor, setArticleAuthor] = useState<
    ArticleControllerFindOne200ResponseData["author"]
  >(JSON.parse(author as string));
  const [article, setArticle] = useState<ArticleData>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 获取数据
  const fetchArticleData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.articleControllerFindOne(id as string);
      if (data.data) {
        setArticle(data.data);
        setArticleAuthor(data.data.author);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 执行请求
  useEffect(() => {
    fetchArticleData();
  }, [fetchArticleData]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.card }}>
      {/* 自定义 header */}
      <ArticleHeader
        data={article ?? ({} as ArticleData)}
        author={articleAuthor}
      />
      {/* 页面主体 */}
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {article?.type === "image" && article?.images && (
          <ArticleSwiper images={article?.images} />
        )}
      </View>
    </SafeAreaView>
  );
}
