import { initializeApiClient } from "@/api";
import { primeEmojiCache } from "@/components/comment/CommentComposerModal/emojiCache";
import ThemedIcon from "@/components/ui/ThemedIcon";
import { ConfirmProvider } from "@/hooks/useConfirm";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { ReportProvider } from "@/hooks/useReport";
import { useTheme } from "@/hooks/useTheme";
import { configurePushNotifications } from "@/lib/push";
import { ToastProvider } from "@/hooks/useToast";
import { prefetchCircleFeed, prefetchHomeFeed } from "@/store/articleStore";
import { useAuthStore } from "@/store/authStore";
import { getCachedCategories, prefetchCategories } from "@/store/categoryStore";
import { useConfigStore } from "@/store/configStore";
import { useSettingsStore } from "@/store/settingsStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, ThemeProvider, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import HugeIcon from "@/components/ui/HugeIcon";
import { useEffect, useState } from "react";

import { InteractionManager, Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../locales/i18n";

void SplashScreen.preventAutoHideAsync();

/** 启动图等待首页 feed 的上限：超时先放行，让首页自己展示骨架屏 */
const SPLASH_WAIT_TIMEOUT_MS = 3000;

// 前台展示策略要早于首条推送注册，放在模块加载期
configurePushNotifications();

export default function RootLayout() {
  const { theme, isDark, DarkTheme, LightTheme } = useTheme();
  const navTheme = isDark ? DarkTheme : LightTheme;
  const router = useRouter();
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const fetchConfig = useConfigStore((s) => s.fetchConfig);
  const [appReady, setAppReady] = useState(false);

  useMessageSocket();
  usePushNotifications(appReady);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        // initializeApiClient 内部会 await ensureAuthHydrated()，复用的是同一个
        // hydrate Promise，所以可以和 hydrate() 并行，不必串行等两轮。
        await Promise.all([hydrate(), hydrateSettings(), initializeApiClient()]);
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

    let cancelled = false;

    void (async () => {
      // 启动图只等首页：配置、分类、圈子 feed 都挪到隐藏启动图之后继续跑，
      // 并给首页 feed 加超时兜底，避免弱网下一直停在启动图上。
      await Promise.race([
        prefetchHomeFeed(),
        new Promise((resolve) => setTimeout(resolve, SPLASH_WAIT_TIMEOUT_MS)),
      ]);

      if (cancelled) return;
      await SplashScreen.hideAsync();

      // 首帧之后再占用 JS 线程与网络：表情缓存是一次文件读 + 一次请求，
      // 打开表情面板时也会自行预热，这里只是预热，可以晚一点。
      InteractionManager.runAfterInteractions(() => {
        void primeEmojiCache().catch(() => undefined);
      });

      void fetchConfig();
      void prefetchCategories().then(() => {
        const cached = getCachedCategories();
        const firstChild = cached?.[0]?.children?.[0];
        if (firstChild) void prefetchCircleFeed(firstChild.id);
      });
    })();

    return () => {
      cancelled = true;
    };
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
                              icon={ArrowLeft01Icon}
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
                        name="search/index"
                        dangerouslySingular
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="publish/index"
                        dangerouslySingular
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="chat/[id]"
                        dangerouslySingular
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
                        name="settings/account"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/account-email"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/account-password"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/account-verify"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/profile"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/blocked"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/widget"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/decoration"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/feedback"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="settings/about"
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
                      <Stack.Screen
                        name="notification/index"
                        dangerouslySingular
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="system-message/index"
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
