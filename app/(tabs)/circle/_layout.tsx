import { CategoryControllerFindAll200ResponseDataDataInner } from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  getCachedCategories,
  prefetchCategories,
  subscribeCategories,
} from "@/store/categoryStore";
import {
  NestedScrollEvent,
  NestedScrollView,
  NestedScrollViewHeader,
} from "@sdcx/nested-scroll";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowUpDown, Search } from "lucide-react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import ImageColors, { type ImageColorsResult } from "react-native-image-colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TabBar } from "react-native-tab-view";

type ParentCategory = CategoryControllerFindAll200ResponseDataDataInner;
type ChildCategory = ParentCategory["children"][number];
export type CirclePostSort = "latest" | "popular";

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

export const HERO_HEIGHT = 208;
export const CHILD_TAB_HEIGHT = 40;
const CONTENT_TOP_RADIUS = 20;

export interface CircleContextType {
  childCategories: ChildCategory[];
  selectedChildIndex: number;
  setSelectedChildIndex: React.Dispatch<React.SetStateAction<number>>;
  postSort: CirclePostSort;
  togglePostSort: () => void;
  scrollY: Animated.Value;
  heroMinHeight: number;
  registerScrollToTop: (categoryId: string | number, fn: () => void) => void;
  unregisterScrollToTop: (categoryId: string | number) => void;
  /** TabView 实时手势 position，由 CircleIndex renderTabBar 写入 */
  tabViewPositionRef: React.MutableRefObject<Animated.AnimatedInterpolation<number> | null>;
}

export const CircleContext = createContext<CircleContextType | null>(null);

export function useCircleContext(): CircleContextType {
  const ctx = useContext(CircleContext);
  if (!ctx)
    throw new Error("useCircleContext must be used within CircleLayout");
  return ctx;
}

export default function CircleLayout() {
  const { theme, colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const initialParentCategories = useMemo(
    () => getCachedCategories() ?? [],
    [],
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("light");
      // setStatusBarTranslucent(true);
      return () => {
        StatusBar.setStyle(isDark ? "light" : "dark");
        // setStatusBarTranslucent(false);
      };
    }, [isDark]),
  );

  const HERO_MIN_HEIGHT = insets.top + 68;
  const COLLAPSE_RANGE = HERO_HEIGHT - HERO_MIN_HEIGHT;

  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    () => initialParentCategories,
  );
  const [selectedParentId, setSelectedParentId] = useState<number | null>(
    () => initialParentCategories[0]?.id ?? null,
  );
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [postSort, setPostSort] = useState<CirclePostSort>("latest");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [heroAccentColor, setHeroAccentColor] = useState<string>(theme.muted);
  const childTabIndexAnim = useRef(new Animated.Value(0)).current;

  const scrollY = useRef(new Animated.Value(0)).current;
  const parentScrollRef = useRef<ScrollView>(null);
  const itemPositionsRef = useRef<Record<number, number>>({});
  const avatarAnims = useRef<Map<number, Animated.Value>>(new Map());

  const getAvatarAnim = useCallback((id: number): Animated.Value => {
    if (!avatarAnims.current.has(id)) {
      avatarAnims.current.set(id, new Animated.Value(0));
    }
    return avatarAnims.current.get(id)!;
  }, []);

  const scrollToTopFnsRef = useRef<Map<string, () => void>>(new Map());
  const tabViewPositionRef =
    useRef<Animated.AnimatedInterpolation<number> | null>(null);

  const registerScrollToTop = useCallback(
    (categoryId: string | number, fn: () => void) => {
      scrollToTopFnsRef.current.set(String(categoryId), fn);
    },
    [],
  );

  const unregisterScrollToTop = useCallback((categoryId: string | number) => {
    scrollToTopFnsRef.current.delete(String(categoryId));
  }, []);

  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      setIsCollapsed(value > COLLAPSE_RANGE * 0.5);
    });
    return () => scrollY.removeListener(id);
  }, [scrollY, COLLAPSE_RANGE]);

  useEffect(() => {
    Animated.spring(childTabIndexAnim, {
      toValue: selectedChildIndex,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  }, [selectedChildIndex, childTabIndexAnim]);

  const heroContentOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const tabsRowOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE * 0.45],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_RANGE * 0.35, COLLAPSE_RANGE * 0.75],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const selectedParent = useMemo(
    () => parentCategories.find((p) => p.id === selectedParentId) ?? null,
    [parentCategories, selectedParentId],
  );

  const childCategories = useMemo<ChildCategory[]>(
    () => selectedParent?.children ?? [],
    [selectedParent],
  );

  const cover = selectedParent?.background ?? "";

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
        if (!cancelled) {
          setHeroAccentColor(theme.muted);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cover, theme.muted]);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const heroSpacerHeight = Math.max(
    HERO_HEIGHT - HERO_MIN_HEIGHT - CONTENT_TOP_RADIUS,
    0,
  );
  const scrollViewportHeight = Math.max(windowHeight - HERO_MIN_HEIGHT, 1);
  const tabViewMinHeight = Math.max(scrollViewportHeight - CHILD_TAB_HEIGHT, 1);

  const childRoutes = useMemo(
    () => childCategories.map((c) => ({ key: String(c.id), title: c.name })),
    [childCategories],
  );

  const handleCollapsedAvatarClick = useCallback(() => {
    const activeCategoryId = childCategories[selectedChildIndex]?.id;
    if (activeCategoryId) {
      scrollToTopFnsRef.current.get(String(activeCategoryId))?.();
    }
  }, [childCategories, selectedChildIndex]);
  const applyCategories = useCallback((data: ParentCategory[]) => {
    setParentCategories((prev) => {
      if (prev.length === 0 && data.length > 0) {
        setSelectedParentId(data[0].id);
        setSelectedChildIndex(0);
      }
      return data;
    });
  }, []);

  useEffect(() => {
    // 订阅 store 更新（其他地方刷新后自动同步）
    const unsub = subscribeCategories(applyCategories);
    // 若缓存已有数据，直接应用；否则触发加载
    const cached = getCachedCategories();
    if (cached && cached.length > 0) {
      applyCategories(cached);
    } else {
      prefetchCategories();
    }
    return unsub;
  }, [applyCategories]);

  useEffect(() => {
    if (parentCategories.length === 0) return;
    const selectedExists = parentCategories.some(
      (item) => item.id === selectedParentId,
    );
    if (!selectedExists) {
      setSelectedParentId(parentCategories[0].id);
      setSelectedChildIndex(0);
    }
  }, [parentCategories, selectedParentId]);

  useEffect(() => {
    childTabIndexAnim.setValue(0);
  }, [selectedParentId, childTabIndexAnim]);

  useEffect(() => {
    if (!parentCategories.length) return;
    const animations = parentCategories.map((item) => {
      const anim = getAvatarAnim(item.id);
      return Animated.spring(anim, {
        toValue: item.id === selectedParentId ? 1 : 0,
        useNativeDriver: true,
        tension: 200,
        friction: 15,
      });
    });
    Animated.parallel(animations).start();
  }, [selectedParentId, parentCategories, getAvatarAnim]);

  const onPressParent = useCallback((item: ParentCategory) => {
    setSelectedParentId(item.id);
    setSelectedChildIndex(0);
    const x = itemPositionsRef.current[item.id];
    if (x != null) {
      parentScrollRef.current?.scrollTo({
        x: Math.max(0, x - 16),
        animated: true,
      });
    }
  }, []);

  const onPressChild = useCallback((index: number) => {
    setSelectedChildIndex(index);
  }, []);

  const togglePostSort = useCallback(() => {
    setPostSort((prev) => (prev === "latest" ? "popular" : "latest"));
  }, []);

  const heroBlurOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE * 0.85],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const heroMaskBaseColor = useMemo(
    () => toDarkTone(heroAccentColor),
    [heroAccentColor],
  );

  const heroMaskColors = useMemo<readonly [string, string, string]>(() => {
    // 有背景图时从图片提取的颜色生成遮罩；没有图片时回退到默认黑色透明
    const baseColor = cover ? heroMaskBaseColor : "#000000";
    const accentColor = cover ? heroAccentColor : "#000000";
    return [
      withAlpha(baseColor, 0.48),
      withAlpha(baseColor, 0.24),
      withAlpha(accentColor, 0),
    ];
  }, [cover, heroMaskBaseColor, heroAccentColor]);

  const handleHeaderScroll = useCallback(
    (event: NestedScrollEvent) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollY.setValue(Math.max(offsetY, 0));
    },
    [scrollY],
  );

  const contextValue = useMemo<CircleContextType>(
    () => ({
      childCategories,
      selectedChildIndex,
      scrollY,
      setSelectedChildIndex,
      postSort,
      togglePostSort,
      heroMinHeight: HERO_MIN_HEIGHT,
      registerScrollToTop,
      unregisterScrollToTop,
      tabViewPositionRef,
    }),

    [
      childCategories,
      selectedChildIndex,
      scrollY,
      postSort,
      togglePostSort,
      HERO_MIN_HEIGHT,
      registerScrollToTop,
      unregisterScrollToTop,
      tabViewPositionRef,
    ],
  );

  return (
    <CircleContext.Provider value={contextValue}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.card }]}
        edges={["left", "right", "bottom"]}
      >
        {/* 内容层（TabBar 放入 NestedScrollViewHeader，和 Profile 使用同一套结构） */}
        <View
          style={[
            styles.circleContentShell,
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
              stickyHeaderHeight={
                childCategories.length > 0 ? CHILD_TAB_HEIGHT : 0
              }
            >
              <View style={{ height: heroSpacerHeight }} />
              {childCategories.length > 0 && (
                <View
                  pointerEvents="box-none"
                  style={[
                    styles.childTabSurface,
                    {
                      backgroundColor: theme.card,
                      borderTopLeftRadius: CONTENT_TOP_RADIUS,
                      borderTopRightRadius: CONTENT_TOP_RADIUS,
                    },
                  ]}
                >
                  <View style={styles.childTabsRow}>
                    <TabBar
                      navigationState={{
                        index: selectedChildIndex,
                        routes: childRoutes,
                      }}
                      scrollEnabled
                      position={
                        (tabViewPositionRef.current ??
                          childTabIndexAnim) as Animated.AnimatedInterpolation<number>
                      }
                      onTabPress={({ route }) => {
                        const idx = childRoutes.findIndex(
                          (r) => r.key === route.key,
                        );
                        if (idx !== -1) onPressChild(idx);
                      }}
                      jumpTo={(key) => {
                        const idx = childRoutes.findIndex((r) => r.key === key);
                        if (idx !== -1) onPressChild(idx);
                      }}
                      layout={{
                        width: windowWidth - 72,
                        height: CHILD_TAB_HEIGHT,
                      }}
                      style={[
                        styles.childTabBar,
                        { backgroundColor: theme.card },
                      ]}
                      tabStyle={styles.childTabStyle}
                      renderIndicator={({ getTabWidth }) => {
                        const pos =
                          tabViewPositionRef.current ?? childTabIndexAnim;
                        const inputRange = childRoutes.map((_, i) => i);
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
                              styles.childTabIndicator,
                              {
                                transform: [{ translateX }],
                                backgroundColor: theme.primary,
                              },
                            ]}
                          />
                        );
                      }}
                      renderTabBarItem={({ route, onPress, onLayout }) => {
                        const idx = childRoutes.findIndex(
                          (r) => r.key === route.key,
                        );
                        const isFocused = idx === selectedChildIndex;
                        return (
                          <Pressable
                            key={route.key}
                            onLayout={onLayout}
                            onPress={onPress}
                            style={styles.childTabButton}
                          >
                            <ThemedText
                              fontWeight="600"
                              color={
                                isFocused ? colors.primary : theme.secondary
                              }
                            >
                              {route.title}
                            </ThemedText>
                          </Pressable>
                        );
                      }}
                    />

                    <Pressable
                      onPress={togglePostSort}
                      style={styles.sortButton}
                      hitSlop={8}
                    >
                      <ArrowUpDown size={15} color={theme.secondary} />
                      <ThemedText
                        size={13}
                        color={theme.secondary}
                        fontWeight="600"
                      >
                        {postSort === "latest" ? t("sortLatest") : t("sortHot")}
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              )}
            </NestedScrollViewHeader>

            <View
              style={[
                styles.circleSlotWrap,
                { minHeight: tabViewMinHeight, backgroundColor: theme.card },
              ]}
            >
              <Slot />
            </View>
          </NestedScrollView>
        </View>

        {/* Hero 浮层 */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.hero,
            {
              backgroundColor: heroAccentColor,
            },
          ]}
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
                style={[styles.heroBlurLayer, { opacity: heroBlurOpacity }]}
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
            <LinearGradient
              pointerEvents="none"
              colors={heroMaskColors}
              locations={[0, 0.56, 1]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={styles.heroMaskLayer}
            />
          </View>

          {/* 父分类 Tab 行 */}
          <View
            pointerEvents="box-none"
            style={[styles.heroTabsRow, { paddingTop: insets.top + 6 }]}
          >
            <Animated.View
              pointerEvents={isCollapsed ? "none" : "auto"}
              style={{ opacity: tabsRowOpacity }}
            >
              <ScrollView
                ref={parentScrollRef}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.parentTabsContent}
              >
                {parentCategories.map((item) => {
                  const anim = getAvatarAnim(item.id);
                  const animScale = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  });
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => onPressParent(item)}
                      onLayout={(e) => {
                        itemPositionsRef.current[item.id] =
                          e.nativeEvent.layout.x;
                      }}
                      style={styles.tabButton}
                    >
                      <Animated.View
                        style={[
                          styles.parentAvatarWrapper,
                          { transform: [{ scale: animScale }] },
                        ]}
                      >
                        <AsyncImage
                          source={{ uri: item.avatar || "" }}
                          style={styles.parentAvatarImage}
                          transition={0}
                          cachePolicy="memory-disk"
                        />
                      </Animated.View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>

            {/* 折叠态：已选分类头像 + 名字 */}
            <Animated.View
              pointerEvents={isCollapsed ? "auto" : "none"}
              style={[
                styles.collapsedHeader,
                { paddingTop: insets.top + 12 },
                { opacity: collapsedHeaderOpacity },
              ]}
            >
              <Pressable
                style={styles.collapsedAvatarWrapper}
                onPress={() => handleCollapsedAvatarClick()}
              >
                {!!selectedParent?.avatar && (
                  <View style={styles.collapsedAvatar}>
                    <AsyncImage
                      source={{ uri: selectedParent.avatar }}
                      style={styles.collapsedAvatarImage}
                      transition={0}
                      cachePolicy="memory-disk"
                    />
                  </View>
                )}
                <ThemedText size={16} fontWeight="700" color="white">
                  {selectedParent?.name ?? ""}
                </ThemedText>
              </Pressable>
              <Animated.View>
                <Search size={22} color="white" />
              </Animated.View>
            </Animated.View>
          </View>

          {/* 标题（折叠时淡出） */}
          <Animated.View
            pointerEvents="none"
            style={[styles.heroContent, { opacity: heroContentOpacity }]}
          >
            <ThemedText size={24} color="white" fontWeight="700">
              {selectedParent?.name ?? t("circle")}
            </ThemedText>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </CircleContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  circleContentShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 2,
  },
  scrollLayer: {
    flex: 1,
  },
  nestedContent: {
    flexGrow: 1,
  },
  childTabSurface: {
    height: CHILD_TAB_HEIGHT,
    overflow: "hidden",
  },
  circleSlotWrap: {
    flexGrow: 1,
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
  heroMaskLayer: {
    ...StyleSheet.absoluteFill,
  },
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
  heroTabsRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: CHILD_TAB_HEIGHT,
    gap: 4,
    zIndex: 2,
  },
  parentTabsContent: {
    paddingHorizontal: 16,
    gap: 20,
    alignItems: "flex-start",
  },
  tabButton: {
    paddingVertical: 8,
    alignItems: "center",
    position: "relative",
  },
  collapsedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  collapsedAvatarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  collapsedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
  },
  collapsedAvatarImage: {
    width: "100%",
    height: "100%",
  },
  parentAvatarWrapper: {
    width: 32,
    height: 32,
    overflow: "hidden",
    borderRadius: 8,
  },
  parentAvatarActive: {
    width: 44,
    height: 44,
  },
  parentAvatarInactive: {
    width: 32,
    height: 32,
  },
  parentAvatarImage: {
    width: "100%",
    height: "100%",
  },
  childTabBar: {
    flex: 1,
    height: CHILD_TAB_HEIGHT,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  childTabStyle: {
    width: "auto",
    minWidth: 48,
  },
  childTabsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: CHILD_TAB_HEIGHT,
  },
  childTabButton: {
    height: CHILD_TAB_HEIGHT,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 10,
    paddingRight: 12,
    height: CHILD_TAB_HEIGHT,
  },
  childTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
  },
});
