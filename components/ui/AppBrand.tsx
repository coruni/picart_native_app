import ThemedText from "@/components/ui/ThemedText";
import { useConfigStore } from "@/store/configStore";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet } from "react-native";

export default function AppBrand({ iconOnly = false }: { iconOnly?: boolean }) {
  const configuredName = useConfigStore((state) => state.config?.app_name);
  const { t } = useTranslation();
  const appName = configuredName?.trim() || t("settingsPage.appFallbackName");

  if (iconOnly) {
    return (
      <Image
        source={require("@/assets/images/icon.png")}
        accessible
        accessibilityLabel={appName}
        style={styles.icon}
      />
    );
  }

  return (
    <ThemedText size={32} fontWeight="800" style={styles.name}>
      {appName}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  name: {
    textAlign: "center",
  },
});
