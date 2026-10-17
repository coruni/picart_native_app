import type { CommentControllerFindAll200ResponseDataDataInnerRepliesInner } from "@/api/generated";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/rich-text/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
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
  articleId: string;
  rootParentId?: number;
  articleAuthorId?: number;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
  onPress?: () => void;
}

function CommentReplyItem({
  reply,
  articleId,
  rootParentId,
  articleAuthorId,
  onLike,
  onReply,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const contentWidth = width - 100;

  const author = reply.author;
  const parent = reply.parent;
  const replyToAuthor = parent?.author;
  const replyTo =
    parent && rootParentId && parent.id !== rootParentId
      ? parent.author?.nickname || parent.author?.username
      : null;
  const hasContent = hasRenderableContent(reply.content, reply.images);
  const showAuthorBadge =
    articleAuthorId && reply.author?.id === Number(articleAuthorId);

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

  const handleReplyToAuthorPress = useCallback(() => {
    if (!replyToAuthor?.id) return;
    router.push(
      {
        pathname: "/user/[id]",
        params: {
          id: String(replyToAuthor.id),
          user: JSON.stringify(replyToAuthor),
        },
      },
      { dangerouslySingular: true },
    );
  }, [replyToAuthor, router]);

  if (!hasContent) {
    return null;
  }

  const Wrapper = onPress ? Pressable : View;
  const wrapperProps = onPress
    ? { onPress, style: styles.container }
    : { style: styles.container };

  return (
    <Wrapper {...wrapperProps}>
      {/* Header: Avatar + Name + Time */}
      <View style={styles.header}>
        <Pressable onPress={handleAuthorPress} hitSlop={8}>
          <Avatar uri={author?.avatar} size={22} />
        </Pressable>

        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Pressable onPress={handleAuthorPress} hitSlop={8}>
              <ThemedText size={13} fontWeight="600">
                {author?.nickname || author?.username || ""}
              </ThemedText>
            </Pressable>

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
      </View>

      {/* Content */}
      {!!reply.content
        ?.replace(RE_HTML_TAGS, "")
        .replace(RE_NBSP, " ")
        .trim() && (
        <View style={styles.content}>
          {replyTo ? (
            <View style={styles.inlineContentRow}>
              <ThemedText
                style={styles.inlineContent}
                color={theme.secondary}
              >
                {t("commentList.replyToPrefix")}
              </ThemedText>
              <Pressable onPress={handleReplyToAuthorPress} hitSlop={6}>
                <ThemedText
                  style={styles.inlineContent}
                  color={theme.primaryText}
                >
                  @{replyTo}
                </ThemedText>
              </Pressable>
              <ThemedText
                style={styles.inlineContent}
                color={theme.foreground}
              >
                {t("commentList.replyToSuffix")} :
              </ThemedText>
              <View style={styles.inlineContentBody}>
                <RenderHtml
                  baseStyle={{ fontSize: 14, color: theme.foreground }}
                  source={{ html: reply.content || "" }}
                  contentWidth={contentWidth}
                  numberOfLines={0}
                />
              </View>
            </View>
          ) : (
            <RenderHtml
              baseStyle={{ fontSize: 14, color: theme.foreground }}
              source={{ html: reply.content || "" }}
              contentWidth={contentWidth}
              numberOfLines={0}
            />
          )}
        </View>
      )}

      <CommentImageGallery
        images={reply.images || []}
        contentWidth={contentWidth}
        articleId={articleId}
        parentId={rootParentId ?? reply.id}
        replyToName={author?.nickname || author?.username || ""}
        isLiked={reply.isLiked}
        likeCount={reply.likes || 0}
        displayMode="link"
        onLike={() => onLike(reply.id)}
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
            color={reply.isLiked ? theme.primaryText : theme.secondary}
          />
          <ThemedText
            size={12}
            color={reply.isLiked ? theme.primaryText : theme.secondary}
          >
            {reply.likes || 0}
          </ThemedText>
        </Pressable>
      </View> */}
    </Wrapper>
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
  content: {
    marginBottom: 0,
  },
  inlineContentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 4,
  },
  inlineContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  inlineContentBody: {
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 0,
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
