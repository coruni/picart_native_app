import { useTheme } from "@/hooks/useTheme";
import { memo, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const BAR_COUNT = 3;

function SkeletonBar({ width, style }: { width: number | string; style?: any }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          height: 12,
          width: width as any,
          borderRadius: 6,
          backgroundColor: theme.muted,
        },
        style,
      ]}
    />
  );
}

function CommentSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Avatar */}
      <View style={styles.avatar} />

      <View style={styles.body}>
        {/* Username */}
        <SkeletonBar width={80} style={styles.username} />
        {/* Content lines */}
        <SkeletonBar width="100%" style={styles.line} />
        <SkeletonBar width="75%" style={styles.line} />
        {/* Actions */}
        <View style={styles.actions}>
          <SkeletonBar width={50} />
          <SkeletonBar width={50} />
        </View>
      </View>
    </Animated.View>
  );
}

function CommentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 16,
    gap: 20,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
  },
  body: {
    flex: 1,
    gap: 6,
  },
  username: {
    marginBottom: 2,
  },
  line: {
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
});

export default memo(CommentListSkeleton);
