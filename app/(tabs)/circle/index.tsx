import { api, ArticleControllerFindAll200Response } from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import ArticleCardSkeletonList from "@/components/article/ArticleCardSkeleton";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getCachedArticles, setCachedArticles } from "@/store/articleStore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { CHILD_TAB_HEIGHT, CirclePostSort, useCircleContext } from "./_layout";

type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];

const PAGE_SIZE = 20;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<ArticleData>,
);

interface ArticleListProps {
  categoryId: number;
  sortMode: CirclePostSort;
}

const ArticleList = React.memo(function ArticleList({
  categoryId,
  sortMode,
}: ArticleListProps) {
  const cacheKey = `circle:${categoryId}:${sortMode}`;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { registerScrollToTop, unregisterScrollToTop } = useCircleContext();
  const initialCachedArticles = useMemo(
    () => getCachedArticles(cacheKey),
    [cacheKey],
  );
  const [articles, setArticles] = useState<ArticleData[]>(
    () => initialCachedArticles ?? [],
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(
    () => !initialCachedArticles,
  );
  const [hasMore, setHasMore] = useState(
    () => (initialCachedArticles?.length ?? PAGE_SIZE) >= PAGE_SIZE,
  );
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const initialLoadingRef = useRef(initialLoading);
  const flatListRef = useRef<FlatList<ArticleData>>(null);

  const updateHasMore = useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  const fetchArticles = useCallback(
    async (isRefresh = false) => {
      if (!categoryId || loadingRef.current) return;
      if (isRefresh) {
        pageRef.current = 1;
        updateHasMore(true);
        if (!initialLoadingRef.current) setRefreshing(true);
      } else if (!hasMoreRef.current) {
        return;
      } else {
        setLoadingMore(true);
      }
      loadingRef.current = true;
      try {
        const { data: res } = await api.articleControllerFindAll(
          pageRef.current,
          PAGE_SIZE,
          undefined,
          categoryId,
          sortMode,
        );
        const list = res.data.data ?? [];
        if (list.length > 0) {
          setArticles((prev) => {
            if (isRefresh) return list;
            const ids = new Set(prev.map((a) => a.id));
            return [...prev, ...list.filter((a) => !ids.has(a.id))];
          });
          if (isRefresh) setCachedArticles(cacheKey, list);
          if (list.length < PAGE_SIZE) {
            updateHasMore(false);
          }
          pageRef.current += 1;
        } else {
          if (isRefresh) {
            setArticles([]);
            setCachedArticles(cacheKey, []);
          }
          updateHasMore(false);
        }
      } catch (e) {
        console.error("fetchArticles:", e);
      } finally {
        loadingRef.current = false;
        if (isRefresh) setRefreshing(false);
        else setLoadingMore(false);
        initialLoadingRef.current = false;
        setInitialLoading(false);
      }
    },
    [categoryId, cacheKey, sortMode, updateHasMore],
  );

  useEffect(() => {
    const task = setTimeout(() => {
      fetchArticles(true);
    }, 0);
    return () => clearTimeout(task);
  }, [fetchArticles]);

  useEffect(() => {
    registerScrollToTop(categoryId, () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return () => unregisterScrollToTop(categoryId);
  }, [categoryId, registerScrollToTop, unregisterScrollToTop]);

  const renderItem: ListRenderItem<ArticleData> = useCallback(
    ({ item, index }) => (
      <ArticleCard data={item as any} isLast={index === articles.length - 1} />
    ),
    [articles.length],
  );

  const keyExtractor = useCallback(
    (item: ArticleData) => item.id.toString(),
    [],
  );

  return (
    <AnimatedFlatList
      ref={flatListRef as any}
      style={styles.flex1}
      contentContainerStyle={[
        styles.listContainer,
        { paddingBottom: CHILD_TAB_HEIGHT + 16 },
      ]}
      data={articles}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={10}
      onEndReached={() => {
        if (articles.length > 0 && !loadingRef.current && !refreshing) {
          fetchArticles(false);
        }
      }}
      onEndReachedThreshold={1}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      nestedScrollEnabled
      bounces
      alwaysBounceVertical
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchArticles(true)}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
      ListEmptyComponent={
        initialLoading ? (
          <ArticleCardSkeletonList count={5} />
        ) : (
          <View style={styles.emptyWrap}>
            <ThemedText size={14} color={theme.secondary}>
              {t("noContent")}
            </ThemedText>
          </View>
        )
      }
      ListFooterComponent={
        articles.length > 0 ? (
          <ListFooterLoadingComponent loading={loadingMore} hasMore={hasMore} />
        ) : null
      }
    />
  );
});

export default function CircleIndex() {
  const layout = useWindowDimensions();
  const {
    childCategories,
    selectedChildIndex,
    setSelectedChildIndex,
    postSort,
    tabViewPositionRef,
  } = useCircleContext();

  const routes = childCategories.map((c) => ({
    key: String(c.id),
    title: c.name,
  }));

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => (
      <ArticleList
        key={`${route.key}:${postSort}`}
        categoryId={Number(route.key)}
        sortMode={postSort}
      />
    ),
    [postSort],
  );

  if (routes.length === 0) {
    return <View style={styles.flex1} />;
  }

  return (
    <TabView
      style={styles.flex1}
      navigationState={{ index: selectedChildIndex, routes }}
      renderScene={renderScene}
      renderTabBar={(props) => {
        tabViewPositionRef.current = props.position;
        return null;
      }}
      onIndexChange={(index) => {
        setSelectedChildIndex(index);
      }}
      initialLayout={{ width: layout.width }}
      swipeEnabled
    />
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  listContainer: {
    paddingVertical: 12,
  },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
