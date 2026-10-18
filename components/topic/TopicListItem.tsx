import { api, isAuthRedirectedError } from "@/api";
import type { TagControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import AsyncImage from "@/components/ui/AsyncImage";
import Button from "@/components/ui/Button";
import HugeIcon, { TOPIC_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { toast } from "@/hooks/useToast";
import { useTheme } from "@/hooks/useTheme";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import HashtagIcon from "@hugeicons/core-free-icons/HashtagIcon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";
import { router } from "expo-router";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

type TopicListItemProps = {
  topic: TagControllerFindAll200ResponseDataDataInner;
  showChevron?: boolean;
  compact?: boolean;
  withDivider?: boolean;
  /**
   * 传入后行尾会显示关注按钮；关注/取关成功后回传更新过的话题，
   * 由列表自行决定是替换还是移除该行。
   */
  onFollowChange?: (topic: TagControllerFindAll200ResponseDataDataInner) => void;
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
  onFollowChange,
}: TopicListItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // 关注结果先覆盖在本行，等列表把新数据回传后再交给 prop。
  // 用「乐观覆盖」而不是和 prop 双向同步，避免 effect 里 setState 造成级联渲染。
  const [optimistic, setOptimistic] = useState<{
    isFollowed: boolean;
    followCount: number;
  } | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  const propFollowed = Boolean(topic.isFollowed);
  const propCount = topic.followCount ?? 0;

  // prop 已经追上乐观值时清掉覆盖，防止旧覆盖压住之后的外部刷新
  if (
    optimistic &&
    optimistic.isFollowed === propFollowed &&
    optimistic.followCount === propCount
  ) {
    setOptimistic(null);
  }

  const isFollowed = optimistic?.isFollowed ?? propFollowed;
  const followCount = optimistic?.followCount ?? propCount;

  const handleToggleFollow = useCallback(async () => {
    if (followLoading) return;

    const prevFollowed = isFollowed;
    const prevCount = followCount;
    const nextFollowed = !prevFollowed;
    const nextCount = Math.max(0, prevCount + (nextFollowed ? 1 : -1));

    // 先乐观更新，失败再回滚，避免按钮点击后要等一圈网络
    setOptimistic({ isFollowed: nextFollowed, followCount: nextCount });
    setFollowLoading(true);

    try {
      if (nextFollowed) {
        await api.tagControllerFollow(String(topic.id));
      } else {
        await api.tagControllerUnfollow(String(topic.id));
      }
      // 成功后再通知列表，失败时行还在，回滚可见
      onFollowChange?.({
        ...topic,
        isFollowed: nextFollowed,
        followCount: nextCount,
      });
    } catch (error) {
      if (isAuthRedirectedError(error)) return;
      setOptimistic({ isFollowed: prevFollowed, followCount: prevCount });
      toast.show(t("topic.followFailed"));
    } finally {
      setFollowLoading(false);
    }
  }, [followCount, followLoading, isFollowed, onFollowChange, t, topic]);

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
      {/* 关注按钮与整行 Pressable 平级，避免 Android 上嵌套 Pressable 抢走点击 */}
      <Pressable
        style={styles.content}
        onPress={() =>
          router.push(
            {
              pathname: "/topic/[id]",
              params: { id: String(topic.id), topic: JSON.stringify(topic) },
            },
            { dangerouslySingular: true },
          )
        }
      >
        <AsyncImage
          source={topic.avatar || topic.cover || topic.background}
          contentFit="cover"
          style={[styles.avatar, compact ? styles.compactAvatar : null]}
        />
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <HugeIcon icon={HashtagIcon} size={compact ? 18 : 20} color={theme.primary} strokeWidth={TOPIC_STROKE_WIDTH} />
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
          <TopicMeta articleCount={topic.articleCount} followCount={followCount} />
        </View>
      </Pressable>
      {onFollowChange ? (
        <Button
          size="sm"
          shape="pill"
          tone="primary"
          variant={isFollowed ? "outline" : "primary"}
          loading={followLoading}
          label={isFollowed ? t("followsPage.followed") : t("article.follow")}
          icon={isFollowed ? Tick02Icon : UserAdd01Icon}
          onPress={handleToggleFollow}
        />
      ) : null}
      {/* 有关注按钮时不再放箭头，窄屏下把宽度留给话题名 */}
      {showChevron && !onFollowChange ? (
        <View>
          <HugeIcon icon={ArrowRight01Icon} color={theme.secondary} size={20} />
        </View>
      ) : null}
    </View>
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
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
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
