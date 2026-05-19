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
import React, { useMemo } from "react";
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

  // 稳定的图标引用，避免每次渲染创建新 JSX 节点
  const icons = useMemo(
    () => ({
      dislike: <HeartCrack size={18} />,
      report: <Flag size={18} />,
      block: <Ban size={18} />,
      copy: <Link2 size={18} />,
      followAdd: <UserRoundPlus size={18} />,
      followRemove: <UserRoundMinus size={18} />,
      share: <Ellipsis size={18} />,
    }),
    [],
  );

  // 完整缓存菜单项，依赖精确，避免多余重算
  const menuItems = useMemo((): ShareMenuItem[] => {
    const isFollowed = data?.author?.isFollowed;

    const allActions: ShareMenuItem[] = [
      {
        label: t("article.dislike"),
        key: "dislike",
        onPress: () => {},
        icon: icons.dislike,
      },
      {
        label: t("article.report"),
        key: "report",
        onPress: () => {},
        icon: icons.report,
      },
      {
        label: t("article.blockUser"),
        key: "block",
        onPress: () => {},
        icon: icons.block,
      },
      {
        label: t("article.copyLink"),
        key: "copy",
        onPress: () => {},
        icon: icons.copy,
      },
      {
        label: isFollowed ? t("article.unfollow") : t("article.follow"),
        key: "follow",
        onPress: () => {},
        icon: isFollowed ? icons.followRemove : icons.followAdd,
      },
      {
        label: t("article.shareViaSystem"),
        key: "share",
        onPress: () => {},
        icon: icons.share,
      },
    ];

    if (!enabledKeys) return allActions;
    return allActions.filter((item) => enabledKeys.includes(item.key));
  }, [t, data?.author?.isFollowed, enabledKeys, icons]);

  const items = actions ?? menuItems;

  // 缓存高度，防止每次渲染重新计算导致 Modal 高度跳变闪烁
  const sheetHeight = useMemo(
    () => Math.min(88 + items.length * 72, 560),
    [items.length],
  );

  // 缓存 iconContainer 样式，避免每次渲染生成新对象
  const iconContainerStyle = useMemo(
    () => [
      styles.iconContainer,
      { backgroundColor: theme.secondaryBackground },
    ],
    [theme.secondaryBackground],
  );

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
              <View style={iconContainerStyle}>{item.icon}</View>
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
