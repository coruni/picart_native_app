import {
  api,
  CreateReportDtoTypeEnum,
  isAuthRedirectedError,
} from "@/api";
import { ArticleData } from "@/types/article";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useReport } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import Clipboard from "@react-native-clipboard/clipboard";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import BanIcon from "@hugeicons/core-free-icons/BanIcon";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import Flag01Icon from "@hugeicons/core-free-icons/Flag01Icon";
import HeartCrackIcon from "@hugeicons/core-free-icons/HeartCrackIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import UserRemove01Icon from "@hugeicons/core-free-icons/UserRemove01Icon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";
import HugeIcon from "@/components/ui/HugeIcon";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";

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
  onFollowChange?: (isFollowed: boolean) => void;
  // 操作失败时的提示出口。默认走全局 toast
  onError?: (message: string) => void;
  onClose: () => void;
};

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={styles.sheetHandleContainer} collapsable={false}>
      <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
    </View>
  );
}

const ShareModal = forwardRef<BottomSheetModal, Props>(function ShareModal(
  { title, data, actions, enabledKeys, onFollowChange, onError, onClose },
  ref,
) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const { report } = useReport();
  const { showToast } = useToast();

  /** 统一失败提示：原生 Modal 里由宿主接管，其它场景用 toast（不用系统 Alert） */
  const notifyError = useCallback(
    (message: string) => {
      if (onError) {
        onError(message);
        return;
      }
      showToast(message);
    },
    [onError, showToast],
  );
  const resolvedTitle = title ?? t("article.moreActions");
  const [isOpen, setIsOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [localFollowed, setLocalFollowed] = useState(
    data?.author?.is_followed ?? false,
  );

  useEffect(() => {
    setLocalFollowed(data?.author?.is_followed ?? false);
  }, [data?.author?.id, data?.author?.is_followed]);

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
        pressBehavior="none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </BottomSheetBackdrop>
    ),
    [dismiss],
  );

  const handleDislike = useCallback(async () => {
    if (!data) return;
    dismiss();
    confirm({
      title: t("article.dislike"),
      message: t("article.dislikeConfirm"),
      confirmText: t("confirm"),
      onConfirm: async () => {
        try {
          await api.articleControllerDislikeArticle(String(data.id));
        } catch (error) {
          if (isAuthRedirectedError(error)) return;
          notifyError(t("article.actionFailed"));
        }
      },
    });
  }, [confirm, data, dismiss, notifyError, t]);

  const handleReport = useCallback(() => {
    if (!data?.id) return;
    dismiss();
    // 失败提示由举报面板统一处理（面板内提示 + 保留选项可重试），这里不要吞错也不要弹系统弹窗
    report({
      onSubmit: async ({ category, reason }) => {
        await api.reportControllerCreate({
          type: CreateReportDtoTypeEnum.Article,
          category,
          reason,
          reported_article_id: String(data.id),
        });
      },
    });
  }, [data, dismiss, report]);

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
        } catch (error) {
          if (isAuthRedirectedError(error)) return;
          notifyError(t("article.actionFailed"));
        }
      },
    });
  }, [data, dismiss, confirm, notifyError, t]);

  const handleCopyLink = useCallback(async () => {
    if (!data) return;
    const url = `${WEB_URL}/article/${data.id}`;
    Clipboard.setString(url);
    dismiss();
    showToast(t("article.linkCopied"));
  }, [data, dismiss, showToast, t]);

  const handleFollow = useCallback(async () => {
    if (!data?.author?.id || followLoading) return;

    const nextFollowed = !localFollowed;
    dismiss();
    setFollowLoading(true);

    try {
      if (nextFollowed) {
        await api.userControllerFollow(String(data.author.id));
      } else {
        await api.userControllerUnfollow(String(data.author.id));
      }

      setLocalFollowed(nextFollowed);
      onFollowChange?.(nextFollowed);
    } catch (error) {
      if (isAuthRedirectedError(error)) return;
      notifyError(t("article.actionFailed"));
    } finally {
      setFollowLoading(false);
    }
  }, [data, dismiss, followLoading, localFollowed, notifyError, onFollowChange, t]);

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
      dislike: <HugeIcon icon={HeartCrackIcon} size={20} />,
      report: <HugeIcon icon={Flag01Icon} size={20} />,
      block: <HugeIcon icon={BanIcon} size={20} />,
      copy: <HugeIcon icon={Link01Icon} size={20} />,
      followAdd: <HugeIcon icon={UserAdd01Icon} size={20} />,
      followRemove: <HugeIcon icon={UserRemove01Icon} size={20} />,
      share: <HugeIcon icon={MoreHorizontalIcon} size={20} />,
    }),
    [],
  );

  const menuItems = useMemo((): ShareMenuItem[] => {
    const isFollowed = localFollowed;
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
    enabledKeys,
    localFollowed,
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
      handleComponent={SheetHandle}
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
            <ThemedText size={15} fontWeight="600">
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
  sheetHandleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  sheetContent: {
    overflow: "hidden",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 14,
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
