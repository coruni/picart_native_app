import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import ThemedText from "./ThemedText";
import HugeIcon from "./HugeIcon";
import type { IconType } from "./ThemedIcon";

// 按钮变体矩阵 variant（视觉权重，从高到低）：- primary   实心主色，承载白字。
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "rounded" | "pill";

// 非实心变体的着色倾向。实心变体（primary / danger）忽略此属性。
export type ButtonTone = "primary" | "neutral" | "danger";

const SIZE_MAP = {
  sm: { height: 32, paddingHorizontal: 14, fontSize: 13, iconSize: 16, radius: 10, gap: 4 },
  md: { height: 44, paddingHorizontal: 20, fontSize: 14, iconSize: 18, radius: 12, gap: 6 },
  lg: { height: 52, paddingHorizontal: 24, fontSize: 15, iconSize: 20, radius: 12, gap: 6 },
} as const;

export interface ButtonProps
  extends Omit<PressableProps, "style" | "children" | "disabled"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  tone?: ButtonTone;
  /** 文字内容。也可用 children 传自定义节点 */
  label?: string;
  children?: React.ReactNode;
  icon?: IconType;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Button = ({
  variant = "primary",
  size = "md",
  shape = "rounded",
  tone,
  label,
  children,
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  disabled = false,
  style,
  labelStyle,
  onPress,
  ...rest
}: ButtonProps) => {
  const { theme } = useTheme();
  const s = SIZE_MAP[size];
  const isFilled = variant === "primary" || variant === "danger";
  const isInactive = disabled || loading;
  const resolvedTone = tone ?? (variant === "ghost" ? "primary" : "neutral");

  // 实心按钮的禁用态换成浅表面 + 次要文字色（保持可读，不用透明度）非实心按钮的禁用态用透明度衰减，保留原色语义
  const palette = (() => {
    if (disabled && isFilled) {
      return {
        background: theme.muted,
        border: "transparent",
        borderWidth: 0,
        foreground: theme.secondary,
      };
    }

    if (variant === "primary") {
      return {
        background: theme.primary,
        border: "transparent",
        borderWidth: 0,
        foreground: "#ffffff",
      };
    }

    if (variant === "danger") {
      return {
        background: theme.dangerFill,
        border: "transparent",
        borderWidth: 0,
        foreground: "#ffffff",
      };
    }

    const toneForeground =
      resolvedTone === "primary"
        ? theme.primary
        : resolvedTone === "danger"
          ? theme.danger
          : theme.foreground;

    if (variant === "secondary") {
      return {
        background: theme.muted,
        border: "transparent",
        borderWidth: 0,
        foreground: toneForeground,
      };
    }

    if (variant === "outline") {
      return {
        background: "transparent",
        border:
          resolvedTone === "neutral"
            ? theme.border
            : toneForeground,
        borderWidth: 1,
        foreground: toneForeground,
      };
    }

    return {
      background: "transparent",
      border: "transparent",
      borderWidth: 0,
      foreground: toneForeground,
    };
  })();

  const IconComponent = icon;  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          gap: s.gap,
          borderRadius: shape === "pill" ? 999 : s.radius,
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderWidth: palette.borderWidth,
        },
        fullWidth && styles.fullWidth,
        disabled && !isFilled && styles.faded,
        loading && styles.loading,
        pressed && !isInactive && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.foreground} />
      ) : (
        <>
          {IconComponent && iconPosition === "left" ? (
            <HugeIcon icon={IconComponent} size={s.iconSize} color={palette.foreground} />
          ) : null}
          {children ??
            (label ? (
              <ThemedText
                size={s.fontSize}
                fontWeight="600"
                color={palette.foreground}
                numberOfLines={1}
                style={labelStyle}
              >
                {label}
              </ThemedText>
            ) : null)}
          {IconComponent && iconPosition === "right" ? (
            <HugeIcon icon={IconComponent} size={s.iconSize} color={palette.foreground} />
          ) : null}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fullWidth: {
    alignSelf: "stretch",
    flexShrink: 1,
  },
  faded: {
    opacity: 0.45,
  },
  loading: {
    opacity: 0.9,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default Button;
