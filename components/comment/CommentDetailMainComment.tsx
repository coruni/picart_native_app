import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { formatRelativeTime } from "@/lib/time";
import { Crown, Heart, MessageCircle, ThumbsUp } from "lucide-react-native";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";

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

type CommentDetailMainCommentProps = {
  comment: CommentControllerFindAll200ResponseDataDataInner;
  articleId: string;
  articleAuthorId?: number;
  contentWidth: number;
  onAuthorPress: () => void;
  onReply: () => void;
  onLike: () => void;
  onReplySubmitted: () => void;
};

function CommentDetailMainComment({
  comment,
  articleId,
  articleAuthorId,
  contentWidth,
  onAuthorPress,
  onReply,
  onLike,
  onReplySubmitted,
}: CommentDetailMainCommentProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const author = comment.author;
  const showAuthorBadge =
    articleAuthorId && author?.id === Number(articleAuthorId);
  const isFloor = comment.floor != null;
  const hasContent = hasRenderableContent(comment.content, comment.images);

  return (
    <View style={styles.mainComment}>
      <View style={styles.header}>
        <Pressable onPress={onAuthorPress} hitSlop={8}>
          <Avatar
            uri={author?.avatar}
            size={36}
            avatarFrameUri={author?.equippedDecorations?.AVATAR_FRAME?.imageUrl}
          />
        </Pressable>

        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Pressable onPress={onAuthorPress} hitSlop={8}>
              <ThemedText size={13} fontWeight="600" numberOfLines={1}>
                {author?.nickname || author?.username || ""}
              </ThemedText>
            </Pressable>

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
              ? t("commentList.floor", { floor: comment.floor })
              : t("commentList.unknownFloor")}
          </ThemedText>
        </View>
      </View>

      {hasContent && (
        <View style={styles.content}>
          {!!comment.content?.trim() && (
            <>
              {comment.author?.equippedDecorations?.COMMENT_BUBBLE ? (
                <View style={styles.bubbleWrapper}>
                  {comment.author.equippedDecorations.COMMENT_BUBBLE
                    .imageUrl && (
                    <Image
                      source={{
                        uri: comment.author.equippedDecorations.COMMENT_BUBBLE
                          .imageUrl,
                      }}
                      style={styles.bubbleImage}
                      resizeMode="contain"
                    />
                  )}
                  <View
                    style={[
                      styles.bubbleContent,
                      {
                        backgroundColor:
                          comment.author.equippedDecorations.COMMENT_BUBBLE
                            .bubbleColor || undefined,
                      },
                    ]}
                  >
                    <RenderHtml
                      source={{ html: comment.content }}
                      contentWidth={contentWidth}
                    />
                  </View>
                </View>
              ) : (
                <RenderHtml
                  source={{ html: comment.content }}
                  contentWidth={contentWidth}
                />
              )}
            </>
          )}
        </View>
      )}

      {comment.images && comment.images.length > 0 && (
        <View style={styles.galleryWrap}>
          <CommentImageGallery
            hasEdge={false}
            images={comment.images || []}
            contentWidth={contentWidth}
            articleId={articleId}
            parentId={comment.id}
            replyToName={author?.nickname || author?.username || ""}
            isLiked={comment.isLiked}
            likeCount={comment.likes || 0}
            onLike={onLike}
            onSubmitted={onReplySubmitted}
          />
        </View>
      )}

      <View style={styles.actions}>
        <ThemedText size={11} color={theme.secondary}>
          {formatRelativeTime(comment.createdAt, t)}
        </ThemedText>

        <View style={styles.actionBtns}>
          <Pressable hitSlop={8} style={styles.actionBtn} onPress={onReply}>
            <MessageCircle size={15} color={theme.foreground} />
            <ThemedText size={12} color={theme.foreground}>
              {t("commentList.reply")}
            </ThemedText>
          </Pressable>

          <Pressable hitSlop={8} style={styles.actionBtn} onPress={onLike}>
            <ThumbsUp
              size={16}
              color={comment.isLiked ? theme.primary : theme.foreground}
            />
            <ThemedText
              size={12}
              color={comment.isLiked ? theme.primary : theme.foreground}
            >
              {comment.likes || t("commentList.like")}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {comment.isAuthorLiked && (
        <View style={styles.authorLikedContainer}>
          <View style={styles.authorLiked}>
            <Heart size={12} color="#FF6B6B" fill="#FF6B6B" />
            <ThemedText size={11} color="#FF6B6B">
              {t("commentList.authorLiked")}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainComment: {
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  header: {
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
    marginTop: 8,
    marginBottom: 8,
  },
  bubbleWrapper: {
    marginTop: 20,
  },
  bubbleImage: {
    position: "absolute",
    top: -20,
    right: 0,
    width: 132,
    height: 32,
  },
  bubbleContent: {
    minWidth: 160,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    borderRadius: 12,
  },
  galleryWrap: {
    paddingVertical: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
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
    flexDirection: "row",
    marginTop: 8,
  },
  authorLiked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FF6B6B20",
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
});

export default memo(CommentDetailMainComment);
