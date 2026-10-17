import { api } from "@/api";
import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShippingAddressScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("infoManagementPage.title") });
  }, [navigation, t]);

  const [addressValue, setAddressValue] = useState("");
  const [addressError, setAddressError] = useState("");
  const [submittingAddress, setSubmittingAddress] = useState(false);

  const handleAddressSubmit = useCallback(async () => {
    setAddressError("");
    const trimmed = addressValue.trim();
    if (!trimmed) {
      setAddressError(t("infoManagementPage.address.required"));
      return;
    }
    if (!user?.id) return;

    setSubmittingAddress(true);
    try {
      await api.userControllerUpdate(String(user.id), { address: trimmed });
      const s = useAuthStore.getState();
      if (s.token && s.refreshToken && s.user) {
        s.setAuth(s.token, s.refreshToken, { ...s.user, address: trimmed });
      }
      toast.show(t("infoManagementPage.address.success"));
      setAddressValue("");
    } catch {
      setAddressError(t("infoManagementPage.address.updateError"));
    } finally {
      setSubmittingAddress(false);
    }
  }, [addressValue, user, t]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection
          title={t("infoManagementPage.address.sectionTitle")}
          footer={t("infoManagementPage.notice")}
        >
          <SettingsRow
            label={t("infoManagementPage.address.currentLabel")}
            value={user?.address || t("infoManagementPage.address.empty")}
            showBorder
          />
          <View style={styles.fieldGroup}>
            <FloatInput
              label={t("infoManagementPage.address.label")}
              placeholder={t("infoManagementPage.address.placeholder")}
              value={addressValue}
              onChangeText={(v) => {
                setAddressValue(v);
                setAddressError("");
              }}
              error={addressError}
            />
            <Button
              label={t("infoManagementPage.address.submit")}
              size="lg"
              fullWidth
              loading={submittingAddress}
              onPress={() => {
                void handleAddressSubmit();
              }}
            />
          </View>
        </SettingsSection>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingTop: 4 },
  fieldGroup: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
});
