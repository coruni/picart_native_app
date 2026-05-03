import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Message',
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Circle',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      
    </Tabs>
  );
}
