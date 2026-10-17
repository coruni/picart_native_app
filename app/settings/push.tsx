import {
  SettingsScreen,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import {
  hasNextRow,
  SettingsSwitchRow,
} from "@/components/settings/SettingsRows";
import { PushSettingKey, useSettingsStore } from "@/store/settingsStore";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

const PUSH_KEYS: PushSettingKey[] = [
  "pushComment",
  "pushLike",
  "pushFollow",
  "pushRecommend",
  "pushFollowing",
];

export default function PushSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const push = useSettingsStore((s) => s.push);
  const setPushSetting = useSettingsStore((s) => s.setPushSetting);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("pushSettingPage.title") });
  }, [navigation, t]);

  return (
    <SettingsScreen contentStyle={{ paddingTop: 16 }}>
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
