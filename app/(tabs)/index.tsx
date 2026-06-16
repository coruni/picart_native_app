import ActivityScreen from "@/components/home/Activity";
import FeedScreen from "@/components/home/Feed";
import FollowScreen from "@/components/home/Follow";
import {
  HomeScrollContext,
  type HomeScrollContextType,
} from "@/components/home/HomeScrollContext";
import SearchBar from "@/components/home/SearchBar";

import { useTheme } from "@/hooks/useTheme";
import { useCallback, useMemo, useRef, useState } from "react";
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

  const scrollToTopFnsRef = useRef<Map<string, () => void>>(new Map());

  const scrollContextValue = useMemo<HomeScrollContextType>(
    () => ({
      register: (key, fn) => {
        scrollToTopFnsRef.current.set(key, fn);
      },
      unregister: (key) => {
        scrollToTopFnsRef.current.delete(key);
      },
    }),
    [],
  );

  const handleTabPress = useCallback(
    (routeKey: string, defaultPress: () => void) => {
      const targetIndex = routes.findIndex((r) => r.key === routeKey);
      // 点击已选中的 tab：回到顶部；否则正常切换
      if (targetIndex === index) {
        scrollToTopFnsRef.current.get(routeKey)?.();
      } else {
        defaultPress();
      }
    },
    [index, routes],
  );

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
              onPress={() => handleTabPress(route.key, onPress)}
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.card }]}>
      <HomeScrollContext.Provider value={scrollContextValue}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={(props) => (
            <>
              {renderTabBar(props)}
              <SearchBar />
            </>
          )}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          swipeEnabled
        />
      </HomeScrollContext.Provider>
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
