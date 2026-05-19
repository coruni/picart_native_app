import { api } from "@/api";
import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import Avatar from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { formatRelativeTime } from "@/lib/time";
import { Crown, Heart, MessageCircle, ThumbsUp } from "lucide-react-native";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import CommentReplyList from "./CommentReplyList";

const RE_HTML_TAGS = /<[^>]*>/g;
const RE_NBSP = /&nbsp;|&#160;/gi;
const OP_BADGE_COLOR = "#12ADB3";

function hasRenderableContent(
  content?: string | null,
  images?: CommentControllerFindAll200ResponseDataDataInner["images"],
) {
  const plainText = (content || "")
    .replace(RE_HTML_TAGS, "")
    .replace(RE_NBSP, " ")
    .trim();

  return plainText.length > 0 || Boolean(images?.length);
}

interface Props {
  data: CommentControllerFindAll200ResponseDataDataInner;
  articleId: string;
  articleAuthorId?: number;
}

function CommentItem({ data, articleId: _articleId, articleAuthorId }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const contentWidth = width - 76;

  const [commentState, setCommentState] = useState(data);
  const [liking, setLiking] = useState(false);

  const author = commentState.author;
  const showAuthorBadge =
    articleAuthorId && author?.id === Number(articleAuthorId);
  const isFloor = commentState.floor != null;
  const hasContent = hasRenderableContent(
    commentState.content,
    commentState.images,
  );

  const handleLike = useCallback(async () => {
    if (liking) return;
    setLiking(true);

    // 乐观更新
    const prevLiked = commentState.isLiked;
    const prevLikes = commentState.likes || 0;
    setCommentState((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: Math.max(0, (prev.likes || 0) + (prev.isLiked ? -1 : 1)),
    }));

    try {
      await api.commentControllerLike(String(commentState.id));
    } catch {
      // 回滚
      setCommentState((prev) => ({
        ...prev,
        isLiked: prevLiked,
        likes: prevLikes,
      }));
    } finally {
      setLiking(false);
    }
  }, [commentState.id, commentState.isLiked, commentState.likes, liking]);

  const handleReply = useCallback(() => {
    // 不打开编辑器，只供外部回调 – 由 ArticleCommentList 处理
  }, []);

  const handleReplyLike = useCallback(async (replyId: number) => {
    try {
      await api.commentControllerLike(String(replyId));
    } catch {
      // 静默失败
    }
  }, []);

  if (!hasContent) {
    return null;
  }

  return (
    <View style={[styles.container]}>
      {/* Header: Avatar + Name + Floor + OP badge */}
      <View style={styles.header}>
        <Avatar
          uri={author?.avatar}
          size={34}
          avatarFrameUri={author?.equippedDecorations?.AVATAR_FRAME?.imageUrl}
        />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <ThemedText size={13} fontWeight="600" numberOfLines={1}>
              {author?.nickname || author?.username || ""}
            </ThemedText>
            {showAuthorBadge && (
              <View style={[styles.opBadge, { borderColor: OP_BADGE_COLOR }]}>
                <View style={styles.opIconWrap}>
                  <Crown size={10} color={OP_BADGE_COLOR} />
                </View>
                <ThemedText size={9} color={OP_BADGE_COLOR}>
                  {t("commentList.originalPoster")}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText size={11} color={theme.mutedForeground}>
            {isFloor
              ? t("commentList.floor", { floor: commentState.floor })
              : t("commentList.unknownFloor")}
          </ThemedText>
        </View>
      </View>

      {/* Content */}
      {hasContent && (
        <View style={styles.content}>
          {!!commentState.content?.trim() && (
            <RenderHtml
              source={{ html: commentState.content }}
              contentWidth={contentWidth}
            />
          )}
        </View>
      )}
      {commentState.images && commentState.images.length > 0 && (
        <View style={{ paddingVertical: 12 }}>
          <CommentImageGallery
            hasEdge
            images={commentState.images || []}
            contentWidth={contentWidth}
          />
        </View>
      )}

      {/* Actions: Time + Reply + Like */}
      <View style={styles.actions}>
        <ThemedText size={11} color={theme.secondary}>
          {formatRelativeTime(commentState.createdAt, t)}
        </ThemedText>

        <View style={styles.actionBtns}>
          <Pressable
            hitSlop={8}
            style={styles.actionBtn}
            onPress={() => handleReply()}
          >
            <MessageCircle size={16} color={theme.secondary} />
            <ThemedText size={12} color={theme.secondary}>
              {t("commentList.reply")}
            </ThemedText>
          </Pressable>

          <Pressable hitSlop={8} style={styles.actionBtn} onPress={handleLike}>
            <ThumbsUp
              size={16}
              color={commentState.isLiked ? theme.primary : theme.secondary}
            />
            <ThemedText
              size={12}
              color={commentState.isLiked ? theme.primary : theme.secondary}
            >
              {commentState.likes || 0}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Author liked badge */}
      {commentState.isAuthorLiked && (
        <View style={styles.authorLikedContainer}>
          <View style={styles.authorLiked}>
            <Heart size={12} color="#FF6B6B" />
            <ThemedText size={11} color="#FF6B6B">
              {t("commentList.authorLiked")}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Reply list */}
      {commentState.replies && commentState.replies.length > 0 && (
        <CommentReplyList
          comment={commentState}
          articleAuthorId={articleAuthorId}
          onLike={handleReplyLike}
          onReply={() => {}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  opBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  opIconWrap: {
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-45deg" }],
  },
  content: {
    paddingLeft: 60,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 60,
    paddingRight: 14,
    marginBottom: 4,
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  authorLikedContainer: {
    paddingLeft: 60,
    paddingRight: 14,
    flexDirection: "row",
    marginVertical: 4,
  },
  authorLiked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FF6B6B20",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
});

export default memo(CommentItem);
