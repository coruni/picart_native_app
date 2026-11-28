import ThemedText from "@/components/ui/ThemedText";
import HugeIcon from "@/components/ui/HugeIcon";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import { forwardRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

export type ImageSaveState = "idle" | "saving" | "saved";

type Props = {
  state: ImageSaveState;
  onSave: () => void;
  onClose: () => void;
};

function SheetHandle() {
  const { theme } = useTheme();

  return (
    <View style={styles.handleContainer} collapsable={false}>
      <View style={[styles.handle, { backgroundColor: theme.border }]} />
    </View>
  );
}

// 长按图片弹出的操作面板。目前只有「保存到相册」一项，所以不做列表，直接把状态画在这一行里。
const ImageActionSheet = forwardRef<BottomSheetModal, Props>(
  function ImageActionSheet({ state, onSave, onClose }, ref) {
    const { theme } = useTheme();
    const { t } = useTranslation();

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

    const saved = state === "saved";
    const saving = state === "saving";
    const label = saving
      ? t("imageViewer.saving")
      : saved
        ? t("imageViewer.saved")
        : t("imageViewer.saveImage");

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        enablePanDownToClose
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
        backgroundStyle={[
          styles.sheetBackground,
          {
            backgroundColor: theme.card,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        ]}
      >
        <BottomSheetView style={styles.content}>
          <Pressable
            style={styles.row}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: saving || saved }}
            disabled={saving || saved}
            onPress={onSave}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.secondaryBackground },
              ]}
            >
              {saving ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <HugeIcon
                  icon={saved ? CheckmarkCircle02Icon : Download01Icon}
                  size={20}
                  color={saved ? theme.primary : theme.text}
                />
              )}
            </View>
            <ThemedText
              variant="bodySmall"
              color={saved ? theme.primary : undefined}
            >
              {label}
            </ThemedText>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default ImageActionSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});
