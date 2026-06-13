import {
  api,
  type DecorationControllerFindAllActivities200Response,
} from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useRouterLock } from "@/hooks/useRouterLock";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { formatDateYMD, toDate } from "@/lib/time";
import { useRouter } from "expo-router";
import { Clock } from "lucide-react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type ActivityData =
  DecorationControllerFindAllActivities200Response["data"]["data"][number];

const PAGE_LIMIT = 20;
const ACTIVE_BADGE_COLOR = "#22c55e";
const RE_HTML_TAGS = /<[^>]*>/g;
const RE_NBSP = /&nbsp;|&#160;/gi;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(RE_NBSP, " ");
}

function getSummaryText(html?: string, fallback?: string): string {
  if (!html?.trim()) {
    return fallback || "";
  }

  return decodeHtmlEntities(html.replace(RE_HTML_TAGS, " ")).trim();
}

function formatActivityDate(value?: string): string {
  return formatDateYMD(value).replace(/-/g, "/");
}

function isActivityActive(start?: string, end?: string): boolean {
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!startDate || !endDate) {
    return false;
  }

  const now = new Date();
  return now >= startDate && now <= endDate;
}

function SkeletonBlock({ style }: { style?: object }) {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.skeletonBlock, { backgroundColor: theme.muted }, style]}
    />
  );
}

function ActivityCardSkeleton({ isLast }: { isLast: boolean }) {
  const { theme } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.card,
        { borderBottomColor: theme.border, opacity },
        isLast && styles.lastCard,
      ]}
    >
      <View style={styles.skeletonCoverWrap}>
        <SkeletonBlock style={styles.skeletonCover} />
        <SkeletonBlock style={styles.skeletonStatusBadge} />
      </View>
      <View style={styles.cardBody}>
        <SkeletonBlock style={styles.skeletonTitle} />
        <SkeletonBlock style={styles.skeletonSummary} />
        <SkeletonBlock style={styles.skeletonSummaryShort} />
        <SkeletonBlock style={styles.skeletonTimeRow} />
      </View>
    </Animated.View>
  );
}

function ActivityCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <ActivityCardSkeleton key={index} isLast={index === count - 1} />
      ))}
    </View>
  );
}

function ActivityCard({
  activity,
  isLast,
}: {
  activity: ActivityData;
  isLast: boolean;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const lockRouter = useRouterLock();
  const article = activity.article;
  const active = isActivityActive(activity.startTime, activity.endTime);
  const coverUrl =
    article?.cover ||
    (article?.images?.[0] ? getImageUrl(article.images[0], "large") : "") ||
    activity.decoration?.imageUrl ||
    "";
  const title = activity.name || article?.title || "";
  const summary = getSummaryText(article?.summary, activity.description);
  const dateRange = `${formatActivityDate(activity.startTime)}-${formatActivityDate(
    activity.endTime,
  )}`;

  const handlePress = () => {
    if (!article?.id) return;

    lockRouter(() => {
      router.push({
        pathname: "/article/[id]",
        params: { id: String(article.id) },
      });
    });
  };

  return (
    <Pressable
      disabled={!article?.id}
      onPress={handlePress}
      style={[
        styles.card,
        { borderBottomColor: theme.border },
        isLast && styles.lastCard,
      ]}
    >
      <View style={styles.coverWrap}>
        <AsyncImage source={coverUrl} contentFit="cover" style={styles.cover} />
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: active ? ACTIVE_BADGE_COLOR : theme.muted,
            },
          ]}
        >
          <ThemedText
            color={active ? "#FFFFFF" : theme.mutedForeground}
            size={11}
            fontWeight="600"
          >
            {active ? t("activityStatus.active") : t("activityStatus.ended")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <ThemedText
          size={16}
          fontWeight="600"
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </ThemedText>

        {summary ? (
          <ThemedText
            size={14}
            color={theme.secondary}
            numberOfLines={2}
            style={styles.summaryText}
          >
            {summary}
          </ThemedText>
        ) : (
          <View style={styles.summaryText} />
        )}

        <View
          style={[
            styles.timeRow,
            {
              backgroundColor: active ? "#e6fbf3" : theme.muted,
            },
          ]}
        >
          <Clock
            size={16}
            color={active ? ACTIVE_BADGE_COLOR : theme.mutedForeground}
          />
          <ThemedText
            size={12}
            fontWeight="500"
            color="black"
            numberOfLines={1}
            style={styles.timeText}
          >
            {dateRange}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const MemoActivityCard = memo(ActivityCard);

export default function ActivityScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const [data, setData] = useState<ActivityData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchActivities = useCallback(async (isRefresh = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (isRefresh) {
      setRefreshing(true);
      pageRef.current = 1;
      hasMoreRef.current = true;
      setHasMore(true);
    } else if (!hasMoreRef.current) {
      loadingRef.current = false;
      return;
    } else {
      setLoadingMore(true);
    }

    try {
      const { data: responseData } =
        await api.decorationControllerFindAllActivities(
          undefined,
          undefined,
          pageRef.current,
          PAGE_LIMIT,
        );
      const newData = responseData.data.data ?? [];

      setData((current) => {
        if (isRefresh) {
          return newData;
        }

        const existingIds = new Set(current.map((item) => item.id));
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.id),
        );
        return [...current, ...uniqueNewData];
      });

      const totalPages = responseData.data.meta?.totalPages;
      const nextHasMore =
        typeof totalPages === "number"
          ? pageRef.current < totalPages
          : newData.length >= PAGE_LIMIT;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);

      if (newData.length > 0) {
        pageRef.current += 1;
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      loadingRef.current = false;
      setRefreshing(false);
      setLoadingMore(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    const task = setTimeout(() => {
      fetchActivities(true);
    }, 0);
    return () => clearTimeout(task);
  }, [fetchActivities]);

  const onRefresh = useCallback(() => {
    fetchActivities(true);
  }, [fetchActivities]);

  const onEndReached = useCallback(() => {
    if (refreshing || loadingRef.current) return;
    fetchActivities(false);
  }, [fetchActivities, refreshing]);

  const renderItem: ListRenderItem<ActivityData> = useCallback(
    ({ item, index }) => (
      <MemoActivityCard activity={item} isLast={index === data.length - 1} />
    ),
    [data.length],
  );

  const keyExtractor = useCallback((item: ActivityData, index: number) => {
    return item.id ? String(item.id) : `activity-${index}`;
  }, []);

  if (initialLoading) {
    return <ActivityCardSkeletonList count={3} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      showsVerticalScrollIndicator={false}
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
            allLoadedText={t("allLoadedActivities")}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 12,
  },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
  },
  card: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  coverWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eef1f7",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: 30,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    paddingTop: 14,
  },
  title: {
    lineHeight: 16,
  },
  summaryText: {
    marginTop: 4,
    lineHeight: 24,
  },
  timeRow: {
    marginTop: 8,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    flex: 1,
  },
  skeletonBlock: {
    backgroundColor: "#eef1f7",
    borderRadius: 6,
  },
  skeletonCoverWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
  },
  skeletonCover: {
    width: "100%",
    height: "100%",
  },
  skeletonStatusBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 72,
    height: 30,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 8,
  },
  skeletonTitle: {
    width: "86%",
    height: 16,
  },
  skeletonSummary: {
    width: "94%",
    height: 14,
    marginTop: 12,
  },
  skeletonSummaryShort: {
    width: "68%",
    height: 14,
    marginTop: 8,
  },
  skeletonTimeRow: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    marginTop: 8,
  },
});
