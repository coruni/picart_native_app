import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";

// 文本语义变体，字号按项目里实际用到的档位取
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
        return { color: theme.primary };
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
