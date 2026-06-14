import { api, ArticleLikeDtoReactionTypeEnum } from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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

function ReactionButton({
  emoji,
  count,
  isReacted,
  onPress,
  loading,
}: {
  emoji: string;
  count: number;
  isReacted: boolean;
  onPress: () => void;
  loading: boolean;
}) {
  const { theme, colors } = useTheme();
  const scale = useSharedValue(1);
  const progress = useSharedValue(isReacted ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isReacted ? 1 : 0, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReacted]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.secondaryBackground, theme.primary + "40"],
    ),
    transform: [{ scale: scale.value }],
  }));

  const textColor = isReacted ? theme.primary : theme.secondary;

  return (
    <Animated.View style={[styles.reactionBtn, animatedStyle]}>
      <Pressable
        onPress={onPress}
        disabled={loading}
        onPressIn={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSpring(0.88, { stiffness: 400, damping: 15 });
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSpring(1, { stiffness: 400, damping: 15 });
        }}
        style={styles.pressable}
      >
        <Image
          source={reactionImageMap[emoji]}
          style={[styles.reactionIcon, isReacted && styles.reactionIconActive]}
        />
        <ThemedText size={13} color={textColor}>
          {count}
        </ThemedText>
      </Pressable>
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
            onPress={() => void handleReactionClick(emoji)}
            loading={loading}
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
  reactionIcon: {
    width: 26,
    height: 26,
  },
  reactionIconActive: {
    width: 26,
    height: 26,
  },
});
