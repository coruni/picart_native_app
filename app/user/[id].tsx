import { api, type UserControllerFindOne200ResponseData } from "@/api";
import CommentsTab from "@/components/profile/CommentsTab";
import PostsTab from "@/components/profile/PostsTab";
import { Avatar } from "@/components/ui/Avatar";
import Loading from "@/components/ui/Loading";
import ThemedIcon from "@/components/ui/ThemedIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import {
  NestedScrollEvent,
  NestedScrollView,
  NestedScrollViewHeader,
} from "@sdcx/nested-scroll";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Check,
  ChevronLeft,
  IdCard,
  MoreHorizontal,
  NotepadText,
  UserRoundPlus,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  StatusBar as RNStatusBar,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import ImageColors, { type ImageColorsResult } from "react-native-image-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

const HERO_HEIGHT = 208;
const TAB_BAR_HEIGHT = 40;
const CONTENT_TOP_RADIUS = 20;
const HERO_CANVAS_HEIGHT = HERO_HEIGHT + CONTENT_TOP_RADIUS;
const COLLAPSED_HERO_EXTRA = 8;

function formatCount(value?: number | null): string {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

type UserTabRoute = {
  key: "posts" | "comments";
  title: string;
};

type ContentScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

interface FollowActionButtonProps {
  isFollowed?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  collapsed?: boolean;
  onPress: () => void;
}

function FollowActionButton({
  isFollowed,
  style,
  loading,
  disabled,
  collapsed = false,
  onPress,
}: FollowActionButtonProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const iconColor = collapsed ? "white" : colors.primary;
  const labelColor = collapsed ? "white" : colors.primary;

  return (
    <Pressable
      hitSlop={8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.followButton,
        collapsed ? styles.collapsedFollowButton : styles.sheetFollowButton,
        isFollowed && styles.followIconOnlyButton,
        {
          borderColor: collapsed ? "transparent" : colors.primary,
          opacity: loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isFollowed ? (
        <Check size={16} color={colors.primary} strokeWidth={3} />
      ) : (
        <UserRoundPlus size={16} color={iconColor} />
      )}
      {!isFollowed && (
        <ThemedText size={12} color={labelColor} fontWeight="600">
          {t("article.follow")}
        </ThemedText>
      )}
    </Pressable>
  );
}

interface UserDetailsProps {
  profile: UserControllerFindOne200ResponseData | null;
  displayName: string;
  description: string;
  stats: { label: string; value: string }[];
  followLoading: boolean;
  onToggleFollow: () => void;
}

function UserDetails({
  profile,
  displayName,
  description,
  stats,
  followLoading,
  onToggleFollow,
}: UserDetailsProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.profileSheet}>
      <View style={styles.profileHeaderRow}>
        <FollowActionButton
          style={{ minWidth: 50 }}
          isFollowed={profile?.isFollowed}
          loading={followLoading}
          disabled={!profile?.id}
          onPress={onToggleFollow}
        />
      </View>

      <View style={styles.identityWrap}>
        <View style={styles.nameRow}>
          <ThemedText fontWeight="800" variant="h3">
            {displayName}
          </ThemedText>
        </View>
        <View style={styles.metaLine}>
          <IdCard size={14} color={colors.primary} />
          <ThemedText size={12} color={theme.foreground}>
            {t("profilePage.passportId")}
            {profile?.id ?? "--"}
          </ThemedText>
        </View>
        <View style={styles.metaLine}>
          <NotepadText size={14} color={theme.secondary} />
          <ThemedText size={12} color={theme.secondary}>
            {description}
          </ThemedText>
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statItem}>
            <ThemedText fontWeight="700">{item.value}</ThemedText>
            <ThemedText variant="caption">{item.label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const userId = Array.isArray(id) ? id[0] : id;
  const { theme, isDark, colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const currentUserId = useAuthStore((s) => s.profile?.id ?? s.user?.id);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollYRef = useRef(0);
  const tabScrollYRef = useRef(0);
  const tabScrollOffsetsRef = useRef<Record<UserTabRoute["key"], number>>({
    posts: 0,
    comments: 0,
  });
  const activeTabKeyRef = useRef<UserTabRoute["key"]>("posts");
  const tabIndexAnim = useRef(new Animated.Value(0)).current;
  const tabViewPositionRef =
    useRef<Animated.AnimatedInterpolation<number> | null>(null);

  const [profile, setProfile] =
    useState<UserControllerFindOne200ResponseData | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(layout.height);
  const [followLoading, setFollowLoading] = useState(false);
  const [collapsedActionsVisible, setCollapsedActionsVisible] = useState(false);
  const collapsedActionsVisibleRef = useRef(false);
  const [heroAccentColor, setHeroAccentColor] = useState<string>(
    theme.secondaryBackground,
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ headerShown: false });
      StatusBar.setStyle("light");
      RNStatusBar.setTranslucent(true);
      return () => {
        StatusBar.setStyle(isDark ? "light" : "dark");
        RNStatusBar.setTranslucent(false);
      };
    }, [isDark, navigation]),
  );

  const refreshUser = useCallback(async () => {
    if (!userId) return;
    const { data } = await api.userControllerFindOne(String(userId));
    setProfile(data.data);
  }, [userId]);

  useEffect(() => {
    refreshUser().catch(() => {});
  }, [refreshUser]);

  const displayName =
    profile?.nickname || profile?.username || t("profilePage.defaultUser");
  const description =
    profile?.description?.trim() || t("profilePage.defaultBio");
  const cover = profile?.background ?? "";
  const avatarFrameUri = profile?.equippedDecorations?.AVATAR_FRAME?.imageUrl;

  const heroMinHeight = insets.top + TAB_BAR_HEIGHT + COLLAPSED_HERO_EXTRA;
  const collapseRange = Math.max(HERO_HEIGHT - heroMinHeight, 0);
  const heroSpacerHeight = Math.max(
    HERO_HEIGHT - heroMinHeight - CONTENT_TOP_RADIUS,
    0,
  );
  const heroScrollRange = Math.max(heroSpacerHeight, 1);
  const scrollViewportHeight = Math.max(viewportHeight - heroMinHeight, 1);
  const tabViewMinHeight = Math.max(scrollViewportHeight - TAB_BAR_HEIGHT, 1);

  useEffect(() => {
    let cancelled = false;

    if (!cover) {
      setHeroAccentColor(theme.secondaryBackground);
      return () => {
        cancelled = true;
      };
    }

    setHeroAccentColor(theme.secondaryBackground);

    ImageColors.getColors(cover, {
      cache: true,
      key: cover,
      fallback: theme.secondaryBackground,
    })
      .then((result: ImageColorsResult) => {
        if (cancelled) return;

        const nextColor =
          result.platform === "ios"
            ? (result.background ??
              result.primary ??
              result.secondary ??
              result.detail ??
              theme.secondaryBackground)
            : (result.dominant ??
              result.vibrant ??
              result.muted ??
              result.darkMuted ??
              theme.secondaryBackground);

        setHeroAccentColor(nextColor || theme.secondaryBackground);
      })
      .catch(() => {
        if (!cancelled) {
          setHeroAccentColor(theme.secondaryBackground);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cover, theme.secondaryBackground]);

  const tabRoutes = useMemo<UserTabRoute[]>(
    () => [
      { key: "posts", title: t("profilePage.tabs.posts") },
      { key: "comments", title: t("profilePage.tabs.comments") },
    ],
    [t],
  );

  const stats = useMemo(
    () => [
      {
        label: t("profilePage.stats.posts"),
        value: formatCount(profile?.articleCount),
      },
      {
        label: t("profilePage.stats.following"),
        value: formatCount(profile?.followingCount),
      },
      {
        label: t("profilePage.stats.followers"),
        value: formatCount(profile?.followerCount),
      },
      {
        label: t("profilePage.stats.likes"),
        value: formatCount(profile?.likes),
      },
    ],
    [profile, t],
  );

  const heroCollapseTranslateY = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, heroScrollRange],
        outputRange: [0, -heroSpacerHeight],
        extrapolate: "clamp",
      }),
    [heroScrollRange, heroSpacerHeight, scrollY],
  );

  const heroContentOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, collapseRange * 0.4],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [collapseRange, scrollY],
  );

  const heroBlurOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, collapseRange * 0.85],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [collapseRange, scrollY],
  );

  const collapsedHeaderOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [collapseRange * 0.35, collapseRange * 0.75],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [collapseRange, scrollY],
  );

  const heroMaskColors = useMemo<readonly [string, string, string]>(
    () => ["rgba(0,0,0,0.48)", "rgba(0,0,0,0.24)", "rgba(0,0,0,0)"],
    [],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshSignal((value) => value + 1);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  }, [refreshUser]);

  const handleTabScroll = useCallback(
    (key: UserTabRoute["key"], event: ContentScrollEvent) => {
      const nextScrollY = Math.max(event.nativeEvent.contentOffset.y, 0);
      tabScrollOffsetsRef.current[key] = nextScrollY;
      if (activeTabKeyRef.current === key) {
        tabScrollYRef.current = nextScrollY;
      }
    },
    [],
  );

  const renderScene = useCallback(
    ({ route }: { route: UserTabRoute }) => {
      if (!userId) return null;

      switch (route.key) {
        case "posts":
          return (
            <PostsTab
              userId={userId}
              refreshSignal={refreshSignal}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onContentScroll={(event) => handleTabScroll(route.key, event)}
            />
          );
        case "comments":
          return (
            <CommentsTab
              userId={userId}
              refreshSignal={refreshSignal}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onContentScroll={(event) => handleTabScroll(route.key, event)}
            />
          );
        default:
          return null;
      }
    },
    [handleRefresh, handleTabScroll, refreshing, refreshSignal, userId],
  );

  const handleTabIndexChange = useCallback((nextIndex: number) => {
    setTabIndex(nextIndex);
  }, []);

  useEffect(() => {
    const activeKey = tabRoutes[tabIndex]?.key ?? "posts";
    activeTabKeyRef.current = activeKey;
    tabScrollYRef.current = tabScrollOffsetsRef.current[activeKey] ?? 0;

    Animated.spring(tabIndexAnim, {
      toValue: tabIndex,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  }, [tabIndex, tabIndexAnim, tabRoutes]);

  const handleHeaderScroll = useCallback(
    (event: NestedScrollEvent) => {
      const nextScrollY = Math.max(event.nativeEvent.contentOffset.y, 0);
      const nextActionsVisible = nextScrollY >= collapseRange * 0.55;
      headerScrollYRef.current = nextScrollY;
      if (collapsedActionsVisibleRef.current !== nextActionsVisible) {
        collapsedActionsVisibleRef.current = nextActionsVisible;
        setCollapsedActionsVisible(nextActionsVisible);
      }
      scrollY.setValue(nextScrollY);
    },
    [collapseRange, scrollY],
  );

  const handleRootLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportHeight(event.nativeEvent.layout.height);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleFollow = useCallback(async () => {
    if (!profile?.id || followLoading) return;
    if (Number(currentUserId) === Number(profile.id)) {
      showToast(t("article.cannotFollowSelf"));
      return;
    }

    const nextFollowed = !profile.isFollowed;
    setFollowLoading(true);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            isFollowed: nextFollowed,
            followerCount: Math.max(
              0,
              (prev.followerCount || 0) + (nextFollowed ? 1 : -1),
            ),
          }
        : prev,
    );

    try {
      if (nextFollowed) {
        await api.userControllerFollow(String(profile.id));
      } else {
        await api.userControllerUnfollow(String(profile.id));
      }
    } catch {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowed: !nextFollowed,
              followerCount: Math.max(
                0,
                (prev.followerCount || 0) + (nextFollowed ? -1 : 1),
              ),
            }
          : prev,
      );
      showToast(t("article.actionFailed"));
    } finally {
      setFollowLoading(false);
    }
  }, [currentUserId, followLoading, profile, showToast, t]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.secondaryBackground }]}
      onLayout={handleRootLayout}
    >
      <View
        style={[
          styles.scrollShell,
          {
            top: heroMinHeight,
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
            stickyHeaderBeginIndex={2}
          >
            <Animated.View style={{ height: heroSpacerHeight }} />
            <View
              style={[
                styles.profileSurface,
                {
                  backgroundColor: theme.card,
                  borderTopLeftRadius: CONTENT_TOP_RADIUS,
                  borderTopRightRadius: CONTENT_TOP_RADIUS,
                },
              ]}
            >
              <UserDetails
                profile={profile}
                displayName={displayName}
                description={description}
                stats={stats}
                followLoading={followLoading}
                onToggleFollow={handleToggleFollow}
              />
            </View>
            <View
              style={[styles.stickyTabSurface, { backgroundColor: theme.card }]}
            >
              <TabBar
                navigationState={{ index: tabIndex, routes: tabRoutes }}
                position={
                  (tabViewPositionRef.current ??
                    tabIndexAnim) as Animated.AnimatedInterpolation<number>
                }
                onTabPress={({ route }) => {
                  const idx = tabRoutes.findIndex((r) => r.key === route.key);
                  if (idx !== -1) handleTabIndexChange(idx);
                }}
                jumpTo={(key) => {
                  const idx = tabRoutes.findIndex((r) => r.key === key);
                  if (idx !== -1) handleTabIndexChange(idx);
                }}
                layout={{ width: layout.width, height: TAB_BAR_HEIGHT }}
                style={[
                  styles.tabBar,
                  {
                    backgroundColor: theme.card,
                    borderBottomColor: theme.border,
                  },
                ]}
                tabStyle={styles.tabStyle}
                renderIndicator={({ getTabWidth }) => {
                  const inputRange = tabRoutes.map((_, i) => i);
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
                      style={[
                        styles.tabIndicator,
                        { transform: [{ translateX }] },
                      ]}
                    />
                  );
                }}
                renderTabBarItem={({ route, onPress, onLayout }) => {
                  const routeIndex = tabRoutes.findIndex(
                    (r) => r.key === route.key,
                  );
                  const isFocused = tabIndex === routeIndex;
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
            </View>
          </NestedScrollViewHeader>

          <View
            style={[
              styles.tabViewWrap,
              { minHeight: tabViewMinHeight, backgroundColor: theme.card },
            ]}
          >
            {profile ? (
              <TabView
                style={styles.flex1}
                navigationState={{ index: tabIndex, routes: tabRoutes }}
                renderScene={renderScene}
                renderTabBar={(props) => {
                  tabViewPositionRef.current = props.position;
                  return null;
                }}
                onIndexChange={handleTabIndexChange}
                initialLayout={{ width: layout.width }}
                pagerStyle={[styles.tabPager, { minHeight: tabViewMinHeight }]}
                swipeEnabled
                lazy
              />
            ) : (
              <Loading loading />
            )}
          </View>
        </NestedScrollView>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.avatarAbsolute, { opacity: heroContentOpacity }]}
      >
        <Avatar
          uri={profile?.avatar}
          avatarFrameUri={avatarFrameUri}
          size={80}
          border
          rounded
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.hero,
          {
            backgroundColor: heroAccentColor,
            transform: [{ translateY: heroCollapseTranslateY }],
          },
        ]}
      >
        <View pointerEvents="none" style={styles.heroImageLayer}>
          {!!cover && (
            <Image
              source={cover}
              style={styles.heroCoverImage}
              contentFit="cover"
              transition={0}
              cachePolicy="memory-disk"
              priority="high"
              recyclingKey={cover}
            />
          )}
          {!!cover && (
            <Animated.View
              pointerEvents="none"
              style={[styles.heroBlurLayer, { opacity: heroBlurOpacity }]}
            >
              <Image
                source={cover}
                style={styles.heroCoverImage}
                contentFit="cover"
                transition={0}
                blurRadius={24}
                cachePolicy="memory-disk"
                recyclingKey={`blur:${cover}`}
              />
            </Animated.View>
          )}
          <LinearGradient
            pointerEvents="none"
            colors={heroMaskColors}
            locations={[0, 0.56, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroMaskLayer}
          />
        </View>
      </Animated.View>

      <View pointerEvents="box-none" style={styles.heroControls}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.collapsedBar, { paddingTop: insets.top }]}
        >
          <View style={styles.collapsedLeft}>
            <Pressable hitSlop={10} onPress={handleGoBack}>
              <ThemedIcon icon={ChevronLeft} color="white" size={26} />
            </Pressable>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.collapsedIdentity,
                { opacity: collapsedHeaderOpacity },
              ]}
            >
              <Avatar uri={profile?.avatar || ""} size={30} />
              <ThemedText size={16} color="#fff">
                {displayName}
              </ThemedText>
            </Animated.View>
          </View>

          <View style={styles.collapsedActionCapsule}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.collapsedActionCapsuleBg,
                { opacity: collapsedHeaderOpacity },
              ]}
            />
            {collapsedActionsVisible && (
              <Animated.View style={{ opacity: collapsedHeaderOpacity }}>
                <FollowActionButton
                  isFollowed={profile?.isFollowed}
                  loading={followLoading}
                  disabled={!profile?.id}
                  collapsed
                  onPress={handleToggleFollow}
                />
              </Animated.View>
            )}
            <Pressable
              hitSlop={8}
              style={styles.moreButton}
              accessibilityLabel={t("article.moreActions")}
            >
              <MoreHorizontal size={20} color="white" />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  flex1: { flex: 1 },
  scrollShell: {
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
  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_CANVAS_HEIGHT,
    zIndex: 0,
    overflow: "hidden",
  },
  heroImageLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_CANVAS_HEIGHT,
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
    height: HERO_CANVAS_HEIGHT,
  },
  heroControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  collapsedBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 12,
  },
  collapsedLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  collapsedIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  followButton: {
    height: 30,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  followIconOnlyButton: {
    width: 34,
    paddingHorizontal: 0,
    gap: 0,
  },
  avatarAbsolute: {
    position: "absolute",
    top: HERO_HEIGHT - CONTENT_TOP_RADIUS - 40,
    left: 24,
    zIndex: 3,
  },
  profileSurface: {
    overflow: "hidden",
  },
  profileSheet: {
    paddingHorizontal: 16,
  },
  profileHeaderRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  sheetFollowButton: {
    marginTop: 4,
    height: 32,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.84)",
  },
  collapsedFollowButton: {
    backgroundColor: "transparent",
  },
  moreButton: {
    width: 34,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  collapsedActionCapsule: {
    height: 30,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  collapsedActionCapsuleBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(14,18,26,0.66)",
  },
  identityWrap: { marginTop: 12, gap: 8 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  metaLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  tabViewWrap: {
    flexGrow: 1,
  },
  tabPager: {
    flex: 1,
  },
  stickyTabSurface: {
    overflow: "hidden",
  },
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
});
