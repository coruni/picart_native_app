import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const GUTTER = 16;

/** 设置子页的居中状态位：加载中 / 空列表 / 加载失败 */
export function SettingsState({
  loading = false,
  message,
  action,
}: {
  loading?: boolean;
  message?: string;
  action?: ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.state}>
      {loading ? (
        <ActivityIndicator size="small" color={theme.secondary} />
      ) : (
        <>
          {message ? (
            <ThemedText size={14} color={theme.mutedForeground}>
              {message}
            </ThemedText>
          ) : null}
          {action}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  state: {
    paddingHorizontal: GUTTER,
    paddingVertical: 48,
    alignItems: "center",
    gap: 16,
  },
});
