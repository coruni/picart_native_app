import { useColorScheme } from 'react-native';
import { Colors, DarkTheme, LightTheme, Theme, type ThemeType } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';

export function useTheme() {
  const systemScheme = useColorScheme();
  const appearance = useSettingsStore((s) => s.appearance);

  // 外观偏好优先：auto 跟随系统，否则用用户选择
  const resolvedScheme: ThemeType =
    appearance === 'auto'
      ? ((systemScheme as ThemeType) ?? 'light')
      : appearance;
  const isDark = resolvedScheme === 'dark';
  const theme = isDark ? Theme.dark : Theme.light;

  return {
    theme,
    colors: Colors,
    DarkTheme,
    LightTheme,
    isDark,
    colorScheme: resolvedScheme,
  };
}
