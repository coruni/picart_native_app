import ThemedText from "@/components/ui/ThemedText";
import { useConfirm } from "@/hooks/useConfirm";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "@/hooks/useToast";
import { clearAppCache, measureCache } from "@/lib/cache";
import { clearAuth } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import { router, useNavigation } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type SettingsItem = {
  key: string;
  label: string;
  value?: string;
};

function SettingsRow({
  label,
  value,
  borderColor,
  onPress,
}: SettingsItem & {
  borderColor: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { borderBottomColor: borderColor }]}
    >
      <ThemedText size={15} fontWeight="400">
        {label}
      </ThemedText>
      <View style={styles.rowRight}>
        {value ? (
          <ThemedText size={15} color="#999999">
            {value}
          </ThemedText>
        ) : null}
        <ChevronRight size={20} color="#C7C7CC" />
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const config = useConfigStore((state) => state.config);
  const [cacheSize, setCacheSize] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("settingsPage.title"),
    });
  }, [navigation, t]);

  const refreshCacheSize = useCallback(async () => {
    try {
      const snapshot = await measureCache();
      setCacheSize(snapshot.display);
    } catch {
      setCacheSize(t("settingsPage.cacheSizeEmpty"));
    }
  }, [t]);

  useEffect(() => {
    refreshCacheSize();
  }, [refreshCacheSize]);

  const sections = useMemo<SettingsItem[][]>(
    () => [
      [
        { key: "account", label: t("settingsPage.accountManagement") },
        { key: "profile", label: t("settingsPage.infoManagement") },
        { key: "notification", label: t("settingsPage.inAppNotification") },
        { key: "push", label: t("settingsPage.pushSettings") },
        { key: "privacy", label: t("settingsPage.privacySettings") },
        { key: "blocked", label: t("settingsPage.blockedUsers") },
      ],
      [
        { key: "widget", label: t("settingsPage.widgets") },
        { key: "system", label: t("settingsPage.systemSettings") },
      ],
      [{ key: "feedback", label: t("settingsPage.feedback") }],
      [
        { key: "community", label: t("settingsPage.communityGuidelines") },
        {
          key: "about",
          label: t("settingsPage.about", { name: config?.app_name }),
        },
        {
          key: "cache",
          label: t("settingsPage.clearCache"),
          value:
            cacheSize === null
              ? t("settingsPage.cacheSizeUnknown")
              : cacheSize,
        },
        { key: "update", label: t("settingsPage.checkUpdate") },
      ],
    ],
    [t, config?.app_name, cacheSize],
  );

  const handlePlaceholderPress = useCallback(() => {}, []);

  const handleClearCache = useCallback(() => {
    if (clearing) return;
    confirm({
      title: t("settingsPage.clearCacheTitle"),
      message: t("settingsPage.clearCacheMessage"),
      confirmText: t("settingsPage.clearCacheConfirm"),
      onConfirm: async () => {
        setClearing(true);
        try {
          const snapshot = await clearAppCache();
          setCacheSize(snapshot.display);
          toast.show(t("settingsPage.clearCacheSuccess"));
        } catch {
          toast.show(t("settingsPage.clearCacheFailed"));
        } finally {
          setClearing(false);
        }
      },
    });
  }, [clearing, confirm, t]);

  const handleRowPress = useCallback(
    (key: string) => {
      if (key === "cache") {
        handleClearCache();
        return;
      }
      if (key === "system") {
        router.push("/settings/system");
        return;
      }
      handlePlaceholderPress();
    },
    [handleClearCache],
  );

  const handleLogout = useCallback(() => {
    confirm({
      title: t("settingsPage.logoutTitle"),
      message: t("settingsPage.logoutMessage"),
      confirmText: t("settingsPage.logout"),
      onConfirm: async () => {
        await clearAuth();
        router.replace("/auth");
      },
    });
  }, [confirm, t]);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <SafeAreaView edges={["bottom", "left", "right"]}>
        <ScrollView
          bounces={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: Math.max(insets.bottom, 20) + 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section, index) => (
            <View
              key={`section-${index}`}
              style={[
                styles.section,
                {
                  backgroundColor: theme.card,
                  borderTopColor: theme.border,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              {section.map((item, itemIndex) => (
                <SettingsRow
                  key={item.key}
                  {...(({ key, ...rest }) => rest)(item)}
                  borderColor={
                    itemIndex === section.length - 1
                      ? "transparent"
                      : theme.border
                  }
                  onPress={() => handleRowPress(item.key)}
                />
              ))}
            </View>
          ))}

          <Pressable
            onPress={handleLogout}
            style={[
              styles.logoutButton,
              {
                backgroundColor: colors.primary + "14",
              },
            ]}
          >
            <ThemedText size={16} fontWeight="600" color={colors.primary}>
              {t("settingsPage.logout")}
            </ThemedText>
          </Pressable>
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
    paddingTop: 0,
  },
  section: {
    marginBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoutButton: {
    marginTop: 24,
    marginHorizontal: 16,
    minHeight: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});
