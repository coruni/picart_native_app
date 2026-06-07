import { CategoryControllerFindAll200ResponseDataDataInner } from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
  getCachedCategories,
  prefetchCategories,
  subscribeCategories,
} from "@/store/categoryStore";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, useFocusEffect } from "expo-router";
import { setStatusBarStyle, setStatusBarTranslucent } from "expo-status-bar";
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
  const insets = useSafeAreaInsets();
  const initialParentCategories = useMemo(
    () => getCachedCategories() ?? [],
    [],
  );

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      setStatusBarTranslucent(true);
      return () => {
        setStatusBarStyle(isDark ? "light" : "dark");
        setStatusBarTranslucent(false);
      };
    }, [isDark]),
  );

  const HERO_MIN_HEIGHT = insets.top + 68 + CHILD_TAB_HEIGHT;
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

  const heroAnimHeight = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE],
    outputRange: [HERO_HEIGHT, HERO_MIN_HEIGHT],
    extrapolate: "clamp",
  });

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

  const cover = selectedParent?.cover ?? selectedParent?.background ?? "";

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
            ? (result.background ??
              result.primary ??
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

  const { width: windowWidth } = useWindowDimensions();

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

  const heroMaskColors = useMemo<readonly [string, string, string]>(
    () => [
      withAlpha(heroMaskBaseColor, 0.5),
      withAlpha(heroMaskBaseColor, 0.3),
      withAlpha(heroAccentColor, 0),
    ],
    [heroMaskBaseColor, heroAccentColor],
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
        {/* 内容层（TabView 填满屏幕，hero 绝对浮层覆盖其上） */}
        <Slot />

        {/* Hero 浮层 */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.hero,
            { height: heroAnimHeight, backgroundColor: heroAccentColor },
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
                    outputRange: [1, 1.25],
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
              {selectedParent?.name ?? "圈子"}
            </ThemedText>
          </Animated.View>

          {/* 子分类 Tab 栏（固定在 hero 底部） */}
          {childCategories.length > 0 && (
            <View
              pointerEvents="box-none"
              style={[styles.heroChildTabsBar, { backgroundColor: theme.card }]}
            >
              <View style={styles.childTabsRow}>
                <TabBar
                  navigationState={{
                    index: selectedChildIndex,
                    routes: childRoutes,
                  }}
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
                  layout={{ width: windowWidth - 72, height: CHILD_TAB_HEIGHT }}
                  scrollEnabled
                  style={[styles.childTabBar, { backgroundColor: theme.card }]}
                  tabStyle={styles.childTabStyle}
                  renderIndicator={({ getTabWidth }) => {
                    const pos = tabViewPositionRef.current ?? childTabIndexAnim;
                    const inputRange = childRoutes.map((_, i) => i);
                    const outputRange = inputRange.map((i) => {
                      let offset = 0;
                      for (let j = 0; j < i; j++) offset += getTabWidth(j);
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
                          { transform: [{ translateX }] },
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
                          color={isFocused ? colors.primary : theme.secondary}
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
                    {postSort === "latest" ? "最新" : "最热"}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </CircleContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    justifyContent: "flex-end",
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
    ...StyleSheet.absoluteFillObject,
    top: Math.round(HERO_HEIGHT * 0.4),
  },
  heroBlurLayer: {
    ...StyleSheet.absoluteFillObject,
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
  heroChildTabsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: CHILD_TAB_HEIGHT,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
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
  },
  childTabButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 10,
    paddingRight: 12,
    height: "100%",
  },
  childTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },
});
