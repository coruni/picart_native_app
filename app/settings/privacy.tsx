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

type PrivacyKey =
  | "hideFavorites"
  | "hideComments"
  | "hideCollections"
  | "hideFollowers"
  | "hideFollowings"
  | "hideTags";

type PrivacyConfigState = Record<PrivacyKey, boolean>;

const PRIVACY_KEYS: PrivacyKey[] = [
  "hideFavorites",
  "hideComments",
  "hideCollections",
  "hideFollowers",
  "hideFollowings",
  "hideTags",
];

// 界面沿用 camelCase（本地化文案按它索引），后端配置字段是蛇形
const API_KEY: Record<PrivacyKey, string> = {
  hideFavorites: "hide_favorites",
  hideComments: "hide_comments",
  hideCollections: "hide_collections",
  hideFollowers: "hide_followers",
  hideFollowings: "hide_followings",
  hideTags: "hide_tags",
};

function readValue(source: Record<string, unknown>, key: PrivacyKey) {
  return source[API_KEY[key]] ?? source[key];
}

function normalizeConfig(
  source?: Record<string, unknown> | null,
): PrivacyConfigState {
  return PRIVACY_KEYS.reduce((acc, key) => {
    acc[key] = Boolean(source ? readValue(source, key) : false);
    return acc;
  }, {} as PrivacyConfigState);
}

/** store 里是否已有任一隐私字段的有效布尔值 */
function hasPrivacyConfig(source?: Record<string, unknown> | null): boolean {
  return PRIVACY_KEYS.some(
    (key) => source && typeof readValue(source, key) === "boolean",
  );
}

export default function PrivacySettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);

  const [config, setConfig] = useState<PrivacyConfigState>(() =>
    normalizeConfig(user?.config),
  );
  const [savingKey, setSavingKey] = useState<PrivacyKey | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("privacySettingPage.title") });
  }, [navigation, t]);

  useEffect(() => {
    let active = true;
    const storeConfig = useAuthStore.getState().user?.config;

    if (hasPrivacyConfig(storeConfig)) return;

    void (async () => {
      try {
        const response = await api.userControllerGetUserConfig();
        if (!active) return;
        setConfig(
          normalizeConfig(response.data?.data as Record<string, unknown> | null),
        );
      } catch {
        // 拉取失败保留本地 store 值
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const persistToStore = useCallback((next: PrivacyConfigState) => {
    const s = useAuthStore.getState();
    if (s.token && s.refreshToken && s.user) {
      s.setAuth(s.token, s.refreshToken, {
        ...s.user,
        config: { ...s.user.config, ...next },
      });
    }
  }, []);

  const handleToggle = useCallback(
    async (key: PrivacyKey, nextValue: boolean) => {
      const previousValue = config[key];
      setConfig((prev) => ({ ...prev, [key]: nextValue }));
      setSavingKey(key);

      try {
        // DtoUpdateUserConfigRequest 还没声明 hide_* 隐私字段，先带着，
        // 等 spec 补齐后删掉 as unknown as（见 docs/api-compat-handover.md）。
        await api.userControllerUpdateUserConfig({
          [API_KEY[key]]: nextValue,
        } as unknown as Parameters<typeof api.userControllerUpdateUserConfig>[0]);
        persistToStore({ ...config, [key]: nextValue });
      } catch {
        setConfig((prev) => ({ ...prev, [key]: previousValue }));
        toast.show(t("privacySettingPage.saveFailed"));
      } finally {
        setSavingKey(null);
      }
    },
    [config, persistToStore, t],
  );

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      <SettingsSection
        title={t("privacySettingPage.sectionTitle")}
        footer={t("privacySettingPage.footer")}
      >
        {PRIVACY_KEYS.map((key, index) => (
          <SettingsSwitchRow
            key={key}
            label={t(`privacySettingPage.${key}`)}
            checked={config[key]}
            loading={savingKey === key}
            showBorder={hasNextRow(PRIVACY_KEYS.length, index)}
            onCheckedChange={(checked) => {
              void handleToggle(key, checked);
            }}
          />
        ))}
      </SettingsSection>
    </SettingsScreen>
  );
}
