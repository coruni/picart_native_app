import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useMemo } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

export default function HistoryTab() {
  const { theme } = useTheme();

  const items = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({ key: `item-${i}`, index: i })),
    [],
  );

  const renderItem: ListRenderItem<(typeof items)[number]> = useCallback(
    ({ item }) => (
      <View style={styles.item}>
        <ThemedText color={theme.secondary}>历史 #{item.index + 1}</ThemedText>
      </View>
    ),
    [theme.secondary],
  );

  return (
    <FlatList
      style={[styles.flex1, { backgroundColor: theme.card }]}
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      bounces={false}
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
