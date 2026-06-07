import { api, ArticleControllerGetFavoritedArticles200Response } from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";

type ArticleData =
  ArticleControllerGetFavoritedArticles200Response["data"]["data"][number];

export default function FavoritesTab() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const limit = 20;

  const [data, setData] = useState<ArticleData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isRefresh) {
      setRefreshing(true);
      pageRef.current = 1;
      hasMoreRef.current = true;
    } else if (!hasMoreRef.current) {
      loadingRef.current = false;
      return;
    } else {
      setLoadingMore(true);
    }

    try {
      const { data: res } = await api.articleControllerGetFavoritedArticles(
        pageRef.current,
        limit,
      );
      const newData = res.data.data;
      if (newData.length > 0) {
        setData((prev) => {
          if (isRefresh) return newData;
          const existingIds = new Set(prev.map((item) => item.id));
          return [
            ...prev,
            ...newData.filter((item) => !existingIds.has(item.id)),
          ];
        });
        pageRef.current += 1;
      } else {
        if (isRefresh) setData([]);
        hasMoreRef.current = false;
      }
    } catch (e) {
      console.error("FavoritesTab fetchData:", e);
    } finally {
      loadingRef.current = false;
      if (isRefresh) setRefreshing(false);
      else setLoadingMore(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const onRefresh = useCallback(() => fetchData(true), [fetchData]);
  const onEndReached = useCallback(() => {
    if (!refreshing && !loadingRef.current) fetchData(false);
  }, [fetchData, refreshing]);

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
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
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
        data.length > 0 ? (
          <ListFooterLoadingComponent
            loading={loadingMore}
            hasMore={hasMoreRef.current}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { paddingVertical: 12 },
  emptyWrap: { paddingTop: 48, alignItems: "center" },
});
