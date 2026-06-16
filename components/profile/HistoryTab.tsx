import {
  api,
  ArticleControllerGetUserBrowseHistory200Response,
  ArticleControllerGetUserBrowseHistoryOrderEnum,
} from "@/api";
import ArticleHistoryCard from "@/components/article/ArticleHistoryCard";
import CommentCardSkeletonList from "@/components/profile/CommentCardSkeleton";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { formatDateYMD, toDate } from "@/lib/time";
import { Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type HistoryData =
  ArticleControllerGetUserBrowseHistory200Response["data"]["data"][number];

type HistoryRow =
  | {
      type: "section";
      key: string;
      isToday: boolean;
      day: number;
      month: string;
      first: boolean;
    }
  | { type: "item"; key: string; data: HistoryData };

type SortOrder = ArticleControllerGetUserBrowseHistoryOrderEnum;

type HistoryTabProps = {
  refreshSignal?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  onContentScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export default function HistoryTab({
  refreshSignal = 0,
  refreshing = false,
  onRefresh,
  onContentScroll,
}: HistoryTabProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { confirm } = useConfirm();

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const orderRef = useRef<SortOrder>(
    ArticleControllerGetUserBrowseHistoryOrderEnum.Newest,
  );
  const limit = 20;

  const [data, setData] = useState<HistoryData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    ArticleControllerGetUserBrowseHistoryOrderEnum.Newest,
  );
  const [clearing, setClearing] = useState(false);

  const updateHasMore = useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  const fetchData = useCallback(
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
        const { data: res } = await api.articleControllerGetUserBrowseHistory(
          pageRef.current,
          limit,
          undefined,
          undefined,
          undefined,
          orderRef.current,
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
        console.error("HistoryTab fetchData:", e);
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

  const handleSortChange = useCallback(
    (next: SortOrder) => {
      if (next === orderRef.current || loadingRef.current) return;
      orderRef.current = next;
      setSortOrder(next);
      setInitialLoading(true);
      fetchData(true);
    },
    [fetchData],
  );

  const handleClear = useCallback(() => {
    if (clearing || data.length === 0) return;
    confirm({
      title: t("history.clearTitle"),
      message: t("history.clearMessage"),
      confirmText: t("history.clearConfirm"),
      onConfirm: async () => {
        setClearing(true);
        try {
          await api.articleControllerClearBrowseHistory();
          setData([]);
          updateHasMore(false);
          pageRef.current = 1;
          toast.show(t("history.clearSuccess"));
        } catch (e) {
          console.error("HistoryTab clear:", e);
          toast.show(t("history.clearFailed"));
        } finally {
          setClearing(false);
        }
      },
    });
  }, [clearing, confirm, data.length, t, updateHasMore]);

  const listData = useMemo<HistoryRow[]>(() => {
    const todayKey = formatDateYMD(new Date());
    const rows: HistoryRow[] = [];
    let lastDateKey: string | null = null;

    for (const item of data) {
      const dateValue = item.updatedAt ?? item.createdAt;
      const dateKey = formatDateYMD(dateValue) || "unknown";
      if (dateKey !== lastDateKey) {
        lastDateKey = dateKey;
        const date = toDate(dateValue);
        rows.push({
          type: "section",
          key: `section-${dateKey}`,
          isToday: dateKey === todayKey,
          day: date ? date.getDate() : 0,
          month: date ? date.toLocaleString("en", { month: "short" }) : "",
          first: rows.length === 0,
        });
      }
      rows.push({ type: "item", key: `item-${item.id}`, data: item });
    }

    return rows;
  }, [data]);

  const renderItem: ListRenderItem<HistoryRow> = useCallback(
    ({ item }) => {
      if (item.type === "section") {
        return (
          <View
            style={[
              styles.section,
              !item.first && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: theme.border,
              },
            ]}
          >
            {item.isToday ? (
              <ThemedText style={styles.sectionToday}>
                {t("history.today")}
              </ThemedText>
            ) : (
              <View style={styles.sectionDateWrap}>
                <ThemedText style={styles.sectionDay}>{item.day}</ThemedText>
                <ThemedText
                  size={13}
                  color={theme.secondary}
                  style={styles.sectionMonth}
                >
                  {item.month}
                </ThemedText>
              </View>
            )}
          </View>
        );
      }
      return <ArticleHistoryCard data={item.data} />;
    },
    [t, theme.border, theme.secondary],
  );

  const keyExtractor = useCallback((item: HistoryRow) => item.key, []);

  if (initialLoading) return <CommentCardSkeletonList count={5} />;

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={listData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 32,
            paddingHorizontal: 16,
            backgroundColor: theme.card,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable
              onPress={() =>
                handleSortChange(
                  ArticleControllerGetUserBrowseHistoryOrderEnum.Newest,
                )
              }
              style={{
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor:
                  sortOrder ===
                  ArticleControllerGetUserBrowseHistoryOrderEnum.Newest
                    ? theme.primary + "20"
                    : theme.secondaryBackground,
              }}
            >
              <ThemedText
                size={13}
                color={
                  sortOrder ===
                  ArticleControllerGetUserBrowseHistoryOrderEnum.Newest
                    ? theme.primary
                    : theme.secondary
                }
              >
                {t("sortLatest")}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() =>
                handleSortChange(
                  ArticleControllerGetUserBrowseHistoryOrderEnum.Oldest,
                )
              }
              style={{
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor:
                  sortOrder ===
                  ArticleControllerGetUserBrowseHistoryOrderEnum.Oldest
                    ? theme.primary + "20"
                    : theme.secondaryBackground,
              }}
            >
              <ThemedText
                size={13}
                color={
                  sortOrder ===
                  ArticleControllerGetUserBrowseHistoryOrderEnum.Oldest
                    ? theme.primary
                    : theme.secondary
                }
              >
                {t("sortEarliest")}
              </ThemedText>
            </Pressable>
          </View>
          <Pressable
            onPress={handleClear}
            disabled={clearing || data.length === 0}
            hitSlop={6}
            style={{
              borderRadius: 6,
              padding: 6,
              opacity: clearing || data.length === 0 ? 0.4 : 1,
              backgroundColor: theme.secondaryBackground,
            }}
          >
            <ThemedText>
              <Trash2 size={16} color={theme.secondary} />
            </ThemedText>
          </Pressable>
        </View>
      }
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
            allLoadedText={t("allLoadedHistory")}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { paddingBottom: 24 },
  emptyWrap: { paddingTop: 48, alignItems: "center" },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionToday: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  sectionDateWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  sectionDay: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  sectionMonth: {
    lineHeight: 28,
  },
});
