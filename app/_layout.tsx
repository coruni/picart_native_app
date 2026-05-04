import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "./hooks/useTheme";

export default function RootLayout() {
  const { theme, isDark ,DarkTheme,LightTheme} = useTheme();
  const navTheme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeProvider value={navTheme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ contentStyle: { backgroundColor: theme.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
