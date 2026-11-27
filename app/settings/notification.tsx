import { api } from "@/api";
import {
  SettingsScreen,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsSwitchRow,
} from "@/components/settings/SettingsRows";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type NotificationKey =
  | "enableSystemNotification"
  | "enableCommentNotification"
  | "enableLikeNotification"
  | "enableFollowNotification"
  | "enableMessageNotification"
  | "enableOrderNotification"
  | "enablePaymentNotification"
  | "enableInviteNotification"
  | "enableEmailNotification"
  | "enableSmsNotification"
  | "enablePushNotification";

type NotificationConfigState = Record<NotificationKey, boolean>;

const NOTIFICATION_KEYS: NotificationKey[] = [
  "enableSystemNotification",
  "enableCommentNotification",
  "enableLikeNotification",
  "enableFollowNotification",
  "enableMessageNotification",
  "enableOrderNotification",
  "enablePaymentNotification",
  "enableInviteNotification",
  "enableEmailNotification",
  "enableSmsNotification",
  "enablePushNotification",
];

// 界面上沿用 camelCase 的 key（本地化文案按它索引），落到后端配置时换成蛇形
const API_KEY: Record<NotificationKey, string> = {
  enableSystemNotification: "enable_system_notification",
  enableCommentNotification: "enable_comment_notification",
  enableLikeNotification: "enable_like_notification",
  enableFollowNotification: "enable_follow_notification",
  enableMessageNotification: "enable_message_notification",
  enableOrderNotification: "enable_order_notification",
  enablePaymentNotification: "enable_payment_notification",
  enableInviteNotification: "enable_invite_notification",
  enableEmailNotification: "enable_email_notification",
  enableSmsNotification: "enable_sms_notification",
  enablePushNotification: "enable_push_notification",
};

function normalizeConfig(
  source?: Record<string, unknown> | null,
): NotificationConfigState {
  return NOTIFICATION_KEYS.reduce((acc, key) => {
    const value = source?.[API_KEY[key]] ?? source?.[key];
    acc[key] = Boolean(value);
    return acc;
  }, {} as NotificationConfigState);
}

export default function NotificationSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);

  const [config, setConfig] = useState<NotificationConfigState>(() =>
    normalizeConfig(user?.config),
  );
  const [savingKey, setSavingKey] = useState<NotificationKey | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("notificationSettingPage.title") });
  }, [navigation, t]);

  useEffect(() => {
    let active = true;
    const storeConfig = normalizeConfig(useAuthStore.getState().user?.config);

    void (async () => {
      try {
        const response = await api.userControllerGetUserConfig();
        if (!active) return;
        const remote = normalizeConfig(
          response.data?.data as Record<string, unknown> | null,
        );
        setConfig(remote);
      } catch {
        if (!active) return;
        setConfig(storeConfig);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const persistToStore = useCallback((next: NotificationConfigState) => {
    const s = useAuthStore.getState();
    if (s.token && s.refreshToken && s.user) {
      s.setAuth(s.token, s.refreshToken, {
        ...s.user,
        config: { ...s.user.config, ...next },
      });
    }
  }, []);

  const handleToggle = useCallback(
    async (key: NotificationKey, nextValue: boolean) => {
      const previousValue = config[key];
      setConfig((prev) => ({ ...prev, [key]: nextValue }));
      setSavingKey(key);

      try {
        await api.userControllerUpdateNotificationSettings({
          [API_KEY[key]]: nextValue,
        });
        persistToStore({ ...config, [key]: nextValue });
      } catch {
        setConfig((prev) => ({ ...prev, [key]: previousValue }));
        toast.show(t("notificationSettingPage.saveFailed"));
      } finally {
        setSavingKey(null);
      }
    },
    [config, persistToStore, t],
  );

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      <SettingsSection
        title={t("notificationSettingPage.sectionTitle")}
        footer={t("notificationSettingPage.footer")}
      >
        {NOTIFICATION_KEYS.map((key, index) => (
          <SettingsSwitchRow
            key={key}
            label={t(`notificationSettingPage.${key}`)}
            checked={config[key]}
            loading={savingKey === key}
            showBorder={hasNextRow(NOTIFICATION_KEYS.length, index)}
            onCheckedChange={(checked) => {
              void handleToggle(key, checked);
            }}
          />
        ))}
      </SettingsSection>
    </SettingsScreen>
  );
}
