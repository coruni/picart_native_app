import { ArticleControllerGetUserBrowseHistory200ResponseDataDataInner } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { formatRelativeTime } from "@/lib/time";
import { useRouter } from "expo-router";
import { Clock } from "lucide-react-native";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
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
          <ThemedText size={14} numberOfLines={2} fontWeight={500}>
            {article?.title}
          </ThemedText>
          {article?.summary ? (
            <ThemedText variant="caption" numberOfLines={1}>
              {article.summary}
            </ThemedText>
          ) : null}
        </View>
        {article?.cover && (
          <AsyncImage
            style={[styles.cover, { borderColor: theme.border }]}
            source={{ uri: imageUrl }}
          />
        )}
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
