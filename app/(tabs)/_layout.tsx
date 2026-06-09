import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { theme, colors } = useTheme();
  const { isLoggedIn, hasHydrated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: t("circle"),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t("message"),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
        }}
        listeners={{
          tabPress: (e) => {
            if (hasHydrated && !isLoggedIn) {
              e.preventDefault();
              router.push("/auth");
            }
          },
        }}
      />
    </Tabs>
  );
}
