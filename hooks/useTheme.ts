import { useColorScheme } from 'react-native';
import { Colors, DarkTheme, LightTheme, Theme, type ThemeType } from '../constants/theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Theme.dark : Theme.light;

  return {
    theme,
    colors: Colors,
    DarkTheme,
    LightTheme,
    isDark,
    colorScheme: (colorScheme as ThemeType) ?? 'light',
  };
}
