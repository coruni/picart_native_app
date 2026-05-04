import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import ActivityScreen from '../components/home/activity';
import FeedScreen from '../components/home/feed';
import FollowScreen from '../components/home/follow';

const renderScene = SceneMap({
  follow: FollowScreen,
  index: FeedScreen,
  activity: ActivityScreen,
});

const ACTIVE_COLOR = '#6680ff';
const INACTIVE_COLOR = '#666';

export default function IndexWithTopTabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(1);

  const [routes] = useState([
    { key: 'follow', title: '关注' },
    { key: 'index', title: '首页' },
    { key: 'activity', title: '活动' },
  ]);

  const renderTabBar = (props: any) => {
    const { position, navigationState } = props;
    const inputRange = navigationState.routes.map((_: any, i: number) => i);

    return (
      <TabBar
        {...props}
        style={styles.tabBar}
        tabStyle={styles.tabStyle}
        renderIndicator={({ getTabWidth }) => {
          const translateX = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i: number) => {
              let offset = 0;
              for (let j = 0; j < i; j++) offset += getTabWidth(j);
              return offset + getTabWidth(i) / 2 - 12;
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
            (r: any) => r.key === route.key
          );
          const isFocused = navigationState.index === routeIndex;
          const scale = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i: number) =>
              i === routeIndex ? 1.125 : 1
            ),
            extrapolate: 'clamp',
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
                  { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR, transform: [{ scale }] },
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
    <SafeAreaView style={styles.container}>
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
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    marginHorizontal: 4
  },
  tabStyle: {
    width: 'auto',
    minWidth: 60,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6680ff',
  },
});