import { api } from "@/api";
import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import CommentDetailMainComment from "@/components/comment/CommentDetailMainComment";
import CommentDetailReplyItem from "@/components/comment/CommentDetailReplyItem";
import CommentDetailReplySkeleton from "@/components/comment/CommentDetailReplySkeleton";
import CommentActionSheet, {
  type CommentActionSheetComment,
  type CommentActionSheetRef,
} from "@/components/feedback/CommentActionSheet";
import {
  CommentListEmptyState,
  CommentListFooterState,
} from "@/components/comment/CommentListState";
import CommentListSkeleton from "@/components/comment/CommentSkeleton";
import {
  dedupeReplies,
  getReplyKey,
} from "@/components/comment/replyListUtils";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REPLY_PAGE_SIZE = 20;
const ROOT_COMMENT_LOOKUP_PAGE_SIZE = 50;
const ROOT_COMMENT_LOOKUP_MAX_PAGES = 20;
const inflightReplyPageRequests = new Map<
  string,
  Promise<{
    replies: CommentControllerFindAll200ResponseDataDataInner["replies"];
    rawLength: number;
  }>
>();

function getReplyPageRequestKey(commentId: string, pageNum: number) {
  return `${commentId}:${pageNum}`;
}

function extractReplies(
  data: unknown,
): CommentControllerFindAll200ResponseDataDataInner["replies"] {
  return (
    (((data as { data?: unknown }).data ?? []) as
      | CommentControllerFindAll200ResponseDataDataInner["replies"]
      | undefined) || []
  );
}

async function fetchReplyPage(commentId: string, pageNum: number) {
  const requestKey = getReplyPageRequestKey(commentId, pageNum);
  const existingRequest = inflightReplyPageRequests.get(requestKey);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const { data: res } = await api.commentControllerFindOne(
      commentId,
      pageNum,
      REPLY_PAGE_SIZE,
    );
    const newData = extractReplies(res.data);

    return {
      replies: dedupeReplies(newData),
      rawLength: newData.length,
    };
  })();

  inflightReplyPageRequests.set(requestKey, request);

  try {
    return await request;
  } finally {
    inflightReplyPageRequests.delete(requestKey);
  }
}

/**
 * 评论通知只带 commentId（回复通知里是回复本身的 id），详情页缺少主评论数据。
 * 先用回复里的 rootId 找到主评论 id，再在文章一级评论里分页定位它。
 */
async function fetchRootComment(
  articleId: string,
  rootId: number,
): Promise<CommentControllerFindAll200ResponseDataDataInner | null> {
  if (!articleId || !rootId) return null;

  let pageNum = 1;
  let totalPages = 1;

  while (pageNum <= totalPages && pageNum <= ROOT_COMMENT_LOOKUP_MAX_PAGES) {
    const { data: res } = await api.commentControllerFindAll(
      articleId,
      pageNum,
      ROOT_COMMENT_LOOKUP_PAGE_SIZE,
    );
    const list = res.data?.data || [];
    const found = list.find((item) => Number(item.id) === rootId);
    if (found) return found;

    totalPages = res.data?.meta?.totalPages || pageNum;
    pageNum += 1;
  }

  return null;
}

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
  const actionSheetRef = useRef<CommentActionSheetRef>(null);
  const [activeComment, setActiveComment] =
    useState<CommentActionSheetComment | null>(null);
  const currentUserId = useAuthStore(
    (state) => state.profile?.id ?? state.user?.id,
  );

  // 从文章详情进入时会带上完整评论（comment），通知进入时只有评论 id
  const commentFromParams = useMemo<
    CommentControllerFindAll200ResponseDataDataInner | null
  >(() => {
    if (!params.comment) return null;
    try {
      return JSON.parse(params.comment);
    } catch {
      return null;
    }
  }, [params.comment]);

  const [comment, setComment] =
    useState<CommentControllerFindAll200ResponseDataDataInner | null>(
      commentFromParams,
    );
  const [replies, setReplies] = useState<
    CommentControllerFindAll200ResponseDataDataInner["replies"]
  >([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [liking, setLiking] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{
    parentId?: number;
    replyToName?: string;
  }>({});
  const replyLikingIdsRef = useRef<Set<number>>(new Set());
  const [resolvedArticleId, setResolvedArticleId] = useState(
    params.articleId || "",
  );
  const [resolvedArticleAuthorId, setResolvedArticleAuthorId] = useState<
    number | undefined
  >(params.articleAuthorId ? Number(params.articleAuthorId) : undefined);
  const articleId = resolvedArticleId;
  const articleAuthorId = resolvedArticleAuthorId;
  const author = comment?.author;
  const fetchReplies = useCallback(
    async (pageNum: number, append = false) => {
      if (!params.id) return;

      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const { replies: uniqueReplies, rawLength } = await fetchReplyPage(
          params.id,
          pageNum,
        );

        if (append) {
          setReplies((prev) =>
            dedupeReplies([...(prev || []), ...uniqueReplies]),
          );
        } else {
          setReplies(uniqueReplies);
        }

        setPage(pageNum + 1);
        setHasMore(rawLength >= REPLY_PAGE_SIZE);
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setInitialLoading(false);
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
        // 先等主评论和首屏回复都取到，再一次性更新状态，避免页面分块闪出
        const { replies: initialReplies, rawLength } = await fetchReplyPage(
          params.id,
          1,
        );

        const firstReply = initialReplies?.[0];
        let rootComment: CommentControllerFindAll200ResponseDataDataInner | null =
          null;

        // 没有随参数带主评论时（评论通知进入），补拉主评论。
        // 回复通知里的 id 是回复本身，回复数据上的 rootId 才是主评论 id。
        if (!commentFromParams) {
          const rootId = firstReply?.rootId ?? Number(params.id);
          const lookupArticleId =
            params.articleId ||
            (firstReply?.article?.id != null
              ? String(firstReply.article.id)
              : "");

          if (lookupArticleId) {
            try {
              rootComment = await fetchRootComment(lookupArticleId, rootId);
            } catch {
              // 主评论补拉失败时仍展示已取到的回复
            }
          }
        }

        if (cancelled) return;

        // 主评论/回复能确定文章信息时，优先用主评论上的（更完整）
        const articleSource =
          rootComment?.article ??
          commentFromParams?.article ??
          firstReply?.article;
        const nextArticleId =
          params.articleId ||
          (articleSource?.id != null ? String(articleSource.id) : "");
        const nextArticleAuthorId = params.articleAuthorId
          ? Number(params.articleAuthorId)
          : articleSource?.authorId != null
            ? Number(articleSource.authorId)
            : undefined;

        if (rootComment) {
          setComment(rootComment);
        }
        setReplies(initialReplies);
        setPage(2);
        setHasMore(rawLength >= REPLY_PAGE_SIZE);
        setResolvedArticleId(nextArticleId);
        setResolvedArticleAuthorId(nextArticleAuthorId);
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [commentFromParams, params.articleAuthorId, params.articleId, params.id]);

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
    (replyId?: number, replyToName?: string, fallbackParentId?: number) => {
      if (!articleId || showReplyComposer) return;
      const rootReplyToName = author?.nickname || author?.username || undefined;
      const targetParentId = replyId ?? fallbackParentId ?? comment?.id;
      const targetReplyToName = replyToName ?? rootReplyToName;

      if (!targetParentId) return;

      setReplyTarget({
        parentId: targetParentId,
        replyToName: targetReplyToName,
      });
      setShowReplyComposer(true);
      requestAnimationFrame(() => {
        replyComposerRef.current?.present();
      });
    },
    [articleId, author, comment?.id, showReplyComposer],
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

  const handleReplyLike = useCallback(
    async (replyId: number) => {
      if (replyLikingIdsRef.current.has(replyId)) {
        return;
      }

      const previousReply = replies?.find((reply) => reply.id === replyId);
      if (!previousReply) {
        return;
      }

      replyLikingIdsRef.current.add(replyId);

      setReplies(
        (prev) =>
          prev?.map((reply) =>
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
          ) || [],
      );

      try {
        await api.commentControllerLike(String(replyId));
      } catch {
        setReplies(
          (prev) =>
            prev?.map((reply) =>
              reply.id === replyId
                ? {
                    ...reply,
                    isLiked: previousReply.isLiked,
                    likes: previousReply.likes || 0,
                  }
                : reply,
            ) || [],
        );
      } finally {
        replyLikingIdsRef.current.delete(replyId);
      }
    },
    [replies],
  );

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

  const openCommentActions = useCallback(
    (target: CommentActionSheetComment) => {
      setActiveComment(target);
      requestAnimationFrame(() => actionSheetRef.current?.present());
    },
    [],
  );

  const handleCommentDeleted = useCallback(
    (id: number) => {
      // 主评论被删除后整条详情已不存在，直接返回上一页
      if (comment && Number(comment.id) === id) {
        router.back();
        return;
      }

      const deletedReply = replies?.find((reply) => Number(reply.id) === id);
      setReplies(
        (prev) => (prev || []).filter((reply) => Number(reply.id) !== id),
      );

      // 只有直接回复主评论时，主评论的 replyCount 才需要 -1
      if (!deletedReply || Number(deletedReply.parentId) === Number(comment?.id)) {
        setComment((prev) =>
          prev
            ? {
                ...prev,
                replyCount: Math.max(0, (prev.replyCount || 0) - 1),
              }
            : prev,
        );
      }
    },
    [comment, replies, router],
  );

  const isActiveCommentOwner =
    activeComment?.author?.id != null &&
    Number(currentUserId) === Number(activeComment.author.id);
  const isArticleAuthor =
    articleAuthorId != null &&
    Number(currentUserId) === Number(articleAuthorId);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchReplies(page, true);
    }
  }, [loadingMore, hasMore, page, fetchReplies]);

  const renderReply = useCallback(
    ({
      item,
    }: {
      item: NonNullable<
        CommentControllerFindAll200ResponseDataDataInner["replies"]
      >[number];
    }) => (
      <CommentDetailReplyItem
        reply={item}
        articleId={articleId}
        rootParentId={comment?.id}
        articleAuthorId={articleAuthorId}
        rootReplyToName={author?.nickname || author?.username || undefined}
        onLike={handleReplyLike}
        onReply={handleReply}
        onMore={openCommentActions}
      />
    ),
    [
      articleId,
      comment?.id,
      articleAuthorId,
      author,
      handleReplyLike,
      handleReply,
      openCommentActions,
    ],
  );

  // 主评论回调保持引用稳定，配合 CommentDetailMainComment 的 memo 避免重复渲染
  const handleMainReply = useCallback(() => handleReply(), [handleReply]);
  const handleMainMore = useCallback(() => {
    if (comment) openCommentActions(comment);
  }, [comment, openCommentActions]);

  // 注意：ListHeaderComponent 传元素而不是内联函数组件。
  // 传新函数会被 React 当作新的组件类型，每次渲染都卸载重建 header，导致头像反复加载闪烁。
  const listHeaderElement = useMemo(
    () =>
      comment ? (
        <View>
          <CommentDetailMainComment
            comment={comment}
            articleId={articleId}
            articleAuthorId={articleAuthorId}
            contentWidth={contentWidth}
            onAuthorPress={handleAuthorPress}
            onReply={handleMainReply}
            onLike={handleLike}
            onReplySubmitted={handleReplySubmitted}
            onMore={handleMainMore}
          />

          <View
            style={[
              styles.repliesSectionHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <ThemedText size={14} fontWeight={500} color={theme.foreground}>
              {t("commentList.viewCommentTitle", {
                count: comment?.replyCount || replies?.length || 0,
              })}
            </ThemedText>
          </View>
        </View>
      ) : null,
    [
      comment,
      contentWidth,
      articleId,
      theme,
      t,
      replies?.length,
      handleAuthorPress,
      handleLike,
      handleMainReply,
      handleReplySubmitted,
      articleAuthorId,
      handleMainMore,
    ],
  );

  return (
    <>
      <Stack.Screen
        options={{
          title:
            comment?.floor != null
              ? t("commentList.floor", { floor: comment.floor })
              : t("commentCard.detailTitle"),
        }}
      />
      <SafeAreaView
        edges={["bottom", "right", "left"]}
        style={[styles.container, { backgroundColor: theme.card }]}
      >
        <FlatList
          data={replies || []}
          keyExtractor={(item, index) => getReplyKey(item, index)}
          renderItem={renderReply}
          ListHeaderComponent={listHeaderElement}
          ListEmptyComponent={
            <CommentListEmptyState
              loading={loading}
              initialized={!initialLoading}
              emptyText={t("noContent")}
              skeleton={
                <>
                  {!comment ? (
                    <View style={styles.loadingHeader}>
                      <CommentListSkeleton count={1} />
                    </View>
                  ) : null}
                  {!comment ? (
                    <View
                      style={[
                        styles.repliesSectionHeader,
                        { borderBottomColor: theme.border },
                      ]}
                    >
                      <ThemedText size={14} color={theme.foreground}>
                        {t("commentList.viewCommentTitle", { count: 0 })}
                      </ThemedText>
                    </View>
                  ) : null}
                  <CommentDetailReplySkeleton />
                </>
              }
            />
          }
          onEndReached={handleLoadMore}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <CommentListFooterState
              hasItems={(replies?.length || 0) > 0}
              loading={loadingMore}
              hasMore={hasMore}
            />
          }
        />

        <View
          style={[
            styles.fakeInputBar,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
            },
          ]}
        >
          <Pressable
            onPress={() => handleReply()}
            style={[
              styles.fakeInput,
              { backgroundColor: theme.secondaryBackground },
            ]}
          >
            <TextInput
              style={[styles.fakeInputText, { color: theme.secondary }]}
              value={
                author?.nickname || author?.username
                  ? t("commentComposer.replyTitle", {
                      name: author?.nickname || author?.username || "",
                    })
                  : t("commentComposer.placeholder")
              }
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <CommentComposerModal
        ref={replyComposerRef}
        articleId={showReplyComposer ? articleId : undefined}
        parentId={showReplyComposer ? replyTarget.parentId : undefined}
        replyToName={showReplyComposer ? replyTarget.replyToName : undefined}
        onClose={() => {
          setShowReplyComposer(false);
          setReplyTarget({});
        }}
        onSubmitted={handleReplySubmitted}
      />

      <CommentActionSheet
        ref={actionSheetRef}
        comment={activeComment}
        isOwner={isActiveCommentOwner}
        isArticleAuthor={isArticleAuthor}
        onDeleted={handleCommentDeleted}
        onClosed={() => setActiveComment(null)}
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
  loadingHeader: {
    paddingTop: 4,
  },

  repliesSectionHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginTop: 8,
  },
  fakeInputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: "center",
    paddingVertical: 4,
  },
  fakeInput: {
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  fakeInputText: {
    fontSize: 12,
  },
});
