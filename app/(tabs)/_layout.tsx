import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, useRouter } from "expo-router";
import { PlatformPressable } from "expo-router/build/react-navigation";
import { TabTriggerSlotProps } from "expo-router/ui";
import { Bell, Circle, House, UserRound } from "lucide-react-native";
import { Ref } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

type TabButtonProps = TabTriggerSlotProps & {
  icon?: React.ReactNode;
  ref: Ref<View>;
};
export default function TabLayout() {
  const { theme, colors } = useTheme();
  const { isLoggedIn, hasHydrated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const TabButton = ({
    icon,
    children,
    isFocused,
    ...props
  }: TabButtonProps) => {
    return (
      <Pressable
        {...props}
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 6,
            borderRadius: 12,
            marginHorizontal: 4,
          },
          isFocused && { backgroundColor: `${colors.primary}1A` },
        ]}
      >
        {icon}
        {children}
      </Pressable>
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
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: t("circle"),
          tabBarIcon: ({ color, size }) => <Circle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t("message"),
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, size }) => (
            <UserRound color={color} size={size} />
          ),
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
