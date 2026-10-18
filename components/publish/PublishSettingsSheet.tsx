import HugeIcon from "@/components/ui/HugeIcon";
import { Switch } from "@/components/ui/Switch";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ComponentProps,
} from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** 发布设置：和 web 端 create 页的「权限配置」保持一致 */
export interface PublishSettings {
  requireLogin: boolean;
  requireFollow: boolean;
  requireMembership: boolean;
  requirePayment: boolean;
  viewPrice: number;
}

export const DEFAULT_PUBLISH_SETTINGS: PublishSettings = {
  requireLogin: false,
  requireFollow: false,
  requireMembership: false,
  requirePayment: false,
  viewPrice: 0,
};

export interface PublishSettingsSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface PublishSettingsSheetProps {
  value: PublishSettings;
  onChange: (next: PublishSettings) => void;
  onDismiss?: () => void;
}

const PublishSettingsSheet = forwardRef<
  PublishSettingsSheetRef,
  PublishSettingsSheetProps
>(function PublishSettingsSheet({ value, onChange, onDismiss }, ref) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(
    ref,
    () => ({
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    }),
    [],
  );

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  const setField = useCallback(
    <K extends keyof PublishSettings>(key: K, next: PublishSettings[K]) => {
      onChange({ ...value, [key]: next });
    },
    [onChange, value],
  );

  const rows: {
    key: keyof Omit<PublishSettings, "viewPrice">;
    label: string;
  }[] = [
    { key: "requireLogin", label: t("publish.settings.requireLogin") },
    { key: "requireFollow", label: t("publish.settings.requireFollow") },
    {
      key: "requireMembership",
      label: t("publish.settings.requireMembership"),
    },
    { key: "requirePayment", label: t("publish.settings.requirePayment") },
  ];

  return (
    <BottomSheetModal
      ref={sheetRef}
      // 内容不长，跟着内容自适应高度，面板自然贴底
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
      onDismiss={onDismiss}
    >
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom + 16 }]}
      >
        <View style={styles.titleRow}>
          <ThemedText fontWeight="600" size={16}>
            {t("publish.settings.title")}
          </ThemedText>
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t("cancel")}
            onPress={() => sheetRef.current?.dismiss()}
            style={styles.closeButton}
          >
            <HugeIcon
              icon={Cancel01Icon}
              size={18}
              color={theme.mutedForeground}
            />
          </Pressable>
        </View>

        <ThemedText size={12} color={theme.mutedForeground} style={styles.groupTitle}>
          {t("publish.settings.permissionTitle")}
        </ThemedText>

        {rows.map((row) => (
          <View key={row.key} style={styles.row}>
            <ThemedText size={14}>{row.label}</ThemedText>
            <Switch
              checked={value[row.key]}
              onCheckedChange={(checked) => setField(row.key, checked)}
            />
          </View>
        ))}

        {/* 开了付费才需要填价格 */}
        {value.requirePayment ? (
          <View style={styles.priceRow}>
            <ThemedText size={13} color={theme.mutedForeground}>
              {t("publish.settings.priceLabel")}
            </ThemedText>
            <BottomSheetTextInput
              value={value.viewPrice > 0 ? String(value.viewPrice) : ""}
              onChangeText={(next) => {
                const digits = next.replace(/[^\d]/g, "");
                setField("viewPrice", digits ? Number(digits) : 0);
              }}
              placeholder={t("publish.settings.pricePlaceholder")}
              placeholderTextColor={theme.mutedForeground}
              keyboardType="number-pad"
              style={[
                styles.priceInput,
                { backgroundColor: theme.muted, color: theme.foreground },
              ]}
            />
          </View>
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PublishSettingsSheet;

const styles = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    paddingHorizontal: 16,
  },
  titleRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  groupTitle: {
    marginTop: 4,
    marginBottom: 4,
  },
  row: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  priceInput: {
    width: 120,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    textAlign: "right",
  },
});
