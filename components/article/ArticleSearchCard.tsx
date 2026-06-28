import type { ArticleControllerFindAll200ResponseDataDataInner } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { useRouter } from "expo-router";
import { Eye, FileImage, ImageIcon, PlayCircle } from "lucide-react-native";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AsyncImage from "../ui/AsyncImage";
import { Avatar } from "../ui/Avatar";
import HighlightText from "../ui/HighlightText";
import ThemedText from "../ui/ThemedText";

type Article = ArticleControllerFindAll200ResponseDataDataInner;

type ArticleSearchCardProps = {
  data: Article;
  keyword?: string;
};

function formatCount(value?: number | null): string {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

function ArticleSearchCard({ data, keyword }: ArticleSearchCardProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const author = data?.author;
  const imageUrl = data?.cover || getImageUrl(data?.images?.[0], "large");

  const handlePress = useCallback(() => {
    const articleId = data?.id ? String(data.id) : "";
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
  }, [data?.id, author, router]);

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

  const renderMedia = () => (
    <View style={{ position: "relative" }}>
      <AsyncImage
        style={[styles.cover, { borderColor: theme.border }]}
        source={{ uri: imageUrl }}
      />
      {data?.type === "video" && (
        <View style={styles.mediaCenter}>
          <PlayCircle color="white" />
        </View>
      )}
      {data?.type === "mixed" && data?.cover && (
        <View style={styles.mediaBadge}>
          <FileImage size={10} color="white" />
        </View>
      )}
      {data?.type === "image" && data?.images?.length > 1 && (
        <View style={[styles.mediaBadge, styles.mediaBadgeRow]}>
          <ImageIcon color="white" size={10} />
          <ThemedText color="white" size={10}>
            +{data?.imageCount - 1}
          </ThemedText>
        </View>
      )}
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.body}>
        <View style={styles.textColumn}>
          <HighlightText
            text={data?.title ?? ""}
            keyword={keyword}
            size={14}
            fontWeight={500}
            numberOfLines={2}
          />
          {data?.summary ? (
            <ThemedText variant="caption" numberOfLines={1}>
              {data.summary}
            </ThemedText>
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
        <View style={styles.viewsRow}>
          <Eye size={14} color={theme.secondary} />
          <ThemedText size={12} color={theme.secondary}>
            {formatCount(data?.views)}
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
  mediaCenter: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  mediaBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 99,
    gap: 4,
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
  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default memo(ArticleSearchCard);
