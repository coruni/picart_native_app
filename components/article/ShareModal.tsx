import { ArticleData } from "@/app/article/[id]";
import Modal from "@/components/ui/Modal";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
    Ban,
    Ellipsis,
    Flag,
    HeartCrack,
    Link2,
    UserRoundMinus,
    UserRoundPlus,
} from "lucide-react-native";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
export type ShareMenuItem = {
  label: string;
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  data?: ArticleData;
  title?: string;
  actions?: ShareMenuItem[];
  enabledKeys?: string[];
  onClose: () => void;
};

export default function ShareModal({
  visible,
  title = "More Actions",
  data,
  actions,
  enabledKeys,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getMenuActions = useCallback((): ShareMenuItem[] => {
    const allActions: (ShareMenuItem | null)[] = [
      {
        label: t("article.dislike"),
        key: "dislike",
        onPress: () => {},
        icon: <HeartCrack size={18} />,
      },
      {
        label: t("article.report"),
        onPress: () => {},
        key: "report",
        icon: <Flag size={18} />,
      },
      {
        label: t("article.blockUser"),
        onPress: () => {},
        key: "block",
        icon: <Ban size={18} />,
      },
      {
        label: t("article.copyLink"),
        onPress: () => {},
        key: "copy",
        icon: <Link2 size={18} />,
      },
      data?.author?.isFollowed
        ? {
            label: t("article.unfollow"),
            onPress: () => {},
            key: "follow",
            icon: <UserRoundMinus size={18} />,
          }
        : {
            label: t("article.follow"),
            onPress: () => {},
            key: "follow",
            icon: <UserRoundPlus size={18} />,
          },
      {
        label: t("article.shareViaSystem"),
        onPress: () => {},
        key: "share",
        icon: <Ellipsis size={18} />,
      },
    ];
    const items = allActions.filter(
      (item): item is ShareMenuItem => item !== null,
    );
    if (!enabledKeys) return items;
    return items.filter((item) => enabledKeys.includes(item.key));
  }, [t, data, enabledKeys]);

  const items = actions ?? getMenuActions();
  const sheetHeight = Math.min(88 + items.length * 72, 560);

  return (
    <Modal
      visible={visible}
      title={title}
      onClose={onClose}
      height={sheetHeight}
    >
      <View style={styles.content}>
        {items.map((item) => (
          <View key={item.key} style={styles.item}>
            <Pressable
              style={styles.button}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              onPress={item.onPress}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.secondaryBackground },
                ]}
              >
                {item.icon}
              </View>
              <ThemedText variant="bodySmall">{item.label}</ThemedText>
            </Pressable>
          </View>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 12,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});
