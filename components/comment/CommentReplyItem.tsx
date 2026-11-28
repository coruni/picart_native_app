import type { DtoCommentDto } from "@/api/generated";
import CommentImageGallery from "@/components/comment/CommentImageGallery";
import { Avatar } from "@/components/ui/Avatar";
import RenderHtml from "@/components/rich-text/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { hasRenderableContent, hasRenderableHtml } from "@/lib/richText";
import { useRouter } from "expo-router";
import CrownIcon from "@hugeicons/core-free-icons/CrownIcon";
import HugeIcon from "@/components/ui/HugeIcon";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

const OP_BADGE_COLOR = "#12ADB3";
const REPLY_BODY_STYLE = { fontSize: 14, lineHeight: 21 };

interface Props {
  reply: DtoCommentDto;
  articleId: string;
  rootParentId?: string;
  articleAuthorId?: string;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
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
  // parent 是后端补的「被回复的那条评论」，只用来显示 @昵称；拿不到就不显示
  const replyToAuthor = reply.parent?.author;
  const replyTo = replyToAuthor?.nickname || replyToAuthor?.username || null;
  const hasContent = hasRenderableContent(reply.content, reply.images);
  const hasBody = hasRenderableHtml(reply.content);
  const showAuthorBadge =
    articleAuthorId != null &&
    String(reply.author?.id) === String(articleAuthorId);

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
              <ThemedText size={12} fontWeight="600" color={theme.secondary}>
                {author?.nickname || author?.username || ""}
              </ThemedText>
            </Pressable>

            {showAuthorBadge && (
              <View style={[styles.opBadge, { borderColor: OP_BADGE_COLOR }]}>
                <View style={styles.opIconWrap}>
                  <HugeIcon icon={CrownIcon} size={12} color={OP_BADGE_COLOR} />
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
      {hasBody && (
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
                  color={theme.primary}
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
                  baseStyle={REPLY_BODY_STYLE}
                  source={{ html: reply.content || "" }}
                  contentWidth={contentWidth}
                  numberOfLines={0}
                />
              </View>
            </View>
          ) : (
            <RenderHtml
              baseStyle={REPLY_BODY_STYLE}
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
        parentId={String(rootParentId ?? reply.id ?? "")}
        replyToName={author?.nickname || author?.username || ""}
        isLiked={reply.is_liked}
        likeCount={reply.likes || 0}
        displayMode="link"
        onLike={() => onLike(String(reply.id ?? ""))}
      />

    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
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
    lineHeight: 21,
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
