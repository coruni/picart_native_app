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
    border: "#0c0f1d",
    notification: Colors.primary,
  },
  fonts,
} as const;

export const Theme = {
  light: {
    ...LightTheme.colors,
    foreground: "#111827",
    muted: Colors.muted,
    mutedForeground: Colors.mutedForeground,
    secondary: Colors.secondary,
    member: Colors.member,
    secondaryBackground: "#f9fafb",
  },
  dark: {
    ...DarkTheme.colors,
    foreground: "#ededed",
    muted: "#252938",
    mutedForeground: "#9ca3af",
    secondary: "#ffffffa6",
    member: Colors.member,
    secondaryBackground: "#4a5565",
  },
} as const;

export type ThemeType = "light" | "dark";
