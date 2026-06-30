import { ArticleControllerGetUserBrowseHistory200ResponseDataDataInner } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import { useTranslate } from "@/hooks/useTranslate";
import { getImageUrl } from "@/lib/image";
import { formatRelativeTime } from "@/lib/time";
import { useRouter } from "expo-router";
import { Clock, FileImage, ImageIcon, PlayCircle } from "lucide-react-native";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import AsyncImage from "../ui/AsyncImage";
import { Avatar } from "../ui/Avatar";
import ThemedText from "../ui/ThemedText";

type ArticleHistoryCardProps = {
  data: ArticleControllerGetUserBrowseHistory200ResponseDataDataInner;
};

function ArticleHistoryCard({ data }: ArticleHistoryCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const article = data?.article;
  const author = article?.author;

  const { displayText: titleText, fadeAnim: titleFade } = useTranslate(
    article?.title ?? "",
    { auto: true },
  );
  const { displayText: summaryText, fadeAnim: summaryFade } = useTranslate(
    article?.summary ?? "",
    { auto: true },
  );

  const imageUrl = article?.cover || getImageUrl(article?.images[0], "large");

  const handlePress = useCallback(() => {
    const articleId = article?.id ? String(article.id) : "";
    if (!articleId) return;
    router.push(
      {
        pathname: "/article/[id]",
        params: {
          id: articleId,
          author: author ? JSON.stringify(author) : undefined,
        },
      },
      { dangerouslySingular: true },
    );
  }, [article?.id, author, router]);

  const renderMedia = () => {
    if (!imageUrl) return null;
    return (
      <View style={{ position: "relative" }}>
        <AsyncImage
          style={[styles.cover, { borderColor: theme.border }]}
          source={{ uri: imageUrl }}
        />
        {data?.article?.type === "video" && (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlayCircle color="white" />
          </View>
        )}
        {data?.article?.type === "mixed" && data?.article.cover && (
          <View
            style={{
              position: "absolute",
              right: 4,
              bottom: 4,
              backgroundColor: "rgba(0,0,0,0.65)",
              paddingHorizontal: 4,
              paddingVertical: 1,
              borderRadius: 4,
            }}
          >
            <FileImage size={10} color="white" />
          </View>
        )}
        {data?.article?.type === "image" &&
          data?.article?.images?.length > 1 && (
            <View
              style={{
                position: "absolute",
                right: 4,
                flexDirection: "row",
                alignItems: "center",
                bottom: 4,
                backgroundColor: "rgba(0,0,0,0.65)",
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 99,
                gap: 4,
              }}
            >
              <ImageIcon color="white" size={10} />
              <ThemedText color="white" size={10}>
                +{data?.article?.imageCount - 1}
              </ThemedText>
            </View>
          )}
      </View>
    );
  };

  const handleAuthorPress = useCallback(() => {
    const authorId = author?.id ? String(author.id) : "";
    if (!authorId) return;
    router.push(
      {
        pathname: "/user/[id]",
        params: { id: authorId, user: JSON.stringify(author) },
      },
      { dangerouslySingular: true },
    );
  }, [author, router]);

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.body}>
        <View style={styles.textColumn}>
          <Animated.Text
            style={[
              styles.titleText,
              { color: theme.text, opacity: titleFade },
            ]}
            numberOfLines={2}
          >
            {titleText}
          </Animated.Text>
          {article?.summary ? (
            <Animated.Text
              style={[
                styles.summaryText,
                { color: theme.secondary, opacity: summaryFade },
              ]}
              numberOfLines={1}
            >
              {summaryText}
            </Animated.Text>
          ) : null}
        </View>
        {renderMedia()}
      </View>
      <View style={styles.footer}>
        <Pressable
          style={styles.authorRow}
          onPress={handleAuthorPress}
          hitSlop={4}
        >
          <Avatar size={20} uri={author?.avatar} />
          <ThemedText variant="caption" numberOfLines={1}>
            {author?.nickname || author?.username}
          </ThemedText>
        </Pressable>
        <View style={styles.timeRow}>
          <Clock size={14} color={theme.secondary} />
          <ThemedText size={12} color={theme.secondary}>
            {formatRelativeTime(data?.updatedAt ?? data?.createdAt, t)}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  body: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "stretch",
    gap: 12,
  },
  textColumn: { flex: 1 },
  titleText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  cover: {
    width: 120,
    height: 68,
    borderRadius: 8,
    borderWidth: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  authorRow: {
    flex: 1,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default memo(ArticleHistoryCard);
