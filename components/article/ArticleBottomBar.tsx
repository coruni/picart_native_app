import { api, ArticleLikeDtoReactionTypeEnum } from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ShareModal from "@/components/article/ShareModal";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import ReactionPicker, {
  type ReactionAnchor,
} from "@/components/feedback/ReactionPicker";
import ThemedText from "@/components/ui/ThemedText";
import { REACTION_IMAGES, REACTION_LABEL_KEYS, isReactionType, type ReactionType } from "@/constants/reactions";
import { useTheme } from "@/hooks/useTheme";
import { applyReaction, type ReactionCounts } from "@/lib/articleReaction";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { MessageCircle, Share, Star, ThumbsUp } from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

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

/** 长按多久弹表态条，短于系统默认 500ms 让手势更跟手 */
const LIKE_LONG_PRESS_DELAY = 320;

function resolveReaction(
  value: string | undefined | null,
  isLiked?: boolean,
): ReactionType | null {
  if (isReactionType(value)) return value;
  return isLiked ? "like" : null;
}

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
  const [userReaction, setUserReaction] = useState<ReactionType | null>(() =>
    resolveReaction(article?.userReaction, article?.isLiked),
  );
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
      setUserReaction(resolveReaction(article.userReaction, article.isLiked));
      setIsFavorited(article.isFavorited ?? false);
      setFavoriteCount(article.favoriteCount ?? 0);
    }
  }, [
    article?.id,
    article?.isLiked,
    article?.likes,
    article?.userReaction,
    article?.isFavorited,
    article?.favoriteCount,
  ]);

  const shareRef = useRef<BottomSheetModal>(null);
  const commentComposerRef = useRef<BottomSheetModal>(null);
  const likeButtonRef = useRef<View>(null);
  const [showShare, setShowShare] = useState(false);
  const [showCommentComposer, setShowCommentComposer] = useState(false);
  const [reactionVisible, setReactionVisible] = useState(false);
  const [reactionAnchor, setReactionAnchor] = useState<ReactionAnchor | null>(
    null,
  );

  const reactionStats = useMemo<ReactionCounts>(
    () => (article?.reactionStats ?? {}) as ReactionCounts,
    [article?.reactionStats],
  );

  /** 把一份表态状态同时写进本地 UI 与页面级文章状态 */
  const pushReactionState = useCallback(
    (state: {
      reactionStats: ReactionCounts;
      userReaction: ReactionType | null;
      likes: number;
    }) => {
      setIsLiked(state.userReaction !== null);
      setLikeCount(state.likes);
      setUserReaction(state.userReaction);
      onArticleInteractionChange?.({
        isLiked: state.userReaction !== null,
        likes: state.likes,
        reactionStats: state.reactionStats as unknown as ArticleData["reactionStats"],
        userReaction: state.userReaction ?? "",
      });
    },
    [onArticleInteractionChange],
  );

  /** 表态乐观更新 + 提交；结果为 null 表示取消，走 dislike 接口 */
  const commitReaction = useCallback(
    async (next: ReactionType) => {
      if (!article?.id) return;

      const before = {
        reactionStats,
        userReaction: resolveReaction(article.userReaction, article.isLiked),
        likes: article.likes ?? 0,
      };
      const result = applyReaction({ ...before, next });

      pushReactionState(result);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => {},
      );

      try {
        if (result.userReaction === null) {
          await api.articleControllerDislikeArticle(String(article.id), {});
        } else {
          await api.articleControllerLike(String(article.id), {
            reactionType: result.userReaction as ArticleLikeDtoReactionTypeEnum,
          });
        }
      } catch {
        pushReactionState(before);
        Alert.alert(t("article.actionFailed"));
      }
    },
    [
      article?.id,
      article?.isLiked,
      article?.likes,
      article?.userReaction,
      pushReactionState,
      reactionStats,
      t,
    ],
  );

  const handleLike = useCallback(() => {
    void commitReaction("like");
  }, [commitReaction]);

  const handleLikeLongPress = useCallback(() => {
    likeButtonRef.current?.measureInWindow((x, y, width, height) => {
      setReactionAnchor({ x, y, width, height });
      setReactionVisible(true);
      void Haptics.selectionAsync().catch(() => {});
    });
  }, []);

  const handleSelectReaction = useCallback(
    (type: ReactionType) => {
      setReactionVisible(false);
      void commitReaction(type);
    },
    [commitReaction],
  );

  const handleCloseReaction = useCallback(() => {
    setReactionVisible(false);
  }, []);

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

          {/* 短按 = 点赞/取消，长按 = 弹表态条 */}
          <Pressable
            ref={likeButtonRef}
            style={styles.actionBtn}
            onPress={handleLike}
            onLongPress={handleLikeLongPress}
            delayLongPress={LIKE_LONG_PRESS_DELAY}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={t(REACTION_LABEL_KEYS[userReaction ?? "like"])}
            accessibilityHint={t("article.reactions.hint")}
          >
            {userReaction ? (
              <Image
                source={REACTION_IMAGES[userReaction]}
                style={styles.reactionIcon}
                contentFit="contain"
                transition={0}
              />
            ) : (
              <ThumbsUp size={22} color={theme.text} />
            )}
            <ThemedText
              size={11}
              color={isLiked ? theme.primary : theme.secondary}
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
              color={isFavorited ? theme.primary : theme.secondary}
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
      <ReactionPicker
        visible={reactionVisible}
        anchor={reactionAnchor}
        selected={userReaction}
        onSelect={handleSelectReaction}
        onClose={handleCloseReaction}
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
  reactionIcon: {
    width: 24,
    height: 24,
    // 与 22 号 lucide 图标保持同样的光学高度，切换时不跳行
    marginVertical: -1,
  },
});
