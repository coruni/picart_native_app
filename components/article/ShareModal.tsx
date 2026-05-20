import { ArticleData } from "@/app/article/[id]";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import {
  Ban,
  Ellipsis,
  Flag,
  HeartCrack,
  Link2,
  UserRoundMinus,
  UserRoundPlus,
} from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";

export type ShareMenuItem = {
  label: string;
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type Props = {
  data?: ArticleData;
  title?: string;
  actions?: ShareMenuItem[];
  enabledKeys?: string[];
  onClose: () => void;
};

const ShareModal = forwardRef<BottomSheetModal, Props>(function ShareModal(
  { title = "More Actions", data, actions, enabledKeys, onClose },
  ref,
) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Android 实体返回键：sheet 打开时拦截，执行 dismiss 而不是导航返回
  useFocusEffect(
    useCallback(() => {
      if (!isOpen) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        return true; // true = 拦截，不往导航层冒泡
      });
      return () => sub.remove();
    }, [isOpen, ref]),
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

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

  const iconContainerStyle = useMemo(
    () => [
      styles.iconContainer,
      { backgroundColor: theme.secondaryBackground },
    ],
    [theme.secondaryBackground],
  );

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      handleComponent={null}
      backdropComponent={renderBackdrop}
      onAnimate={(_, toIndex) => {
        // toIndex >= 0 = 打开中，-1 = 关闭中
        setIsOpen(toIndex >= 0);
      }}
      onDismiss={() => {
        setIsOpen(false);
        onClose();
      }}
      backgroundStyle={[
        styles.sheetBackground,
        {
          backgroundColor: theme.card,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      ]}
    >
      <BottomSheetView style={styles.sheetContent}>
        {!!title && (
          <View style={styles.titleContainer}>
            <ThemedText size={14} fontWeight="500" color={theme.secondary}>
              {title}
            </ThemedText>
          </View>
        )}
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
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ShareModal;

const styles = StyleSheet.create({
  sheetBackground: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sheetContent: {
    overflow: "hidden",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
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
