import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface FlexSpacerProps {
  minHeight?: number;
  flex?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function FlexSpacer({
  minHeight = 24,
  flex = 1,
  style,
}: FlexSpacerProps) {
  return <View style={[{ flex, minHeight }, style]} />;
}

const styles = StyleSheet.create({});
