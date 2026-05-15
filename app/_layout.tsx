import { useTheme } from "@/hooks/useTheme";
import { prefetchCircleFeed, prefetchHomeFeed } from "@/lib/articleStore";
import {
  getCachedCategories,
  prefetchCategories,
  subscribeCategories,
} from "@/lib/categoryStore";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../locales/i18n";

export default function RootLayout() {
  const { theme, isDark, DarkTheme, LightTheme } = useTheme();
  const navTheme = isDark ? DarkTheme : LightTheme;

  // app 启动时立即开始预加载分类数据，让 circle 页面秒显示
  useEffect(() => {
    // 1. 预加载首页 feed
    prefetchHomeFeed();

    // 2. 预加载分类，分类就绪后预加载圈子第一个 tab 的文章
    const tryPrefetchCircle = (cats: ReturnType<typeof getCachedCategories>) => {
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
    <ThemeProvider value={navTheme}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
