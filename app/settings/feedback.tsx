import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import Button from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import Clipboard from "@react-native-clipboard/clipboard";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedbackSettingsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const config = useConfigStore((s) => s.config);
  const user = useAuthStore((s) => s.user);

  const [content, setContent] = useState("");
  const [contact, setContact] = useState(user?.email ?? "");

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("feedbackPage.title") });
  }, [navigation, t]);

  const supportEmail = config?.site_mail || config?.site_contact || "";

  const diagnostics = useMemo(
    () =>
      [
        `${t("feedbackPage.appVersion")}: ${Constants.expoConfig?.version ?? "-"}`,
        `${t("feedbackPage.platform")}: ${Platform.OS} ${Platform.Version}`,
        `${t("feedbackPage.device")}: ${Constants.deviceName ?? "-"}`,
        `${t("feedbackPage.account")}: ${user?.username ?? "-"}`,
      ].join("\n"),
    [t, user?.username],
  );

  const handleCopyDiagnostics = useCallback(() => {
    Clipboard.setString(diagnostics);
    toast.show(t("feedbackPage.diagnosticsCopied"));
  }, [diagnostics, t]);

  const handleMailto = useCallback(() => {
    if (!supportEmail) {
      toast.show(t("feedbackPage.mailNotConfigured"));
      return;
    }
    const subject = encodeURIComponent(t("feedbackPage.mailSubject"));
    const body = encodeURIComponent(
      `${content}\n\n---\n${diagnostics}\n${t("feedbackPage.contact")}: ${contact}`,
    );
    void Linking.openURL(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  }, [contact, content, diagnostics, supportEmail, t]);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.card }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection
          title={t("feedbackPage.formSection")}
          footer={t("feedbackPage.formFooter")}
        >
          <View style={styles.fieldGroup}>
            <FloatInput
              label={t("feedbackPage.contentLabel")}
              value={content}
              onChangeText={setContent}
              maxLength={2000}
              returnKeyType="next"
            />
            <FloatInput
              label={t("feedbackPage.contactLabel")}
              value={contact}
              onChangeText={setContact}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              label={t("feedbackPage.sendByMail")}
              size="lg"
              fullWidth
              onPress={handleMailto}
            />
          </View>
        </SettingsSection>

        <SettingsSection title={t("feedbackPage.mailSection")}>
          <SettingsRow
            label={t("feedbackPage.supportEmail")}
            value={supportEmail || t("feedbackPage.notConfigured")}
            showBorder
            disabled={!supportEmail}
            onPress={
              supportEmail
                ? () => {
                    Clipboard.setString(supportEmail);
                    toast.show(t("feedbackPage.copied"));
                  }
                : undefined
            }
          />
          <SettingsRow
            label={t("feedbackPage.copyDiagnostics")}
            value={t("feedbackPage.diagnosticsValue")}
            onPress={handleCopyDiagnostics}
          />
        </SettingsSection>

        <ThemedText size={12} color={theme.mutedForeground} style={styles.note}>
          {t("feedbackPage.note")}
        </ThemedText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 20,
  },
  fieldGroup: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 20,
    gap: 16,
  },
  note: {
    marginHorizontal: 16,
    marginTop: 4,
    lineHeight: 18,
  },
});
