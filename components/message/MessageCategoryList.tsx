import { api, isAuthRedirectedError } from "@/api";
import type { MessageControllerSearchTypeEnum } from "@/api/generated";
import MessageItemRow, {
  type MessageCategory,
  type MessageItemData,
} from "@/components/message/MessageItemRow";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { router, useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PAGE_SIZE = 20;

interface MessageCategoryListProps {
  type: MessageControllerSearchTypeEnum;
  category: MessageCategory;
  title: string;
  emptyText: string;
}

export default function MessageCategoryList({
  type,
  category,
  title,
  emptyText,
}: MessageCategoryListProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<MessageItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (replace) setRefreshing(true);
      else setLoading(true);
      try {
        const { data } = await api.messageControllerSearch(
          nextPage,
          PAGE_SIZE,
          type,
        );
        const list = data.data.data ?? [];
        const meta = data.data.meta;
        setItems((prev) => (replace ? list : [...prev, ...list]));
        setPage(nextPage);
        setHasMore(nextPage < (meta?.totalPages ?? nextPage));
      } catch (error) {
        if (!isAuthRedirectedError(error)) {
          toast.show(t("article.actionFailed"));
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [type, t],
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const handleRefresh = useCallback(() => {
    setHasMore(true);
    fetchPage(1, true);
  }, [fetchPage]);

  const handleEndReached = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    fetchPage(page + 1, false);
  }, [fetchPage, hasMore, page]);

  const handleMarkAll = useCallback(async () => {
    if (markingAll) return;
    setMarkingAll(true);
    try {
      await api.messageControllerMarkAllAsRead({ type });
      setItems((prev) => prev.map((it) => ({ ...it, isRead: true })));
      toast.show(t("messagePage.allReadDone"));
    } catch (error) {
      if (!isAuthRedirectedError(error)) {
        toast.show(t("article.actionFailed"));
      }
    } finally {
      setMarkingAll(false);
    }
  }, [markingAll, type, t]);

  const handlePressItem = useCallback(
    (item: MessageItemData) => {
      // 标记单条已读(乐观更新);返回消息 tab 时其 useFocusEffect 会重拉未读数
      if (!item.isRead) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, isRead: true } : it)),
        );
        void api
          .messageControllerMarkAsRead(String(item.id))
          .catch(() => undefined);
      }

      // 按优先级跳转到关联内容
      const articleId = item.articleId ?? item.metadata?.articleId;
      if (item.commentId) {
        router.push({
          pathname: "/comment/[id]",
          params: {
            id: String(item.commentId),
            // 通知里只有评论 id，评论详情页要靠 articleId 定位并补拉主评论
            articleId: articleId ? String(articleId) : undefined,
          },
        });
      } else if (articleId) {
        router.push({
          pathname: "/article/[id]",
          params: { id: String(articleId) },
        });
      } else if (item.targetType === "user" && item.targetId) {
        router.push({
          pathname: "/user/[id]",
          params: { id: String(item.targetId) },
        });
      }
    },
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <Pressable
          hitSlop={10}
          disabled={markingAll || items.length === 0}
          onPress={handleMarkAll}
          style={styles.headerRight}
        >
          <ThemedText
            size={14}
            color={items.length === 0 ? theme.mutedForeground : theme.primary}
            fontWeight="600"
          >
            {t("messagePage.markAllRead")}
          </ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, title, handleMarkAll, markingAll, items.length, theme, t]);

  const renderItem = useCallback(
    ({ item }: { item: MessageItemData }) => (
      <MessageItemRow
        item={item}
        category={category}
        onPress={handlePressItem}
      />
    ),
    [category, handlePressItem],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.card }]}
      edges={["bottom", "left", "right"]}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) },
          items.length === 0 && styles.emptyContent,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={theme.card}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading || refreshing ? null : (
            <View style={styles.empty}>
              <ThemedText size={14} color={theme.secondary}>
                {emptyText}
              </ThemedText>
            </View>
          )
        }
        ListFooterComponent={
          loading && items.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={theme.secondary} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8 },
  emptyContent: { flexGrow: 1 },
  headerRight: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
