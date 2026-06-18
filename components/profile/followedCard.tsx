import { UserControllerGetFollowers200ResponseDataDataInner } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import { Check, UserRoundPlus } from "lucide-react-native";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Avatar from "../ui/Avatar";
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
  const { theme, colors } = useTheme();
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
        <Pressable
          disabled={followLoading}
          onPress={() =>
            data?.id != null && onToggleFollow?.(data.id, !isFollowed)
          }
          style={[
            styles.followBtn,
            {
              borderColor: colors.primary,
              backgroundColor: isFollowed ? "transparent" : colors.primary,
              opacity: followLoading ? 0.5 : 1,
            },
          ]}
          hitSlop={6}
        >
          {followLoading ? (
            <ActivityIndicator
              size={14}
              color={isFollowed ? colors.primary : "#fff"}
            />
          ) : isFollowed ? (
            <>
              <Check size={14} color={colors.primary} strokeWidth={3} />
              <ThemedText size={12} color={colors.primary} fontWeight="600">
                {t("followsPage.followed")}
              </ThemedText>
            </>
          ) : (
            <>
              <UserRoundPlus size={14} color="#fff" />
              <ThemedText size={12} color="#fff" fontWeight="600">
                {t("article.follow")}
              </ThemedText>
            </>
          )}
        </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 72,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
});
