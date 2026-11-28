import { Markdown } from "@/components/rich-text/Markdown";
import RenderHtml from "@/components/rich-text/RenderHtml";
import { useTheme } from "@/hooks/useTheme";
import { getLocalAgreement } from "@/locales/legal";
import { looksLikeMarkdown } from "@/lib/markdown";
import { useConfigStore } from "@/store/configStore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AgreementType = "terms" | "privacy";

function getAgreementHtml(
  type: AgreementType,
  config: { site_terms_of_service?: string; site_privacy_policy?: string } | null,
): string {
  if (!config) return "";
  if (type === "privacy") return config.site_privacy_policy ?? "";
  return config.site_terms_of_service ?? "";
}

export default function AgreementScreen() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const config = useConfigStore((s) => s.config);

  const agreementType: AgreementType = type === "privacy" ? "privacy" : "terms";

  // 服务端没配（或还没拉到配置）就用本地正文兜底：审核期间一页白屏就是硬伤。
  const html = useMemo(() => {
    const remote = getAgreementHtml(agreementType, config).trim();
    if (remote) return remote;
    return getLocalAgreement(
      agreementType,
      i18n.language.startsWith("zh") ? "zh" : "en",
      {
        appName: config?.site_name || undefined,
        email: config?.site_mail || undefined,
      },
    );
  }, [agreementType, config, i18n.language]);

  const isMarkdown = useMemo(() => looksLikeMarkdown(html), [html]);
  const title =
    agreementType === "privacy"
      ? t("auth.privacyPolicy")
      : t("auth.termsOfService");

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation, title]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isMarkdown ? (
          <Markdown source={html} />
        ) : (
          <RenderHtml source={{ html }} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
