import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, useRouter } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { theme, colors } = useTheme();
  const { isLoggedIn, hasHydrated } = useAuth();
  const router = useRouter();

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
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: "Circle",
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Message",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
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
