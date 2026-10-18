import {
  SettingsScreen,
  SettingsSection,
  SettingsRow,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsSwitchRow,
} from "@/components/settings/SettingsRows";
import { toast } from "@/hooks/useToast";
import { usePushStatus } from "@/hooks/usePushNotifications";
import {
  refreshPushStatus,
  registerPushToken,
  type PushPermissionState,
} from "@/lib/push";
import { PushSettingKey, useSettingsStore } from "@/store/settingsStore";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

const PUSH_KEYS: PushSettingKey[] = [
  "pushComment",
  "pushLike",
  "pushFollow",
  "pushRecommend",
  "pushFollowing",
];

function permissionKey(state: PushPermissionState) {
  switch (state) {
    case "granted":
      return "pushSettingPage.permissionGranted";
    case "denied":
      return "pushSettingPage.permissionDenied";
    default:
      return "pushSettingPage.permissionUndetermined";
  }
}

export default function PushSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const push = useSettingsStore((s) => s.push);
  const setPushSetting = useSettingsStore((s) => s.setPushSetting);

  const { permission, token, error, syncing } = usePushStatus();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("pushSettingPage.title") });
  }, [navigation, t]);

  useEffect(() => {
    void refreshPushStatus();
  }, []);

  const handlePermissionPress = useCallback(() => {
    if (permission === "undetermined") {
      void registerPushToken({ requestPermission: true });
      return;
    }
    // 已授权/已拒绝都只能去系统设置里改
    void Linking.openSettings();
  }, [permission]);

  const handleRefreshToken = useCallback(() => {
    void registerPushToken({ requestPermission: permission === "undetermined" });
  }, [permission]);

  const handleCopyToken = useCallback(() => {
    if (!token) return;
    Clipboard.setString(token);
    toast.show(t("pushSettingPage.tokenCopied"));
  }, [token, t]);

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      <SettingsSection
        title={t("pushSettingPage.systemSectionTitle")}
        footer={t("pushSettingPage.systemFooter")}
      >
        <SettingsRow
          label={t("pushSettingPage.permissionLabel")}
          value={t(permissionKey(permission))}
          chevron
          showBorder={hasNextRow(3, 0)}
          disabled={syncing}
          onPress={handlePermissionPress}
        />
        <SettingsRow
          label={t("pushSettingPage.tokenLabel")}
          value={token ? `${token.slice(0, 16)}…` : t("pushSettingPage.tokenEmpty")}
          showBorder={hasNextRow(3, 1)}
          disabled={!token}
          onPress={handleCopyToken}
        />
        <SettingsRow
          label={t("pushSettingPage.refreshToken")}
          value={syncing ? t("pushSettingPage.refreshing") : undefined}
          disabled={syncing}
          onPress={handleRefreshToken}
        />
      </SettingsSection>

      {error ? (
        <SettingsSection title={t("pushSettingPage.lastError")}>
          <SettingsRow label={error} />
        </SettingsSection>
      ) : null}

      <SettingsSection
        title={t("pushSettingPage.sectionTitle")}
        footer={t("pushSettingPage.hint")}
      >
        {PUSH_KEYS.map((key, index) => (
          <SettingsSwitchRow
            key={key}
            label={t(`pushSettingPage.${key}`)}
            checked={push[key]}
            showBorder={hasNextRow(PUSH_KEYS.length, index)}
            onCheckedChange={(checked) => setPushSetting(key, checked)}
          />
        ))}
      </SettingsSection>
    </SettingsScreen>
  );
}
