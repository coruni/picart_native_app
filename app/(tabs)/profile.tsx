import { api, type UserControllerGetProfile200ResponseData } from "@/api";
import backgroundPlaceholder from "@/assets/images/placeholder/background_placeholder.webp";
import CommentsTab from "@/components/profile/CommentsTab";
import FavoritesTab from "@/components/profile/FavoritesTab";
import HistoryTab from "@/components/profile/HistoryTab";
import { NativePullToRefreshHeader } from "@/components/profile/NativePullToRefreshHeader";
import PostsTab from "@/components/profile/PostsTab";
import TopicsTab from "@/components/profile/TopicsTab";
import { Avatar } from "@/components/ui/Avatar";
import ImageCropperSheet, {
  type ImageCropperSheetRef,
} from "@/components/ui/ImageCropperSheet";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { uploadSingleImage } from "@/lib/uploadImage";
import { useAuthStore } from "@/store/authStore";
import {
  NestedScrollEvent,
  NestedScrollView,
  NestedScrollViewHeader,
} from "@sdcx/nested-scroll";
import { PullToRefresh } from "@sdcx/pull-to-refresh";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dessert,
  IdCard,
  NotepadText,
  PencilLine,
  Settings,
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
  View,
  useWindowDimensions,
} from "react-native";
import ImageColors, { type ImageColorsResult } from "react-native-image-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

// ─── 常量 ────────────────────────────────────────────────────────────────────
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

function getImageRecyclingKey(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

type ProfileTabRoute = {
  key: "posts" | "comments" | "favorites" | "topics" | "history";
  title: string;
};

type ContentScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

// ─── ProfileDetails ───────────────────────────────────────────────────────────
interface ProfileDetailsProps {
  profile: UserControllerGetProfile200ResponseData | null;
  displayName: string;
  description: string;
  stats: { label: string; value: string; onPress?: () => void }[];
}

function ProfileDetails({
  profile,
  displayName,
  description,
  stats,
}: ProfileDetailsProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.profileSheet}>
      <View style={styles.profileHeaderRow}>
        <Pressable
          style={[styles.editButton, { borderColor: colors.primary }]}
          hitSlop={8}
          onPress={() => router.push("/edit-profile")}
        >
          <PencilLine size={16} color={colors.primary} />
          <ThemedText fontWeight="600" color={colors.primary}>
            {t("profilePage.edit")}
          </ThemedText>
        </Pressable>
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
          <Pressable
            key={item.label}
            style={styles.statItem}
            disabled={!item.onPress}
            onPress={item.onPress}
          >
            <ThemedText fontWeight="700">{item.value}</ThemedText>
            <ThemedText variant="caption">{item.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── ProfileScreen ────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { theme, isDark, colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);
  const displayProfile =
    profile ??
    (user as unknown as UserControllerGetProfile200ResponseData | null);

  const backgroundCropperRef = useRef<ImageCropperSheetRef>(null);
  const [localBackground, setLocalBackground] = useState<string | undefined>(
    undefined,
  );
  const [uploadingBackground, setUploadingBackground] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollYRef = useRef(0);
  const tabScrollYRef = useRef(0);
  const heroRef = useRef<View>(null);
  const heroImageLayerRef = useRef<View>(null);

  // 统一的头像透明度：由 scrollY 插值 OR 下拉时直接 setValue
  // 不用 Animated.multiply，避免两个动画值竞争导致闪烁
  const avatarOpacity = useRef(new Animated.Value(1)).current;

  // 封面图高度，由下拉驱动（不支持 setNativeProps 的 expo-image 用此方案）
  const pullDownHeight = useRef(new Animated.Value(HERO_CANVAS_HEIGHT)).current;

  // hero 容器高度，由下拉驱动（与 pullDownHeight 同步动画）
  const heroContainerHeight = useRef(
    new Animated.Value(HERO_CANVAS_HEIGHT),
  ).current;

  // 标记当前是否处于下拉状态，下拉时屏蔽 scrollY 对头像的驱动
  const isPullingRef = useRef(false);

  const tabScrollOffsetsRef = useRef<Record<ProfileTabRoute["key"], number>>({
    posts: 0,
    comments: 0,
    favorites: 0,
    topics: 0,
    history: 0,
  });
  const activeTabKeyRef = useRef<ProfileTabRoute["key"]>("posts");
  const refreshingRef = useRef(false);
  const tabIndexAnim = useRef(new Animated.Value(0)).current;
  const tabViewPositionRef =
    useRef<Animated.AnimatedInterpolation<number> | null>(null);

  const [tabIndex, setTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(layout.height);
  const [heroAccentColor, setHeroAccentColor] = useState<string>(
    theme.secondaryBackground,
  );

  // ── Status Bar ─────────────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("light");
      return () => {
        StatusBar.setStyle(isDark ? "light" : "dark");
      };
    }, [isDark]),
  );

  const refreshProfile = useCallback(async () => {
    const { data } = await api.userControllerGetProfile();
    setProfile(data.data);
  }, [setProfile]);

  const handleBackgroundCrop = useCallback(
    async (uri: string) => {
      setUploadingBackground(true);
      try {
        const uploadedUrl = await uploadSingleImage(uri);
        if (!displayProfile?.id) return;

        await api.userControllerUpdate(String(displayProfile.id), {
          background: uploadedUrl,
        });

        setLocalBackground(uploadedUrl);
        await refreshProfile();
        showToast(t("profilePage.backgroundUpdated"));
      } catch (error) {
        showToast(t("common.uploadFailed"));
      } finally {
        setUploadingBackground(false);
      }
    },
    [displayProfile?.id, refreshProfile, showToast, t],
  );

  // ── 加载资料 ───────────────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      refreshProfile()
        .then(() => {
          if (cancelled) return;
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [refreshProfile]),
  );

  // ── 衍生数据 ──────────────────────────────────────────────────────────────
  const displayName =
    displayProfile?.nickname ||
    displayProfile?.username ||
    t("profilePage.defaultUser");
  const description =
    displayProfile?.description?.trim() || t("profilePage.defaultBio");
  const background = localBackground || displayProfile?.background;
  const cover = background || backgroundPlaceholder;
  const coverRecyclingKey = getImageRecyclingKey(
    cover,
    "background-placeholder",
  );
  const avatarFrameUri =
    displayProfile?.equippedDecorations?.AVATAR_FRAME?.imageUrl;

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

    if (!background) {
      setHeroAccentColor(theme.secondaryBackground);
      return () => {
        cancelled = true;
      };
    }

    setHeroAccentColor(theme.secondaryBackground);

    ImageColors.getColors(background, {
      cache: true,
      key: background,
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
  }, [background, theme.secondaryBackground]);

  const tabRoutes = useMemo<ProfileTabRoute[]>(
    () => [
      { key: "posts", title: t("profilePage.tabs.posts") },
      { key: "comments", title: t("profilePage.tabs.comments") },
      { key: "favorites", title: t("profilePage.tabs.favorites") },
      { key: "topics", title: t("profilePage.tabs.topics") },
      { key: "history", title: t("profilePage.tabs.history") },
    ],
    [t],
  );

  const stats = useMemo(
    () => [
      {
        label: t("profilePage.stats.posts"),
        value: formatCount(displayProfile?.articleCount),
      },
      {
        label: t("profilePage.stats.following"),
        value: formatCount(displayProfile?.followingCount),
        onPress: displayProfile?.id
          ? () =>
              router.push({
                pathname: "/follows/[id]",
                params: { id: String(displayProfile.id), type: "following" },
              })
          : undefined,
      },
      {
        label: t("profilePage.stats.followers"),
        value: formatCount(displayProfile?.followerCount),
        onPress: displayProfile?.id
          ? () =>
              router.push({
                pathname: "/follows/[id]",
                params: { id: String(displayProfile.id), type: "followers" },
              })
          : undefined,
      },
      {
        label: t("profilePage.stats.points"),
        value: formatCount(displayProfile?.points),
      },
    ],
    [displayProfile, t],
  );

  // ── Hero 动画 ──────────────────────────────────────────────────────────────
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const heroMaskColors = useMemo<readonly [string, string, string]>(
    () => ["rgba(0,0,0,0.48)", "rgba(0,0,0,0.24)", "rgba(0,0,0,0)"],
    [],
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

  const handleRefresh = useCallback(async () => {
    if (refreshingRef.current) return;

    refreshingRef.current = true;
    setRefreshing(true);
    setRefreshSignal((value) => value + 1);

    try {
      await refreshProfile();
    } catch {
      // Keep cached profile data visible if refresh fails.
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);

      // 刷新结束:以动画方式同步重置图片高度和容器高度
      isPullingRef.current = false;

      // 使用 Animated.timing 同步动画,避免容器和图片高度不同步导致闪烁
      Animated.parallel([
        Animated.timing(heroContainerHeight, {
          toValue: HERO_CANVAS_HEIGHT,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(pullDownHeight, {
          toValue: HERO_CANVAS_HEIGHT,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();

      // 头像透明度归位(scrollY=0 时应为 1)
      avatarOpacity.setValue(1);
    }
  }, [refreshProfile, pullDownHeight, avatarOpacity]);

  const handleTabScroll = useCallback(
    (key: ProfileTabRoute["key"], event: ContentScrollEvent) => {
      const nextScrollY = Math.max(event.nativeEvent.contentOffset.y, 0);
      tabScrollOffsetsRef.current[key] = nextScrollY;
      if (activeTabKeyRef.current === key) {
        tabScrollYRef.current = nextScrollY;
      }
    },
    [],
  );

  // ── TabView Scenes ────────────────────────────────────────────────────────
  const renderScene = useCallback(
    ({ route }: { route: ProfileTabRoute }) => {
      switch (route.key) {
        case "posts":
          return (
            <PostsTab
              refreshSignal={refreshSignal}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onContentScroll={(event) => handleTabScroll(route.key, event)}
            />
          );
        case "comments":
          return (
            <CommentsTab
              refreshSignal={refreshSignal}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onContentScroll={(event) => handleTabScroll(route.key, event)}
            />
          );
        case "favorites":
          return (
            <FavoritesTab
              refreshSignal={refreshSignal}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onContentScroll={(event) => handleTabScroll(route.key, event)}
            />
          );
        case "topics":
          return (
            <TopicsTab
              refreshSignal={refreshSignal}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onContentScroll={(event) => handleTabScroll(route.key, event)}
            />
          );
        case "history":
          return (
            <HistoryTab
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
    [handleRefresh, handleTabScroll, refreshing, refreshSignal],
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
      headerScrollYRef.current = nextScrollY;
      scrollY.setValue(nextScrollY);

      // 更新折叠状态
      const collapsed = nextScrollY >= collapseRange * 0.5;
      if (collapsed !== isCollapsed) {
        setIsCollapsed(collapsed);
      }

      // 上滑时同步更新头像透明度（下拉状态下跳过，由下拉逻辑独立控制）
      if (!isPullingRef.current) {
        const fadeRange = collapseRange * 0.4;
        const opacity =
          fadeRange > 0
            ? Math.max(1 - nextScrollY / fadeRange, 0)
            : nextScrollY > 0
              ? 0
              : 1;
        avatarOpacity.setValue(opacity);
      }
    },
    [scrollY, avatarOpacity, collapseRange, isCollapsed],
  );

  const handlePullOffsetChanged = useCallback(
    (offset: number) => {
      const pullDown = Math.max(-offset, 0);
      const height = HERO_CANVAS_HEIGHT + pullDown;

      isPullingRef.current = pullDown > 0;

      // 同步更新容器和图片高度
      heroContainerHeight.setValue(height);
      pullDownHeight.setValue(height);

      // 下拉时隐藏头像，回弹时恢复
      // 用 opacity 而非裁切，避免截断头像框
      const opacity = pullDown > 0 ? Math.max(1 - pullDown / 60, 0) : 1;
      avatarOpacity.setValue(opacity);
    },
    [pullDownHeight, heroContainerHeight, avatarOpacity],
  );

  const handleRootLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportHeight(event.nativeEvent.layout.height);
  }, []);

  const handleOpenSettings = useCallback(() => {
    router.push("/settings");
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────
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
        <PullToRefresh
          refreshing={refreshing}
          onRefresh={handleRefresh}
          header={
            <NativePullToRefreshHeader
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onPullOffsetChanged={handlePullOffsetChanged}
            />
          }
        >
          <NestedScrollView
            bounces={false}
            style={styles.scrollLayer}
            contentContainerStyle={styles.nestedContent}
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
                <ProfileDetails
                  profile={displayProfile}
                  displayName={displayName}
                  description={description}
                  stats={stats}
                />
              </View>
              <View
                style={[
                  styles.stickyTabSurface,
                  {
                    backgroundColor: theme.card,
                  },
                ]}
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
                  scrollEnabled
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
                          {
                            transform: [{ translateX }],
                            backgroundColor: theme.primary,
                          },
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
                              color: isFocused
                                ? colors.primary
                                : theme.secondary,
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

            {/* TabView - 使用 flex: 1 填满剩余空间 */}
            <View
              style={[
                styles.tabViewWrap,
                { minHeight: tabViewMinHeight, backgroundColor: theme.card },
              ]}
            >
              <TabView
                style={styles.flex1}
                navigationState={{ index: tabIndex, routes: tabRoutes }}
                renderScene={renderScene}
                renderTabBar={(props) => {
                  tabViewPositionRef.current = props.position;
                  return null;
                }}
                renderLazyPlaceholder={() => null}
                onIndexChange={handleTabIndexChange}
                initialLayout={{
                  width: layout.width,
                }}
                pagerStyle={[styles.tabPager, { minHeight: tabViewMinHeight }]}
                swipeEnabled
                lazy
              />
            </View>
          </NestedScrollView>
        </PullToRefresh>
      </View>

      {/* ── 头像浮层 ─────────────────────────────────────────────────────── */}
      {/* 单一 avatarOpacity 控制，上滑和下拉共用，无竞争无闪烁 */}
      <Animated.View
        pointerEvents="none"
        style={[styles.avatarAbsolute, { opacity: avatarOpacity }]}
      >
        <Avatar
          uri={displayProfile?.avatar}
          avatarFrameUri={avatarFrameUri}
          size={80}
          border
          rounded
        />
      </Animated.View>

      {/* ── Hero 背景层(浮动) ────────────────────────────────────────────── */}
      <Animated.View
        ref={heroRef}
        pointerEvents="box-none"
        style={[
          styles.hero,
          {
            backgroundColor: heroAccentColor,
            height: heroContainerHeight,
            transform: [{ translateY: heroCollapseTranslateY }],
          },
        ]}
      >
        <View
          ref={heroImageLayerRef}
          pointerEvents="box-none"
          style={[styles.heroImageLayer, { height: HERO_CANVAS_HEIGHT }]}
        >
          {!!cover && (
            <Pressable
              style={styles.heroCoverPressable}
              onPress={() => backgroundCropperRef.current?.present()}
              disabled={uploadingBackground}
            >
              <Animated.Image
                source={typeof cover === "string" ? { uri: cover } : cover}
                style={[StyleSheet.absoluteFill, { height: pullDownHeight }]}
                resizeMode="cover"
              />
            </Pressable>
          )}
          {background && isCollapsed ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.heroBlurLayer, { opacity: heroBlurOpacity }]}
            >
              <Image
                source={cover}
                style={styles.heroBlurCoverImage}
                contentFit="cover"
                transition={0}
                blurRadius={24}
                cachePolicy="memory-disk"
                recyclingKey={`blur:${coverRecyclingKey}`}
              />
            </Animated.View>
          ) : null}
          <LinearGradient
            pointerEvents="none"
            colors={heroMaskColors}
            locations={[0, 0.56, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.heroMaskLayer, { pointerEvents: "none" }]}
          />
        </View>
      </Animated.View>

      <View pointerEvents="box-none" style={styles.heroControls}>
        {/* 折叠态顶栏：小头像 + 名字 + 操作按钮，与大头像交叉淡入 */}
        <Animated.View
          pointerEvents="box-none"
          style={[styles.collapsedBar, { paddingTop: insets.top }]}
        >
          <Animated.View
            pointerEvents="box-none"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              opacity: collapsedHeaderOpacity,
            }}
          >
            <Avatar uri={displayProfile?.avatar || ""} size={30} />
            <ThemedText size={16} color="#fff">
              {displayName}
            </ThemedText>
          </Animated.View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Animated.View style={{ opacity: heroContentOpacity }}>
              <Pressable hitSlop={8} style={{ padding: 8 }}>
                <Dessert size={20} color="white" />
              </Pressable>
            </Animated.View>
            <Pressable
              hitSlop={8}
              style={{ padding: 4, borderRadius: 999, overflow: "hidden" }}
              onPress={handleOpenSettings}
            >
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: "rgba(0,0,0,0.6)",
                    opacity: collapsedHeaderOpacity,
                  },
                ]}
              />
              <Settings size={20} color="white" />
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {/* 背景图裁剪器 */}
      <ImageCropperSheet
        ref={backgroundCropperRef}
        mode="banner"
        bannerSize={{ width: 1200, height: 400 }}
        shape="rect"
        onCrop={handleBackgroundCrop}
      />
    </View>
  );
}

// ─── 样式 ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  flex1: { flex: 1 },

  loadingWrap: { paddingVertical: 24 },

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
    overflow: "visible",
    zIndex: 0,
  },
  heroImageLayerPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "visible",
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
    // height 由 pullDownHeight Animated.Value 动态控制
  },
  heroBlurCoverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 12,
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
  heroCoverPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // ← 撑满 heroImageLayer，跟着 setNativeProps 的高度走
  },
  profileSheet: { paddingHorizontal: 16 },
  profileHeaderRow: {
    marginTop: 8,
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
  },
});
