import { api, CategoryControllerFindAll200ResponseDataDataInner } from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Search } from "lucide-react-native";
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
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type ParentCategory = CategoryControllerFindAll200ResponseDataDataInner;
type ChildCategory = ParentCategory["children"][number];

export const HERO_HEIGHT = 208;
export const CHILD_TAB_HEIGHT = 44;

export interface CircleContextType {
  childCategories: ChildCategory[];
  selectedChildIndex: number;
  setSelectedChildIndex: React.Dispatch<React.SetStateAction<number>>;
  scrollY: Animated.Value;
  heroMinHeight: number;
  registerScrollToTop: (categoryId: number, fn: () => void) => void;
  unregisterScrollToTop: (categoryId: number) => void;
}

export const CircleContext = createContext<CircleContextType | null>(null);

export function useCircleContext(): CircleContextType {
  const ctx = useContext(CircleContext);
  if (!ctx)
    throw new Error("useCircleContext must be used within CircleLayout");
  return ctx;
}

export default function CircleLayout() {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const HERO_MIN_HEIGHT = insets.top + 68 + CHILD_TAB_HEIGHT;
  const COLLAPSE_RANGE = HERO_HEIGHT - HERO_MIN_HEIGHT;

  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    [],
  );
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [childTabLayouts, setChildTabLayouts] = useState<
    { x: number; width: number }[]
  >([]);
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

  const scrollToTopFnsRef = useRef<Map<number, () => void>>(new Map());

  const registerScrollToTop = useCallback(
    (categoryId: number, fn: () => void) => {
      scrollToTopFnsRef.current.set(categoryId, fn);
    },
    [],
  );

  const unregisterScrollToTop = useCallback((categoryId: number) => {
    scrollToTopFnsRef.current.delete(categoryId);
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

  const indicatorTranslateX = useMemo(() => {
    if (
      childCategories.length === 0 ||
      childTabLayouts.length < childCategories.length
    ) {
      return null;
    }
    if (childCategories.length === 1) {
      const layout = childTabLayouts[0];
      return layout ? layout.x + layout.width / 2 - 12 : null;
    }
    const inputRange = childCategories.map((_, i) => i);
    const outputRange = childCategories.map((_, i) => {
      const layout = childTabLayouts[i];
      return layout ? layout.x + layout.width / 2 - 12 : 0;
    });
    return childTabIndexAnim.interpolate({ inputRange, outputRange });
  }, [childTabLayouts, childCategories, childTabIndexAnim]);

  useEffect(() => {
    setChildTabLayouts([]);
  }, [childCategories]);
  const handleCollapsedAvatarClick = useCallback(() => {
    const activeCategoryId = childCategories[selectedChildIndex]?.id;
    if (activeCategoryId) {
      scrollToTopFnsRef.current.get(activeCategoryId)?.();
    }
  }, [childCategories, selectedChildIndex]);
  const fetchParentCategories = useCallback(async () => {
    try {
      const { data: res } = await api.categoryControllerFindAll(
        1,
        100,
        undefined,
        undefined,
        undefined,
        "sort",
        "asc",
      );
      const all = res.data.data ?? [];
      const roots = all.filter(
        (item) =>
          item.parentId === 0 ||
          item.parentId == null ||
          item.children.length > 0,
      );
      const normalized = roots.length > 0 ? roots : all;
      setParentCategories(normalized);
      if (normalized.length > 0) {
        setSelectedParentId(normalized[0].id);
        setSelectedChildIndex(0);
      }
    } catch (e) {
      console.error("fetchParentCategories:", e);
    }
  }, []);

  useEffect(() => {
    fetchParentCategories();
  }, [fetchParentCategories]);

  useEffect(() => {
    if (!parentCategories.length) return;
    const animations = parentCategories.map((item) => {
      const anim = getAvatarAnim(item.id);
      return Animated.spring(anim, {
        toValue: item.id === selectedParentId ? 1 : 0,
        useNativeDriver: false,
        tension: 200,
        friction: 15,
      });
    });
    Animated.parallel(animations).start();
  }, [selectedParentId, parentCategories, getAvatarAnim]);

  const onPressParent = useCallback(
    (item: ParentCategory) => {
      setSelectedParentId(item.id);
      setSelectedChildIndex(0);
      scrollY.setValue(0);
      const x = itemPositionsRef.current[item.id];
      if (x != null) {
        parentScrollRef.current?.scrollTo({
          x: Math.max(0, x - 16),
          animated: true,
        });
      }
    },
    [scrollY],
  );

  const onPressChild = useCallback(
    (index: number) => {
      setSelectedChildIndex(index);
      scrollY.setValue(0);
    },
    [scrollY],
  );

  const cover = selectedParent?.cover ?? selectedParent?.background ?? "";

  const contextValue = useMemo<CircleContextType>(
    () => ({
      childCategories,
      selectedChildIndex,
      scrollY,
      setSelectedChildIndex,
      heroMinHeight: HERO_MIN_HEIGHT,
      registerScrollToTop,
      unregisterScrollToTop,
    }),

    [
      childCategories,
      selectedChildIndex,
      scrollY,
      HERO_MIN_HEIGHT,
      registerScrollToTop,
      unregisterScrollToTop,
    ],
  );

  return (
    <CircleContext.Provider value={contextValue}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.card }]}
        edges={["left", "right", "bottom"]}
      >
        <StatusBar style="light" translucent backgroundColor="transparent" />

        {/* 内容层（TabView 填满屏幕，hero 绝对浮层覆盖其上） */}
        <Slot />

        {/* Hero 浮层 */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.hero,
            { height: heroAnimHeight, backgroundColor: theme.muted },
          ]}
        >
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
          <View style={styles.heroOverlay} pointerEvents="none" />

          {/* 父分类 Tab 行 */}
          <View style={[styles.heroTabsRow, { paddingTop: insets.top + 6 }]}>
            <Animated.View style={{ opacity: tabsRowOpacity }}>
              <ScrollView
                ref={parentScrollRef}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.parentTabsContent}
              >
                {parentCategories.map((item) => {
                  const anim = getAvatarAnim(item.id);
                  const animSize = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [32, 40],
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
                          { width: animSize, height: animSize },
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
              pointerEvents={isCollapsed ? "box-none" : "none"}
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
            style={[styles.heroContent, { opacity: heroContentOpacity }]}
          >
            <ThemedText size={24} color="white" fontWeight="700">
              {selectedParent?.name ?? "圈子"}
            </ThemedText>
          </Animated.View>

          {/* 子分类 Tab 栏（固定在 hero 底部） */}
          {childCategories.length > 0 && (
            <View
              style={[styles.heroChildTabsBar, { backgroundColor: theme.card }]}
            >
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.childTabsContent}
              >
                {childCategories.map((item, i) => {
                  const active = i === selectedChildIndex;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => onPressChild(i)}
                      onLayout={(e) => {
                        const { x, width } = e.nativeEvent.layout;
                        setChildTabLayouts((prev) => {
                          const next = [...prev];
                          next[i] = { x, width };
                          return next;
                        });
                      }}
                      style={styles.childTabButton}
                    >
                      <ThemedText
                        size={16}
                        fontWeight="600"
                        color={active ? colors.primary : theme.secondary}
                      >
                        {item.name}
                      </ThemedText>
                    </Pressable>
                  );
                })}
                {indicatorTranslateX && (
                  <Animated.View
                    style={[
                      styles.childTabIndicator,
                      { transform: [{ translateX: indicatorTranslateX }] },
                    ]}
                  />
                )}
              </ScrollView>
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
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
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
    paddingHorizontal: 16,
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
  childTabsContent: {
    paddingHorizontal: 16,
    gap: 20,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  childTabButton: {
    paddingBottom: 0,
    position: "relative",
    justifyContent: "flex-end",
  },
  childTabIndicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },
});
