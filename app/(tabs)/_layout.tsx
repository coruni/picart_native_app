import { TabBarIcon, type TabIconName } from "@/components/ui/TabBarIcon";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, useRouter } from "expo-router";
import { PlatformPressable } from "expo-router/build/react-navigation";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { theme, colors } = useTheme();
  const { isLoggedIn, hasHydrated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // 四个底部图标共用一套配色，保证激活态视觉一致
  const renderTabIcon =
    (name: TabIconName) =>
    function TabIcon({ focused }: { focused: boolean }) {
      return (
        <TabBarIcon
          name={name}
          focused={focused}
          size={25}
          color={theme.mutedForeground}
          activeColor={colors.primary}
          surfaceColor={theme.card}
        />
      );
    };

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
        tabBarShowLabel: false,
        tabBarLabelPosition: "beside-icon",
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            pressColor="transparent" // Android: 涟漪颜色透明
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: renderTabIcon("home"),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: t("circle"),
          tabBarIcon: renderTabIcon("circle"),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t("message"),
          tabBarIcon: renderTabIcon("message"),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: renderTabIcon("profile"),
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
