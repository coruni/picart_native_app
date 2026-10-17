import {
  SettingsRow,
  SettingsSection,
  SettingsScreen,
} from "@/components/settings/SettingsPrimitives";
import { hasNextRow } from "@/components/settings/SettingsRows";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AccountSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("accountSettingPage.title") });
  }, [navigation, t]);

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
    </SettingsScreen>
  );
}
