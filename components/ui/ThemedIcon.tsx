import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ColorValue, ViewStyle } from "react-native";

export type IconType = React.ComponentType<{
  size?: number;
  color?: ColorValue;
  strokeWidth?: number;
}>;

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
  style?: ViewStyle;
}

const ThemedIcon = ({
  icon: IconComponent,
  size = 18,
  variant = "default",
  color,
  strokeWidth,
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
        return theme.primaryText;
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
    <IconComponent
      size={size}
      color={getIconColor()}
      strokeWidth={strokeWidth}
    />
  );
};

export default ThemedIcon;
