import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";

/**
 * 文本语义变体。
 *
 * 字号取自项目实际使用频次：15（bodyMedium，最高频）、14（bodySmall）、
 * 16（body）、13（caption 的常用替代）、12（caption / label）。
 *
 * 颜色变体区分三类角色，不可混用：
 * - 文字色：default / muted / secondary / primary / danger
 * - 表面色：muted 只用于背景填充，**不可**作为文字色（对比度不足）
 * - 反白色：onPrimary / inverse 只用于深色填充之上
 */
export type TextVariant =
  | "default"
  | "muted"
  | "secondary"
  | "inverse"
  | "primary"
  | "onPrimary"
  | "danger"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyMedium"
  | "bodySmall"
  | "caption"
  | "label";

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  size?: number;
  lineHeight?: number;
}

const ThemedText = ({
  children,
  variant = "default",
  style,
  color,
  fontWeight,
  size,
  lineHeight,
  ...rest
}: ThemedTextProps) => {
  const { theme } = useTheme();

  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case "muted":
        return { color: theme.mutedForeground };
      case "secondary":
        return { color: theme.secondary };
      case "inverse":
        return { color: theme.background };
      case "primary":
        return { color: theme.primaryText };
      case "onPrimary":
        return { color: "#ffffff" };
      case "danger":
        return { color: theme.danger };
      case "h1":
        return {
          color: theme.text,
          fontSize: 24,
          fontWeight: "700",
        };
      case "h2":
        return {
          color: theme.text,
          fontSize: 20,
          fontWeight: "600",
        };
      case "h3":
        return {
          color: theme.text,
          fontSize: 18,
          fontWeight: "600",
        };
      case "body":
        return {
          color: theme.text,
          fontSize: 16,
        };
      case "bodyMedium":
        return {
          color: theme.text,
          fontSize: 15,
        };
      case "bodySmall":
        return {
          color: theme.text,
          fontSize: 14,
        };
      case "caption":
        return {
          color: theme.secondary,
          fontSize: 12,
        };
      case "label":
        return {
          color: theme.text,
          fontSize: 12,
          fontWeight: "500",
        };
      case "default":
      default:
        return { color: theme.text };
    }
  };

  return (
    <Text
      style={[
        getVariantStyles(),
        color && { color },
        fontWeight && { fontWeight },
        size !== undefined && { fontSize: size },
        lineHeight !== undefined && { lineHeight },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
