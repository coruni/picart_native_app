import { api } from "@/api";
import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import CommentComposerModal from "@/components/comment/CommentComposerModal";
import CommentDetailMainComment from "@/components/comment/CommentDetailMainComment";
import CommentDetailReplyItem from "@/components/comment/CommentDetailReplyItem";
import CommentDetailReplySkeleton from "@/components/comment/CommentDetailReplySkeleton";
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
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const articleId = params.articleId || "";
  const articleAuthorId = params.articleAuthorId
    ? Number(params.articleAuthorId)
    : undefined;
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
        const { replies: initialReplies, rawLength } = await fetchReplyPage(
          params.id,
          1,
        );
        if (cancelled) return;
        setReplies(initialReplies);
        setPage(2);
        setHasMore(rawLength >= REPLY_PAGE_SIZE);
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
      />
    ),
    [
      articleId,
      comment?.id,
      articleAuthorId,
      author,
      handleReplyLike,
      handleReply,
    ],
  );

  const ListHeaderComponent = useCallback(
    () =>
      comment ? (
        <View>
          <CommentDetailMainComment
            comment={comment}
            articleId={articleId}
            articleAuthorId={articleAuthorId}
            contentWidth={contentWidth}
            onAuthorPress={handleAuthorPress}
            onReply={() => handleReply()}
            onLike={handleLike}
            onReplySubmitted={handleReplySubmitted}
          />

          <View
            style={[
              styles.repliesSectionHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <ThemedText size={14} color={theme.foreground}>
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
      handleReply,
      handleReplySubmitted,
      articleAuthorId,
    ],
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t("commentList.floor", { floor: comment?.floor }),
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
          ListHeaderComponent={ListHeaderComponent}
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
