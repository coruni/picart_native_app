import type { TagControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ChevronRight, Hash } from "lucide-react-native";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

type TopicListItemProps = {
  topic: TagControllerFindAll200ResponseDataDataInner;
  showChevron?: boolean;
  compact?: boolean;
  withDivider?: boolean;
};

type TopicListItemSkeletonProps = {
  compact?: boolean;
  withDivider?: boolean;
};

function formatCount(value?: number | null) {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

function TopicListItem({
  topic,
  showChevron = true,
  compact = false,
  withDivider = false,
}: TopicListItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      style={[
        styles.row,
        compact ? styles.compactRow : null,
        withDivider
          ? {
              borderBottomColor: theme.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }
          : null,
      ]}
    >
      <AsyncImage
        source={topic.avatar || topic.cover || topic.background}
        contentFit="cover"
        style={[styles.avatar, compact ? styles.compactAvatar : null]}
      />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Hash size={compact ? 16 : 18} color={theme.primary} strokeWidth={3} />
          <ThemedText
            size={compact ? 15 : 16}
            fontWeight={compact ? "500" : "600"}
            color={theme.foreground}
            numberOfLines={1}
            style={styles.name}
          >
            {topic.name}
          </ThemedText>
        </View>
        <TopicMeta
          articleCount={topic.articleCount}
          followCount={topic.followCount}
        />
      </View>
      {showChevron ? (
        <View>
          <ChevronRight color={theme.secondary} size={18} />
        </View>
      ) : null}
    </Pressable>
  );
}

function TopicMeta({
  articleCount,
  followCount,
}: {
  articleCount?: number | null;
  followCount?: number | null;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ThemedText size={12} color={theme.secondary}>
      {t("followTopics.meta", {
        articles: formatCount(articleCount),
        followers: formatCount(followCount),
      })}
    </ThemedText>
  );
}

function TopicListItemSkeletonView({
  compact = false,
  withDivider = false,
}: TopicListItemSkeletonProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.row,
        compact ? styles.compactRow : null,
        withDivider
          ? {
              borderBottomColor: theme.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }
          : null,
      ]}
    >
      <View
        style={[
          styles.avatar,
          compact ? styles.compactAvatar : null,
          { backgroundColor: theme.muted },
        ]}
      />
      <View style={styles.body}>
        <View
          style={[styles.skeletonTitle, { backgroundColor: theme.muted }]}
        />
        <View
          style={[styles.skeletonMeta, { backgroundColor: theme.muted }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  compactRow: {
    paddingHorizontal: 16,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 12,
  },
  compactAvatar: {
    width: 58,
    height: 58,
  },
  body: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  name: {
    flex: 1,
  },
  skeletonTitle: {
    width: "52%",
    height: 18,
    borderRadius: 9,
  },
  skeletonMeta: {
    width: "72%",
    height: 14,
    borderRadius: 7,
  },
});

export default memo(TopicListItem);
export const TopicListItemSkeleton = memo(TopicListItemSkeletonView);
