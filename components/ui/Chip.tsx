import { useTheme } from "@/hooks/useTheme";
import { X } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import ThemedText from "./ThemedText";
import type { IconType } from "./ThemedIcon";

/**
 * 胶囊标签（Chip）变体
 *
 * variant：
 * - soft    浅表面底，无描边。默认形态（搜索历史、热门词、筛选条件）
 * - solid   主色实心底，承载白字。强选中态或强调标签
 * - outline 透明底 + 描边。与 soft 并列的次级形态
 *
 * selected 会覆盖 variant 的配色：
 * - soft + selected    → 主色 10% 底 + 主色文字
 * - outline + selected → 主色文字 + 主色描边
 * - solid 忽略 selected（本身已是强调态）
 *
 * 尺寸恒为胶囊（radius = height / 2），不提供 rounded 形态。
 */
export type ChipVariant = "soft" | "solid" | "outline";
export type ChipSize = "sm" | "md";

const SIZE_MAP = {
  sm: { height: 26, paddingHorizontal: 10, fontSize: 12, iconSize: 12, gap: 4 },
  md: { height: 32, paddingHorizontal: 14, fontSize: 13, iconSize: 14, gap: 6 },
} as const;

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  disabled?: boolean;
  icon?: IconType;
  onPress?: () => void;
  /** 传入后尾部渲染关闭按钮（搜索历史等可删除标签） */
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

const Chip = ({
  label,
  variant = "soft",
  size = "md",
  selected = false,
  disabled = false,
  icon,
  onPress,
  onClose,
  style,
}: ChipProps) => {
  const { theme } = useTheme();
  const s = SIZE_MAP[size];

  const palette = (() => {
    if (variant === "solid") {
      return {
        background: theme.primary,
        foreground: "#ffffff",
        border: "transparent",
        borderWidth: 0,
      };
    }

    if (selected) {
      return {
        background: variant === "soft" ? theme.primary + "1A" : "transparent",
        foreground: theme.primary,
        border: variant === "outline" ? theme.primary : "transparent",
        borderWidth: variant === "outline" ? 1 : 0,
      };
    }

    if (variant === "outline") {
      return {
        background: "transparent",
        foreground: theme.foreground,
        border: theme.border,
        borderWidth: 1,
      };
    }

    return {
      background: theme.muted,
      foreground: theme.foreground,
      border: "transparent",
      borderWidth: 0,
    };
  })();

  const IconComponent = icon;
  const content = (
    <>
      {IconComponent ? (
        <IconComponent size={s.iconSize} color={palette.foreground} />
      ) : null}
      <ThemedText
        size={s.fontSize}
        fontWeight={selected || variant === "solid" ? "600" : "400"}
        color={palette.foreground}
        numberOfLines={1}
      >
        {label}
      </ThemedText>
      {onClose ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onClose}
          disabled={disabled}
        >
          <X size={s.iconSize} color={palette.foreground} />
        </Pressable>
      ) : null}
    </>
  );

  const containerStyle = [
    styles.base,
    {
      height: s.height,
      paddingHorizontal: s.paddingHorizontal,
      gap: s.gap,
      borderRadius: s.height / 2,
      backgroundColor: palette.background,
      borderColor: palette.border,
      borderWidth: palette.borderWidth,
    },
    disabled && styles.disabled,
    style,
  ];

  if (!onPress) {
    return <View style={containerStyle}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [...containerStyle, pressed && !disabled && styles.pressed]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default Chip;
