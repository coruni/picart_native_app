import { api } from "@/api";
import {
  SettingsRow,
  SettingsSection,
  SettingsScreen,
} from "@/components/settings/SettingsPrimitives";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AccountEmailScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const currentEmail = user?.email ?? "";

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("accountSettingPage.emailPageTitle") });
  }, [navigation, t]);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = useCallback(() => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t("accountSettingPage.emailActions.required"));
      return null;
    }
    if (!isValidEmail(trimmed)) {
      setError(t("accountSettingPage.emailActions.invalid"));
      return null;
    }
    if (currentEmail && trimmed.toLowerCase() === currentEmail.toLowerCase()) {
      setError(t("accountSettingPage.emailActions.sameAsCurrent"));
      return null;
    }
    return trimmed;
  }, [email, currentEmail, t]);

  const handleSendCode = useCallback(async () => {
    setError("");
    const trimmed = validateEmail();
    if (!trimmed) return;

    setSending(true);
    try {
      await api.userControllerSendVerificationCode({
        email: trimmed,
        type: "verification",
      });
      setCodeSent(true);
      toast.show(t("accountSettingPage.emailActions.codeSent"));
    } catch {
      setError(t("accountSettingPage.emailActions.codeSendError"));
    } finally {
      setSending(false);
    }
  }, [validateEmail, t]);

  const handleSubmit = useCallback(async () => {
    setError("");
    const trimmed = validateEmail();
    if (!trimmed) return;
    if (!code.trim()) {
      setError(t("accountSettingPage.emailActions.codeRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await api.userControllerUpdateProfileContact({
        email: trimmed,
        verificationCode: code.trim(),
      });
      const s = useAuthStore.getState();
      if (s.token && s.refreshToken && s.user) {
        s.setAuth(s.token, s.refreshToken, { ...s.user, email: trimmed });
      }
      toast.show(t("accountSettingPage.emailActions.success"));
      navigation.goBack();
    } catch {
      setError(t("accountSettingPage.emailActions.updateError"));
    } finally {
      setSubmitting(false);
    }
  }, [validateEmail, code, navigation, t]);

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      <SettingsSection
        title={t("accountSettingPage.emailSection")}
        footer={t("accountSettingPage.emailActions.footer")}
      >
        <SettingsRow
          label={t("accountSettingPage.emailActions.currentLabel")}
          value={currentEmail || t("accountSettingPage.emailNotSet")}
          showBorder
        />
        <View style={styles.form}>
          <FloatInput
            label={t("accountSettingPage.emailActions.newLabel")}
            placeholder={t("accountSettingPage.emailActions.placeholder")}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
              setCodeSent(false);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
          />
          <Button
            label={t("accountSettingPage.emailActions.sendCode")}
            variant="outline"
            tone="primary"
            size="md"
            fullWidth
            loading={sending}
            disabled={sending || submitting}
            onPress={() => {
              void handleSendCode();
            }}
          />
          <FloatInput
            label={t("accountSettingPage.emailActions.codeLabel")}
            value={code}
            onChangeText={(v) => {
              setCode(v);
              setError("");
            }}
            keyboardType="number-pad"
            autoCapitalize="none"
            editable={codeSent && !submitting}
            error={error}
          />
          <Button
            label={t("accountSettingPage.emailActions.confirm")}
            size="lg"
            fullWidth
            loading={submitting}
            onPress={() => {
              void handleSubmit();
            }}
          />
        </View>
      </SettingsSection>

      <ThemedText
        size={12}
        color={theme.mutedForeground}
        style={styles.legal}
      >
        {t("accountSettingPage.emailActions.legalHint")}
      </ThemedText>
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
  legal: {
    marginHorizontal: 16,
    lineHeight: 18,
  },
});
