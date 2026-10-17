import { useTheme } from "@/hooks/useTheme";
import {
  PullToRefreshHeader,
  PullToRefreshHeaderProps,
  PullToRefreshOffsetChangedEvent,
} from "@sdcx/pull-to-refresh";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";

/** header 高度即原生触发距离：iOS UIRefreshControl / Android SmartRefreshLayout 都按它判定松手刷新 */
const REFRESH_TRIGGER_DISTANCE = 80;

interface NativePullToRefreshHeaderProps extends PullToRefreshHeaderProps {
  onPullOffsetChanged?: (offset: number) => void;
}

/**
 * 下拉刷新头。
 *
 * 视觉沿用系统原生下拉样式：`ActivityIndicator`（iOS 是 UIActivityIndicatorView，
 * Android 是 ProgressBar），灰色小号，随下拉进度淡入放大，松手后保持完全可见。
 * 不再自绘圆环——自绘的空心圈既不像 iOS 也不像 Android。
 *
 * 进度用 `Animated.Value` 驱动，下拉全程不触发 setState，避免每帧重渲染。
 */
export function NativePullToRefreshHeader({
  onRefresh,
  refreshing,
  onPullOffsetChanged,
}: NativePullToRefreshHeaderProps) {
  const { theme } = useTheme();
  // 惰性初始化：Animated.Value 是不可变对象，用 state 持有可避免
  // react-hooks/refs 规则把 useRef().current 判为「渲染期读取 ref」
  const [progress] = useState(() => new Animated.Value(0));

  const handleOffsetChanged = useCallback(
    (event: PullToRefreshOffsetChangedEvent) => {
      const offset = event.nativeEvent.offset;

      progress.setValue(
        Math.min(Math.max(offset / REFRESH_TRIGGER_DISTANCE, 0), 1),
      );

      // 负号：库给的是「下拉距离」，父组件的 Hero 高度按正值累加
      onPullOffsetChanged?.(-offset);
    },
    [onPullOffsetChanged, progress],
  );

  const { opacity, scale } = useMemo(
    () => ({
      // 前 35% 几乎不可见，接近触发距离时才浮现，贴近原生「松手才刷新」的暗示
      opacity: progress.interpolate({
        inputRange: [0, 0.35, 1],
        outputRange: [0, 0.45, 1],
        extrapolate: "clamp",
      }),
      scale: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
        extrapolate: "clamp",
      }),
    }),
    [progress],
  );

  return (
    <PullToRefreshHeader
      style={styles.container}
      onOffsetChanged={handleOffsetChanged}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: theme.card,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <ActivityIndicator size="small" color={theme.primary} />
      </Animated.View>
    </PullToRefreshHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    height: REFRESH_TRIGGER_DISTANCE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  indicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    // 白色圆底压在封面图上，保证菊花在任何底色上都清晰
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
