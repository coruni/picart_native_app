import type { CommentControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import {
  dedupeReplies,
  getReplyKey,
} from "@/components/comment/replyListUtils";
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
    () => dedupeReplies(comment.replies).slice(0, 2),
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
          {visibleReplies.map((reply, index) => (
            <CommentReplyItem
              key={getReplyKey(reply, index)}
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
        <View style={styles.viewBtnWrapper}>
          <Pressable
            style={[styles.viewAllBtn, { backgroundColor: theme.border }]}
            onPress={navigateToCommentDetail}
          >
            <ThemedText size={12}>
              {t("commentList.totalReplies", { count: totalReplies })}
            </ThemedText>
            <ChevronRight size={16} />
          </Pressable>
        </View>
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
  viewBtnWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 60,
    marginVertical: 12,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 2,
  },
});

export default memo(CommentReplyList);
