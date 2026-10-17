import {
  SettingsSection,
  SettingsRow,
} from "@/components/settings/SettingsPrimitives";
import { hasNextRow } from "@/components/settings/SettingsRows";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { isVersionNewer } from "@/lib/version";
import { useConfigStore } from "@/store/configStore";
import Clipboard from "@react-native-clipboard/clipboard";import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CURRENT_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export default function AboutSettingsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const config = useConfigStore((s) => s.config);

  const appName = config?.app_name ?? t("settingsPage.appFallbackName");

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("aboutSettingPage.title") });
  }, [navigation, t]);

  const latestVersion = Platform.select({
    ios: config?.app_ios_version,
    android: config?.app_android_version,
    default: config?.app_version,
  }) || config?.app_version;

  const hasUpdate = useMemo(
    () => isVersionNewer(latestVersion, CURRENT_VERSION),
    [latestVersion],
  );

  const downloadUrl = Platform.select({
    ios: config?.app_ios_download_url,
    android: config?.app_android_download_url,
    default: config?.app_android_download_url,
  });

  const handleContact = useCallback(() => {
    const mail = config?.site_mail;
    if (!mail) return;
    Clipboard.setString(mail);
    toast.show(t("aboutSettingPage.copied"));
    void Linking.openURL(`mailto:${mail}`);
  }, [config?.site_mail, t]);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) return;
    void Linking.openURL(downloadUrl);
  }, [downloadUrl]);

  const aboutRows: {
    key: string;
    label: string;
    value?: string;
    onPress?: () => void;
  }[] = [
    {
      key: "version",
      label: t("aboutSettingPage.currentVersion"),
      value: `v${CURRENT_VERSION}`,
    },
    {
      key: "update",
      label: t("aboutSettingPage.latestVersion"),
      value: hasUpdate
        ? t("aboutSettingPage.updateAvailableShort", { version: latestVersion })
        : t("aboutSettingPage.upToDate"),
      onPress: hasUpdate && downloadUrl ? handleDownload : undefined,
    },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.card }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 20) + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brand}>
        <ThemedText size={22} fontWeight="700">
          {appName}
        </ThemedText>
        <ThemedText size={13} color={theme.mutedForeground}>
          {config?.site_subtitle || t("aboutSettingPage.defaultTagline")}
        </ThemedText>
      </View>

      <SettingsSection title={t("aboutSettingPage.versionSection")}>
        {aboutRows.map((row, index) => (
          <SettingsRow
            key={row.key}
            label={row.label}
            value={row.value}
            showBorder={hasNextRow(aboutRows.length, index)}
            onPress={row.onPress}
          />
        ))}
      </SettingsSection>

      {/* 社区公约与隐私政策唯一入口在设置首页的「关于」分组，此处只留联系渠道 */}
      <SettingsSection title={t("aboutSettingPage.legalSection")}>
        <SettingsRow
          label={t("aboutSettingPage.contactEmail")}
          chevron={Boolean(config?.site_mail)}
          value={config?.site_mail || t("aboutSettingPage.notConfigured")}
          onPress={config?.site_mail ? handleContact : undefined}
        />
      </SettingsSection>

      {config?.site_description ? (
        <ThemedText
          size={12}
          color={theme.mutedForeground}
          style={styles.description}
        >
          {config.site_description}
        </ThemedText>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 32,
  },
  brand: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  description: {
    marginHorizontal: 16,
    marginTop: 8,
    lineHeight: 18,
  },
});
