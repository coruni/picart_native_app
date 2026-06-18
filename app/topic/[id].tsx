import type {
  ArticleControllerFindAll200Response,
  TagControllerFindAll200ResponseDataDataInner,
} from "@/api";
import { api, isAuthRedirectedError } from "@/api";
import ArticleCard from "@/components/article/ArticleCard";
import ArticleCardSkeletonList from "@/components/article/ArticleCardSkeleton";
import AsyncImage from "@/components/ui/AsyncImage";
import { ListFooterLoadingComponent } from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { getCachedArticles, setCachedArticles } from "@/store/articleStore";
import {
  NestedScrollEvent,
  NestedScrollView,
  NestedScrollViewHeader,
} from "@sdcx/nested-scroll";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Check,
  ChevronLeft,
  Forward,
  UserRoundPlus,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  Share,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import ImageColors, { type ImageColorsResult } from "react-native-image-colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

type TagDetail = TagControllerFindAll200ResponseDataDataInner;
type ArticleData = ArticleControllerFindAll200Response["data"]["data"][number];
type TopicSort = "popular" | "latest";

const PAGE_SIZE = 20;
const HERO_HEIGHT = 248;
const NAV_BAR_HEIGHT = 46; // navIcon(40) + 顶部留白(6)
const TAB_HEIGHT = 40;
const CONTENT_TOP_RADIUS = 20;
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<ArticleData>,
);

function formatCount(value?: number | null): string {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

function withAlpha(color: string, alpha: number): string {
  if (!color.startsWith("#")) return color;
  const normalized = color.slice(1);
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => part + part)
          .join("")
      : normalized.length === 8
        ? normalized.slice(0, 6)
        : normalized;
  if (expanded.length !== 6) return color;
  const red = parseInt(expanded.slice(0, 2), 16);
  const green = parseInt(expanded.slice(2, 4), 16);
  const blue = parseInt(expanded.slice(4, 6), 16);
  if ([red, green, blue].some(Number.isNaN)) return color;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function toDarkTone(color: string): string {
  if (!color.startsWith("#")) return "#0b0f14";
  const normalized = color.slice(1);
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => part + part)
          .join("")
      : normalized.length === 8
        ? normalized.slice(0, 6)
        : normalized;
  if (expanded.length !== 6) return "#0b0f14";
  const red = parseInt(expanded.slice(0, 2), 16);
  const green = parseInt(expanded.slice(2, 4), 16);
  const blue = parseInt(expanded.slice(4, 6), 16);
  if ([red, green, blue].some(Number.isNaN)) return "#0b0f14";
  const darkenFactor = 0.24;
  const toHex = (value: number) =>
    Math.round(value * darkenFactor)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

interface TopicArticleListProps {
  tagId: number;
  sortMode: TopicSort;
}

const TopicArticleList = React.memo(function TopicArticleList({
  tagId,
  sortMode,
}: TopicArticleListProps) {
  const cacheKey = `topic:${tagId}:${sortMode}`;
  const { theme } = useTheme();
  const { t } = useTranslation();
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

  const updateHasMore = useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  const fetchArticles = useCallback(
    async (isRefresh = false) => {
      if (!tagId || loadingRef.current) return;
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
          undefined,
          sortMode,
          tagId,
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
        console.error("fetchTopicArticles:", e);
      } finally {
        loadingRef.current = false;
        if (isRefresh) setRefreshing(false);
        else setLoadingMore(false);
        initialLoadingRef.current = false;
        setInitialLoading(false);
      }
    },
    [tagId, cacheKey, sortMode, updateHasMore],
  );

  useEffect(() => {
    const task = setTimeout(() => {
      fetchArticles(true);
    }, 0);
    return () => clearTimeout(task);
  }, [fetchArticles]);

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
      style={styles.flex1}
      contentContainerStyle={[
        styles.listContainer,
        { paddingBottom: TAB_HEIGHT + 16 },
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

export default function TopicScreen() {
  const { id, topic: topicParam } = useLocalSearchParams<{
    id: string;
    topic?: string;
  }>();
  const { theme, colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [tag, setTag] = useState<TagDetail | null>(() => {
    if (!topicParam) return null;
    try {
      return JSON.parse(topicParam) as TagDetail;
    } catch {
      return null;
    }
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [heroAccentColor, setHeroAccentColor] = useState<string>(theme.muted);

  const scrollY = useRef(new Animated.Value(0)).current;
  const tabViewPositionRef =
    useRef<Animated.AnimatedInterpolation<number> | null>(null);
  const tabIndexAnim = useRef(new Animated.Value(0)).current;

  const HERO_MIN_HEIGHT = insets.top + NAV_BAR_HEIGHT;
  const COLLAPSE_RANGE = HERO_HEIGHT - HERO_MIN_HEIGHT;

  const tagId = Number(id);
  const cover = tag?.background ?? "";
  const name = tag?.name ?? "";
  const description = tag?.description ?? "";
  const isFollowed = Boolean(tag?.isFollowed);

  const routes = useMemo(
    () => [
      { key: "popular", title: t("sortHot") },
      { key: "latest", title: t("sortLatest") },
    ],
    [t],
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("light");
      return () => {
        StatusBar.setStyle(isDark ? "light" : "dark");
      };
    }, [isDark]),
  );

  // 拉取话题详情刷新计数 / isFollowed
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data: res } = await api.tagControllerFindOne(String(id));
        if (!active) return;
        if (res?.data) setTag(res.data as TagDetail);
      } catch {
        // 静默失败，保留序列化传入的初值
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    const sub = scrollY.addListener(({ value }) => {
      setIsCollapsed(value > COLLAPSE_RANGE * 0.5);
    });
    return () => scrollY.removeListener(sub);
  }, [scrollY, COLLAPSE_RANGE]);

  useEffect(() => {
    Animated.spring(tabIndexAnim, {
      toValue: tabIndex,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  }, [tabIndex, tabIndexAnim]);

  // 背景图取色
  useEffect(() => {
    let cancelled = false;
    if (!cover) {
      setHeroAccentColor(theme.muted);
      return () => {
        cancelled = true;
      };
    }
    setHeroAccentColor(theme.muted);
    ImageColors.getColors(cover, {
      cache: true,
      key: cover,
      fallback: theme.muted,
    })
      .then((result: ImageColorsResult) => {
        if (cancelled) return;
        const nextColor =
          result.platform === "ios"
            ? (result.primary ??
              result.background ??
              result.secondary ??
              result.detail ??
              theme.muted)
            : (result.dominant ??
              result.vibrant ??
              result.muted ??
              result.darkMuted ??
              theme.muted);
        setHeroAccentColor(nextColor || theme.muted);
      })
      .catch(() => {
        if (!cancelled) setHeroAccentColor(theme.muted);
      });
    return () => {
      cancelled = true;
    };
  }, [cover, theme.muted]);

  const heroContentOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_RANGE * 0.35, COLLAPSE_RANGE * 0.75],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const heroMaskBaseColor = useMemo(
    () => toDarkTone(heroAccentColor),
    [heroAccentColor],
  );
  const heroMaskColors = useMemo<readonly [string, string, string]>(() => {
    const baseColor = cover ? heroMaskBaseColor : "#000000";
    const accentColor = cover ? heroAccentColor : "#000000";
    return [
      withAlpha(baseColor, 0.48),
      withAlpha(baseColor, 0.24),
      withAlpha(accentColor, 0),
    ];
  }, [cover, heroMaskBaseColor, heroAccentColor]);

  const heroSpacerHeight = Math.max(
    HERO_HEIGHT - HERO_MIN_HEIGHT - CONTENT_TOP_RADIUS,
    0,
  );
  const scrollViewportHeight = Math.max(windowHeight - HERO_MIN_HEIGHT, 1);
  const tabViewMinHeight = Math.max(scrollViewportHeight - TAB_HEIGHT, 1);

  const handleHeaderScroll = useCallback(
    (event: NestedScrollEvent) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollY.setValue(Math.max(offsetY, 0));
    },
    [scrollY],
  );

  const handleToggleFollow = useCallback(async () => {
    if (followLoading || !tag) return;
    const prev = isFollowed;
    const next = !prev;
    setTag((cur) =>
      cur
        ? {
            ...cur,
            isFollowed: next,
            followCount: Math.max(0, cur.followCount + (next ? 1 : -1)),
          }
        : cur,
    );
    setFollowLoading(true);
    try {
      if (next) await api.tagControllerFollow(String(id));
      else await api.tagControllerUnfollow(String(id));
    } catch (e) {
      if (isAuthRedirectedError(e)) return;
      setTag((cur) =>
        cur
          ? {
              ...cur,
              isFollowed: prev,
              followCount: Math.max(0, cur.followCount + (next ? -1 : 1)),
            }
          : cur,
      );
      toast.show(t("topic.followFailed"));
    } finally {
      setFollowLoading(false);
    }
  }, [followLoading, tag, isFollowed, id, t]);

  const handleShare = useCallback(async () => {
    try {
      const url = `${WEB_URL}/topic/${id}`;
      await Share.share({ message: url, url });
    } catch {
      // user cancelled
    }
  }, [id]);

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => (
      <TopicArticleList tagId={tagId} sortMode={route.key as TopicSort} />
    ),
    [tagId],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["left", "right", "bottom"]}
    >
      {/* 内容层 */}
      <View
        style={[
          styles.contentShell,
          {
            top: HERO_MIN_HEIGHT,
            borderTopLeftRadius: CONTENT_TOP_RADIUS,
            borderTopRightRadius: CONTENT_TOP_RADIUS,
          },
        ]}
      >
        <NestedScrollView
          bounces={false}
          style={styles.scrollLayer}
          contentContainerStyle={[
            styles.nestedContent,
            { minHeight: scrollViewportHeight },
          ]}
        >
          <NestedScrollViewHeader
            onScroll={handleHeaderScroll}
            stickyHeaderBeginIndex={1}
            stickyHeaderHeight={TAB_HEIGHT}
          >
            <View style={{ height: heroSpacerHeight }} />
            <View
              pointerEvents="box-none"
              style={[
                styles.tabSurface,
                {
                  backgroundColor: theme.card,
                  borderTopLeftRadius: CONTENT_TOP_RADIUS,
                  borderTopRightRadius: CONTENT_TOP_RADIUS,
                },
              ]}
            >
              <TabBar
                navigationState={{ index: tabIndex, routes }}
                position={
                  (tabViewPositionRef.current ??
                    tabIndexAnim) as Animated.AnimatedInterpolation<number>
                }
                onTabPress={({ route }) => {
                  const idx = routes.findIndex((r) => r.key === route.key);
                  if (idx !== -1) setTabIndex(idx);
                }}
                jumpTo={(key) => {
                  const idx = routes.findIndex((r) => r.key === key);
                  if (idx !== -1) setTabIndex(idx);
                }}
                layout={{ width: windowWidth, height: TAB_HEIGHT }}
                style={[styles.tabBar, { backgroundColor: theme.card }]}
                tabStyle={styles.tabStyle}
                renderIndicator={({ getTabWidth }) => {
                  const pos = tabViewPositionRef.current ?? tabIndexAnim;
                  const inputRange = routes.map((_, i) => i);
                  const outputRange = inputRange.map((i) => {
                    let offset = 0;
                    for (let j = 0; j < i; j++) {
                      offset += getTabWidth(j);
                    }
                    return offset + getTabWidth(i) / 2 - 10;
                  });
                  const translateX =
                    inputRange.length >= 2
                      ? pos.interpolate({ inputRange, outputRange })
                      : (outputRange[0] ?? 0);
                  return (
                    <Animated.View
                      style={[
                        styles.tabIndicator,
                        { transform: [{ translateX }] },
                      ]}
                    />
                  );
                }}
                renderTabBarItem={({ route, onPress, onLayout }) => {
                  const idx = routes.findIndex((r) => r.key === route.key);
                  const isFocused = idx === tabIndex;
                  return (
                    <Pressable
                      key={route.key}
                      onLayout={onLayout}
                      onPress={onPress}
                      style={styles.tabButton}
                    >
                      <ThemedText
                        fontWeight="600"
                        color={isFocused ? colors.primary : theme.secondary}
                      >
                        {route.title}
                      </ThemedText>
                    </Pressable>
                  );
                }}
              />
            </View>
          </NestedScrollViewHeader>

          <View
            style={[
              styles.slotWrap,
              { minHeight: tabViewMinHeight, backgroundColor: theme.card },
            ]}
          >
            <TabView
              style={styles.flex1}
              navigationState={{ index: tabIndex, routes }}
              renderScene={renderScene}
              renderTabBar={(props) => {
                tabViewPositionRef.current = props.position;
                return null;
              }}
              onIndexChange={setTabIndex}
              initialLayout={{ width: windowWidth }}
              swipeEnabled
            />
          </View>
        </NestedScrollView>
      </View>

      {/* Hero 浮层 */}
      <Animated.View
        pointerEvents="box-none"
        style={[styles.hero, { backgroundColor: theme.muted }]}
      >
        <View pointerEvents="none" style={styles.heroImageLayer}>
          {!!cover && (
            <AsyncImage
              source={cover}
              style={styles.heroCoverImage}
              contentFit="cover"
              showLoading={false}
              transition={0}
              cachePolicy="memory-disk"
            />
          )}
          {!!cover && (
            <Animated.View
              style={[styles.heroBlurLayer, { opacity: heroContentOpacity }]}
            >
              <AsyncImage
                source={cover}
                style={styles.heroCoverImage}
                contentFit="cover"
                showLoading={false}
                transition={0}
                blurRadius={24}
                cachePolicy="memory-disk"
              />
            </Animated.View>
          )}
          <Animated.View
            pointerEvents="none"
            style={[styles.heroMaskLayer, { opacity: heroContentOpacity }]}
          >
            <LinearGradient
              colors={heroMaskColors}
              locations={[0, 0.56, 1]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          {/* 上滑收起时渐显的 primary 覆盖层 */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroPrimaryLayer,
              { backgroundColor: colors.primary, opacity: collapsedHeaderOpacity },
            ]}
          />
        </View>

        {/* 固定顶部导航栏 */}
        <View
          pointerEvents="box-none"
          style={[
            styles.navBar,
            { height: HERO_MIN_HEIGHT, paddingTop: insets.top },
          ]}
        >
          {/* 收起态纯色背景层：展开时透明露出头图，收起时渐显形成吸顶栏 */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.navBarBackground,
              {
                height: HERO_MIN_HEIGHT,
                backgroundColor: colors.primary,
                opacity: collapsedHeaderOpacity,
              },
            ]}
          />

          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={styles.navIcon}
          >
            <ChevronLeft size={26} color="white" />
          </Pressable>

          <Animated.View
            pointerEvents="none"
            style={[styles.navTitle, { opacity: collapsedHeaderOpacity }]}
          >
            {!!tag?.avatar && (
              <View style={styles.navAvatar}>
                <AsyncImage
                  source={{ uri: tag.avatar }}
                  style={styles.fullSize}
                  transition={0}
                  cachePolicy="memory-disk"
                />
              </View>
            )}
            <ThemedText
              size={16}
              fontWeight="700"
              color="white"
              numberOfLines={1}
            >
              {name}
            </ThemedText>
          </Animated.View>

          <Pressable onPress={handleShare} hitSlop={8} style={styles.navIcon}>
            <Forward size={24} color="white" />
          </Pressable>
        </View>

        {/* 话题头部（折叠时淡出） */}
        <Animated.View
          pointerEvents={isCollapsed ? "none" : "box-none"}
          style={[styles.heroContent, { opacity: heroContentOpacity }]}
        >
          <View style={styles.heroInfoRow}>
            <View style={styles.topicAvatar}>
              <AsyncImage
                source={tag?.avatar || cover}
                style={styles.fullSize}
                contentFit="cover"
                transition={0}
                cachePolicy="memory-disk"
              />
            </View>
            <View style={styles.heroInfoText}>
              <ThemedText
                size={22}
                color="white"
                fontWeight="700"
                numberOfLines={1}
              >
                {name}
              </ThemedText>
              <ThemedText size={13} color="rgba(255,255,255,0.9)">
                {t("followTopics.meta", {
                  articles: formatCount(tag?.articleCount),
                  followers: formatCount(tag?.followCount),
                })}
              </ThemedText>
            </View>

            <Pressable
              disabled={followLoading}
              onPress={handleToggleFollow}
              style={[
                styles.followBtn,
                {
                  borderColor: "#fff",
                  backgroundColor: isFollowed ? "transparent" : colors.primary,
                  opacity: followLoading ? 0.6 : 1,
                },
              ]}
              hitSlop={6}
            >
              {followLoading ? (
                <ActivityIndicator size={14} color="#fff" />
              ) : isFollowed ? (
                <>
                  <Check size={15} color="#fff" strokeWidth={3} />
                  <ThemedText size={13} color="#fff" fontWeight="600">
                    {t("followsPage.followed")}
                  </ThemedText>
                </>
              ) : (
                <>
                  <UserRoundPlus size={15} color="#fff" />
                  <ThemedText size={13} color="#fff" fontWeight="600">
                    {t("article.follow")}
                  </ThemedText>
                </>
              )}
            </Pressable>
          </View>

          {!!description && (
            <ThemedText
              size={13}
              color="rgba(255,255,255,0.85)"
              numberOfLines={2}
              style={styles.heroDescription}
            >
              {description}
            </ThemedText>
          )}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },

  contentShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 2,
  },
  scrollLayer: { flex: 1 },
  nestedContent: { flexGrow: 1 },
  tabSurface: {
    height: TAB_HEIGHT,
    overflow: "hidden",
  },
  slotWrap: { flexGrow: 1 },

  listContainer: { paddingVertical: 12 },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    overflow: "hidden",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  heroImageLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    overflow: "hidden",
    zIndex: 0,
  },
  heroMaskLayer: { ...StyleSheet.absoluteFill },
  heroPrimaryLayer: { ...StyleSheet.absoluteFill },
  heroBlurLayer: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  heroCoverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
  },

  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    zIndex: 3,
  },
  navBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  navIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navAvatar: {
    width: 28,
    height: 28,
    borderRadius: 7,
    overflow: "hidden",
  },

  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginBottom: TAB_HEIGHT,
    gap: 10,
    zIndex: 2,
  },
  heroInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topicAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
  },
  heroInfoText: {
    flex: 1,
    gap: 4,
  },
  heroDescription: {
    lineHeight: 18,
  },
  fullSize: { width: "100%", height: "100%" },

  followBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 76,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },

  tabBar: {
    flex: 1,
    height: TAB_HEIGHT,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  tabStyle: {
    width: "auto",
    minWidth: 48,
  },
  tabButton: {
    height: TAB_HEIGHT,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },
});
