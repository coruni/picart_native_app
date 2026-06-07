import { api, ArticleLikeDtoReactionTypeEnum } from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ShareModal from "@/components/article/ShareModal";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MessageCircle, Share, Star, ThumbsUp } from "lucide-react-native";
import { memo, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  article: ArticleData | undefined;
  onScrollToComments: () => void;
};

function ArticleBottomBar({ article, onScrollToComments }: Props) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [isLiked, setIsLiked] = useState(() => article?.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(() => article?.likes ?? 0);
  const [isFavorited, setIsFavorited] = useState(
    () => article?.isFavorited ?? false,
  );
  const [favoriteCount, setFavoriteCount] = useState(
    () => article?.favoriteCount ?? 0,
  );

  const shareRef = useRef<BottomSheetModal>(null);
  const [showShare, setShowShare] = useState(false);

  const handleLike = useCallback(async () => {
    if (!article) return;
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
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
  }, [article, isLiked, t]);

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
      Alert.alert(t("article.actionFailed"));
    } finally {
    }
  }, [article, isFavorited, t]);

  const handleShare = useCallback(() => {
    setShowShare(true);
    setTimeout(() => shareRef.current?.present(), 50);
  }, []);

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
        <View
          style={[
            styles.inputPlaceholder,
            { backgroundColor: theme.secondaryBackground },
          ]}
        >
          <TextInput
            style={[styles.inputText, { color: theme.secondary }]}
            placeholder={t("commentList.noComments")}
            placeholderTextColor={theme.secondary}
            editable={false}
            pointerEvents="none"
          />
        </View>

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
            {(article?.commentCount ?? 0) > 0 && (
              <ThemedText
                size={11}
                color={theme.secondary}
                style={styles.count}
              >
                {article?.commentCount}
              </ThemedText>
            )}
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
    </>
  );
}

export default memo(ArticleBottomBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  inputPlaceholder: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 14,
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
