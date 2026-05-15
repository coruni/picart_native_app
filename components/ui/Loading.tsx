import { useTheme } from "@/hooks/useTheme";
import { memo } from "react";
import { ActivityIndicator, View } from "react-native";

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
};
function ListFooterLoading({ loading }: ListFooterLoadingProps) {
  const { theme } = useTheme();
  if (!loading) return null;
  return (
    <View style={{ paddingVertical: 16, alignItems: "center" }}>
      <ActivityIndicator color={theme.primary} size="small" />
    </View>
  );
}

export const ListFooterLoadingComponent = memo(ListFooterLoading);
export default memo(LoadingWidget);
