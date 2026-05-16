import { api, type UserControllerGetProfile200ResponseData } from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import { Avatar } from "@/components/ui/Avatar";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  NestedScrollEvent,
  NestedScrollView,
  NestedScrollViewHeader,
} from "@sdcx/nested-scroll";
import { useFocusEffect } from "expo-router";
import { setStatusBarStyle, setStatusBarTranslucent } from "expo-status-bar";
import { IdCard, MessageSquareText, PencilLine } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

// ─── 常量 ────────────────────────────────────────────────────────────────────
const HERO_HEIGHT = 208;
const TAB_BAR_HEIGHT = 40;
const ROUNDED_CAP_HEIGHT = 20;

function formatCount(value?: number | null): string {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

const TAB_ROUTES = [
  { key: "posts", title: "帖子" },
  { key: "comments", title: "评论" },
  { key: "favorites", title: "收藏" },
  { key: "topics", title: "话题" },
  { key: "history", title: "我看过的" },
];

type ProfileTabRoute = (typeof TAB_ROUTES)[number];

// ─── ProfileDetails ───────────────────────────────────────────────────────────
interface ProfileDetailsProps {
  profile: UserControllerGetProfile200ResponseData | null;
  displayName: string;
  description: string;
  stats: { label: string; value: string }[];
}

function ProfileDetails({
  profile,
  displayName,
  description,
  stats,
}: ProfileDetailsProps) {
  const { theme, colors } = useTheme();

  return (
    <View style={styles.profileSheet}>
      <View style={styles.profileHeaderRow}>
        <Pressable
          style={[styles.editButton, { borderColor: colors.primary }]}
          hitSlop={8}
        >
          <PencilLine size={16} color={colors.primary} />
          <ThemedText fontWeight="600" color={colors.primary}>
            编辑
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.identityWrap}>
        <View style={styles.nameRow}>
          <ThemedText fontWeight="800">{displayName}</ThemedText>
          {!!profile?.membershipLevelName && (
            <View
              style={[
                styles.levelBadge,
                { backgroundColor: theme.secondaryBackground },
              ]}
            >
              <ThemedText fontWeight="700" color={colors.primary}>
                {profile.membershipLevelName}
              </ThemedText>
            </View>
          )}
        </View>
        <View style={styles.metaLine}>
          <IdCard size={14} color={colors.primary} />
          <ThemedText color={theme.foreground}>
            通行证ID: {profile?.id ?? "--"}
          </ThemedText>
        </View>
        <View style={styles.metaLine}>
          <MessageSquareText size={14} color={theme.secondary} />
          <ThemedText color={theme.secondary}>{description}</ThemedText>
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statItem}>
            <ThemedText fontWeight="700">{item.value}</ThemedText>
            <ThemedText color={theme.secondary}>{item.label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── ProfileScene ─────────────────────────────────────────────────────────────
interface ProfileSceneProps {
  route: ProfileTabRoute;
  tabViewHeight: number;
}

function ProfileScene({ route, tabViewHeight }: ProfileSceneProps) {
  const { theme } = useTheme();

  const INNER_ITEMS = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({ key: `item-${i}`, index: i })),
    [],
  );

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => (
      <View style={styles.tabContentItem}>
        <ThemedText color={theme.secondary}>
          {route.title} 内容 #{item.index + 1}
        </ThemedText>
      </View>
    ),
    [route.title, theme.secondary],
  );

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={INNER_ITEMS}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      bounces={false}
    />
  );
}

// ─── ProfileScreen ────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { theme, isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const scrollY = useRef(new Animated.Value(0)).current;
  const tabIndexAnim = useRef(new Animated.Value(0)).current;
  const tabViewPositionRef =
    useRef<Animated.AnimatedInterpolation<number> | null>(null);

  const [profile, setProfile] =
    useState<UserControllerGetProfile200ResponseData | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // ── Status Bar ─────────────────────────────────────────────────────────────
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

  // ── 加载资料 ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.userControllerGetProfile();
        if (!cancelled) setProfile(data.data);
      } catch (e) {
        if (!cancelled) {
          console.error("fetchProfile:", e);
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── 衍生数据 ──────────────────────────────────────────────────────────────
  const displayName = profile?.nickname || profile?.username || "未登录用户";
  const description =
    profile?.description?.trim() || "这个人很神秘，什么都没留下。";
  const cover = profile?.background ?? "";
  const avatarFrameUri = profile?.equippedDecorations?.AVATAR_FRAME?.imageUrl;

  const heroMinHeight = insets.top + 68 + TAB_BAR_HEIGHT;
  const collapseRange = Math.max(HERO_HEIGHT - heroMinHeight, 0);

  const stats = useMemo(
    () => [
      { label: "帖子", value: formatCount(profile?.articleCount) },
      { label: "关注", value: formatCount(profile?.followingCount) },
      { label: "粉丝", value: formatCount(profile?.followerCount) },
      { label: "积分", value: formatCount(profile?.points) },
    ],
    [profile],
  );

  // ── Hero 动画 ──────────────────────────────────────────────────────────────
  const heroAnimHeight = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, collapseRange],
        outputRange: [HERO_HEIGHT, heroMinHeight],
        extrapolate: "clamp",
      }),
    [collapseRange, heroMinHeight, scrollY],
  );

  const heroContentOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, collapseRange * 0.5],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [collapseRange, scrollY],
  );

  // TabView 高度
  const tabViewHeight = useMemo(
    () => Math.max(layout.height - heroMinHeight, 1),
    [layout.height, heroMinHeight],
  );

  // ── TabView Scenes ────────────────────────────────────────────────────────
  const renderScene = useCallback(
    ({ route }: { route: ProfileTabRoute }) => (
      <ProfileScene route={route} tabViewHeight={tabViewHeight} />
    ),
    [tabViewHeight],
  );

  const handleTabIndexChange = useCallback((nextIndex: number) => {
    setTabIndex(nextIndex);
  }, []);

  useEffect(() => {
    Animated.spring(tabIndexAnim, {
      toValue: tabIndex,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  }, [tabIndex, tabIndexAnim]);

  const handleHeaderScroll = useCallback(
    (event: NestedScrollEvent) => {
      scrollY.setValue(event.nativeEvent.contentOffset.y);
    },
    [scrollY],
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <NestedScrollView style={styles.flex1}>
        <NestedScrollViewHeader
          onScroll={handleHeaderScroll}
          stickyHeaderBeginIndex={1}
          stickyHeaderHeight={heroMinHeight + TAB_BAR_HEIGHT - 10}
        >
          <View style={{ height: HERO_HEIGHT }} />
          <ProfileDetails
            profile={profile}
            displayName={displayName}
            description={description}
            stats={stats}
          />
          {/* TabBar */}
          <TabBar
            navigationState={{ index: tabIndex, routes: TAB_ROUTES }}
            position={
              (tabViewPositionRef.current ??
                tabIndexAnim) as Animated.AnimatedInterpolation<number>
            }
            onTabPress={({ route }) => {
              const idx = TAB_ROUTES.findIndex((r) => r.key === route.key);
              if (idx !== -1) handleTabIndexChange(idx);
            }}
            jumpTo={(key) => {
              const idx = TAB_ROUTES.findIndex((r) => r.key === key);
              if (idx !== -1) handleTabIndexChange(idx);
            }}
            layout={{ width: layout.width, height: TAB_BAR_HEIGHT }}
            style={[
              styles.tabBar,
              { backgroundColor: theme.card, borderBottomColor: theme.border },
            ]}
            tabStyle={styles.tabStyle}
            renderIndicator={({ getTabWidth }) => {
              const inputRange = TAB_ROUTES.map((_, i) => i);
              const outputRange = inputRange.map((i) => {
                let offset = 0;
                for (let j = 0; j < i; j++) offset += getTabWidth(j);
                return offset + getTabWidth(i) / 2 - 10;
              });
              const pos = tabViewPositionRef.current ?? tabIndexAnim;
              const translateX =
                inputRange.length >= 2
                  ? pos.interpolate({ inputRange, outputRange })
                  : (outputRange[0] ?? 0);
              return (
                <Animated.View
                  style={[styles.tabIndicator, { transform: [{ translateX }] }]}
                />
              );
            }}
            renderTabBarItem={({ route, onPress, onLayout }) => {
              const routeIndex = TAB_ROUTES.findIndex(
                (r) => r.key === route.key,
              );
              const isFocused = tabIndex === routeIndex;
              const scale = tabIndexAnim.interpolate({
                inputRange: TAB_ROUTES.map((_, i) => i),
                outputRange: TAB_ROUTES.map((_, i) =>
                  i === routeIndex ? 1.1 : 1,
                ),
                extrapolate: "clamp",
              });
              return (
                <Pressable
                  key={route.key}
                  onLayout={onLayout}
                  onPress={onPress}
                  style={styles.tabItem}
                >
                  <Animated.Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused ? colors.primary : theme.secondary,
                      },
                    ]}
                  >
                    {route.title}
                  </Animated.Text>
                </Pressable>
              );
            }}
          />
        </NestedScrollViewHeader>

        {/* TabView - 使用 flex: 1 填满剩余空间 */}
        <View style={{ flex: 1 }}>
          <TabView
            style={styles.flex1}
            navigationState={{ index: tabIndex, routes: TAB_ROUTES }}
            renderScene={renderScene}
            renderTabBar={(props) => {
              tabViewPositionRef.current = props.position;
              return null;
            }}
            onIndexChange={handleTabIndexChange}
            initialLayout={{
              width: layout.width,
            }}
            pagerStyle={{ flex: 1, height: "100%" }}
            swipeEnabled
            lazy={true}
          />
        </View>
      </NestedScrollView>

      {/* ── 头像浮层 ─────────────────────────────────────────────────────── */}
      <Animated.View
        pointerEvents="none"
        style={[styles.avatarAbsolute, { opacity: heroContentOpacity }]}
      >
        <Avatar
          uri={profile?.avatar}
          avatarFrameUri={avatarFrameUri}
          size={96}
          border
          rounded
        />
      </Animated.View>

      {/* ── Hero 浮层 ────────────────────────────────────────────────────── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.hero,
          {
            height: heroAnimHeight,
            backgroundColor: theme.secondaryBackground,
          },
        ]}
      >
        <View style={StyleSheet.absoluteFill}>
          {!!cover && (
            <AsyncImage
              source={cover}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              showLoading={false}
              transition={0}
              cachePolicy="memory-disk"
            />
          )}
          <View style={styles.heroMask} />
        </View>

        <Animated.View
          style={[styles.heroContent, { opacity: heroContentOpacity }]}
        />

        <View
          style={[styles.heroRoundedCap, { backgroundColor: theme.card }]}
        />
      </Animated.View>
    </View>
  );
}

// ─── 样式 ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },

  loadingWrap: { paddingVertical: 24 },

  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 15, 30, 0.28)",
  },
  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: ROUNDED_CAP_HEIGHT,
  },
  heroRoundedCap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ROUNDED_CAP_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  avatarAbsolute: {
    position: "absolute",
    top: HERO_HEIGHT - ROUNDED_CAP_HEIGHT - 56,
    left: 16,
    zIndex: 11,
  },
  profileSheet: { paddingHorizontal: 16 },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  editButton: {
    marginTop: 4,
    height: 32,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  identityWrap: { marginTop: 12, gap: 8 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  levelBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  metaLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },

  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 4,
  },
  tabStyle: {
    width: "auto",
    minWidth: 60,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },

  tabContentItem: {
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    justifyContent: "center",
  },
});
