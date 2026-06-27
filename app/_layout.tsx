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

    void primeEmojiCache().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [hydrate, hydrateSettings]);

  useEffect(() => {
    if (!appReady) return;

    void (async () => {
      await Promise.all([
        fetchConfig(),
        prefetchHomeFeed(),
        prefetchCategories().then(() => {
          const cached = getCachedCategories();
          const firstChild = cached?.[0]?.children?.[0];
          if (firstChild) prefetchCircleFeed(firstChild.id);
        }),
      ]);
      await SplashScreen.hideAsync();
    })();
  }, [appReady, fetchConfig]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <ToastProvider>
              <ThemeProvider value={navTheme}>
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
                        name="topic/[id]"
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
                        name="settings/notification"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/push"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/privacy"
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
                      <Stack.Screen
                        name="follows/[id]"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                    </Stack>
                    <StatusBar style={isDark ? "light" : "dark"} animated />
                  </ReportProvider>
                </ConfirmProvider>
              </ThemeProvider>
            </ToastProvider>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
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
