import { api, ArticleControllerFindAll200Response } from "@/api";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from "react-native";
import ArticleCard from "../article/ArticleCard";

type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];

export default function HomeScreen() {
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const limit = 20;
  const [data, setData] = useState<ArticleData[]>([]);
  const hasMoreRef = useRef(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticleData = useCallback(async (isRefresh = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isRefresh) {
      setRefreshing(true);
      pageRef.current = 1;
    } else if (!hasMoreRef.current) {
      loadingRef.current = false;
      return;
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
        pageRef.current += 1;
        if (isRefresh) hasMoreRef.current = true;
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
    }
  }, []);

  useEffect(() => {
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
    ({ item }) => <ArticleCard data={item} />,
    [],
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
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
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
