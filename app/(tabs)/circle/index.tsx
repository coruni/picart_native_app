import { api, ArticleControllerFindAll200Response } from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getCachedArticles, setCachedArticles } from "@/lib/articleStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { CirclePostSort, HERO_HEIGHT, useCircleContext } from "./_layout";

type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];

const PAGE_SIZE = 20;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<ArticleData>,
);

interface ArticleListProps {
  categoryId: number;
  sortMode: CirclePostSort;
  scrollY: Animated.Value;
  heroMinHeight: number;
}

const ArticleList = React.memo(function ArticleList({
  categoryId,
  sortMode,
  scrollY,
  heroMinHeight,
}: ArticleListProps) {
  const cacheKey = `circle:${categoryId}:${sortMode}`;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { registerScrollToTop, unregisterScrollToTop } = useCircleContext();
  const [articles, setArticles] = useState<ArticleData[]>(
    () => getCachedArticles(cacheKey) ?? [],
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(
    () => !getCachedArticles(cacheKey),
  );
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const flatListRef = useRef<FlatList<ArticleData>>(null);

  const fetchArticles = useCallback(
    async (isRefresh = false) => {
      if (!categoryId || loadingRef.current) return;
      if (isRefresh) {
        pageRef.current = 1;
        hasMoreRef.current = true;
        setRefreshing(true);
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
          pageRef.current += 1;
        } else {
          if (isRefresh) setArticles([]);
          hasMoreRef.current = false;
        }
      } catch (e) {
        console.error("fetchArticles:", e);
      } finally {
        loadingRef.current = false;
        if (isRefresh) setRefreshing(false);
        else setLoadingMore(false);
        setInitialLoading(false);
      }
    },
    [categoryId, cacheKey, sortMode],
  );

  useEffect(() => {
    const cached = getCachedArticles(cacheKey);
    if (cached) {
      setArticles(cached);
      setInitialLoading(false);
    } else {
      setArticles([]);
      setInitialLoading(true);
    }

    // 分类或排序切换后，总是重新请求一次，确保服务端排序生效
    fetchArticles(true);
  }, [fetchArticles, cacheKey]);

  useEffect(() => {
    registerScrollToTop(categoryId, () => {
      const listRef = flatListRef.current as any;
      if (listRef?.scrollToOffset) {
        listRef.scrollToOffset({ offset: 0, animated: true });
        return;
      }
      if (listRef?.getNode?.()?.scrollToOffset) {
        listRef.getNode().scrollToOffset({ offset: 0, animated: true });
      }
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
      style={StyleSheet.absoluteFill}
      contentContainerStyle={styles.listContainer}
      data={articles}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={() => <View style={{ height: HERO_HEIGHT }} />}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={10}
      onEndReached={() => {
        if (!loadingRef.current && !refreshing) fetchArticles(false);
      }}
      onEndReachedThreshold={200}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchArticles(true)}
          progressViewOffset={HERO_HEIGHT}
        />
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
      ListFooterComponent={<ListFooterLoadingComponent loading={loadingMore} />}
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
    scrollY,
    heroMinHeight,
  } = useCircleContext();

  const routes = childCategories.map((c) => ({
    key: String(c.id),
    title: c.name,
  }));

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => (
      <ArticleList
        categoryId={Number(route.key)}
        sortMode={postSort}
        scrollY={scrollY}
        heroMinHeight={heroMinHeight}
      />
    ),
    [postSort, scrollY, heroMinHeight],
  );

  if (routes.length === 0) {
    return <View style={styles.flex1} />;
  }

  return (
    <TabView
      style={styles.flex1}
      navigationState={{ index: selectedChildIndex, routes }}
      renderScene={renderScene}
      renderTabBar={() => null}
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
    paddingBottom: 24,
  },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
