import ThemedText from "@/components/ui/ThemedText";
import { Switch } from "@/components/ui/Switch";
import { useTheme } from "@/hooks/useTheme";
import {
  useSettingsStore,
  type AppearanceMode,
  type LanguageMode,
} from "@/store/settingsStore";
import { useNavigation } from "expo-router";
import { Check } from "lucide-react-native";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/** 通用分组容器 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionWrap}>
      <ThemedText size={13} color={theme.secondary} style={styles.sectionTitle}>
        {title}
      </ThemedText>
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

/** 单选行：左侧文案，右侧选中打勾 */
function OptionRow({
  label,
  selected,
  showBorder,
  onPress,
}: {
  label: string;
  selected: boolean;
  showBorder: boolean;
  onPress: () => void;
}) {
  const { theme, colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        showBorder && {
          borderBottomColor: theme.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <ThemedText size={15}>{label}</ThemedText>
      {selected ? <Check size={20} color={colors.primary} /> : null}
    </Pressable>
  );
}

export default function SystemSettingsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const appearance = useSettingsStore((s) => s.appearance);
  const language = useSettingsStore((s) => s.language);
  const autoTranslate = useSettingsStore((s) => s.autoTranslate);
  const setAppearance = useSettingsStore((s) => s.setAppearance);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setAutoTranslate = useSettingsStore((s) => s.setAutoTranslate);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("systemSettingsPage.title"),
    });
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={["bottom", "left", "right"]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 语言设置 */}
          <Section title={t("systemSettingsPage.language")}>
            {languageOptions.map((opt, index) => (
              <OptionRow
                key={opt.key}
                label={opt.label}
                selected={language === opt.key}
                showBorder={index !== languageOptions.length - 1}
                onPress={() => setLanguage(opt.key)}
              />
            ))}
          </Section>

          {/* 外观设置 */}
          <Section title={t("systemSettingsPage.appearance")}>
            {appearanceOptions.map((opt, index) => (
              <OptionRow
                key={opt.key}
                label={opt.label}
                selected={appearance === opt.key}
                showBorder={index !== appearanceOptions.length - 1}
                onPress={() => setAppearance(opt.key)}
              />
            ))}
          </Section>

          {/* 自动翻译 */}
          <Section title={t("systemSettingsPage.translation")}>
            <View style={styles.row}>
              <View style={styles.switchLabel}>
                <ThemedText size={15}>
                  {t("systemSettingsPage.autoTranslate")}
                </ThemedText>
                <ThemedText
                  size={12}
                  color={theme.secondary}
                  style={styles.switchHint}
                >
                  {t("systemSettingsPage.autoTranslateHint")}
                </ThemedText>
              </View>
              <Switch
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
            </View>
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
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
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
  switchLabel: {
    flex: 1,
    marginRight: 12,
  },
  switchHint: {
    marginTop: 2,
  },
});
