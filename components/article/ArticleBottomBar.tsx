import { api, ArticleLikeDtoReactionTypeEnum } from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ShareModal from "@/components/article/ShareModal";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MessageCircle, Share, Star, ThumbsUp } from "lucide-react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

type Props = {
  article: ArticleData | undefined;
  onScrollToComments: () => void;
  onCommentSubmitted?: () => void;
  onArticleInteractionChange?: (
    updates: Partial<
      Pick<ArticleData, "isLiked" | "likes" | "reactionStats" | "userReaction">
    >,
  ) => void;
};

function ArticleBottomBar({
  article,
  onScrollToComments,
  onCommentSubmitted,
  onArticleInteractionChange,
}: Props) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  const [isLiked, setIsLiked] = useState(() => article?.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(() => article?.likes ?? 0);
  const [isFavorited, setIsFavorited] = useState(
    () => article?.isFavorited ?? false,
  );
  const [favoriteCount, setFavoriteCount] = useState(
    () => article?.favoriteCount ?? 0,
  );

  useEffect(() => {
    if (article) {
      setIsLiked(article.isLiked ?? false);
      setLikeCount(article.likes ?? 0);
      setIsFavorited(article.isFavorited ?? false);
      setFavoriteCount(article.favoriteCount ?? 0);
    }
  }, [
    article?.id,
    article?.isLiked,
    article?.likes,
    article?.isFavorited,
    article?.favoriteCount,
  ]);

  const shareRef = useRef<BottomSheetModal>(null);
  const commentComposerRef = useRef<BottomSheetModal>(null);
  const [showShare, setShowShare] = useState(false);
  const [showCommentComposer, setShowCommentComposer] = useState(false);

  const handleLike = useCallback(async () => {
    if (!article) return;
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));

    const currentStats = { ...(article.reactionStats || {}) };
    const currentReaction = article.userReaction || null;
    let newStats = currentStats;
    let newUserReaction = currentReaction;

    if (next) {
      newStats = { ...currentStats, like: (currentStats.like || 0) + 1 };
      newUserReaction = "like";
    } else {
      newStats = {
        ...currentStats,
        like: Math.max(0, (currentStats.like || 0) - 1),
      };
      if (currentReaction === "like") {
        newUserReaction = null;
      }
    }

    onArticleInteractionChange?.({
      isLiked: next,
      likes: next
        ? (article.likes || 0) + 1
        : Math.max(0, (article.likes || 0) - 1),
      reactionStats: newStats as ArticleData["reactionStats"],
      userReaction: newUserReaction ?? "",
    });

    try {
      if (next) {
        await api.articleControllerLike(String(article.id), {
          reactionType: ArticleLikeDtoReactionTypeEnum.Like,
        });
      } else {
        await api.articleControllerDislikeArticle(String(article.id), {});
      }
    } catch {
      setIsLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
      Alert.alert(t("article.actionFailed"));
    }
  }, [article, isLiked, t, onArticleInteractionChange]);

  const handleFavorite = useCallback(async () => {
    if (!article) return;
    const next = !isFavorited;
    setFavoriteCount((c) => c + (next ? 1 : -1));
    setIsFavorited(next);
    try {
      if (next) {
        await api.articleControllerFavoriteArticle(String(article.id));
      } else {
        await api.articleControllerUnfavoriteArticle(String(article.id));
      }
    } catch {
      setIsFavorited(!next);
      setFavoriteCount((c) => c + (next ? -1 : 1));
      // Alert.alert(t("article.actionFailed"));
    } finally {
    }
  }, [article, isFavorited, t]);

  const handleShare = useCallback(() => {
    setShowShare(true);
    setTimeout(() => shareRef.current?.present(), 50);
  }, []);

  const handleOpenCommentComposer = useCallback(() => {
    if (!article?.id || showCommentComposer) return;
    setShowCommentComposer(true);
    requestAnimationFrame(() => {
      commentComposerRef.current?.present();
    });
  }, [article?.id, showCommentComposer]);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            // paddingBottom: insets.bottom || 0,
          },
        ]}
      >
        {/* 评论输入框占位 - 纯展示，不可点击 */}
        <Pressable
          onPress={handleOpenCommentComposer}
          style={[
            styles.inputPlaceholder,
            { backgroundColor: theme.secondaryBackground },
          ]}
        >
          <TextInput
            style={[styles.inputText, { color: theme.secondary }]}
            placeholder={t("commentComposer.placeholder")}
            placeholderTextColor={theme.secondary}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>

        {/* 右侧操作区 */}
        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={handleShare} hitSlop={6}>
            <Share size={22} color={theme.text} />
            <ThemedText size={11} color={theme.secondary} style={styles.count}>
              0
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={onScrollToComments}
            hitSlop={6}
          >
            <MessageCircle size={22} color={theme.text} />
            <ThemedText size={11} color={theme.secondary} style={styles.count}>
              {article?.commentCount || 0}
            </ThemedText>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleLike} hitSlop={6}>
            <ThumbsUp
              size={22}
              color={isLiked ? colors.primary : theme.text}
              fill={isLiked ? colors.primary : "transparent"}
            />
            <ThemedText
              size={11}
              color={isLiked ? colors.primary : theme.secondary}
              style={styles.count}
            >
              {likeCount || 0}
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={handleFavorite}
            hitSlop={6}
          >
            {isFavorited ? (
              <Star size={22} color={colors.primary} fill={colors.primary} />
            ) : (
              <Star size={22} color={theme.text} />
            )}
            <ThemedText
              size={11}
              color={isFavorited ? colors.primary : theme.secondary}
              style={styles.count}
            >
              {favoriteCount}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <ShareModal
        ref={shareRef}
        data={showShare ? article : undefined}
        onClose={() => setShowShare(false)}
      />
      <CommentComposerModal
        ref={commentComposerRef}
        articleId={showCommentComposer ? String(article?.id) : undefined}
        onClose={() => setShowCommentComposer(false)}
        onSubmitted={onCommentSubmitted}
      />
    </>
  );
}

export default memo(ArticleBottomBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    elevation: 0,
    paddingVertical: 4,
    height: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  inputPlaceholder: {
    height: 36,
    width: 160,
    borderRadius: 18,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtn: {
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 36,
  },
  count: {
    marginTop: 1,
    lineHeight: 13,
  },
});
