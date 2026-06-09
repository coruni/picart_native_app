import { useTheme } from "@/hooks/useTheme";
import { memo, useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

function SkeletonBlock({ style }: { style?: any }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: theme.muted, borderRadius: 6 },
        style,
      ]}
    />
  );
}

function CommentCardSkeleton() {
  const { theme } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.35));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.card,
        { borderBottomColor: theme.border, opacity },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.dateWrap}>
          <SkeletonBlock style={styles.dateDay} />
          <SkeletonBlock style={styles.dateMonth} />
        </View>
        <SkeletonBlock style={styles.menu} />
      </View>

      <View style={styles.content}>
        <SkeletonBlock style={styles.line} />
        <SkeletonBlock style={styles.shortLine} />
      </View>

      <View
        style={[
          styles.articleBlock,
          { backgroundColor: theme.secondaryBackground },
        ]}
      >
        <SkeletonBlock style={styles.cover} />
        <View style={styles.articleText}>
          <SkeletonBlock style={styles.articleLine} />
          <SkeletonBlock style={styles.articleShortLine} />
        </View>
      </View>

      <View style={styles.footer}>
        <SkeletonBlock style={styles.category} />
        <SkeletonBlock style={styles.like} />
      </View>
    </Animated.View>
  );
}

function CommentCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <CommentCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 4,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  dateDay: {
    width: 34,
    height: 26,
  },
  dateMonth: {
    width: 28,
    height: 12,
  },
  menu: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  content: {
    gap: 8,
    marginBottom: 10,
  },
  line: {
    width: "92%",
    height: 14,
  },
  shortLine: {
    width: "64%",
    height: 14,
  },
  articleBlock: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    height: 64,
  },
  cover: {
    width: 72,
    height: 64,
    borderRadius: 0,
  },
  articleText: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 8,
  },
  articleLine: {
    width: "86%",
    height: 12,
  },
  articleShortLine: {
    width: "52%",
    height: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  category: {
    width: 72,
    height: 12,
  },
  like: {
    width: 44,
    height: 12,
  },
});

export default memo(CommentCardSkeletonList);
