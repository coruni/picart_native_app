import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import ThemedText from "./ThemedText";

/**
 * 角标 / 徽章变体
 *
 * variant：
 * - count 数字角标（未读消息数、评论数），超过 max 显示 "99+"
 * - dot   纯圆点，表示"有更新"但不暴露数量
 * - label 文字标签（话题标签、状态标签），可带描边
 *
 * tone：primary（主色，承载白字）/ neutral（浅表面）/ danger（危险色，承载白字）
 *
 * 用法约束（MUST）：
 * - count 的数值为 0 时由调用方决定是否渲染，组件本身不做隐藏
 * - 角标叠在图标右上角时，用 style 传 position: "absolute" 定位，不要嵌套额外容器
 */
export type BadgeVariant = "count" | "dot" | "label";
export type BadgeTone = "primary" | "neutral" | "danger";
export type BadgeSize = "sm" | "md";

const SIZE_MAP = {
  sm: { height: 18, minWidth: 18, paddingHorizontal: 4, fontSize: 11, dotSize: 8, labelPadding: 8, labelFontSize: 11 },
  md: { height: 22, minWidth: 22, paddingHorizontal: 6, fontSize: 12, dotSize: 10, labelPadding: 10, labelFontSize: 12 },
} as const;

export interface BadgeProps {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  /** variant="count" 时展示的数字 */
  count?: number;
  /** 数字上限，超出显示 `${max}+`，默认 99 */
  max?: number;
  /** variant="label" 时的文字 */
  label?: string;
  /** label 变体是否带描边 */
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Badge = ({
  variant = "count",
  tone = "primary",
  size = "sm",
  count = 0,
  max = 99,
  label,
  outlined = false,
  style,
}: BadgeProps) => {
  const { theme } = useTheme();
  const s = SIZE_MAP[size];

  const palette = (() => {
    switch (tone) {
      case "primary":
        return { background: theme.primary, foreground: "#ffffff", border: "transparent" };
      case "danger":
        return { background: theme.dangerFill, foreground: "#ffffff", border: "transparent" };
      case "neutral":
      default:
        return { background: theme.muted, foreground: theme.mutedForeground, border: theme.border };
    }
  })();

  if (variant === "dot") {
    return (
      <View
        style={[
          {
            width: s.dotSize,
            height: s.dotSize,
            borderRadius: s.dotSize / 2,
            backgroundColor: palette.background,
          },
          style,
        ]}
      />
    );
  }

  if (variant === "label") {
    return (
      <View
        style={[
          styles.base,
          {
            height: s.height,
            paddingHorizontal: s.labelPadding,
            borderRadius: s.height / 2,
            backgroundColor: palette.background,
            borderColor: outlined ? palette.border : "transparent",
            borderWidth: outlined ? 1 : 0,
          },
          style,
        ]}
      >
        <ThemedText
          size={s.labelFontSize}
          fontWeight="600"
          color={palette.foreground}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
      </View>
    );
  }

  const display = count > max ? `${max}+` : String(count);

  return (
    <View
      style={[
        styles.base,
        {
          minWidth: s.minWidth,
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.height / 2,
          backgroundColor: palette.background,
        },
        style,
      ]}
    >
      <ThemedText
        size={s.fontSize}
        fontWeight="600"
        color={palette.foreground}
        numberOfLines={1}
      >
        {display}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});

export default Badge;
