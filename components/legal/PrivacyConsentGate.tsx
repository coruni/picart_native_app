import AppBrand from "@/components/ui/AppBrand";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getLocalAgreement, type LegalType } from "@/locales/legal";
import { Markdown } from "@/components/rich-text/Markdown";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  onAgree: () => void;
}

/** 首启合规闸门：同意之前不初始化任何网络请求、推送与设备信息上报 */
export default function PrivacyConsentGate({ onAgree }: Props) {
  const { theme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [viewing, setViewing] = useState<LegalType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 弹窗本身就是首屏，启动图这时就该撤掉
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  const handleAgree = () => {
    if (submitting) return;
    setSubmitting(true);
    onAgree();
  };

  // 不同意就退出：不给「跳过」的口子，否则审核会认定可以绕过隐私政策
  const handleDisagree = () => {
    Alert.alert(
      t("privacyGate.disagreeTitle"),
      t("privacyGate.disagreeMessage"),
      [
        { text: t("privacyGate.back"), style: "cancel" },
        {
          text: t("privacyGate.exit"),
          style: "destructive",
          onPress: () => {
            if (Platform.OS === "android") {
              BackHandler.exitApp();
              return;
            }
            Alert.alert(t("privacyGate.title"), t("privacyGate.iosHint"));
          },
        },
      ],
    );
  };

  if (viewing) {
    const doc = getLocalAgreement(
      viewing,
      i18n.language.startsWith("zh") ? "zh" : "en",
    );
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.docHeader,
            {
              paddingTop: insets.top + 8,
              borderBottomColor: theme.border,
              backgroundColor: theme.card,
            },
          ]}
        >
          <ThemedText fontWeight="700" size={16}>
            {viewing === "privacy"
              ? t("auth.privacyPolicy")
              : t("auth.termsOfService")}
          </ThemedText>
          <Pressable
            hitSlop={12}
            onPress={() => setViewing(null)}
            style={styles.docClose}
          >
            <ThemedText size={15} color={colors.primary}>
              {t("privacyGate.close")}
            </ThemedText>
          </Pressable>
        </View>
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={[
            styles.docBody,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Markdown source={doc} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <AppBrand />
        <ThemedText fontWeight="700" size={20} style={styles.title}>
          {t("privacyGate.title")}
        </ThemedText>
        <ThemedText size={14} color={theme.secondary} style={styles.intro}>
          {t("privacyGate.intro")}
        </ThemedText>

        <View style={styles.points}>
          {["pointAccount", "pointDevice", "pointPermission"].map((key) => (
            <View key={key} style={styles.pointRow}>
              <View
                style={[styles.dot, { backgroundColor: colors.primary }]}
              />
              <ThemedText size={13} color={theme.secondary} style={styles.flex1}>
                {t(`privacyGate.${key}`)}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.links}>
          <Pressable hitSlop={8} onPress={() => setViewing("terms")}>
            <ThemedText size={14} color={colors.primary}>
              {t("auth.termsOfService")}
            </ThemedText>
          </Pressable>
          <ThemedText size={14} color={theme.secondary}>
            /
          </ThemedText>
          <Pressable hitSlop={8} onPress={() => setViewing("privacy")}>
            <ThemedText size={14} color={colors.primary}>
              {t("auth.privacyPolicy")}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label={t("privacyGate.agree")}
          onPress={handleAgree}
          loading={submitting}
          fullWidth
        />
        <Pressable
          hitSlop={8}
          onPress={handleDisagree}
          style={styles.disagree}
        >
          <ThemedText size={14} color={theme.secondary}>
            {t("privacyGate.disagree")}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  flex1: { flex: 1 },
  body: { paddingBottom: 24 },
  title: { marginTop: 16, marginBottom: 8 },
  intro: { lineHeight: 21 },
  points: { marginTop: 20, gap: 12 },
  pointRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 8 },
  links: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  actions: { gap: 12 },
  disagree: { alignSelf: "center", paddingVertical: 8 },
  docHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  docClose: { paddingVertical: 4, paddingLeft: 12 },
  docBody: { paddingHorizontal: 16, paddingTop: 16 },
});
