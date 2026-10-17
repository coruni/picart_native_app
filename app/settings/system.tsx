import {
  SettingsScreen,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsOptionRow,
  SettingsSwitchRow,
} from "@/components/settings/SettingsRows";
import {
  useSettingsStore,
  type AppearanceMode,
  type LanguageMode,
} from "@/store/settingsStore";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

export default function SystemSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const appearance = useSettingsStore((s) => s.appearance);
  const language = useSettingsStore((s) => s.language);
  const autoTranslate = useSettingsStore((s) => s.autoTranslate);
  const setAppearance = useSettingsStore((s) => s.setAppearance);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setAutoTranslate = useSettingsStore((s) => s.setAutoTranslate);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("systemSettingsPage.title") });
  }, [navigation, t]);

  const languageOptions: { key: LanguageMode; label: string }[] = [
    { key: "auto", label: t("systemSettingsPage.languageAuto") },
    { key: "zh", label: "简体中文" },
    { key: "en", label: "English" },
  ];

  const appearanceOptions: { key: AppearanceMode; label: string }[] = [
    { key: "auto", label: t("systemSettingsPage.appearanceAuto") },
    { key: "light", label: t("systemSettingsPage.appearanceLight") },
    { key: "dark", label: t("systemSettingsPage.appearanceDark") },
  ];

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
      <SettingsSection title={t("systemSettingsPage.language")}>
        {languageOptions.map((opt, index) => (
          <SettingsOptionRow
            key={opt.key}
            label={opt.label}
            selected={language === opt.key}
            showBorder={hasNextRow(languageOptions.length, index)}
            onPress={() => setLanguage(opt.key)}
          />
        ))}
      </SettingsSection>

      <SettingsSection title={t("systemSettingsPage.appearance")}>
        {appearanceOptions.map((opt, index) => (
          <SettingsOptionRow
            key={opt.key}
            label={opt.label}
            selected={appearance === opt.key}
            showBorder={hasNextRow(appearanceOptions.length, index)}
            onPress={() => setAppearance(opt.key)}
          />
        ))}
      </SettingsSection>

      <SettingsSection title={t("systemSettingsPage.translation")}>
        <SettingsSwitchRow
          label={t("systemSettingsPage.autoTranslate")}
          hint={t("systemSettingsPage.autoTranslateHint")}
          checked={autoTranslate}
          onCheckedChange={setAutoTranslate}
        />
      </SettingsSection>
    </SettingsScreen>
  );
}
