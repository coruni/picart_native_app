import type { CommentControllerFindAll200ResponseDataDataInnerRepliesInner } from "@/api/generated";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import Avatar from "@/components/ui/Avatar";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const RE_HTML_TAGS = /<[^>]*>/g;
const RE_NBSP = /&nbsp;|&#160;/gi;

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
  onLike: (id: number) => void;
  onReply: (id: number) => void;
}

function CommentReplyItem({ reply, rootParentId, onLike, onReply }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const contentWidth = width - 100;

  const author = reply.author;
  const parent = reply.parent;
  const replyTo =
    parent && rootParentId && parent.id !== rootParentId
      ? parent.author?.nickname || parent.author?.username
      : null;
  const hasContent = hasRenderableContent(reply.content, reply.images);

  if (!hasContent) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header: Avatar + Name + Time */}
      <View style={styles.header}>
        <Avatar uri={author?.avatar} size={22} />
        <ThemedText size={13} fontWeight="600" style={styles.name}>
          {author?.nickname || author?.username || ""}
        </ThemedText>
      </View>

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
  name: {
    flex: 1,
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
