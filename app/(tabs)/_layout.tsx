import { useTheme } from "@/hooks/useTheme";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { theme, colors } = useTheme();

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
      />
    </Tabs>
  );
}
