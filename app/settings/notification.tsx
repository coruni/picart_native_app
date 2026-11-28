import { api } from "@/api";
import type {
  DtoUpdateNotificationRequest,
  DtoUserConfigDto,
} from "@/api/generated";
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
const API_KEY: Record<NotificationKey, keyof DtoUserConfigDto> = {
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

/** 11 个开关一次性写回，后端按整份通知配置覆盖 */
function toApiPatch(state: NotificationConfigState): DtoUpdateNotificationRequest {
  return {
    enable_system_notification: state.enableSystemNotification,
    enable_comment_notification: state.enableCommentNotification,
    enable_like_notification: state.enableLikeNotification,
    enable_follow_notification: state.enableFollowNotification,
    enable_message_notification: state.enableMessageNotification,
    enable_order_notification: state.enableOrderNotification,
    enable_payment_notification: state.enablePaymentNotification,
    enable_invite_notification: state.enableInviteNotification,
    enable_email_notification: state.enableEmailNotification,
    enable_sms_notification: state.enableSmsNotification,
    enable_push_notification: state.enablePushNotification,
  };
}

function normalizeConfig(
  source?: DtoUserConfigDto | null,
): NotificationConfigState {
  return NOTIFICATION_KEYS.reduce((acc, key) => {
    acc[key] = Boolean(source?.[API_KEY[key]]);
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
        const remote = normalizeConfig(response.data?.data);
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
        config: { ...s.user.config, ...toApiPatch(next) },
      });
    }
  }, []);

  const handleToggle = useCallback(
    async (key: NotificationKey, nextValue: boolean) => {
      const previousValue = config[key];
      const next = { ...config, [key]: nextValue };
      setConfig(next);
      setSavingKey(key);

      try {
        await api.userControllerUpdateNotificationSettings(toApiPatch(next));
        persistToStore(next);
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
