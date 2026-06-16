import { initializeApiClient } from "@/api";
import { primeEmojiCache } from "@/components/comment/CommentComposerModal/emojiCache";
import ThemedIcon from "@/components/ui/ThemedIcon";
import { ConfirmProvider } from "@/hooks/useConfirm";
import { ReportProvider } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import { ToastProvider } from "@/hooks/useToast";
import { prefetchCircleFeed, prefetchHomeFeed } from "@/store/articleStore";
import { useAuthStore } from "@/store/authStore";
import {
  getCachedCategories,
  prefetchCategories,
  subscribeCategories,
} from "@/store/categoryStore";
import { useConfigStore } from "@/store/configStore";
import { useSettingsStore } from "@/store/settingsStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, ThemeProvider, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";

import { Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../locales/i18n";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme, isDark, DarkTheme, LightTheme } = useTheme();
  const navTheme = isDark ? DarkTheme : LightTheme;
  const router = useRouter();
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const fetchConfig = useConfigStore((s) => s.fetchConfig);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        await Promise.all([hydrate(), hydrateSettings()]);
        await initializeApiClient();
      } finally {
        if (!cancelled) {
          setAppReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrate, hydrateSettings]);

  useEffect(() => {
    if (!appReady) return;
    fetchConfig();
  }, [appReady, fetchConfig]);

  useEffect(() => {
    void primeEmojiCache().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!appReady) return;
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
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;
    void SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ToastProvider>
          <BottomSheetModalProvider>
            <ThemeProvider value={navTheme}>
              <SafeAreaProvider>
                <ConfirmProvider>
                  <ReportProvider>
                    <Stack
                      screenOptions={{
                        contentStyle: { backgroundColor: theme.background },
                        headerTitleAlign: "center",
                        headerStyle: { backgroundColor: theme.card },
                        headerShadowVisible: false,
                        headerTintColor: theme.foreground,
                        headerTitleStyle: {
                          fontSize: 16,
                          fontWeight: "700",
                          color: theme.foreground,
                        },
                        headerLeft: () => (
                          <Pressable
                            hitSlop={10}
                            onPress={() => router.back()}
                            style={layoutStyles.headerBackButton}
                          >
                            <ThemedIcon
                              variant="default"
                              icon={ChevronLeft}
                              size={28}
                            />
                          </Pressable>
                        ),
                      }}
                    >
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                        dangerouslySingular
                      />
                      <Stack.Screen
                        name="auth/index"
                        dangerouslySingular
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="user/[id]"
                        dangerouslySingular
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="article/[id]"
                        dangerouslySingular
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="settings"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/system"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="agreement"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="edit-profile/index"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="comment/[id]"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                    </Stack>
                    <StatusBar style={isDark ? "light" : "dark"} animated />
                  </ReportProvider>
                </ConfirmProvider>
              </SafeAreaProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </ToastProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const layoutStyles = StyleSheet.create({
  headerBackButton: {
    marginLeft: -6,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
