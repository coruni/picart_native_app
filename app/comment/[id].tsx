import { api } from "@/api";
import type {
  CommentControllerFindAll200ResponseDataDataInner,
  CommentControllerFindAll200ResponseDataDataInnerRepliesInner,
} from "@/api/generated";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { formatRelativeTime } from "@/lib/time";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Crown, Heart, MessageCircle, ThumbsUp } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

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

interface ReplyItemProps {
  reply: CommentControllerFindAll200ResponseDataDataInnerRepliesInner;
  articleId: string;
  rootParentId?: number;
  articleAuthorId?: number;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
}

function ReplyItem({
  reply,
  articleId,
  rootParentId,
  articleAuthorId,
  onLike,
  onReply,
}: ReplyItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const contentWidth = width - 76;

  const author = reply.author;
  const parent = reply.parent;
  const replyTo =
    parent && rootParentId && parent.id !== rootParentId
      ? parent.author?.nickname || parent.author?.username
      : null;
  const showAuthorBadge =
    articleAuthorId && reply.author?.id === Number(articleAuthorId);

  const hasContent = hasRenderableContent(reply.content, reply.images);

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
    <View style={replyStyles.container}>
      {/* Header: Avatar + Name */}
      <Pressable
        onPress={handleAuthorPress}
        hitSlop={8}
        style={replyStyles.header}
      >
        <Avatar
          uri={author?.avatar}
          size={28}
          avatarFrameUri={author?.equippedDecorations?.AVATAR_FRAME?.imageUrl}
        />
        <View style={replyStyles.headerText}>
          <View style={replyStyles.nameRow}>
            <ThemedText size={13} fontWeight="600" numberOfLines={1}>
              {author?.nickname || author?.username || ""}
            </ThemedText>
            {showAuthorBadge && (
              <View
                style={[replyStyles.opBadge, { borderColor: OP_BADGE_COLOR }]}
              >
                <View style={replyStyles.opIconWrap}>
                  <Crown size={10} color={OP_BADGE_COLOR} />
                </View>
                <ThemedText size={9} color={OP_BADGE_COLOR}>
                  {t("commentList.originalPoster")}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </Pressable>

      {/* Reply-to hint */}
      {replyTo && (
        <ThemedText
          size={12}
          color={theme.secondary}
          style={replyStyles.replyTo}
        >
          {t("commentList.replyToPrefix")} {replyTo}
          {t("commentList.replyToSuffix")}
        </ThemedText>
      )}

      {/* Content */}
      {!!reply.content
        ?.replace(RE_HTML_TAGS, "")
        .replace(RE_NBSP, " ")
        .trim() && (
        <View style={replyStyles.content}>
          <RenderHtml
            baseStyle={{ fontSize: 14, color: theme.foreground }}
            source={{ html: reply.content }}
            contentWidth={contentWidth}
            numberOfLines={0}
          />
        </View>
      )}

      {reply.images && reply.images.length > 0 && (
        <View style={{ paddingVertical: 8 }}>
          <CommentImageGallery
            images={reply.images || []}
            contentWidth={contentWidth}
            hasEdge={false}
            articleId={articleId}
            parentId={rootParentId ?? reply.id}
            replyToName={author?.nickname || author?.username || ""}
            isLiked={reply.isLiked}
            likeCount={reply.likes || 0}
            displayMode="link"
            onLike={() => onLike(reply.id)}
          />
        </View>
      )}

      {/* Actions: Time + Reply + Like */}
      <View style={replyStyles.actions}>
        <ThemedText size={11} color={theme.secondary}>
          {formatRelativeTime(reply.createdAt, t)}
        </ThemedText>

        <View style={replyStyles.actionBtns}>
          <Pressable
            hitSlop={8}
            style={replyStyles.actionBtn}
            onPress={() => onReply(reply.id)}
          >
            <MessageCircle size={14} color={theme.secondary} />
            <ThemedText size={12} color={theme.secondary}>
              {t("commentList.reply")}
            </ThemedText>
          </Pressable>

          <Pressable
            hitSlop={8}
            style={replyStyles.actionBtn}
            onPress={() => onLike(reply.id)}
          >
            <ThumbsUp
              size={14}
              color={reply.isLiked ? theme.primary : theme.secondary}
            />
            <ThemedText
              size={12}
              color={reply.isLiked ? theme.primary : theme.secondary}
            >
              {reply.likes || 0}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const replyStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
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
  replyTo: {
    marginBottom: 4,
    marginLeft: 38,
  },
  content: {
    marginBottom: 6,
    marginLeft: 38,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 38,
    marginTop: 4,
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
});

export default function CommentDetailPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{
    id: string;
    articleId: string;
    articleAuthorId?: string;
    comment?: string;
  }>();

  const contentWidth = width - 76;
  const replyComposerRef = useRef<BottomSheetModal>(null);

  const [comment, setComment] =
    useState<CommentControllerFindAll200ResponseDataDataInner | null>(() => {
      if (params.comment) {
        try {
          return JSON.parse(params.comment);
        } catch {
          return null;
        }
      }
      return null;
    });
  const [replies, setReplies] = useState<
    CommentControllerFindAll200ResponseDataDataInner["replies"]
  >([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [liking, setLiking] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);

  const articleId = params.articleId || "";
  const articleAuthorId = params.articleAuthorId
    ? Number(params.articleAuthorId)
    : undefined;

  const fetchReplies = useCallback(
    async (pageNum: number, append = false) => {
      if (!params.id) return;

      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const { data: res } = await api.commentControllerFindOne(
          params.id,
          pageNum,
          20,
        );
        const newData =
          (((res.data as { data?: unknown }).data ?? []) as
            | CommentControllerFindAll200ResponseDataDataInner["replies"]
            | undefined) || [];

        if (append) {
          setReplies((prev) => [...(prev || []), ...newData]);
        } else {
          setReplies(newData);
        }

        setPage(pageNum + 1);
        setHasMore(newData.length >= 20);
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [params.id],
  );

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!params.id) return;
      setLoading(true);
      try {
        const { data: res } = await api.commentControllerFindOne(
          params.id,
          1,
          20,
        );
        if (cancelled) return;
        const newData =
          (((res.data as { data?: unknown }).data ?? []) as
            | CommentControllerFindAll200ResponseDataDataInner["replies"]
            | undefined) || [];
        setReplies(newData);
        setPage(2);
        setHasMore(newData.length >= 20);
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleLike = useCallback(async () => {
    if (!comment || liking) return;
    setLiking(true);

    const prevLiked = comment.isLiked;
    const prevLikes = comment.likes || 0;

    setComment((prev) =>
      prev
        ? {
            ...prev,
            isLiked: !prev.isLiked,
            likes: Math.max(0, (prev.likes || 0) + (prev.isLiked ? -1 : 1)),
          }
        : prev,
    );

    try {
      await api.commentControllerLike(String(comment.id));
    } catch {
      setComment((prev) =>
        prev
          ? {
              ...prev,
              isLiked: prevLiked,
              likes: prevLikes,
            }
          : prev,
      );
    } finally {
      setLiking(false);
    }
  }, [comment, liking]);

  const handleReply = useCallback(
    (_id?: number) => {
      if (!articleId || showReplyComposer) return;
      setShowReplyComposer(true);
      requestAnimationFrame(() => {
        replyComposerRef.current?.present();
      });
    },
    [articleId, showReplyComposer],
  );

  const handleReplySubmitted = useCallback(() => {
    setComment((prev) =>
      prev
        ? {
            ...prev,
            replyCount: (prev.replyCount || 0) + 1,
          }
        : prev,
    );
    fetchReplies(1);
  }, [fetchReplies]);

  const handleReplyLike = useCallback(async (replyId: number) => {
    try {
      await api.commentControllerLike(String(replyId));
    } catch {
      // ignore
    }
  }, []);

  const handleAuthorPress = useCallback(() => {
    if (!comment?.author?.id) return;
    router.push(
      {
        pathname: "/user/[id]",
        params: {
          id: String(comment.author.id),
          user: JSON.stringify(comment.author),
        },
      },
      { dangerouslySingular: true },
    );
  }, [comment, router]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchReplies(page, true);
    }
  }, [loadingMore, hasMore, page, fetchReplies]);

  const author = comment?.author;
  const showAuthorBadge =
    articleAuthorId && author?.id === Number(articleAuthorId);
  const isFloor = comment?.floor != null;
  const hasContent = hasRenderableContent(comment?.content, comment?.images);

  const renderReply = useCallback(
    ({
      item,
    }: {
      item: NonNullable<
        CommentControllerFindAll200ResponseDataDataInner["replies"]
      >[number];
    }) => (
      <ReplyItem
        reply={item}
        articleId={articleId}
        rootParentId={comment?.id}
        articleAuthorId={articleAuthorId}
        onLike={handleReplyLike}
        onReply={handleReply}
      />
    ),
    [articleId, comment?.id, articleAuthorId, handleReplyLike, handleReply],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View>
        {/* Main comment */}
        {comment && (
          <View style={[styles.mainComment, { backgroundColor: theme.card }]}>
            {/* Header: Avatar + Name + Floor + OP badge */}
            <Pressable
              onPress={handleAuthorPress}
              hitSlop={8}
              style={styles.header}
            >
              <Avatar
                uri={author?.avatar}
                size={34}
                avatarFrameUri={
                  author?.equippedDecorations?.AVATAR_FRAME?.imageUrl
                }
              />
              <View style={styles.headerText}>
                <View style={styles.nameRow}>
                  <ThemedText size={13} fontWeight="600" numberOfLines={1}>
                    {author?.nickname || author?.username || ""}
                  </ThemedText>
                  {showAuthorBadge && (
                    <View
                      style={[styles.opBadge, { borderColor: OP_BADGE_COLOR }]}
                    >
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
            </Pressable>

            {/* Content */}
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
                              uri: comment.author.equippedDecorations
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
                                comment.author.equippedDecorations
                                  .COMMENT_BUBBLE.bubbleColor || undefined,
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
              <View style={{ paddingVertical: 12 }}>
                <CommentImageGallery
                  hasEdge
                  images={comment.images || []}
                  contentWidth={contentWidth}
                  articleId={articleId}
                  parentId={comment.id}
                  replyToName={author?.nickname || author?.username || ""}
                  isLiked={comment.isLiked}
                  likeCount={comment.likes || 0}
                  onLike={handleLike}
                  onSubmitted={handleReplySubmitted}
                />
              </View>
            )}

            {/* Actions: Time + Reply + Like */}
            <View style={styles.actions}>
              <ThemedText size={11} color={theme.secondary}>
                {formatRelativeTime(comment.createdAt, t)}
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
                    color={comment.isLiked ? theme.primary : theme.foreground}
                  />
                  <ThemedText
                    size={12}
                    color={comment.isLiked ? theme.primary : theme.foreground}
                  >
                    {comment.likes || 0}
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Author liked badge */}
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
        )}

        {/* Replies section header */}
        <View
          style={[
            styles.repliesSectionHeader,
            { borderBottomColor: theme.border },
          ]}
        >
          <ThemedText size={14} fontWeight="600">
            {t("commentList.viewCommentTitle", {
              count: comment?.replyCount || replies?.length || 0,
            })}
          </ThemedText>
        </View>
      </View>
    ),
    [
      comment,
      author,
      showAuthorBadge,
      isFloor,
      hasContent,
      contentWidth,
      articleId,
      theme,
      t,
      replies?.length,
      handleAuthorPress,
      handleLike,
      handleReply,
      handleReplySubmitted,
    ],
  );

  if (loading && !comment) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: comment?.floor
            ? t("commentList.floor", { floor: comment.floor })
            : t("commentList.viewCommentTitle", {
                count: comment?.replyCount || 0,
              }),
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={replies || []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderReply}
          ListHeaderComponent={ListHeaderComponent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      </View>

      <CommentComposerModal
        ref={replyComposerRef}
        articleId={showReplyComposer ? articleId : undefined}
        parentId={showReplyComposer ? comment?.id : undefined}
        replyToName={
          showReplyComposer
            ? author?.nickname || author?.username || ""
            : undefined
        }
        onClose={() => {
          setShowReplyComposer(false);
        }}
        onSubmitted={handleReplySubmitted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 32,
  },
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
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  repliesSectionHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginTop: 8,
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
