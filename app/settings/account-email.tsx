import { api } from "@/api";
import { sendVerificationCode } from "@/api/compat";
import {
  SettingsRow,
  SettingsSection,
  SettingsScreen,
} from "@/components/settings/SettingsPrimitives";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
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
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = useCallback(() => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError(t("accountSettingPage.emailActions.required"));
      return null;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError(t("accountSettingPage.emailActions.invalid"));
      return null;
    }
    if (currentEmail && trimmed.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError(t("accountSettingPage.emailActions.sameAsCurrent"));
      return null;
    }
    return trimmed;
  }, [email, currentEmail, t]);

  const handleSendCode = useCallback(async () => {
    setEmailError("");
    setCodeError("");
    const trimmed = validateEmail();
    if (!trimmed) return;

    setSending(true);
    try {
      await sendVerificationCode({
        email: trimmed,
        type: "verification",
      });
      setCodeSent(true);
    } catch {
      setEmailError(t("accountSettingPage.emailActions.codeSendError"));
    } finally {
      setSending(false);
    }
  }, [validateEmail, t]);

  const handleSubmit = useCallback(async () => {
    setEmailError("");
    setCodeError("");
    const trimmed = validateEmail();
    if (!trimmed) return;
    if (!code.trim()) {
      setCodeError(t("accountSettingPage.emailActions.codeRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await api.userControllerUpdateContact({
        email: trimmed,
        verification_code: code.trim(),
      });
      const s = useAuthStore.getState();
      if (s.token && s.refreshToken && s.user) {
        s.setAuth(s.token, s.refreshToken, { ...s.user, email: trimmed });
      }
      // 改完直接返回，设置页会显示新邮箱
      navigation.goBack();
    } catch {
      setCodeError(t("accountSettingPage.emailActions.updateError"));
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
          <View style={styles.emailRow}>
            <View style={styles.emailInput}>
              <FloatInput
                label={t("accountSettingPage.emailActions.newLabel")}
                placeholder={t("accountSettingPage.emailActions.placeholder")}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setEmailError("");
                  // 验证码是发给原邮箱的，邮箱一改就作废
                  setCodeSent(false);
                  setCode("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!submitting}
                error={emailError}
              />
            </View>
            <Button
              // 文案只换字、宽度不跟着变，否则输入框会被挤得一跳一跳
              label={
                codeSent
                  ? t("accountSettingPage.emailActions.resend")
                  : t("accountSettingPage.emailActions.sendCode")
              }
              variant="outline"
              tone="primary"
              size="lg"
              style={styles.sendBtn}
              loading={sending}
              disabled={sending || submitting}
              onPress={() => {
                void handleSendCode();
              }}
            />
          </View>
          <FloatInput
            label={t("accountSettingPage.emailActions.codeLabel")}
            value={code}
            onChangeText={(v) => {
              setCode(v);
              setCodeError("");
            }}
            keyboardType="number-pad"
            autoCapitalize="none"
            editable={codeSent && !submitting}
            error={codeError}
          />
          {/* 有效期只在验证码真的发出去之后才说，没发的时候说了也没用 */}
          {codeSent ? (
            <ThemedText
              size={12}
              color={theme.mutedForeground}
              style={styles.codeHint}
            >
              {t("accountSettingPage.emailActions.legalHint")}
            </ThemedText>
          ) : null}
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
  emailRow: {
    flexDirection: "row",
    // flex-start + 按钮 marginTop：输入框下方可能多出一行错误文案，按钮只跟框体对齐
    alignItems: "flex-start",
    gap: 12,
  },
  emailInput: {
    flex: 1,
  },
  sendBtn: {
    // 和输入框框体同高（FloatInput 的 CONTAINER_H = 54），两态文案取宽的那个定最小宽
    minWidth: 128,
    height: 54,
    // wrapper 顶部留白 9（给浮起的 label），按钮和框体顶对齐
    marginTop: 9,
  },
  codeHint: {
    // form 的 gap 是 16，这条紧贴验证码框，压到 8
    marginTop: -8,
    lineHeight: 18,
  },
});
