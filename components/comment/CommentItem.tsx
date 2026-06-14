import { api } from "@/api";
import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { formatRelativeTime } from "@/lib/time";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Crown, Heart, MessageCircle, ThumbsUp } from "lucide-react-native";
import { memo, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
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

function CommentItem({ data, articleId, articleAuthorId }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const contentWidth = width - 76;
  const replyComposerRef = useRef<BottomSheetModal>(null);

  const [commentState, setCommentState] = useState(data);
  const [liking, setLiking] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);

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
    if (!articleId || showReplyComposer) return;
    setShowReplyComposer(true);
    requestAnimationFrame(() => {
      replyComposerRef.current?.present();
    });
  }, [articleId, showReplyComposer]);

  const handleReplySubmitted = useCallback(() => {
    setCommentState((prev) => ({
      ...prev,
      replyCount: (prev.replyCount || 0) + 1,
    }));
  }, []);

  const handleReplyLike = useCallback(async (replyId: number) => {
    try {
      await api.commentControllerLike(String(replyId));
    } catch {
      // 静默失败
    }
  }, []);

  const handleAuthorPress = useCallback(() => {
    if (!author?.id) return;
    router.push(
      {
        pathname: "/user/[id]",
        params: { id: String(author.id), user: JSON.stringify(author) },
      },
      { dangerouslySingular: true },
    );
  }, [author, router]);

  if (!hasContent) {
    return null;
  }

  return (
    <>
      <View style={[styles.container]}>
        {/* Header: Avatar + Name + Floor + OP badge */}
        <Pressable
          onPress={handleAuthorPress}
          hitSlop={8}
          style={styles.header}
        >
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
        </Pressable>

        {/* Content */}
        {hasContent && (
          <Pressable style={styles.content} onPress={handleReply}>
            {!!commentState.content?.trim() && (
              <>
                {commentState.author?.equippedDecorations?.COMMENT_BUBBLE ? (
                  <View style={styles.bubbleWrapper}>
                    {commentState.author.equippedDecorations.COMMENT_BUBBLE
                      .imageUrl && (
                      <Image
                        source={{
                          uri: commentState.author.equippedDecorations
                            .COMMENT_BUBBLE.imageUrl,
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
                            commentState.author.equippedDecorations
                              .COMMENT_BUBBLE.bubbleColor || undefined,
                        },
                      ]}
                    >
                      <RenderHtml
                        source={{ html: commentState.content }}
                        contentWidth={contentWidth}
                      />
                    </View>
                  </View>
                ) : (
                  <RenderHtml
                    source={{ html: commentState.content }}
                    contentWidth={contentWidth}
                  />
                )}
              </>
            )}
          </Pressable>
        )}
        {commentState.images && commentState.images.length > 0 && (
          <View style={{ paddingVertical: 12 }}>
            <CommentImageGallery
              hasEdge
              images={commentState.images || []}
              contentWidth={contentWidth}
              articleId={articleId}
              parentId={commentState.id}
              replyToName={author?.nickname || author?.username || ""}
              isLiked={commentState.isLiked}
              likeCount={commentState.likes || 0}
              onLike={handleLike}
              onSubmitted={handleReplySubmitted}
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
              <MessageCircle size={16} color={theme.foreground} />
              <ThemedText size={12} color={theme.foreground}>
                {t("commentList.reply")}
              </ThemedText>
            </Pressable>

            <Pressable
              hitSlop={8}
              style={styles.actionBtn}
              onPress={handleLike}
            >
              <ThumbsUp
                size={16}
                color={commentState.isLiked ? theme.primary : theme.foreground}
              />
              <ThemedText
                size={12}
                color={commentState.isLiked ? theme.primary : theme.foreground}
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
              <Heart size={12} color="#FF6B6B" fill="#FF6B6B" />
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
            articleId={articleId}
            articleAuthorId={articleAuthorId}
            onLike={handleReplyLike}
            onReply={handleReply}
          />
        )}
      </View>

      <CommentComposerModal
        ref={replyComposerRef}
        articleId={showReplyComposer ? articleId : undefined}
        parentId={showReplyComposer ? commentState.id : undefined}
        replyToName={
          showReplyComposer
            ? author?.nickname || author?.username || ""
            : undefined
        }
        onClose={() => setShowReplyComposer(false)}
        onSubmitted={handleReplySubmitted}
      />
    </>
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
    paddingRight: 14,
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
