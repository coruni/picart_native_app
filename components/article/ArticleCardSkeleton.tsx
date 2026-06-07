import { useTheme } from "@/hooks/useTheme";
import { memo, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

function SkeletonBlock({ style }: { style?: any }) {
  const { theme } = useTheme();
  return <View style={[{ backgroundColor: theme.muted, borderRadius: 6 }, style]} />;
}

function ArticleCardSkeleton() {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBlock style={styles.avatar} />
        <View style={styles.headerInfo}>
          <SkeletonBlock style={styles.name} />
          <SkeletonBlock style={styles.meta} />
        </View>
        <SkeletonBlock style={styles.menu} />
      </View>

      {/* Title */}
      <View style={styles.content}>
        <SkeletonBlock style={styles.title} />
        <SkeletonBlock style={styles.titleShort} />
        {/* Cover image placeholder */}
        <SkeletonBlock style={styles.cover} />
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderColor: theme.border }]}>
        <SkeletonBlock style={styles.stat} />
        <View style={styles.footerRight}>
          <SkeletonBlock style={styles.stat} />
          <SkeletonBlock style={styles.stat} />
        </View>
      </View>
    </Animated.View>
  );
}

function ArticleCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 12,
  },
  container: {
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 10,
    gap: 6,
  },
  name: {
    height: 12,
    width: 100,
    borderRadius: 6,
  },
  meta: {
    height: 10,
    width: 140,
    borderRadius: 5,
  },
  menu: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  content: {
    paddingHorizontal: 14,
    gap: 6,
    marginTop: 8,
  },
  title: {
    height: 14,
    width: "90%",
    borderRadius: 6,
  },
  titleShort: {
    height: 14,
    width: "60%",
    borderRadius: 6,
    marginBottom: 6,
  },
  cover: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerRight: {
    flexDirection: "row",
    gap: 24,
  },
  stat: {
    height: 12,
    width: 44,
    borderRadius: 6,
  },
});

export default memo(ArticleCardSkeletonList);
