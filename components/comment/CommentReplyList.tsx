import { api } from "@/api";
import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import Avatar from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ChevronRight, Crown, Heart, MessageCircle } from "lucide-react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import CommentReplyItem from "./CommentReplyItem";

interface Props {
  comment: CommentControllerFindAll200ResponseDataDataInner;
  articleAuthorId?: number;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
}

function CommentReplyList({
  comment,
  articleAuthorId,
  onLike,
  onReply,
}: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [allReplies, setAllReplies] = useState<
    CommentControllerFindAll200ResponseDataDataInner["replies"]
  >([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const totalReplies = comment.replyCount || comment.replies?.length || 0;
  const visibleReplies = useMemo(
    () => (comment.replies || []).slice(0, 2),
    [comment.replies],
  );

  const showAuthorBadge =
    articleAuthorId && comment.author?.id === Number(articleAuthorId);

  const contentWidth = width - 48;

  const openModal = useCallback(async () => {
    setModalVisible(true);

    // 先显示已有数据
    setAllReplies(comment.replies || []);

    try {
      const { data: res } = await api.commentControllerFindOne(
        String(comment.id),
        1,
        20,
      );
      const newData = (res.data as any)?.data || [];
      setAllReplies(newData);
      setPage(2);
      setHasMore(newData.length >= 20);
    } catch {
      // fallback to existing replies
    }
  }, [comment.id, comment.replies]);

  const loadMoreReplies = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const { data: res } = await api.commentControllerGetReplies(
        comment.id,
        page,
        10,
      );
      const newData = (res.data as any)?.data || [];
      setAllReplies((prev) => [...prev, ...newData] as any);
      setPage((p) => p + 1);
      if (newData.length < 10) setHasMore(false);
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }, [comment.id, page, loadingMore, hasMore]);

  if (!totalReplies && (!comment.replies || comment.replies.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Inline replies (first 2) */}
      <View style={styles.container}>
        <View style={[styles.threadLine, { borderLeftColor: theme.border }]}>
          {visibleReplies.map((reply) => (
            <CommentReplyItem
              key={reply.id}
              reply={reply}
              rootParentId={comment.id}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </View>
      </View>

      {/* "View all replies" button */}
      {totalReplies > visibleReplies.length && (
        <Pressable style={styles.viewAllBtn} onPress={openModal}>
          <ThemedText size={13} color={theme.primary}>
            {t("commentList.totalReplies", { count: totalReplies })}
          </ThemedText>
          <ChevronRight size={16} color={theme.primary} />
        </Pressable>
      )}

      {/* Replies Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View
              style={[styles.modalHeader, { borderBottomColor: theme.border }]}
            >
              <ThemedText size={16} fontWeight="600">
                {t("commentList.viewCommentTitle", {
                  count: totalReplies,
                })}
              </ThemedText>
              <Pressable hitSlop={12} onPress={() => setModalVisible(false)}>
                <ThemedText size={14} color={theme.primary}>
                  {t("commentList.close")}
                </ThemedText>
              </Pressable>
            </View>

            {/* Parent comment preview */}
            <View style={styles.modalComment}>
              <View style={styles.modalCommentHeader}>
                <Avatar uri={comment.author?.avatar} size={28} />
                <ThemedText size={13} fontWeight="600" style={styles.nameText}>
                  {comment.author?.nickname || comment.author?.username}
                </ThemedText>
                {showAuthorBadge && (
                  <View style={[styles.badge, { borderColor: theme.primary }]}>
                    <Crown size={10} color={theme.primary} />
                    <ThemedText size={10} color={theme.primary}>
                      {t("commentList.originalPoster")}
                    </ThemedText>
                  </View>
                )}
              </View>
              <RenderHtml
                source={{ html: comment.content || "" }}
                contentWidth={contentWidth}
              />
              <View style={styles.modalActions}>
                <Pressable
                  hitSlop={8}
                  style={styles.actionBtn}
                  onPress={() => onReply(comment.id)}
                >
                  <MessageCircle size={16} color={theme.secondary} />
                  <ThemedText size={12} color={theme.secondary}>
                    {t("commentList.reply")}
                  </ThemedText>
                </Pressable>
                {comment.isAuthorLiked && (
                  <View style={styles.authorLiked}>
                    <Heart size={12} color="#FF6B6B" />
                    <ThemedText size={11} color="#FF6B6B">
                      {t("commentList.authorLiked")}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* Replies list */}
            <ScrollView
              style={styles.repliesList}
              onMomentumScrollEnd={({ nativeEvent }) => {
                const { contentOffset, contentSize, layoutMeasurement } =
                  nativeEvent;
                if (
                  contentOffset.y + layoutMeasurement.height >=
                  contentSize.height - 40
                ) {
                  loadMoreReplies();
                }
              }}
            >
              {allReplies.map((reply) => (
                <CommentReplyItem
                  key={reply.id}
                  reply={reply}
                  rootParentId={comment.id}
                  onLike={onLike}
                  onReply={onReply}
                />
              ))}
              {loadingMore && (
                <ThemedText
                  size={12}
                  color={theme.secondary}
                  style={styles.loadingMore}
                >
                  {t("commentList.loading")}
                </ThemedText>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 46,
    marginTop: 8,
  },
  threadLine: {
    borderLeftWidth: 2,
    paddingLeft: 12,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 48,
    paddingVertical: 12,
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  modalComment: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalCommentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  nameText: {
    flex: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  authorLiked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FF6B6B20",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  repliesList: {
    paddingHorizontal: 16,
  },
  loadingMore: {
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default memo(CommentReplyList);
