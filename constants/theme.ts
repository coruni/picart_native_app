type FontStyle = {
  fontFamily: string;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
};

type NavTheme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
};

export const Colors = {
  primary: "#6680ff" as const,
  border: "#f2f4f9" as const,
  secondary: "#00000073" as const,
  muted: "#f1f4f9" as const,
  mutedForeground: "#6b7280" as const,
  card: "#ffffff" as const,
  member: "#6c5ce7" as const,
} as const;

export type ColorType = keyof typeof Colors;

export const fonts = {
  regular: {
    fontFamily: "System",
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: "System",
    fontWeight: "500" as const,
  },
  bold: {
    fontFamily: "System",
    fontWeight: "700" as const,
  },
  heavy: {
    fontFamily: "System",
    fontWeight: "900" as const,
  },
} as const;

export const LightTheme: NavTheme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: "#f8f9fd",
    card: Colors.card,
    text: "#111827",
    border: Colors.border,
    notification: Colors.primary,
  },
  fonts,
} as const;

export const DarkTheme: NavTheme = {
  dark: true,
  colors: {
    primary: Colors.primary,
    background: "#0c0f1d",
    card: "#1b1d2a",
    text: "#ededed",
    border: "#262a3b",
    notification: Colors.primary,
  },
  fonts,
} as const;

/**
 * 主色的两种语义角色。
 * - primaryFill：实心填充，承载白色文字/图标（白字对比度 4.96:1）
 * - primaryText：彩色文字与链接，需随底色切换明度（亮色 4.96:1 / 暗色 6.99:1）
 * 品牌色 primary (#6680ff) 仅用于指示器、图标、光标、选中底等非文字场景。
 *
 * 危险色同理：
 * - dangerFill：实心填充，承载白色文字（白字对比度 4.83:1）
 * - danger：错误提示文字，需随底色切换明度（亮色 4.83:1 / 暗色 6.04:1）
 */
export const Theme = {
  light: {
    ...LightTheme.colors,
    foreground: "#111827",
    muted: Colors.muted,
    mutedForeground: Colors.mutedForeground,
    secondary: Colors.secondary,
    member: Colors.member,
    secondaryBackground: "#f9fafb",
    primaryFill: "#4C63E6",
    primaryText: "#4C63E6",
    dangerFill: "#DC2626",
    danger: "#DC2626",
  },
  dark: {
    ...DarkTheme.colors,
    foreground: "#ededed",
    muted: "#252938",
    mutedForeground: "#9ca3af",
    secondary: "#ffffffa6",
    member: Colors.member,
    secondaryBackground: "#151827",
    primaryFill: "#4C63E6",
    primaryText: "#8FA2FF",
    dangerFill: "#DC2626",
    danger: "#F87171",
  },
} as const;

export type ThemeType = "light" | "dark";
