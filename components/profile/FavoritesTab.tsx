import { api, ArticleControllerGetFavoritedArticles200Response } from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import ArticleCardSkeletonList from "@/components/article/ArticleCardSkeleton";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type ArticleData =
  ArticleControllerGetFavoritedArticles200Response["data"]["data"][number];

type FavoritesTabProps = {
  refreshSignal?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  onContentScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export default function FavoritesTab({
  refreshSignal = 0,
  refreshing = false,
  onRefresh,
  onContentScroll,
}: FavoritesTabProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const limit = 20;

  const [data, setData] = useState<ArticleData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const updateHasMore = useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isRefresh) {
      pageRef.current = 1;
      updateHasMore(true);
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
        updateHasMore(false);
      }
    } catch (e) {
      console.error("FavoritesTab fetchData:", e);
    } finally {
      loadingRef.current = false;
      if (!isRefresh) setLoadingMore(false);
      setInitialLoading(false);
    }
  }, [updateHasMore]);

  useEffect(() => {
    const task = setTimeout(() => {
      fetchData(true);
    }, 0);
    return () => clearTimeout(task);
  }, [fetchData]);

  useEffect(() => {
    if (refreshSignal <= 0) return;
    const task = setTimeout(() => {
      fetchData(true);
    }, 0);
    return () => clearTimeout(task);
  }, [fetchData, refreshSignal]);

  const onEndReached = useCallback(() => {
    if (!loadingRef.current) fetchData(false);
  }, [fetchData]);

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

  if (initialLoading) return <ArticleCardSkeletonList count={5} />;

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      onScroll={onContentScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      bounces
      alwaysBounceVertical
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={theme.card}
            tintColor={colors.primary}
          />
        ) : undefined
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
            hasMore={hasMore}
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
