import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";

type HistoryTabProps = {
  onContentScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export default function HistoryTab({ onContentScroll }: HistoryTabProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({ key: `item-${i}`, index: i })),
    [],
  );

  const renderItem: ListRenderItem<(typeof items)[number]> = useCallback(
    ({ item }) => (
      <View style={styles.item}>
        <ThemedText color={theme.secondary}>{t("historyItem", { number: item.index + 1 })}</ThemedText>
      </View>
    ),
    [theme.secondary, t],
  );

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      onScroll={onContentScroll}
      scrollEventThrottle={16}
      bounces
      alwaysBounceVertical
    />
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  item: {
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    justifyContent: "center",
  },
});
