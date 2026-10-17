import { api } from "@/api";
import { SettingsSection, SettingsScreen } from "@/components/settings/SettingsPrimitives";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { clearAuth } from "@/store/authStore";
import { router, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const MIN_PASSWORD_LENGTH = 6;

export default function AccountPasswordScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { confirm } = useConfirm();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("accountSettingPage.passwordSection") });
  }, [navigation, t]);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current) return;

    if (!oldPassword) {
      setError(t("accountSettingPage.currentPasswordRequired"));
      return;
    }
    if (!newPassword) {
      setError(t("accountSettingPage.newPasswordRequired"));
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(t("accountSettingPage.newPasswordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("accountSettingPage.passwordMismatch"));
      return;
    }
    if (newPassword === oldPassword) {
      setError(t("accountSettingPage.passwordSameAsOld"));
      return;
    }

    setError(null);
    submittingRef.current = true;
    setSubmitting(true);

    try {
      await api.userControllerChangePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      confirm({
        title: t("accountSettingPage.changeSuccessTitle"),
        message: t("accountSettingPage.changeSuccessMessage"),
        confirmText: t("accountSettingPage.relogin"),
        onConfirm: async () => {
          await clearAuth();
          router.replace("/auth");
        },
      });
    } catch (raw) {
      const message = (raw as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(message ? String(message) : t("accountSettingPage.changeFailed"));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [confirmPassword, confirm, newPassword, oldPassword, t]);

  return (
    <SettingsScreen>
      <SettingsSection footer={t("accountSettingPage.passwordFooter")}>
        <View style={styles.form}>
          <FloatInput
            label={t("accountSettingPage.currentPassword")}
            value={oldPassword}
            onChangeText={(text) => {
              setOldPassword(text);
              setError(null);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />
          <FloatInput
            label={t("accountSettingPage.newPassword")}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setError(null);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />
          <FloatInput
            label={t("accountSettingPage.confirmPassword")}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />
          {error ? (
            <ThemedText size={13} color={theme.danger} style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}
          <Button
            label={t("accountSettingPage.submit")}
            size="lg"
            fullWidth
            loading={submitting}
            onPress={() => {
              void handleSubmit();
            }}
          />
        </View>
      </SettingsSection>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
  errorText: {
    marginTop: -4,
    lineHeight: 18,
  },
});
