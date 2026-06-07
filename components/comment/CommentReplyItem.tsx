import type { CommentControllerFindAll200ResponseDataDataInnerRepliesInner } from "@/api/generated";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useRouterLock } from "@/hooks/useRouterLock";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { Crown } from "lucide-react-native";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

const RE_HTML_TAGS = /<[^>]*>/g;
const RE_NBSP = /&nbsp;|&#160;/gi;
const OP_BADGE_COLOR = "#12ADB3";

function hasRenderableContent(
  content?: string | null,
  images?: CommentControllerFindAll200ResponseDataDataInnerRepliesInner["images"],
) {
  const plainText = (content || "")
    .replace(RE_HTML_TAGS, "")
    .replace(RE_NBSP, " ")
    .trim();

  return plainText.length > 0 || Boolean(images?.length);
}

interface Props {
  reply: CommentControllerFindAll200ResponseDataDataInnerRepliesInner;
  rootParentId?: number;
  articleAuthorId?: number;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
}

function CommentReplyItem({
  reply,
  rootParentId,
  articleAuthorId,
  onLike,
  onReply,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const lockRouter = useRouterLock();
  const contentWidth = width - 100;

  const author = reply.author;
  const parent = reply.parent;
  const replyTo =
    parent && rootParentId && parent.id !== rootParentId
      ? parent.author?.nickname || parent.author?.username
      : null;
  const hasContent = hasRenderableContent(reply.content, reply.images);
  const showAuthorBadge =
    articleAuthorId && reply.author?.id === Number(articleAuthorId);

  const handleAuthorPress = useCallback(() => {
    if (!author?.id) return;
    lockRouter(() => {
      router.push({
        pathname: "/user/[id]",
        params: { id: String(author.id) },
      });
    });
  }, [author?.id, lockRouter, router]);

  if (!hasContent) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header: Avatar + Name + Time */}
      <Pressable onPress={handleAuthorPress} hitSlop={8} style={styles.header}>
        <Avatar uri={author?.avatar} size={22} />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <ThemedText size={13} fontWeight="600">
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
        </View>
      </Pressable>

      {/* Reply-to hint */}
      {replyTo && (
        <ThemedText size={12} color={theme.secondary} style={styles.replyTo}>
          {t("commentList.replyToPrefix")} {replyTo}
          {t("commentList.replyToSuffix")}
        </ThemedText>
      )}

      {/* Content */}
      {!!reply.content
        ?.replace(RE_HTML_TAGS, "")
        .replace(RE_NBSP, " ")
        .trim() && (
        <View style={styles.content}>
          <RenderHtml
            baseStyle={{ fontSize: 14, color: theme.secondary }}
            source={{ html: reply.content }}
            contentWidth={contentWidth}
            numberOfLines={0}
          />
        </View>
      )}

      <CommentImageGallery
        images={reply.images || []}
        contentWidth={contentWidth}
        displayMode="link"
      />

      {/* Actions */}
      {/* <View style={styles.actions}>
        <Pressable
          hitSlop={8}
          style={styles.actionBtn}
          onPress={() => onReply(reply.id)}
        >
          <MessageCircle size={14} color={theme.secondary} />
          <ThemedText size={12} color={theme.secondary}>
            {t("commentList.reply")}
          </ThemedText>
        </Pressable>

        <Pressable
          hitSlop={8}
          style={styles.actionBtn}
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
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
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
    marginBottom: 2,
  },
  content: {
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default memo(CommentReplyItem);
