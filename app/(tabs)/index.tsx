import React, { useState } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FeedScreen from '../components/home/feed';
import FollowScreen from '../components/home/follow';

const renderScene = SceneMap({
  follow: FollowScreen,
  index: FeedScreen,
});

export default function IndexWithTopTabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: 'follow', title: '关注' },
    { key: 'index', title: '首页' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      labelStyle={styles.label}
      activeColor="#000"
      inactiveColor="#666"
      tabStyle={styles.tabStyle}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  indicator: {
    backgroundColor: '#000',
    height: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabStyle: {
    width: 'auto',
  },
});
