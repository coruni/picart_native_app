import {
  SettingsRow,
  SettingsScreen,
  SettingsSection,
} from "@/components/settings/SettingsPrimitives";
import { SettingsSwitchRow } from "@/components/settings/SettingsRows";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

/**
 * 小组件设置：本地偏好，暂未接入原生 Widget Extension。
 * 开关只做本地状态，重启后回到默认值——接入原生后替换为持久化即可。
 */
export default function WidgetSettingsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [showBrowsingHistory, setShowBrowsingHistory] = useState(true);

  return (
    <SettingsScreen contentStyle={styles.content}>
      <SettingsSection title={t("widgetSettingPage.title")}>
        <SettingsSwitchRow
          label={t("widgetSettingPage.enable")}
          hint={t("widgetSettingPage.enableHint")}
          checked={enabled}
          showBorder
          onCheckedChange={setEnabled}
        />
        <SettingsSwitchRow
          label={t("widgetSettingPage.showHistory")}
          hint={t("widgetSettingPage.showHistoryHint")}
          checked={showBrowsingHistory}
          disabled={!enabled}
          onCheckedChange={setShowBrowsingHistory}
        />
      </SettingsSection>

      <SettingsSection title={t("widgetSettingPage.statusSection")}>
        <SettingsRow label={t("widgetSettingPage.statusLabel")} value={t("widgetSettingPage.statusValue")} />
      </SettingsSection>

      <View style={styles.hint}>
        <ThemedText size={12} color={theme.mutedForeground} lineHeight={18}>
          {t("widgetSettingPage.footer")}
        </ThemedText>
      </View>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
  },
  hint: {
    paddingHorizontal: 16,
  },
});
