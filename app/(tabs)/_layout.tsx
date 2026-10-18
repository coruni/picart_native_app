import { TabBarIcon, type TabIconName } from "@/components/ui/TabBarIcon";
import HugeIcon from "@/components/ui/HugeIcon";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import { Tabs, useRouter, type Href } from "expo-router";
import { PlatformPressable } from "expo-router/build/react-navigation";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const { theme, colors } = useTheme();
  const { isLoggedIn, hasHydrated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // 四个常规 tab 图标共用一套配色，保证激活态视觉一致（中间发布按钮单独配色）
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
        name="publish-tab"
        options={{
          title: t("publish.title"),
          tabBarIcon: () => (
            <View
              style={[
                styles.publishPill,
                { backgroundColor: colors.primary },
              ]}
            >
              <HugeIcon icon={PlusSignIcon} size={20} color="#ffffff" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // 这个 tab 不切换页面，直接打开发布页
            e.preventDefault();
            if (hasHydrated && !isLoggedIn) {
              router.push("/auth");
              return;
            }
            router.push("/publish" as unknown as Href);
          },
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

const styles = StyleSheet.create({
  publishPill: {
    width: 54,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
