import { useTheme } from "@/hooks/useTheme";
import { ConfirmProvider } from "@/hooks/useConfirm";
import { ReportProvider } from "@/hooks/useReport";
import { prefetchCircleFeed, prefetchHomeFeed } from "@/store/articleStore";
import { useAuthStore } from "@/store/authStore";
import {
  getCachedCategories,
  prefetchCategories,
  subscribeCategories,
} from "@/store/categoryStore";
import { useConfigStore } from "@/store/configStore";
import {
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet";
import { useEffect } from "react";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../locales/i18n";

export default function RootLayout() {
  const { theme, isDark, DarkTheme, LightTheme } = useTheme();
  const navTheme = isDark ? DarkTheme : LightTheme;
  const hydrate = useAuthStore((s) => s.hydrate);
  const fetchConfig = useConfigStore((s) => s.fetchConfig);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    prefetchHomeFeed();
    const tryPrefetchCircle = (
      cats: ReturnType<typeof getCachedCategories>,
    ) => {
      const firstChild = cats?.[0]?.children?.[0];
      if (firstChild) prefetchCircleFeed(firstChild.id);
    };
    const cached = getCachedCategories();
    if (cached && cached.length > 0) {
      tryPrefetchCircle(cached);
    } else {
      let done = false;
      const unsub = subscribeCategories((cats) => {
        if (!done) {
          done = true;
          tryPrefetchCircle(cats);
          unsub();
        }
      });
      prefetchCategories();
      return unsub;
    }
    prefetchCategories();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={navTheme}>
          <SafeAreaProvider>
            <ConfirmProvider>
              <ReportProvider>
                <Stack
                  screenOptions={{
                    contentStyle: { backgroundColor: theme.background },
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="auth/index"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <StatusBar style={isDark ? "light" : "dark"} animated />
              </ReportProvider>
            </ConfirmProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
