import { Switch } from "@/components/ui/Switch";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { PushSettingKey, useSettingsStore } from "@/store/settingsStore";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PUSH_KEYS: PushSettingKey[] = [
  "pushComment",
  "pushLike",
  "pushFollow",
  "pushRecommend",
  "pushFollowing",
];

/** 通用分组容器，样式对齐 notification 页 */
function Section({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionWrap}>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        {children}
      </View>
    </View>
  );
}

export default function PushSettingsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const push = useSettingsStore((s) => s.push);
  const setPushSetting = useSettingsStore((s) => s.setPushSetting);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("pushSettingPage.title") });
  }, [navigation, t]);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <SafeAreaView edges={["bottom", "left", "right"]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Section>
            {PUSH_KEYS.map((key, index) => (
              <View
                key={key}
                style={[
                  styles.row,
                  index !== PUSH_KEYS.length - 1 && {
                    borderBottomColor: theme.border,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <ThemedText size={15} style={styles.rowLabel}>
                  {t(`pushSettingPage.${key}`)}
                </ThemedText>
                <Switch
                  checked={push[key]}
                  onCheckedChange={(checked) => setPushSetting(key, checked)}
                />
              </View>
            ))}
          </Section>

          <ThemedText size={13} color="#999999" style={styles.hint}>
            {t("pushSettingPage.hint")}
          </ThemedText>
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
    marginBottom: 12,
  },
  section: {
    borderRadius: 12,
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
  hint: {
    marginHorizontal: 20,
    lineHeight: 18,
  },
});
