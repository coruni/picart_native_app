import { Markdown } from "@/components/ui/Markdown";
import RenderHtml from "@/components/ui/RenderHtml";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { looksLikeMarkdown } from "@/lib/markdown";
import { useConfigStore } from "@/store/configStore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useLayoutEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const config = useConfigStore((s) => s.config);

  const agreementType: AgreementType = type === "privacy" ? "privacy" : "terms";
  const html = useMemo(
    () => getAgreementHtml(agreementType, config),
    [agreementType, config],
  );
  const isMarkdown = useMemo(() => looksLikeMarkdown(html), [html]);
  const title =
    agreementType === "privacy"
      ? t("auth.privacyPolicy")
      : t("auth.termsOfService");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title,
      headerTitleAlign: "center",
      headerStyle: { backgroundColor: theme.card },
      headerShadowVisible: false,
      headerTintColor: theme.foreground,
      headerTitleStyle: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.foreground,
      },
      headerBackTitleVisible: false,
      headerLeft: () => (
        <Pressable
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
        >
          <ChevronLeft size={26} color={theme.foreground} />
        </Pressable>
      ),
    });
  }, [navigation, theme, title]);

  if (!config) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="small" color={theme.secondary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {!html.trim() ? (
        <View style={styles.center}>
          <ThemedText size={14} color={theme.secondary}>
            {t("agreement.empty")}
          </ThemedText>
        </View>
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },
});
