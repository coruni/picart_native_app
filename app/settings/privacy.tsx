import { api } from "@/api";
import type {
  DtoUpdateUserConfigRequest,
  DtoUserConfigDto,
} from "@/api/generated";
import {
  SettingsRow,
  SettingsScreen,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsSwitchRow,
} from "@/components/settings/SettingsRows";
import { useConfirm } from "@/hooks/useConfirm";
import { toast } from "@/hooks/useToast";
import { clearConsent } from "@/lib/privacyConsent";
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
const API_KEY: Record<PrivacyKey, keyof DtoUserConfigDto> = {
  hideFavorites: "hide_favorites",
  hideComments: "hide_comments",
  hideCollections: "hide_collections",
  hideFollowers: "hide_followers",
  hideFollowings: "hide_followings",
  hideTags: "hide_tags",
};

/** 6 个开关一次性写回，后端按整份隐私配置覆盖 */
function toApiPatch(state: PrivacyConfigState): DtoUpdateUserConfigRequest {
  return {
    hide_favorites: state.hideFavorites,
    hide_comments: state.hideComments,
    hide_collections: state.hideCollections,
    hide_followers: state.hideFollowers,
    hide_followings: state.hideFollowings,
    hide_tags: state.hideTags,
  };
}

function normalizeConfig(
  source?: DtoUserConfigDto | null,
): PrivacyConfigState {
  return PRIVACY_KEYS.reduce((acc, key) => {
    acc[key] = Boolean(source?.[API_KEY[key]]);
    return acc;
  }, {} as PrivacyConfigState);
}

/** store 里是否已有任一隐私字段的有效布尔值 */
function hasPrivacyConfig(source?: DtoUserConfigDto | null): boolean {
  return PRIVACY_KEYS.some((key) => typeof source?.[API_KEY[key]] === "boolean");
}

export default function PrivacySettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { confirm } = useConfirm();
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
        setConfig(normalizeConfig(response.data?.data));
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
        config: { ...s.user.config, ...toApiPatch(next) },
      });
    }
  }, []);

  const handleToggle = useCallback(
    async (key: PrivacyKey, nextValue: boolean) => {
      const previousValue = config[key];
      const next = { ...config, [key]: nextValue };
      setConfig(next);
      setSavingKey(key);

      try {
        await api.userControllerUpdateUserConfig(toApiPatch(next));
        persistToStore(next);
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

      {/* 工信部要求可撤回同意，撤回后直接退回隐私弹窗 */}
      <SettingsSection footer={t("privacySettingPage.withdrawFooter")}>
        <SettingsRow
          label={t("privacySettingPage.withdraw")}
          destructive
          chevron
          onPress={() =>
            confirm({
              title: t("privacySettingPage.withdrawConfirmTitle"),
              message: t("privacySettingPage.withdrawConfirmMessage"),
              confirmText: t("privacySettingPage.withdraw"),
              onConfirm: () => clearConsent(),
            })
          }
        />
      </SettingsSection>
    </SettingsScreen>
  );
}
