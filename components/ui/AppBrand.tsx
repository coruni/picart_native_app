import ThemedText from "@/components/ui/ThemedText";
import { useConfigStore } from "@/store/configStore";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function AppBrand() {
  const configuredName = useConfigStore((state) => state.config?.app_name);
  const { t } = useTranslation();
  const appName = configuredName?.trim() || t("settingsPage.appFallbackName");

  return (
    <ThemedText
      testID="app-brand"
      size={32}
      fontWeight="800"
      style={styles.name}
    >
      {appName}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  name: {
    textAlign: "center",
  },
});
