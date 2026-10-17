import { Switch } from "@/components/ui/Switch";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import HugeIcon from "@/components/ui/HugeIcon";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SettingsRow } from "./SettingsPrimitives";

/** 开关行：左侧标签（可带说明），右侧 Switch。整行可点。 */
export function SettingsSwitchRow({
  label,
  hint,
  checked,
  loading = false,
  disabled = false,
  showBorder = false,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  loading?: boolean;
  disabled?: boolean;
  showBorder?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const interactive = !disabled && !loading;

  return (
    <SettingsRow
      label={label}
      hint={hint}
      showBorder={showBorder}
      disabled={disabled}
      right={
        <Switch
          checked={checked}
          loading={loading}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
        />
      }
      onPress={interactive ? () => onCheckedChange(!checked) : undefined}
    />
  );
}

/** 单选行：左侧标签，选中时右侧打勾 */
export function SettingsOptionRow({
  label,
  selected,
  showBorder = false,
  onPress,
}: {
  label: string;
  selected: boolean;
  showBorder?: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <SettingsRow
      label={label}
      showBorder={showBorder}
      onPress={onPress}
      accessibilityLabel={label}
      right={selected ? <HugeIcon icon={Tick02Icon} size={20} color={colors.primary} /> : undefined}
    />
  );
}

/** 判断是否为分组内最后一行，最后一行不画下边线 */
export function hasNextRow(length: number, index: number) {
  return index !== length - 1;
}

/** 页面底部的主操作区（退出登录、保存等） */
export function SettingsActionArea({ children }: { children: ReactNode }) {
  return <View style={styles.actionArea}>{children}</View>;
}

/** 设置页唯一的彩色操作：主色 8% 底 + 主色字，52 高 / 圆角 26 */
export function SettingsLogoutButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { theme, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.logout,
        { backgroundColor: colors.primary + "14" },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText size={16} fontWeight="600" color={theme.primary}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionArea: {
    marginTop: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  logout: {
    minHeight: 52,
    marginHorizontal: 16,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
