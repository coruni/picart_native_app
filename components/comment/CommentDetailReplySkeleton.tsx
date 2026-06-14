import { useTheme } from "@/hooks/useTheme";
import { memo, useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

function SkeletonBar({
  width,
  height = 12,
  style,
}: {
  width: number | string;
  height?: number;
  style?: any;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius: height / 2,
          backgroundColor: theme.muted,
        },
        style,
      ]}
    />
  );
}

function CommentDetailReplySkeletonItem() {
  const { theme } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.3));

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
    <Animated.View style={[styles.item, { opacity }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.muted }]} />
        <SkeletonBar width={96} height={14} />
      </View>

      <View style={styles.content}>
        <SkeletonBar width={120} height={14} style={styles.inlinePrefix} />
        <SkeletonBar width="100%" height={14} style={styles.line} />
        <SkeletonBar width="72%" height={14} style={styles.line} />
      </View>

      <View style={styles.actions}>
        <SkeletonBar width={56} height={12} />
        <View style={styles.actionGroup}>
          <SkeletonBar width={56} height={12} />
          <SkeletonBar width={44} height={12} />
        </View>
      </View>
    </Animated.View>
  );
}

type CommentDetailReplySkeletonProps = {
  count?: number;
};

function CommentDetailReplySkeleton({
  count = 4,
}: CommentDetailReplySkeletonProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <CommentDetailReplySkeletonItem key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  content: {
    gap: 8,
  },
  inlinePrefix: {
    marginBottom: 2,
  },
  line: {
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});

export default memo(CommentDetailReplySkeleton);
