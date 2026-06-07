import { api } from "@/api";
import type { CommentControllerFindAllComments200ResponseDataDataInner } from "@/api/generated";
import CommentCard from "@/components/profile/CommentCard";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
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

type CommentData = CommentControllerFindAllComments200ResponseDataDataInner;

type CommentsTabProps = {
  refreshSignal?: number;
  onPullScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onPullRelease?: () => void;
};

export default function CommentsTab({
  refreshSignal = 0,
  onPullScroll,
  onPullRelease,
}: CommentsTabProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.profile?.id);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const limit = 20;

  const [data, setData] = useState<CommentData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!userId || loadingRef.current) return;
      loadingRef.current = true;

      if (isRefresh) {
        pageRef.current = 1;
        hasMoreRef.current = true;
      } else if (!hasMoreRef.current) {
        loadingRef.current = false;
        return;
      } else {
        setLoadingMore(true);
      }

      try {
        const { data: res } = await api.commentControllerGetUserComments(
          String(userId),
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
        console.error("CommentsTab fetchData:", e);
      } finally {
        loadingRef.current = false;
        if (!isRefresh) setLoadingMore(false);
        setInitialLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (refreshSignal > 0) fetchData(true);
  }, [fetchData, refreshSignal]);

  const onEndReached = useCallback(() => {
    if (!loadingRef.current) fetchData(false);
  }, [fetchData]);

  const renderItem: ListRenderItem<CommentData> = useCallback(
    ({ item, index }) => (
      <CommentCard data={item} isLast={index === data.length - 1} />
    ),
    [data.length],
  );

  const keyExtractor = useCallback(
    (item: CommentData) => item.id.toString(),
    [],
  );

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      onScroll={onPullScroll}
      onScrollEndDrag={onPullRelease}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      bounces
      alwaysBounceVertical
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
  emptyWrap: { paddingTop: 48, alignItems: "center" },
});
