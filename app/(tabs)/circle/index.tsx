import { api, ArticleControllerFindAll200Response } from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { HERO_HEIGHT, useCircleContext } from "./_layout";

type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];

const PAGE_SIZE = 20;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<ArticleData>,
);

interface ArticleListProps {
  categoryId: number;
  scrollY: Animated.Value;
  heroMinHeight: number;
}

const ArticleList = React.memo(function ArticleList({
  categoryId,
  scrollY,
  heroMinHeight,
}: ArticleListProps) {
  const { theme } = useTheme();
  const { registerScrollToTop, unregisterScrollToTop } = useCircleContext();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
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
      }
      loadingRef.current = true;
      try {
        const { data: res } = await api.articleControllerFindAll(
          pageRef.current,
          PAGE_SIZE,
          undefined,
          categoryId,
        );
        const list = res.data.data ?? [];
        if (list.length > 0) {
          setArticles((prev) => {
            if (isRefresh) return list;
            const ids = new Set(prev.map((a) => a.id));
            return [...prev, ...list.filter((a) => !ids.has(a.id))];
          });
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
      }
    },
    [categoryId],
  );

  useEffect(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  useEffect(() => {
    registerScrollToTop(categoryId, () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return () => unregisterScrollToTop(categoryId);
  }, [categoryId, registerScrollToTop, unregisterScrollToTop]);

  const renderItem: ListRenderItem<ArticleData> = useCallback(
    ({ item }) => <ArticleCard data={item as any} />,
    [],
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
      onEndReachedThreshold={0.5}
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
          progressViewOffset={heroMinHeight}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <ThemedText size={14} color={theme.secondary}>
            暂无内容
          </ThemedText>
        </View>
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
        scrollY={scrollY}
        heroMinHeight={heroMinHeight}
      />
    ),
    [scrollY, heroMinHeight],
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
        scrollY.setValue(0);
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
