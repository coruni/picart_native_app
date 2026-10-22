import { api } from "@/api";
import CommentActionSheet, {
  type CommentActionSheetRef,
} from "@/components/feedback/CommentActionSheet";
import CommentCard, {
  type CommentData,
} from "@/components/profile/CommentCard";
import CommentCardSkeletonList from "@/components/profile/CommentCardSkeleton";
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

type CommentsTabProps = {
  userId?: string | number;
  refreshSignal?: number;
  onContentScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export default function CommentsTab({
  userId: userIdProp,
  refreshSignal = 0,
  onContentScroll,
}: CommentsTabProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.profile?.id);
  const userId = userIdProp ?? currentUserId;

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const limit = 20;

  const [data, setData] = useState<CommentData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [activeComment, setActiveComment] = useState<CommentData | null>(null);

  const actionSheetRef = useRef<CommentActionSheetRef>(null);

  const updateHasMore = useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!userId || loadingRef.current) return;
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
          updateHasMore(false);
        }
      } catch (e) {
        console.error("CommentsTab fetchData:", e);
      } finally {
        loadingRef.current = false;
        if (!isRefresh) setLoadingMore(false);
        setInitialLoading(false);
      }
    },
    [updateHasMore, userId],
  );

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

  const handleMore = useCallback((comment: CommentData) => {
    setActiveComment(comment);
    requestAnimationFrame(() => {
      actionSheetRef.current?.present();
    });
  }, []);

  const likingIdsRef = useRef<Set<number>>(new Set());

  const handleLike = useCallback(async (comment: CommentData) => {
    if (likingIdsRef.current.has(comment.id)) return;
    likingIdsRef.current.add(comment.id);

    const prevLiked = Boolean(comment.isLiked);
    const prevLikes = comment.likes ?? 0;

    setData((prev) =>
      prev.map((item) =>
        item.id === comment.id
          ? {
              ...item,
              isLiked: !prevLiked,
              likes: Math.max(0, prevLikes + (prevLiked ? -1 : 1)),
            }
          : item,
      ),
    );

    try {
      await api.commentControllerLike(String(comment.id));
    } catch {
      setData((prev) =>
        prev.map((item) =>
          item.id === comment.id
            ? { ...item, isLiked: prevLiked, likes: prevLikes }
            : item,
        ),
      );
    } finally {
      likingIdsRef.current.delete(comment.id);
    }
  }, []);

  const handleDeleted = useCallback((id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const renderItem: ListRenderItem<CommentData> = useCallback(
    ({ item, index }) => (
      <CommentCard
        data={item}
        isLast={index === data.length - 1}
        onMore={handleMore}
        onLike={handleLike}
      />
    ),
    [data.length, handleLike, handleMore],
  );

  const keyExtractor = useCallback(
    (item: CommentData) => item.id.toString(),
    [],
  );

  if (initialLoading) return <CommentCardSkeletonList count={5} />;

  return (
    <>
      <FlatList
        style={[styles.flex1, { backgroundColor: theme.card }]}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        onScroll={onContentScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
        alwaysBounceVertical={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <ThemedText size={14} color={theme.secondary}>
              {t("noContent")}
            </ThemedText>
          </View>
        }
        ListFooterComponent={
          data.length > 0 ? (
            <ListFooterLoadingComponent
              loading={loadingMore}
              hasMore={hasMore}
              allLoadedText={t("allLoadedComments")}
            />
          ) : null
        }
      />

      <CommentActionSheet
        ref={actionSheetRef}
        comment={activeComment}
        isOwner={activeComment?.author?.id === currentUserId}
        onDeleted={handleDeleted}
        onClosed={() => setActiveComment(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  emptyWrap: { paddingTop: 48, alignItems: "center" },
});
