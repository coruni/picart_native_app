import { api } from "@/api";
import { Switch } from "@/components/ui/Switch";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

function normalizeConfig(
  source?: Partial<Record<NotificationKey, unknown>> | null,
): NotificationConfigState {
  return NOTIFICATION_KEYS.reduce((acc, key) => {
    acc[key] = Boolean(source?.[key]);
    return acc;
  }, {} as NotificationConfigState);
}

/** 通用分组容器，样式对齐 system 页 */
function Section({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionWrap}>
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
    const storeConfig = normalizeConfig(user?.config);
    setConfig(storeConfig);
    if (Object.values(storeConfig).some(Boolean)) return;

    void (async () => {
      try {
        const response = await api.userControllerGetUserConfig();
        if (!active) return;
        setConfig(
          normalizeConfig(
            response.data?.data as Partial<
              Record<NotificationKey, unknown>
            > | null,
          ),
        );
      } catch {
        // 静默失败，保留本地 store 值
      }
    })();

    return () => {
      active = false;
    };
    // 仅在挂载时加载一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          [key]: nextValue,
        });
        const next = { ...config, [key]: nextValue };
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={["bottom", "left", "right"]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Section>
            {NOTIFICATION_KEYS.map((key, index) => (
              <View
                key={key}
                style={[
                  styles.row,
                  index !== NOTIFICATION_KEYS.length - 1 && {
                    borderBottomColor: theme.border,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <ThemedText size={15} style={styles.rowLabel}>
                  {t(`notificationSettingPage.${key}`)}
                </ThemedText>
                <Switch
                  checked={config[key]}
                  loading={savingKey === key}
                  onCheckedChange={(checked) => void handleToggle(key, checked)}
                />
              </View>
            ))}
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
  },
  sectionWrap: {
    marginBottom: 16,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    flex: 1,
    marginRight: 12,
  },
});
