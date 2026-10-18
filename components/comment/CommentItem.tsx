import { api } from "@/api";
import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import CommentActionSheet, {
  type CommentActionSheetRef,
} from "@/components/feedback/CommentActionSheet";
import CertificationBadge from "@/components/user/CertificationBadge";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/rich-text/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useTranslate } from "@/hooks/useTranslate";
import { normalizeImageUrl } from "@/lib/image";
import { formatRelativeTime } from "@/lib/time";
import { resolveLanguage, useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import CrownIcon from "@hugeicons/core-free-icons/CrownIcon";
import FavouriteIcon from "@hugeicons/core-free-icons/FavouriteIcon";
import LanguagesIcon from "@hugeicons/core-free-icons/LanguagesIcon";
import Message02Icon from "@hugeicons/core-free-icons/Message02Icon";
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon";
import ThumbsUpIcon from "@hugeicons/core-free-icons/ThumbsUpIcon";
import HugeIcon, { ICON_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import { memo, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
const COMMENT_BODY_STYLE = { fontSize: 15, lineHeight: 23 };

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
  onDeleted?: (id: number) => void;
}

function CommentItem({ data, articleId, articleAuthorId, onDeleted }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const contentWidth = width - 76;
  const replyComposerRef = useRef<BottomSheetModal>(null);
  const actionSheetRef = useRef<CommentActionSheetRef>(null);
  const currentUserId = useAuthStore(
    (state) => state.profile?.id ?? state.user?.id,
  );

  const [commentState, setCommentState] = useState(data);
  const [liking, setLiking] = useState(false);

  const {
    displayText: translatedContent,
    showTranslated,
    loading: translating,
    detectedLang,
    toggle: toggleTranslate,
  } = useTranslate(commentState.content ?? "", { auto: false });
  const appLang = useSettingsStore((s) => resolveLanguage(s.language));
  // 默认显示图标（翻译前 detectedLang 为 null，不能提前隐藏）
  // 只有在翻译完成且检测到源语言与 app 语言相同时才隐藏；纯数字内容也不显示
  const articleLangMatchesApp =
    detectedLang !== null &&
    (detectedLang === "num" ||
      appLang.startsWith(detectedLang) ||
      detectedLang.startsWith(appLang));
  const showTranslateIcon = !articleLangMatchesApp || showTranslated;
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const replyLikingIdsRef = useRef<Set<number>>(new Set());

  const author = commentState.author;
  const isCommentOwner =
    author?.id != null && Number(currentUserId) === Number(author.id);
  // 文章作者（楼主）与评论作者都可以删除评论
  const isArticleAuthor =
    articleAuthorId != null &&
    Number(currentUserId) === Number(articleAuthorId);
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

  const handleReplyLike = useCallback(
    async (replyId: number) => {
      if (replyLikingIdsRef.current.has(replyId)) {
        return;
      }

      const previousReply = commentState.replies?.find(
        (reply) => reply.id === replyId,
      );
      if (!previousReply) {
        return;
      }

      replyLikingIdsRef.current.add(replyId);

      setCommentState((prev) => {
        if (!prev.replies?.length) {
          return prev;
        }

        return {
          ...prev,
          replies: prev.replies.map((reply) =>
            reply.id === replyId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: Math.max(
                    0,
                    (reply.likes || 0) + (reply.isLiked ? -1 : 1),
                  ),
                }
              : reply,
          ),
        };
      });

      try {
        await api.commentControllerLike(String(replyId));
      } catch {
        setCommentState((prev) => {
          if (!prev.replies?.length) {
            return prev;
          }

          return {
            ...prev,
            replies: prev.replies.map((reply) =>
              reply.id === replyId
                ? {
                    ...reply,
                    isLiked: previousReply.isLiked,
                    likes: previousReply.likes || 0,
                  }
                : reply,
            ),
          };
        });
      } finally {
        replyLikingIdsRef.current.delete(replyId);
      }
    },
    [commentState.replies],
  );

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
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <ThemedText size={13} fontWeight="600" numberOfLines={1}>
                  {author?.nickname || author?.username || ""}
                </ThemedText>
                <CertificationBadge certification={author?.certification} size={12} />
                {showAuthorBadge && (
                  <View
                    style={[styles.opBadge, { borderColor: OP_BADGE_COLOR }]}
                  >
                    <View style={styles.opIconWrap}>
                      <HugeIcon icon={CrownIcon} size={12} color={OP_BADGE_COLOR} />
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 16,
              }}
            >
              {showTranslateIcon && (
                <Pressable
                  hitSlop={10}
                  onPress={toggleTranslate}
                  disabled={translating}
                >
                  {translating ? (
                    <ActivityIndicator size={20} color={theme.primary} />
                  ) : (
                    <HugeIcon icon={LanguagesIcon} size={20} color={showTranslated ? theme.primary : theme.secondary} />
                  )}
                </Pressable>
              )}
              <Pressable
                hitSlop={10}
                onPress={() => actionSheetRef.current?.present()}
              >
                <HugeIcon icon={MoreVerticalIcon} color={theme.secondary} />
              </Pressable>
            </View>
          </View>
        </Pressable>

        {/* Content */}
        {hasContent && (
          <Pressable style={styles.content} onPress={handleReply}>
            {!!commentState.content?.trim() && (
              <View>
                {commentState.author?.equippedDecorations?.COMMENT_BUBBLE ? (
                  <View style={styles.bubbleWrapper}>
                    {commentState.author.equippedDecorations.COMMENT_BUBBLE
                      .imageUrl && (
                      <Image
                        source={{
                          uri: normalizeImageUrl(
                            commentState.author.equippedDecorations
                              .COMMENT_BUBBLE.imageUrl,
                          ),
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
                        source={{ html: translatedContent }}
                        contentWidth={contentWidth}
                        baseStyle={COMMENT_BODY_STYLE}
                      />
                    </View>
                  </View>
                ) : (
                  <RenderHtml
                    source={{ html: translatedContent }}
                    contentWidth={contentWidth}
                    baseStyle={COMMENT_BODY_STYLE}
                  />
                )}
              </View>
            )}
          </Pressable>
        )}
        {commentState.images && commentState.images.length > 0 && (
          <View style={{ paddingVertical: 8 }}>
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
              <HugeIcon icon={Message02Icon} size={20} color={theme.secondary} />
              <ThemedText size={12} color={theme.secondary}>
                {t("commentList.reply")}
              </ThemedText>
            </Pressable>

            <Pressable
              hitSlop={8}
              style={styles.actionBtn}
              onPress={handleLike}
            >
              <HugeIcon
                icon={ThumbsUpIcon}
                size={20}
                strokeWidth={commentState.isLiked ? 0 : ICON_STROKE_WIDTH}
                fill={commentState.isLiked ? theme.primary : undefined}
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
              <HugeIcon
                icon={FavouriteIcon}
                size={16}
                color="#FF6B6B"
                strokeWidth={0}
                fill="#FF6B6B"
              />
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

      <CommentActionSheet
        ref={actionSheetRef}
        comment={commentState}
        isOwner={isCommentOwner}
        isArticleAuthor={isArticleAuthor}
        onDeleted={onDeleted}
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
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    marginBottom: 10,
  },
  bubbleWrapper: {
    marginTop: 8,
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
    marginTop: 2,
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
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
});

export default memo(CommentItem);
