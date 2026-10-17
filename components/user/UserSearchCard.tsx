import type { UserControllerFindAll200ResponseDataDataInner } from "@/api";
import { api, isAuthRedirectedError } from "@/api";
import { Avatar } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import HighlightText from "@/components/ui/HighlightText";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import HugeIcon from "@/components/ui/HugeIcon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

type User = UserControllerFindAll200ResponseDataDataInner;

type UserSearchCardProps = {
  data: User;
  keyword?: string;
};

function formatCount(value?: number | null): string {
  if (!value) return "0";
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`;
  }
  return String(value);
}

function UserSearchCard({ data, keyword }: UserSearchCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [isFollowed, setIsFollowed] = useState(Boolean(data?.isFollowed));
  const [followLoading, setFollowLoading] = useState(false);

  const displayName = data?.nickname || data?.username || "";
  const bio = data?.description?.trim();

  const handlePress = useCallback(() => {
    const userId = data?.id ? String(data.id) : "";
    if (!userId) return;
    router.push(
      {
        pathname: "/user/[id]",
        params: { id: userId, user: JSON.stringify(data) },
      },
      { dangerouslySingular: true },
    );
  }, [data, router]);

  const handleToggleFollow = useCallback(async () => {
    if (followLoading || !data?.id) return;
    const prev = isFollowed;
    const next = !prev;
    setIsFollowed(next);
    setFollowLoading(true);
    try {
      if (next) await api.userControllerFollow(String(data.id));
      else await api.userControllerUnfollow(String(data.id));
    } catch (e) {
      if (isAuthRedirectedError(e)) return;
      setIsFollowed(prev);
    } finally {
      setFollowLoading(false);
    }
  }, [followLoading, data?.id, isFollowed]);

  return (
    <Pressable style={styles.row} onPress={handlePress}>
      <Avatar uri={data?.avatar || ""} size={48} />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <HighlightText
            text={displayName}
            keyword={keyword}
            size={15}
            fontWeight="600"
            color={theme.foreground}
            numberOfLines={1}
          />
          <ThemedText
            size={12}
            color={theme.secondary}
            numberOfLines={1}
            style={styles.username}
          >
            @{data?.username}
          </ThemedText>
        </View>
        {bio ? (
          <ThemedText size={13} color={theme.secondary} numberOfLines={2}>
            {bio}
          </ThemedText>
        ) : null}
        <ThemedText size={12} color={theme.secondary} style={styles.stats}>
          {t("userSearch.stats", {
            posts: formatCount(data?.articleCount),
            followers: formatCount(data?.followerCount),
          })}
        </ThemedText>
      </View>

      <Button
        size="sm"
        shape="pill"
        tone="primary"
        variant={isFollowed ? "outline" : "primary"}
        loading={followLoading}
        label={isFollowed ? t("followsPage.followed") : t("article.follow")}
        icon={isFollowed ? Tick02Icon : UserAdd01Icon}
        onPress={handleToggleFollow}
        style={styles.followBtn}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  body: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  username: {
    flexShrink: 1,
  },
  stats: {
    marginTop: 2,
  },
  followBtn: {
    minWidth: 72,
  },
});

export default memo(UserSearchCard);
