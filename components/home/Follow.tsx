import {
  api,
  ArticleControllerFindAll200Response,
  ArticleControllerFindAllTypeEnum,
} from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import ArticleCardSkeletonList from "@/components/article/ArticleCardSkeleton";
import FollowTopics from "@/components/home/FollowTopics";
import { useRegisterScrollToTop } from "@/components/home/HomeScrollContext";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];

export default function FollowScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const listRef = useRef<FlatList<ArticleData>>(null);
  const limit = 20;

  const [data, setData] = useState<ArticleData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [topicsRefreshSignal, setTopicsRefreshSignal] = useState(0);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!isLoggedIn || loadingRef.current) return;
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
        const { data: res } = await api.articleControllerFindAll(
          pageRef.current,
          limit,
          undefined,
          undefined,
          ArticleControllerFindAllTypeEnum.Following,
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
          setHasMore(false);
        }
      } catch (e) {
        console.error("FollowScreen fetchData:", e);
      } finally {
        loadingRef.current = false;
        if (isRefresh) setRefreshing(false);
        else setLoadingMore(false);
        setInitialLoading(false);
      }
    },
    [isLoggedIn],
  );

  useEffect(() => {
    if (!isLoggedIn) return;

    const task = setTimeout(() => {
      fetchData(true);
    }, 0);

    return () => clearTimeout(task);
  }, [fetchData, isLoggedIn]);

  const onRefresh = useCallback(() => {
    setTopicsRefreshSignal((current) => current + 1);
    fetchData(true);
  }, [fetchData]);
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

  useRegisterScrollToTop("follow", () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  });

  if (!isLoggedIn) {
    return (
      <View style={[styles.loginWrap, { backgroundColor: theme.background }]}>
        <ThemedText size={15} color={theme.secondary} style={styles.loginText}>
          {t("loginToViewFollow")}
        </ThemedText>
        <Pressable
          style={[styles.loginBtn, { backgroundColor: theme.primary + "26" }]}
          onPress={() => router.push("/auth")}
        >
          <ThemedText size={15} color={theme.primary}>
            {t("goLogin")}
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  if (initialLoading) {
    return <ArticleCardSkeletonList count={5} />;
  }

  return (
    <FlatList
      ref={listRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
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
      ListHeaderComponent={
        <FollowTopics refreshSignal={topicsRefreshSignal} />
      }
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
  container: {
    paddingVertical: 12,
  },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
  },
  loginWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loginText: {
    textAlign: "center",
  },
  loginBtn: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
