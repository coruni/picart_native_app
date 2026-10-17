import { api, getDeviceId } from "@/api";
import {
  SettingsScreen,
  SettingsSection,
  SettingsRow,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsLogoutButton,
} from "@/components/settings/SettingsRows";
import { useConfirm } from "@/hooks/useConfirm";
import { toast } from "@/hooks/useToast";
import { clearAppCache, measureCache } from "@/lib/cache";
import { isVersionNewer } from "@/lib/version";
import { clearAuth } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import Constants from "expo-constants";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type RowKey =
  | "account"
  | "profile"
  | "blocked"
  | "notification"
  | "push"
  | "privacy"
  | "system"
  | "widget"
  | "cache"
  | "update"
  | "feedback"
  | "community"
  | "privacyPolicy"
  | "about";

type RowHandlers = Record<RowKey, () => void>;

const CURRENT_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export default function SettingsScreenPage() {
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const navigation = useNavigation();
  const config = useConfigStore((state) => state.config);
  const fetchConfig = useConfigStore((state) => state.fetchConfig);
  const appName = config?.app_name ?? t("settingsPage.appFallbackName");
  const [cacheSize, setCacheSize] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("settingsPage.title") });
  }, [navigation, t]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const snapshot = await measureCache();
        if (active) setCacheSize(snapshot.display);
      } catch {
        if (active) setCacheSize(t("settingsPage.cacheSizeEmpty"));
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const handleClearCache = useCallback(() => {
    if (clearing) return;
    confirm({
      title: t("settingsPage.clearCacheTitle"),
      message: t("settingsPage.clearCacheMessage"),
      confirmText: t("settingsPage.clearCacheConfirm"),
      onConfirm: async () => {
        setClearing(true);
        try {
          const snapshot = await clearAppCache();
          setCacheSize(snapshot.display);
          toast.show(t("settingsPage.clearCacheSuccess"));
        } catch {
          toast.show(t("settingsPage.clearCacheFailed"));
        } finally {
          setClearing(false);
        }
      },
    });
  }, [clearing, confirm, t]);

  const handleCheckUpdate = useCallback(async () => {
    await fetchConfig();
    const latest = useConfigStore.getState().config;
    const latestVersion = latest?.app_android_version || latest?.app_version;

    if (isVersionNewer(latestVersion, CURRENT_VERSION)) {
      confirm({
        title: t("settingsPage.updateAvailableTitle", { version: latestVersion }),
        message: latest?.app_update_message || t("settingsPage.updateAvailableMessage"),
        confirmText: t("settingsPage.updateConfirm"),
        onConfirm: () => {
          router.push("/settings/about");
        },
      });
      return;
    }

    toast.show(t("settingsPage.updateLatest"));
  }, [confirm, fetchConfig, t]);

  const handleLogout = useCallback(() => {
    confirm({
      title: t("settingsPage.logoutTitle"),
      message: t("settingsPage.logoutMessage"),
      confirmText: t("settingsPage.logout"),
      onConfirm: async () => {
        try {
          const deviceId = await getDeviceId();
          await api.userControllerLogout(deviceId);
        } catch {
          // 服务端登出失败不阻塞本地退出
        }
        await clearAuth();
        router.replace("/auth");
      },
    });
  }, [confirm, t]);

  const handlers: RowHandlers = {
    account: () => router.push("/settings/account"),
    profile: () => router.push("/settings/profile"),
    blocked: () => router.push("/settings/blocked"),
    notification: () => router.push("/settings/notification"),
    push: () => router.push("/settings/push"),
    privacy: () => router.push("/settings/privacy"),
    system: () => router.push("/settings/system"),
    widget: () => router.push("/settings/widget"),
    cache: handleClearCache,
    update: () => {
      void handleCheckUpdate();
    },
    feedback: () => router.push("/settings/feedback"),
    community: () => router.push("/agreement?type=terms"),
    privacyPolicy: () => router.push("/agreement?type=privacy"),
    about: () => router.push("/settings/about"),
  };

  const groups: { key: string; title: string; rows: RowKey[] }[] = [
    {
      key: "account",
      title: t("settingsPage.groupAccount"),
      rows: ["account", "profile", "blocked"],
    },
    {
      key: "notification",
      title: t("settingsPage.groupNotification"),
      rows: ["notification", "push", "privacy"],
    },
    {
      key: "general",
      title: t("settingsPage.groupGeneral"),
      rows: ["system", "widget", "cache", "update", "feedback"],
    },
    {
      key: "about",
      title: t("settingsPage.groupAbout"),
      rows: ["community", "privacyPolicy", "about"],
    },
  ];

  const rowMeta: Record<RowKey, { label: string; value?: string }> = {
    account: { label: t("settingsPage.accountManagement") },
    profile: { label: t("settingsPage.shippingAddress") },
    blocked: { label: t("settingsPage.blockedUsers") },
    notification: { label: t("settingsPage.inAppNotification") },
    push: { label: t("settingsPage.pushSettings") },
    privacy: { label: t("settingsPage.privacySettings") },
    system: { label: t("settingsPage.systemSettings") },
    widget: { label: t("settingsPage.widgets") },
    cache: {
      label: t("settingsPage.clearCache"),
      value:
        cacheSize === null ? t("settingsPage.cacheSizeUnknown") : cacheSize,
    },
    update: { label: t("settingsPage.checkUpdate") },
    feedback: { label: t("settingsPage.feedback") },
    community: { label: t("settingsPage.communityGuidelines") },
    privacyPolicy: { label: t("settingsPage.privacyPolicy") },
    about: {
      label: t("settingsPage.about", { name: appName }),
      value: `v${CURRENT_VERSION}`,
    },
  };

  return (
    <SettingsScreen>
      {groups.map((group) => (
        <SettingsSection key={group.key} title={group.title}>
          {group.rows.map((rowKey, index) => (
            <SettingsRow
              key={rowKey}
              label={rowMeta[rowKey].label}
              value={rowMeta[rowKey].value}
              chevron
              showBorder={hasNextRow(group.rows.length, index)}
              disabled={rowKey === "cache" && clearing}
              onPress={handlers[rowKey]}
            />
          ))}
        </SettingsSection>
      ))}

      <SettingsLogoutButton
        label={t("settingsPage.logout")}
        onPress={handleLogout}
      />
    </SettingsScreen>
  );
}
