import { api, CreateReportDtoTypeEnum, isAuthRedirectedError } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useReport } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ban, Flag } from "lucide-react-native";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";

export interface UserActionSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface Props {
  title?: string;
  userId?: string | number;
  onClosed?: () => void;
}

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
  );
}

const UserActionSheet = forwardRef<UserActionSheetRef, Props>(
  function UserActionSheet({ title, userId, onClosed }, ref) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { confirm } = useConfirm();
    const { report } = useReport();
    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }));

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

    const dismiss = useCallback(() => {
      sheetRef.current?.dismiss();
    }, []);

    const handleBlock = useCallback(() => {
      if (!userId) return;
      const idStr = String(userId);
      dismiss();
      confirm({
        title: t("article.blockUser"),
        message: t("article.blockConfirm"),
        confirmText: t("article.blockConfirmBtn"),
        onConfirm: async () => {
          try {
            await api.messageControllerBlockPrivateUser(idStr);
          } catch (error) {
            if (isAuthRedirectedError(error)) return;
            Alert.alert(t("article.actionFailed"));
          }
        },
      });
    }, [userId, dismiss, confirm, t]);

    const handleReport = useCallback(() => {
      if (!userId) return;
      const idNum = Number(userId);
      dismiss();
      report({
        onSubmit: async ({ category, reason }) => {
          try {
            await api.reportControllerCreate({
              type: CreateReportDtoTypeEnum.User,
              category,
              reason,
              reportedUserId: idNum,
            });
          } catch (error) {
            if (isAuthRedirectedError(error)) return;
            Alert.alert(t("article.actionFailed"));
          }
        },
      });
    }, [userId, dismiss, report, t]);

    const items = [
      {
        key: "block",
        label: t("article.blockUser"),
        icon: <Ban size={18} />,
        onPress: handleBlock,
      },
      {
        key: "report",
        label: t("article.report"),
        icon: <Flag size={18} />,
        onPress: handleReport,
      },
    ];

    return (
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        onDismiss={onClosed}
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
              <ThemedText size={15} fontWeight="600">
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
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default UserActionSheet;

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
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
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
