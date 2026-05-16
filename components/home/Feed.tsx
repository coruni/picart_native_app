import { api, ArticleControllerFindAll200Response } from "@/api";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getCachedArticles, setCachedArticles } from "@/store/articleStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import ArticleCard from "../article/ArticleCard";

type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];

const CACHE_KEY = "home";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const limit = 20;
  const [data, setData] = useState<ArticleData[]>(
    () => getCachedArticles(CACHE_KEY) ?? [],
  );
  const hasMoreRef = useRef(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(
    () => !getCachedArticles(CACHE_KEY),
  );

  const fetchArticleData = useCallback(async (isRefresh = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isRefresh) {
      setRefreshing(true);
      pageRef.current = 1;
    } else if (!hasMoreRef.current) {
      loadingRef.current = false;
      return;
    } else {
      setLoadingMore(true);
    }

    try {
      const { data: responseData } = await api.articleControllerFindAll(
        pageRef.current,
        limit,
        undefined,
        undefined,
        "popular",
      );
      const newData = responseData.data.data;
      if (newData.length > 0) {
        setData((prev) => {
          if (isRefresh) return newData;
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewData = newData.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewData];
        });
        if (isRefresh) {
          setCachedArticles(CACHE_KEY, newData);
          hasMoreRef.current = true;
        }
        pageRef.current += 1;
      } else if (isRefresh) {
        setData([]);
        hasMoreRef.current = false;
      } else {
        hasMoreRef.current = false;
      }
    } catch (e) {
      console.error("Failed to fetch articles:", e);
    } finally {
      loadingRef.current = false;
      if (isRefresh) setRefreshing(false);
      else setLoadingMore(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    // 有缓存则跳过自动加载（用户下拉可刷新）；无缓存时正常加载
    if (getCachedArticles(CACHE_KEY)) return;
    fetchArticleData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    fetchArticleData(true);
  }, [fetchArticleData]);

  const onEndReached = useCallback(() => {
    if (refreshing || loadingRef.current) return;
    fetchArticleData(false);
  }, [fetchArticleData, refreshing]);

  const renderItem: ListRenderItem<ArticleData> = useCallback(
    ({ item, index }) => (
      <ArticleCard data={item as any} isLast={index === data.length - 1} />
    ),
    [data.length],
  );

  const keyExtractor = useCallback(
    (item: ArticleData) => item.id.toString(),
    [],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews
      ListEmptyComponent={
        !initialLoading ? (
          <View style={styles.emptyWrap}>
            <ThemedText size={14} color={theme.secondary}>
              {t("noContent")}
            </ThemedText>
          </View>
        ) : null
      }
      ListFooterComponent={
        <ListFooterLoadingComponent
          loading={loadingMore}
          hasMore={hasMoreRef.current}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 16,
  },
});
