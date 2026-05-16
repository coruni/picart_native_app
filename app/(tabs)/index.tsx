import ActivityScreen from "@/components/home/Activity";
import FeedScreen from "@/components/home/Feed";
import FollowScreen from "@/components/home/Follow";

import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

const renderScene = SceneMap({
  follow: FollowScreen,
  index: FeedScreen,
  activity: ActivityScreen,
});

const INACTIVE_COLOR = "#666";

export default function IndexWithTopTabs() {
  const layout = useWindowDimensions();
  const { theme, colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [index, setIndex] = useState(1);

  const [routes] = useState([
    { key: "follow", title: t("follow") },
    { key: "index", title: t("home") },
    { key: "activity", title: t("activity") },
  ]);

  const renderTabBar = (props: any) => {
    const { position, navigationState } = props;
    const inputRange = navigationState.routes.map((_: any, i: number) => i);

    return (
      <TabBar
        {...props}
        style={[styles.tabBar, { backgroundColor: theme.card }]}
        tabStyle={styles.tabStyle}
        renderIndicator={({ getTabWidth }) => {
          const translateX = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i: number) => {
              let offset = 0;
              for (let j = 0; j < i; j++) offset += getTabWidth(j);
              return offset + getTabWidth(i) / 2 - 10;
            }),
          });

          return (
            <Animated.View
              style={[styles.indicator, { transform: [{ translateX }] }]}
            />
          );
        }}
        renderTabBarItem={({ route, onLayout, onPress }) => {
          const routeIndex = navigationState.routes.findIndex(
            (r: any) => r.key === route.key,
          );
          const isFocused = navigationState.index === routeIndex;
          const scale = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i: number) =>
              i === routeIndex ? 1.125 : 1,
            ),
            extrapolate: "clamp",
          });
          return (
            <Pressable
              key={route.key}
              onLayout={onLayout}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Animated.Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? colors.primary : INACTIVE_COLOR,
                    transform: [{ scale }],
                  },
                ]}
              >
                {route.title}
              </Animated.Text>
            </Pressable>
          );
        }}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.card }]}
      edges={["top"]}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    marginHorizontal: 4,
  },
  tabStyle: {
    width: "auto",
    minWidth: 60,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },
});
