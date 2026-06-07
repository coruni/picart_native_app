import {
  api,
  CreateReportDtoTypeEnum,
} from "@/api";
import { ArticleData } from "@/app/article/[id]";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useReport } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import Clipboard from "@react-native-clipboard/clipboard";

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
import {
  Alert,
  BackHandler,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
// eslint-disable-next-line deprecation/deprecation

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

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

const ShareModal = forwardRef<BottomSheetModal, Props>(function ShareModal(
  { title, data, actions, enabledKeys, onClose },
  ref,
) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const { report } = useReport();
  const resolvedTitle = title ?? t("article.moreActions");
  const [isOpen, setIsOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isOpen) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        return true;
      });
      return () => sub.remove();
    }, [isOpen, ref]),
  );

  const dismiss = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
  }, [ref]);

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

  const handleDislike = useCallback(async () => {
    if (!data) return;
    dismiss();
    try {
      await api.articleControllerDislikeArticle(String(data.id), {});
    } catch {
      Alert.alert(t("article.actionFailed"));
    }
  }, [data, dismiss, t]);

  const handleReport = useCallback(() => {
    if (!data) return;
    dismiss();
    report({
      onSubmit: async ({ category, reason }) => {
        try {
          await api.reportControllerCreate({
            type: CreateReportDtoTypeEnum.Article,
            category,
            reason,
            reportedArticleId: data.id,
          });
        } catch {
          Alert.alert(t("article.actionFailed"));
        }
      },
    });
  }, [data, dismiss, report, t]);

  const handleBlock = useCallback(() => {
    if (!data?.author?.id) return;
    dismiss();
    confirm({
      title: t("article.blockUser"),
      message: t("article.blockConfirm"),
      confirmText: t("article.blockConfirmBtn"),
      onConfirm: async () => {
        try {
          await api.messageControllerBlockPrivateUser(String(data.author!.id));
        } catch {
          Alert.alert(t("article.actionFailed"));
        }
      },
    });
  }, [data, dismiss, confirm, t]);

  const handleCopyLink = useCallback(async () => {
    if (!data) return;
    const url = `${WEB_URL}/article/${data.id}`;
    Clipboard.setString(url);
    dismiss();
  }, [data, dismiss]);

  const handleFollow = useCallback(async () => {
    if (!data?.author?.id) return;
    dismiss();
    try {
      if (data.author.isFollowed) {
        await api.userControllerUnfollow(String(data.author.id));
      } else {
        await api.userControllerFollow(String(data.author.id));
      }
    } catch {
      Alert.alert(t("article.actionFailed"));
    }
  }, [data, dismiss, t]);

  const handleShare = useCallback(async () => {
    if (!data) return;
    const url = `${WEB_URL}/article/${data.id}`;
    dismiss();
    try {
      await Share.share({ message: url, url });
    } catch {
      // user cancelled
    }
  }, [data, dismiss]);

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
        onPress: handleDislike,
        icon: icons.dislike,
      },
      {
        label: t("article.report"),
        key: "report",
        onPress: handleReport,
        icon: icons.report,
      },
      {
        label: t("article.blockUser"),
        key: "block",
        onPress: handleBlock,
        icon: icons.block,
      },
      {
        label: t("article.copyLink"),
        key: "copy",
        onPress: handleCopyLink,
        icon: icons.copy,
      },
      {
        label: isFollowed ? t("article.unfollow") : t("article.follow"),
        key: "follow",
        onPress: handleFollow,
        icon: isFollowed ? icons.followRemove : icons.followAdd,
      },
      {
        label: t("article.shareViaSystem"),
        key: "share",
        onPress: handleShare,
        icon: icons.share,
      },
    ];
    if (!enabledKeys) return allActions;
    return allActions.filter((item) => enabledKeys.includes(item.key));
  }, [
    t,
    data?.author?.isFollowed,
    enabledKeys,
    icons,
    handleDislike,
    handleReport,
    handleBlock,
    handleCopyLink,
    handleFollow,
    handleShare,
  ]);

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
        {!!resolvedTitle && (
          <View style={styles.titleContainer}>
            <ThemedText size={14} fontWeight="500" color={theme.secondary}>
              {resolvedTitle}
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
