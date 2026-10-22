import { useColorScheme } from "react-native";
import {
  Colors,
  DarkTheme,
  LightTheme,
  Theme,
  type ThemeType,
} from "../constants/theme";
import { useSettingsStore } from "../store/settingsStore";

type ThemeResult = {
  theme: (typeof Theme)[keyof typeof Theme];
  colors: typeof Colors;
  DarkTheme: typeof DarkTheme;
  LightTheme: typeof LightTheme;
  isDark: boolean;
  colorScheme: ThemeType;
};

/**
 * 结果按 scheme 缓存成模块级常量。
 * 每次渲染都返回新的对象字面量会让 useTheme() 的返回值引用每次都变，
 * 任何把它整体透传给子组件的写法都会让子组件的 memo 失效。
 */
const themeResultCache = new Map<ThemeType, ThemeResult>();

function getThemeResult(colorScheme: ThemeType): ThemeResult {
  const cached = themeResultCache.get(colorScheme);
  if (cached) return cached;

  const result: ThemeResult = {
    theme: colorScheme === "dark" ? Theme.dark : Theme.light,
    colors: Colors,
    DarkTheme,
    LightTheme,
    isDark: colorScheme === "dark",
    colorScheme,
  };
  themeResultCache.set(colorScheme, result);
  return result;
}

export function useTheme() {
  const systemScheme = useColorScheme();
  const appearance = useSettingsStore((s) => s.appearance);

  // 外观偏好优先：auto 跟随系统，否则用用户选择
  const resolvedScheme: ThemeType =
    appearance === "auto"
      ? ((systemScheme as ThemeType) ?? "light")
      : appearance;

  return getThemeResult(resolvedScheme);
}
