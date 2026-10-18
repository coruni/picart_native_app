import type { CommentControllerFindAllComments200ResponseDataDataInner } from "@/api/generated";
import RenderHtml from "@/components/rich-text/RenderHtml";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { useRouter } from "expo-router";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import ThumbsUpIcon from "@hugeicons/core-free-icons/ThumbsUpIcon";
import HugeIcon, { ICON_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

const RE_HTML_TAGS = /<[^>]*>/g;

// 保留 ql-emoji-embed__img，移除其他 <img> 标签
const RE_NON_EMOJI_IMG =
  /<img(?![^>]*class="[^"]*ql-emoji-embed__img[^"]*")[^>]*>/gi;

type CommentData = CommentControllerFindAllComments200ResponseDataDataInner;

interface Props {
  data: CommentData;
  isLast?: boolean;
  onMore?: (data: CommentData) => void;
  onLike?: (data: CommentData) => void;
}

function CommentCard({ data, isLast, onMore, onLike }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const article = data.article;
  const articleCover = article?.cover
    ? getImageUrl(article.cover, "small")
    : article?.images?.[0]
      ? getImageUrl(article.images[0], "small")
      : null;
  const articleTitle = article?.title ?? "";
  const categoryName = article?.category?.name ?? "";

  const date = new Date(data.createdAt);
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" });

  // 过滤掉非 emoji 图片
  const commentHtml = useMemo(() => {
    const filtered = data.content.replace(RE_NON_EMOJI_IMG, "");
    // 过滤后如果纯文本为空（只有图片），显示占位符
    const plainText = filtered.replace(RE_HTML_TAGS, "").trim();
    return plainText ? filtered : `<p style="color:inherit">${t("imageContent")}</p>`;
  }, [data.content, t]);

  const contentWidth = width - 32; // paddingHorizontal 16*2

  const parent = data.parent;
  const parentAuthor =
    parent?.author?.nickname ?? parent?.author?.username ?? "";
  const parentPlain = parent?.content
    ? parent.content.replace(RE_HTML_TAGS, "").trim()
    : "";

  const liked = Boolean(data.isLiked);
  const likeCount = data.likes ?? 0;

  const openCommentDetail = useCallback(
    (id?: number, payload?: unknown) => {
      if (!id || !article?.id) return;
      router.push(
        {
          pathname: "/comment/[id]",
          params: {
            id: String(id),
            articleId: String(article.id),
            articleAuthorId: article.authorId
              ? String(article.authorId)
              : undefined,
            comment: payload ? JSON.stringify(payload) : undefined,
          },
        },
        { dangerouslySingular: true },
      );
    },
    [article, router],
  );

  const handleCardPress = useCallback(() => {
    openCommentDetail(data.id, data);
  }, [data, openCommentDetail]);

  const handleArticlePress = useCallback(
    (event?: GestureResponderEvent) => {
      event?.stopPropagation?.();
      if (!article?.id) return;
      router.push(
        {
          pathname: "/article/[id]",
          params: { id: String(article.id) },
        },
        { dangerouslySingular: true },
      );
    },
    [article, router],
  );

  const handleParentPress = useCallback(
    (event?: GestureResponderEvent) => {
      event?.stopPropagation?.();
      if (!parent?.id) return;
      openCommentDetail(parent.id, parent);
    },
    [openCommentDetail, parent],
  );

  const handleMorePress = useCallback(
    (event?: GestureResponderEvent) => {
      event?.stopPropagation?.();
      onMore?.(data);
    },
    [data, onMore],
  );

  const handleLikePress = useCallback(
    (event?: GestureResponderEvent) => {
      event?.stopPropagation?.();
      onLike?.(data);
    },
    [data, onLike],
  );

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        { borderBottomColor: theme.border },
        isLast && { borderBottomWidth: 0 },
        pressed && { backgroundColor: theme.secondaryBackground },
      ]}
    >
      {/* 顶部：日期 + 更多按钮 */}
      <View style={styles.header}>
        <View style={styles.dateWrap}>
          <ThemedText style={styles.dateDay}>{day}</ThemedText>
          <ThemedText
            size={13}
            color={theme.secondary}
            style={styles.dateMonth}
          >
            {month}
          </ThemedText>
        </View>
        <Pressable hitSlop={8} onPress={handleMorePress}>
          <HugeIcon icon={MoreHorizontalIcon} size={20} color={theme.secondary} />
        </Pressable>
      </View>

      {/* 评论内容 */}
      <RenderHtml
        source={{ html: commentHtml }}
        contentWidth={contentWidth}
        style={styles.htmlContent}
        numberOfLines={2}
      />

      {/* 被回复评论小字 */}
      {!!parent && !!parentPlain && (
        <Pressable
          onPress={handleParentPress}
          style={[styles.parentQuote, { borderLeftColor: theme.border }]}
        >
          <ThemedText size={12} color={theme.secondary} numberOfLines={2}>
            {parentAuthor ? `@${parentAuthor}：` : ""}
            {parentPlain}
          </ThemedText>
        </Pressable>
      )}

      {/* 引用文章块 */}
      {!!article && (
        <Pressable
          style={[
            styles.articleBlock,
            { backgroundColor: theme.secondaryBackground },
          ]}
          onPress={handleArticlePress}
        >
          {articleCover ? (
            <AsyncImage
              source={articleCover}
              style={styles.articleCover}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.articleCoverPlaceholder} />
          )}
          <ThemedText
            size={13}
            color={theme.secondary}
            numberOfLines={2}
            style={styles.articleTitle}
          >
            {articleTitle}
          </ThemedText>
        </Pressable>
      )}

      {/* 底部：分类 + 点赞 */}
      <View style={styles.footer}>
        <ThemedText size={13} color={theme.secondary}>
          {categoryName}
        </ThemedText>
        <Pressable style={styles.likeBtn} hitSlop={8} onPress={handleLikePress}>
          <HugeIcon
            icon={ThumbsUpIcon}
            size={18}
            strokeWidth={liked ? 0 : ICON_STROKE_WIDTH}
            fill={liked ? theme.primary : undefined}
            color={liked ? theme.primary : theme.secondary}
          />
          <ThemedText
            size={13}
            color={liked ? theme.primary : theme.secondary}
          >
            {likeCount > 0 ? likeCount : t("like")}
          </ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default memo(CommentCard);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  dateDay: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
  },
  dateMonth: {
    lineHeight: 32,
  },
  htmlContent: {
    marginBottom: 10,
  },
  articleBlock: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    height: 64,
  },
  articleCover: {
    width: 72,
    height: 64,
  },
  articleCoverPlaceholder: {
    width: 0,
    height: 64,
  },
  articleTitle: {
    flex: 1,
    paddingHorizontal: 10,
  },
  parentQuote: {
    borderLeftWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
