import { api, type UserControllerGetProfile200ResponseData } from "@/api";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Slot, useFocusEffect } from "expo-router";
import { setStatusBarStyle, setStatusBarTranslucent } from "expo-status-bar";
import { Settings } from "lucide-react-native";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import ImageColors, { type ImageColorsResult } from "react-native-image-colors";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

// ─── 常量 ────────────────────────────────────────────────────────────────────
export const HERO_HEIGHT = 200;

// ─── 工具 ────────────────────────────────────────────────────────────────────
function withAlpha(color: string, alpha: number): string {
  if (!color.startsWith("#")) return color;
  const normalized = color.slice(1);
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized.length === 8
        ? normalized.slice(0, 6)
        : normalized;
  if (expanded.length !== 6) return color;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return color;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function formatCount(value?: number | null): string {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

// ─── Context ─────────────────────────────────────────────────────────────────
export interface ProfileStat {
  label: string;
  value: string;
}

export interface ProfileContextType {
  profile: UserControllerGetProfile200ResponseData | null;
  loading: boolean;
  displayName: string;
  avatarFrameUri: string | undefined;
  description: string;
  cover: string;
  stats: ProfileStat[];
  scrollY: Animated.Value;
  heroMinHeight: number;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);

export function useProfileContext(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error("useProfileContext must be used within ProfileLayout");
  return ctx;
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function ProfileLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [profile, setProfile] =
    useState<UserControllerGetProfile200ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroAccentColor, setHeroAccentColor] = useState<string>(theme.muted);

  // status bar
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

  // 加载资料
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.userControllerGetProfile();
        if (!cancelled) setProfile(data.data);
      } catch (e) {
        if (!cancelled) {
          console.error("fetchProfile:", e);
          setProfile(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 衍生数据
  const displayName = profile?.nickname || profile?.username || "未登录用户";
  const description =
    profile?.description?.trim() || "这个人很神秘，什么都没留下。";
  const cover = profile?.background ?? "";
  const avatarFrameUri = profile?.equippedDecorations?.AVATAR_FRAME?.imageUrl;

  const stats = useMemo<ProfileStat[]>(
    () => [
      { label: "帖子", value: formatCount(profile?.articleCount) },
      { label: "关注", value: formatCount(profile?.followingCount) },
      { label: "粉丝", value: formatCount(profile?.followerCount) },
      { label: "积分", value: formatCount(profile?.points) },
    ],
    [profile],
  );

  // 折叠尺寸
  const heroMinHeight = insets.top + 56;
  const COLLAPSE_RANGE = HERO_HEIGHT - heroMinHeight;

  // 提取头图主色
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
        const next =
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
        setHeroAccentColor(next || theme.muted);
      })
      .catch(() => {
        if (!cancelled) setHeroAccentColor(theme.muted);
      });
    return () => {
      cancelled = true;
    };
  }, [cover, theme.muted]);

  // 动画插值 —— height 插值（与 Circle 同逻辑）
  const heroAnimHeight = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE],
    outputRange: [HERO_HEIGHT, heroMinHeight],
    extrapolate: "clamp",
  });

  const heroContentOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const collapsedTitleOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_RANGE * 0.4, COLLAPSE_RANGE * 0.8],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const heroOverlayColor = useMemo(
    () => withAlpha(heroAccentColor, 0.15),
    [heroAccentColor],
  );

  // Context value
  const ctxValue = useMemo<ProfileContextType>(
    () => ({
      profile,
      loading,
      displayName,
      avatarFrameUri,
      description,
      cover,
      stats,
      scrollY,
      heroMinHeight,
    }),
    [
      profile,
      loading,
      displayName,
      avatarFrameUri,
      description,
      cover,
      stats,
      scrollY,
      heroMinHeight,
    ],
  );

  return (
    <ProfileContext.Provider value={ctxValue}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.card }]}
        edges={["left", "right", "bottom"]}
      >
        {/* Hero 底层 —— 先渲染，内容层压在上面 */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.hero,
            { height: heroAnimHeight, backgroundColor: heroAccentColor },
          ]}
        >
          {/* 图片层：固定 HERO_HEIGHT，容器高度缩小时从底部裁切 */}
          <View style={styles.heroImageLayer}>
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
            <View
              style={[
                styles.heroMaskLayer,
                { backgroundColor: heroOverlayColor },
              ]}
            />
          </View>

          {/* 展开态：底部用户名 */}
          <Animated.View
            style={[styles.heroContent, { opacity: heroContentOpacity }]}
          >
            <ThemedText fontWeight="800" color="white">
              {displayName}
            </ThemedText>
          </Animated.View>
        </Animated.View>

        {/* 内容层 —— 后渲染，自然压在 Hero 之上 */}
        <Slot />

        {/* 顶部操作栏 —— 最顶层，始终可点击 */}
        <View
          pointerEvents="box-none"
          style={[styles.heroTopBar, { paddingTop: insets.top + 6 }]}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.collapsedTitle, { opacity: collapsedTitleOpacity }]}
          >
            <ThemedText fontWeight="700" color="white">
              {displayName}
            </ThemedText>
          </Animated.View>
          <Pressable style={styles.heroIconButton} hitSlop={8}>
            <Settings size={20} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>
    </ProfileContext.Provider>
  );
}

// ─── 样式 ────────────────────────────────────────────────────────────────────
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
  },
  heroCoverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
  },
  heroMaskLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  collapsedTitle: {
    flex: 1,
  },
  heroIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(17, 24, 39, 0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    zIndex: 2,
  },
});
