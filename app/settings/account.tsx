import { api } from "@/api";
import {
  SettingsRow,
  SettingsSection,
  SettingsScreen,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsSwitchRow,
} from "@/components/settings/SettingsRows";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function readWatermarkFromStore(): boolean | null {
  const value = useAuthStore.getState().user?.config?.watermarkEnabled;
  return typeof value === "boolean" ? value : null;
}

export default function AccountSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // null = 还不知道，界面按 loading 处理
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean | null>(
    readWatermarkFromStore,
  );
  const [savingWatermark, setSavingWatermark] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("accountSettingPage.title") });
  }, [navigation, t]);

  useEffect(() => {
    // 登录/资料接口已经带了该字段就不再多打一次请求
    if (readWatermarkFromStore() !== null) return;

    let active = true;

    void (async () => {
      try {
        const response = await api.userControllerGetUserConfig();
        if (!active) return;
        setWatermarkEnabled(Boolean(response.data?.data?.watermarkEnabled));
      } catch {
        // 读取失败时落到「关闭」态，用户仍可手动开启
        if (active) setWatermarkEnabled(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleWatermark = useCallback(
    async (nextValue: boolean) => {
      const previousValue = watermarkEnabled ?? false;
      setWatermarkEnabled(nextValue);
      setSavingWatermark(true);

      try {
        await api.userControllerUpdateUserConfig({
          watermarkEnabled: nextValue,
        });

        // 回写 store，离开页面再进来时先显示新值
        const state = useAuthStore.getState();
        if (state.token && state.refreshToken && state.user) {
          const patch = { watermarkEnabled: nextValue };
          void state.setAuth(state.token, state.refreshToken, {
            ...state.user,
            config: { ...state.user.config, ...patch },
          });
        }
      } catch {
        setWatermarkEnabled(previousValue);
        toast.show(t("accountSettingPage.watermarkSaveFailed"));
      } finally {
        setSavingWatermark(false);
      }
    },
    [watermarkEnabled, t],
  );

  const accountRows: { key: string; label: string; onPress: () => void }[] = [
    {
      key: "email",
      label: t("accountSettingPage.email"),
      onPress: () => router.push("/settings/account-email"),
    },
    {
      key: "password",
      label: t("accountSettingPage.passwordRow"),
      onPress: () => router.push("/settings/account-password"),
    },
  ];

  const verifyRows: { key: string; label: string; onPress: () => void }[] = [
    {
      key: "certification",
      label: t("accountSettingPage.verifyEntry"),
      onPress: () => router.push("/settings/account-verify"),
    },
  ];

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      <SettingsSection
        title={t("accountSettingPage.manageSection")}
        footer={t("accountSettingPage.manageFooter")}
      >
        {accountRows.map((row, index) => (
          <SettingsRow
            key={row.key}
            label={row.label}
            chevron
            showBorder={hasNextRow(accountRows.length, index)}
            onPress={row.onPress}
          />
        ))}
      </SettingsSection>

      <SettingsSection
        title={t("accountSettingPage.verifySection")}
        footer={t("accountSettingPage.verifyFooter")}
      >
        {verifyRows.map((row, index) => (
          <SettingsRow
            key={row.key}
            label={row.label}
            chevron
            showBorder={hasNextRow(verifyRows.length, index)}
            onPress={row.onPress}
          />
        ))}
      </SettingsSection>

      <SettingsSection
        title={t("accountSettingPage.watermarkSection")}
        footer={t("accountSettingPage.watermarkFooter")}
      >
        <SettingsSwitchRow
          label={t("accountSettingPage.watermarkLabel")}
          hint={t("accountSettingPage.watermarkHint")}
          checked={watermarkEnabled ?? false}
          loading={watermarkEnabled === null || savingWatermark}
          onCheckedChange={(checked) => {
            void handleToggleWatermark(checked);
          }}
        />
      </SettingsSection>
    </SettingsScreen>
  );
}
