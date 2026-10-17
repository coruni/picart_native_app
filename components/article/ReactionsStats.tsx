import { api, ArticleLikeDtoReactionTypeEnum } from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import angry from "@/assets/images/reaction/angry.png";
import dislike from "@/assets/images/reaction/dislike.png";
import haha from "@/assets/images/reaction/haha.png";
import like from "@/assets/images/reaction/like.png";
import love from "@/assets/images/reaction/love.png";
import sad from "@/assets/images/reaction/sad.png";
import wow from "@/assets/images/reaction/wow.png";
import { Image } from "expo-image";

const reactionImageMap: Record<string, any> = {
  haha,
  wow,
  dislike,
  like,
  angry,
  sad,
  love,
};

const reactionOrder = [
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
  "dislike",
];

type Props = {
  article: ArticleData | undefined;
  onArticleInteractionChange?: (
    updates: Partial<
      Pick<ArticleData, "reactionStats" | "userReaction" | "isLiked" | "likes">
    >,
  ) => void;
};

const SHIMMER_DURATION = 900;
const SHIMMER_FADE_OUT = 180;
const SHIMMER_MIN_VISIBLE = 420;

function ReactionButton({
  emoji,
  count,
  isReacted,
  pending,
  disabled,
  onPress,
}: {
  emoji: string;
  count: number;
  isReacted: boolean;
  pending: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const { theme, isDark } = useTheme();
  const progress = useSharedValue(isReacted ? 1 : 0);
  const shimmer = useSharedValue(0);
  const shimmerOpacity = useSharedValue(0);
  const [width, setWidth] = useState(0);
  const shimmerStartedAt = useRef(0);

  useEffect(() => {
    progress.value = withTiming(isReacted ? 1 : 0, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReacted]);

  useEffect(() => {
    if (pending) {
      shimmerStartedAt.current = Date.now();
      shimmer.value = 0;
      shimmerOpacity.value = withTiming(1, { duration: 120 });
      shimmer.value = withRepeat(
        withTiming(1, { duration: SHIMMER_DURATION, easing: Easing.linear }),
        -1,
        false,
      );
      return;
    }
    if (!shimmerStartedAt.current) return;
    const rest = Math.max(
      0,
      SHIMMER_MIN_VISIBLE - (Date.now() - shimmerStartedAt.current),
    );
    const fadeTimer = setTimeout(() => {
      shimmerOpacity.value = withTiming(0, { duration: SHIMMER_FADE_OUT });
    }, rest);
    const stopTimer = setTimeout(() => {
      cancelAnimation(shimmer);
      shimmer.value = 0;
      shimmerStartedAt.current = 0;
    }, rest + SHIMMER_FADE_OUT);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(stopTimer);
    };
  }, [pending, shimmer, shimmerOpacity]);

  const bandWidth = Math.max(24, Math.round(width * 0.5));

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.secondaryBackground, theme.primary + "40"],
    ),
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [-bandWidth, width]) },
      { skewX: "-20deg" },
    ],
  }));

  const shimmerColors = isDark
    ? (["rgba(255,255,255,0)", "rgba(255,255,255,0.16)", "rgba(255,255,255,0)"] as const)
    : ([
        "rgba(102,128,255,0)",
        "rgba(102,128,255,0.22)",
        "rgba(102,128,255,0)",
      ] as const);

  const textColor = isReacted ? theme.primary : theme.secondary;

  return (
    <Animated.View
      style={[styles.reactionBtn, animatedStyle]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityState={{ selected: isReacted, disabled }}
      >
        <Image
          source={reactionImageMap[emoji]}
          style={[styles.reactionIcon, isReacted && styles.reactionIconActive]}
        />
        <ThemedText size={13} color={textColor}>
          {count}
        </ThemedText>
      </Pressable>
      <Animated.View
        pointerEvents="none"
        style={[styles.shimmer, { width: bandWidth }, shimmerStyle]}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
}

function ReactionsStats({ article, onArticleInteractionChange }: Props) {
  const { showToast } = useToast();
  const isAuthenticated = useAuthStore((state) => state.isLoggedIn);

  const [reactionStats, setReactionStats] = useState<Record<string, number>>(
    () => article?.reactionStats || {},
  );
  const [userReaction, setUserReaction] = useState<string | null>(
    () => article?.userReaction || null,
  );
  const [loading, setLoading] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);

  useEffect(() => {
    if (!article) return;
    const id = requestAnimationFrame(() => {
      setReactionStats(
        (article.reactionStats ?? {}) as unknown as Record<string, number>,
      );
      setUserReaction(article.userReaction || null);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id, article?.reactionStats, article?.userReaction]);

  const handleReactionClick = useCallback(
    async (emoji: string) => {
      if (!isAuthenticated) {
        return;
      }
      if (loading || !article?.id) return;

      setLoading(true);
      setPendingReaction(emoji);
      const wasReacted = userReaction === emoji;
      const currentReaction = userReaction;

      try {
        await api.articleControllerLike(String(article.id), {
          reactionType: emoji as ArticleLikeDtoReactionTypeEnum,
        });

        const newStats = { ...reactionStats };

        if (wasReacted) {
          newStats[emoji] = Math.max(0, (newStats[emoji] || 0) - 1);
        } else {
          if (currentReaction && currentReaction !== emoji) {
            newStats[currentReaction] = Math.max(
              0,
              (newStats[currentReaction] || 0) - 1,
            );
          }
          newStats[emoji] = (newStats[emoji] || 0) + 1;
        }

        const newUserReaction = wasReacted ? null : emoji;
        setReactionStats(newStats);
        setUserReaction(newUserReaction);

        const totalLikes = Object.values(newStats).reduce(
          (sum, v) => sum + (v || 0),
          0,
        );

        onArticleInteractionChange?.({
          reactionStats: newStats as unknown as ArticleData["reactionStats"],
          userReaction: newUserReaction ?? undefined,
          isLiked: newUserReaction !== null,
          likes: totalLikes,
        });
      } catch (error) {
        console.error("Failed to toggle reaction:", error);
        showToast("操作失败");
      } finally {
        setLoading(false);
        setPendingReaction(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [article, isAuthenticated, loading, reactionStats, userReaction, showToast],
  );

  const orderedReactions = reactionOrder.filter(
    (type) => (reactionStats[type] || 0) > 0,
  );

  if (orderedReactions.length === 0) return null;

  return (
    <View style={styles.container}>
      {orderedReactions.map((emoji) => {
        const count = reactionStats[emoji] || 0;
        const isReacted = userReaction === emoji;
        return (
          <ReactionButton
            key={emoji}
            emoji={emoji}
            count={count}
            isReacted={isReacted}
            pending={pendingReaction === emoji}
            disabled={loading}
            onPress={() => void handleReactionClick(emoji)}
          />
        );
      })}
    </View>
  );
}

export default ReactionsStats;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  reactionBtn: {
    borderRadius: 99,
    paddingRight: 8,
    overflow: "hidden",
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  reactionIcon: {
    width: 26,
    height: 26,
  },
  reactionIconActive: {
    width: 26,
    height: 26,
  },
});
