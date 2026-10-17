import { UserControllerGetFollowers200ResponseDataDataInner } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import { Check, UserRoundPlus } from "lucide-react-native";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import Button from "../ui/Button";
import ThemedText from "../ui/ThemedText";

type FollowedCardProps = {
  data: UserControllerGetFollowers200ResponseDataDataInner;
  /** 是否展示关注按钮（自己出现在列表里时隐藏） */
  showFollowButton?: boolean;
  followLoading?: boolean;
  onToggleFollow?: (id: number, nextFollowed: boolean) => void;
  onPressUser?: (id: number) => void;
};

function FollowedCard({
  data,
  showFollowButton = true,
  followLoading = false,
  onToggleFollow,
  onPressUser,
}: FollowedCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isFollowed = Boolean(data?.isFollowed);

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.userArea}
        onPress={() => data?.id != null && onPressUser?.(data.id)}
        hitSlop={4}
      >
        <Avatar uri={data?.avatar || ""} size={44} />
        <View style={styles.textArea}>
          <ThemedText variant="bodySmall" fontWeight="600" numberOfLines={1}>
            {data?.nickname || data?.username}
          </ThemedText>
          {data?.description ? (
            <ThemedText
              variant="caption"
              color={theme.secondary}
              numberOfLines={1}
            >
              {data.description}
            </ThemedText>
          ) : null}
        </View>
      </Pressable>

      {showFollowButton ? (
        <Button
          size="sm"
          shape="pill"
          tone="primary"
          variant={isFollowed ? "outline" : "primary"}
          loading={followLoading}
          label={
            isFollowed ? t("followsPage.followed") : t("article.follow")
          }
          icon={isFollowed ? Check : UserRoundPlus}
          onPress={() =>
            data?.id != null && onToggleFollow?.(data.id, !isFollowed)
          }
          style={styles.followBtn}
        />
      ) : null}
    </View>
  );
}

export default memo(FollowedCard);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  userArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textArea: {
    flex: 1,
    gap: 2,
  },
  followBtn: {
    minWidth: 72,
  },
});
