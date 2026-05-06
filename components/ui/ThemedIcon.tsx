import { useTheme } from "@/hooks/useTheme";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { ColorValue } from "react-native";

type IconType = React.ComponentType<{
  size?: number;
  color?: ColorValue;
  strokeWidth?: number;
}>;

export type IconVariant = "default" | "muted" | "secondary" | "inverse";

interface ThemedIconProps {
  icon: IconType;
  size?: number;
  variant?: IconVariant;
  color?: string;
  strokeWidth?: number;
  style?: React.ComponentProps<IconType>["style"];
}

const ThemedIcon = ({
  icon: IconComponent,
  size = 18,
  variant = "default",
  color,
  strokeWidth,
  style,
}: ThemedIconProps) => {
  const { theme } = useTheme();

  const getIconColor = (): string => {
    if (color) return color;

    switch (variant) {
      case "muted":
      case "secondary":
        return theme.secondary;
      case "inverse":
        return theme.background;
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
      style={style}
    />
  );
};

export default ThemedIcon;
