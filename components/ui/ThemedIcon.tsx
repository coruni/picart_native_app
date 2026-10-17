import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ColorValue, ViewStyle } from "react-native";
import HugeIcon, { type HugeIconData } from "./HugeIcon";

export type IconType = HugeIconData;

export type IconVariant =
  | "default"
  | "muted"
  | "secondary"
  | "inverse"
  | "primary"
  | "onPrimary"
  | "danger";

interface ThemedIconProps {
  icon: IconType;
  size?: number;
  variant?: IconVariant;
  color?: string;
  strokeWidth?: number;
  fill?: ColorValue;
  style?: ViewStyle;
}

const ThemedIcon = ({
  icon,
  size = 18,
  variant = "default",
  color,
  strokeWidth,
  fill,
}: ThemedIconProps) => {
  const { theme } = useTheme();

  const getIconColor = (): string => {
    if (color) return color;

    switch (variant) {
      case "muted":
        return theme.mutedForeground;
      case "secondary":
        return theme.secondary;
      case "inverse":
        return theme.background;
      case "primary":
        return theme.primary;
      case "onPrimary":
        return "#ffffff";
      case "danger":
        return theme.danger;
      case "default":
      default:
        return theme.text;
    }
  };

  return (
    <HugeIcon
      icon={icon}
      size={size}
      color={getIconColor()}
      strokeWidth={strokeWidth}
      fill={fill}
    />
  );
};

export default ThemedIcon;
