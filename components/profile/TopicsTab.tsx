import { api } from "@/api";
import type { TagControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import TopicListItem, {
    TopicListItemSkeleton,
} from "@/components/topic/TopicListItem";
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
    StyleSheet,
    View,
} from "react-native";

type TopicsTabProps = {
  refreshSignal?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  onContentScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export default function TopicsTab({
  refreshSignal = 0,
  refreshing = false,
  onRefresh,
  onContentScroll,
}: TopicsTabProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const limit = 20;
  const [topics, setTopics] = useState<
    TagControllerFindAll200ResponseDataDataInner[]
  >([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const updateHasMore = useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  const fetchTopics = useCallback(
    async (isRefresh = false) => {
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
        const { data: res } = await api.tagControllerFollowedList(
          pageRef.current,
          limit,
        );
        const newData = res.data?.data || [];
        setTopics((prev) => {
          if (isRefresh) return newData;
          const existingIds = new Set(prev.map((item) => item.id));
          return [
            ...prev,
            ...newData.filter((item) => !existingIds.has(item.id)),
          ];
        });
        pageRef.current += 1;
        if (!newData.length) {
          updateHasMore(false);
        }
      } catch (error) {
        console.error("TopicsTab fetchTopics:", error);
        if (isRefresh) setTopics([]);
      } finally {
        loadingRef.current = false;
        if (!isRefresh) setLoadingMore(false);
        setInitialLoading(false);
      }
    },
    [updateHasMore],
  );

  useEffect(() => {
    const task = setTimeout(() => {
      fetchTopics(true);
    }, 0);

    return () => clearTimeout(task);
  }, [fetchTopics]);

  useEffect(() => {
    if (refreshSignal <= 0) return;
    const task = setTimeout(() => {
      fetchTopics(true);
    }, 0);
    return () => clearTimeout(task);
  }, [fetchTopics, refreshSignal]);

  const renderItem: ListRenderItem<TagControllerFindAll200ResponseDataDataInner> =
    useCallback(
      ({ item }) => (
        <TopicListItem topic={item} showChevron={false} compact withDivider />
      ),
      [],
    );

  const onEndReached = useCallback(() => {
    if (!loadingRef.current) fetchTopics(false);
  }, [fetchTopics]);

  if (initialLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.card }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <TopicListItemSkeleton key={index} compact withDivider />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={topics}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      onEndReached={onEndReached}
      contentContainerStyle={styles.container}
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
        topics.length > 0 ? (
          <ListFooterLoadingComponent
            loading={loadingMore}
            hasMore={hasMore}
            allLoadedText={t("allLoadedTopics")}
          />
        ) : null
      }
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      onScroll={onContentScroll}
      scrollEventThrottle={16}
      onEndReachedThreshold={1}
      bounces
      alwaysBounceVertical
    />
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { paddingVertical: 12 },
  emptyWrap: { paddingTop: 48, alignItems: "center" },
});
