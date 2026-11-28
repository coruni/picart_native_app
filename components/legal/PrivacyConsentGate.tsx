import { Markdown } from "@/components/rich-text/Markdown";
import AppBrand from "@/components/ui/AppBrand";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getLocalAgreement, type LegalType } from "@/locales/legal";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

interface Props {
  onAgree: () => void;
}

/** 弹窗外壳：底色 + 遮罩 + 居中卡片，两层分支共用 */
function DialogShell({
  children,
  maxHeight,
}: {
  children: ReactNode;
  maxHeight: number;
}) {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.brand}>
        <AppBrand />
      </View>
      <View style={styles.mask} />
      <View
        style={[styles.card, { backgroundColor: theme.card, maxHeight }]}
      >
        {children}
      </View>
    </View>
  );
}

/** 首启合规闸门：同意之前不初始化任何网络请求、推送与设备信息上报 */
export default function PrivacyConsentGate({ onAgree }: Props) {
  const { theme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { height } = useWindowDimensions();
  const [viewing, setViewing] = useState<LegalType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 弹窗本身就是首屏，启动图这时就该撤掉
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  const cardMaxHeight = height * 0.82;

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

  // 全文也在这个弹窗里看，不再跳独立页面
  if (viewing) {
    const doc = getLocalAgreement(
      viewing,
      i18n.language.startsWith("zh") ? "zh" : "en",
    );
    return (
      <DialogShell maxHeight={cardMaxHeight}>
        <View style={[styles.docHeader, { borderBottomColor: theme.border }]}>
          <ThemedText fontWeight="700" size={16}>
            {viewing === "privacy"
              ? t("auth.privacyPolicy")
              : t("auth.termsOfService")}
          </ThemedText>
          <Pressable hitSlop={12} onPress={() => setViewing(null)}>
            <ThemedText size={15} color={colors.primary}>
              {t("privacyGate.close")}
            </ThemedText>
          </Pressable>
        </View>
        <ScrollView
          style={styles.shrink}
          contentContainerStyle={styles.docBody}
          showsVerticalScrollIndicator={false}
        >
          <Markdown source={doc} />
        </ScrollView>
      </DialogShell>
    );
  }

  return (
    <DialogShell maxHeight={cardMaxHeight}>
      <ScrollView
        style={styles.shrink}
        contentContainerStyle={styles.cardBody}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText fontWeight="700" size={17}>
          {t("privacyGate.title")}
        </ThemedText>
        <ThemedText size={13} color={theme.secondary} style={styles.intro}>
          {t("privacyGate.intro")}
        </ThemedText>

        <View style={styles.points}>
          {["pointAccount", "pointDevice", "pointPermission"].map((key) => (
            <View key={key} style={styles.pointRow}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              <ThemedText size={12} color={theme.secondary} style={styles.flex1}>
                {t(`privacyGate.${key}`)}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.links}>
          <Pressable hitSlop={8} onPress={() => setViewing("terms")}>
            <ThemedText size={13} color={colors.primary}>
              {t("auth.termsOfService")}
            </ThemedText>
          </Pressable>
          <ThemedText size={13} color={theme.secondary}>
            /
          </ThemedText>
          <Pressable hitSlop={8} onPress={() => setViewing("privacy")}>
            <ThemedText size={13} color={colors.primary}>
              {t("auth.privacyPolicy")}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.actions, { borderTopColor: theme.border }]}>
        <Button
          label={t("privacyGate.agree")}
          onPress={handleAgree}
          loading={submitting}
          fullWidth
        />
        <Pressable hitSlop={8} onPress={handleDisagree} style={styles.disagree}>
          <ThemedText size={13} color={theme.secondary}>
            {t("privacyGate.disagree")}
          </ThemedText>
        </Pressable>
      </View>
    </DialogShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  mask: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  brand: {
    position: "absolute",
    top: 96,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
  },
  shrink: { flexShrink: 1 },
  flex1: { flex: 1 },
  cardBody: { padding: 20, paddingBottom: 16 },
  intro: { marginTop: 8, lineHeight: 19 },
  points: { marginTop: 14, gap: 8 },
  pointRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 7 },
  links: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  actions: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  disagree: { alignSelf: "center", paddingVertical: 6 },
  docHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  docBody: { padding: 16 },
});
