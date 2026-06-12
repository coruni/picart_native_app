import { useTheme } from "@/hooks/useTheme";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import ThemedText from "./ThemedText";

type LoadingProps = {
  loading: boolean;
};
function LoadingWidget({ loading = false }: LoadingProps) {
  const { theme } = useTheme();
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={theme.primary} size={"large"} />
      </View>
    );
  }
}

type ListFooterLoadingProps = {
  loading: boolean;
  hasMore?: boolean;
  allLoadedText?: string;
};
function ListFooterLoading({
  loading,
  hasMore = true,
  allLoadedText,
}: ListFooterLoadingProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  if (loading) {
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ActivityIndicator color={theme.primary} size="small" />
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ThemedText size={13} color={theme.secondary}>
          {allLoadedText ?? t("allLoadedPosts")}
        </ThemedText>
      </View>
    );
  }

  return null;
}

export const ListFooterLoadingComponent = memo(ListFooterLoading);
export default memo(LoadingWidget);
