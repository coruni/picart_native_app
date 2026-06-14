import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import CommentReplyItem from "./CommentReplyItem";

interface Props {
  comment: CommentControllerFindAll200ResponseDataDataInner;
  articleId: string;
  articleAuthorId?: number;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
}

function CommentReplyList({
  comment,
  articleId,
  articleAuthorId,
  onLike,
  onReply,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const totalReplies = comment.replyCount || comment.replies?.length || 0;
  const visibleReplies = useMemo(
    () => (comment.replies || []).slice(0, 2),
    [comment.replies],
  );

  const navigateToCommentDetail = useCallback(() => {
    router.push({
      pathname: "/comment/[id]",
      params: {
        id: String(comment.id),
        articleId,
        articleAuthorId: articleAuthorId ? String(articleAuthorId) : undefined,
        comment: JSON.stringify(comment),
      },
    });
  }, [comment, articleId, articleAuthorId, router]);

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
              articleId={articleId}
              rootParentId={comment.id}
              articleAuthorId={articleAuthorId}
              onLike={onLike}
              onReply={onReply}
              onPress={navigateToCommentDetail}
            />
          ))}
        </View>
      </View>

      {/* "View all replies" button -> navigates to /comment/[id] (no modal) */}
      {totalReplies > visibleReplies.length && (
        <Pressable style={styles.viewAllBtn} onPress={navigateToCommentDetail}>
          <ThemedText size={13} color={theme.primary}>
            {t("commentList.totalReplies", { count: totalReplies })}
          </ThemedText>
          <ChevronRight size={16} color={theme.primary} />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 60,
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
});

export default memo(CommentReplyList);
