import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import type { HugeIconData } from "@/components/ui/HugeIcon";
import HugeIcon, { ICON_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { DecorationType } from "@/lib/decoration";

export interface VerticalTabItem<T extends string> {
  key: T;
  label: string;
  icon: HugeIconData;
  /** 该分类下的已装备数量，为 0 时不显示计数 */
  badge?: number;
}

/**
 * 左侧竖向分类栏。
 * 层级：侧栏与右侧内容同走 `card`，不额外加一层底色；两侧只用一条 hairline
 * 竖线分界。选中态只用主色的浅底 + 主色文字 + 左侧 3px 指示条，不给卡片加描边或阴影。
 */
function VerticalTabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: VerticalTabItem<T>[];
  value: T;
  onChange: (key: T) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.rail,
        { backgroundColor: theme.card, borderRightColor: theme.border },
      ]}
    >
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            style={({ pressed }) => [
              styles.item,
              active && { backgroundColor: theme.primary + "1A" },
              pressed && styles.pressed,
            ]}
          >
            {active ? (
              <View style={[styles.indicator, { backgroundColor: theme.primary }]} />
            ) : null}

            <HugeIcon
              icon={item.icon}
              size={20}
              color={active ? theme.primary : theme.mutedForeground}
              strokeWidth={active ? ICON_STROKE_WIDTH : ICON_STROKE_WIDTH - 0.5}
            />

            <ThemedText
              size={12}
              fontWeight={active ? "600" : "400"}
              color={active ? theme.primary : theme.mutedForeground}
              numberOfLines={1}
              style={styles.label}
            >
              {item.label}
            </ThemedText>

            {item.badge ? (
              <ThemedText size={11} color={theme.mutedForeground}>
                {item.badge}
              </ThemedText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: 64,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  item: {
    // 标签统一为两字，单行放得下；最小高度 64，保证点击热区足够大
    minHeight: 64,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
  },
  label: {
    lineHeight: 16,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});

export type { DecorationType };
export default memo(VerticalTabs) as typeof VerticalTabs;