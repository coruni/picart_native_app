import { useTheme } from "@/hooks/useTheme";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import HugeIcon from "@/components/ui/HugeIcon";
import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemedText from "@/components/ui/ThemedText";

const GUTTER = 16;

/**
 * 设置页统一容器：card 画布 + 底部安全区留白。
 * 设置页全部用 card 底（不是 background），靠分组间隙与 hairline 分层。
 */
export function SettingsScreen({
  children,
  contentStyle,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScrollView
        contentContainerStyle={[
          styles.screenContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/**
 * 带标题的分组。标题 13/mutedForeground，左缩进对齐行内文字的 16 gutter；
 * 分组之间 24 间距，组内行用 hairline 分隔。
 */
export function SettingsSection({
  title,
  footer,
  children,
  style,
}: {
  title?: string;
  footer?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.section, style]}>
      {title ? (
        <ThemedText
          size={13}
          color={theme.mutedForeground}
          style={styles.sectionTitle}
        >
          {title}
        </ThemedText>
      ) : null}
      <View style={styles.sectionCard}>{children}</View>
      {footer ? (
        <ThemedText
          size={12}
          color={theme.mutedForeground}
          style={styles.sectionFooter}
        >
          {footer}
        </ThemedText>
      ) : null}
    </View>
  );
}

/**
 * 分组内的一行。
 *
 * - `onPress` 存在时整行可点（`hitSlop` 由行高保证 ≥48）
 * - `chevron` 显示右侧箭头，颜色走 `theme.iconMuted`
 * - `value` 右侧值文字，15/mutedForeground
 * - `right` 自定义右侧节点（开关、徽标等），与 `value` / `chevron` 并排追加在末尾；
 *   若需要完全接管右侧，传 `right` 并不要同时传 `value` / `chevron`
 */
export function SettingsRow({
  label,
  hint,
  value,
  right,
  chevron = false,
  destructive = false,
  showBorder = false,
  disabled = false,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  hint?: string;
  value?: string;
  right?: ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  showBorder?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const { theme } = useTheme();

  const content = (
    <>
      <View style={styles.rowLabelWrap}>
        <ThemedText
          size={15}
          color={destructive ? theme.danger : theme.foreground}
        >
          {label}
        </ThemedText>
        {hint ? (
          <ThemedText
            size={12}
            color={theme.mutedForeground}
            style={styles.rowHint}
          >
            {hint}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <ThemedText size={15} color={theme.mutedForeground}>
            {value}
          </ThemedText>
        ) : null}
        {right}
        {chevron ? <HugeIcon icon={ArrowRight01Icon} size={20} color={theme.iconMuted} /> : null}
      </View>
    </>
  );

  const rowStyle = [
    styles.row,
    showBorder && {
      borderBottomColor: theme.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  ];

  if (!onPress) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        rowStyle,
        pressed && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginLeft: GUTTER,
    marginBottom: 8,
  },
  sectionCard: {
    overflow: "hidden",
  },
  sectionFooter: {
    marginHorizontal: GUTTER,
    marginTop: 8,
    lineHeight: 18,
  },
  row: {
    minHeight: 48,
    paddingHorizontal: GUTTER,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowLabelWrap: {
    flex: 1,
  },
  rowHint: {
    marginTop: 2,
    lineHeight: 16,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
