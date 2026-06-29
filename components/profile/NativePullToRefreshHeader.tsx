import { useTheme } from "@/hooks/useTheme";
import {
    PullToRefreshHeader,
    PullToRefreshHeaderProps,
    PullToRefreshOffsetChangedEvent,
    PullToRefreshStateChangedEvent,
    PullToRefreshStateIdle,
    PullToRefreshStateRefreshing,
} from "@sdcx/pull-to-refresh";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const REFRESH_TRIGGER_DISTANCE = 80;

interface NativePullToRefreshHeaderProps extends PullToRefreshHeaderProps {
  onPullOffsetChanged?: (offset: number) => void;
}

export function NativePullToRefreshHeader(
  props: NativePullToRefreshHeaderProps,
) {
  const { onRefresh, refreshing, onPullOffsetChanged } = props;

  const [state, setState] = useState<
    "idle" | "pulling" | "ready" | "refreshing"
  >("idle");
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();

  const onStateChanged = useCallback(
    (event: PullToRefreshStateChangedEvent) => {
      const nativeState = event.nativeEvent.state;
      if (nativeState === PullToRefreshStateIdle) {
        setState("idle");
      } else if (nativeState === PullToRefreshStateRefreshing) {
        setState("refreshing");
      } else {
        setState("ready");
      }
    },
    [],
  );

  const onOffsetChanged = useCallback(
    (event: PullToRefreshOffsetChangedEvent) => {
      const offset = event.nativeEvent.offset;
      const normalizedProgress = Math.min(offset / REFRESH_TRIGGER_DISTANCE, 1);
      setProgress(normalizedProgress);

      // 通知父组件 pull offset 变化
      if (onPullOffsetChanged) {
        onPullOffsetChanged(-offset);
      }

      if (offset > 0 && offset < REFRESH_TRIGGER_DISTANCE) {
        setState("pulling");
      } else if (offset >= REFRESH_TRIGGER_DISTANCE) {
        setState("ready");
      }
    },
    [onPullOffsetChanged],
  );

  const isRefreshing = state === "refreshing" || refreshing;

  return (
    <PullToRefreshHeader
      style={styles.container}
      onOffsetChanged={onOffsetChanged}
      onStateChanged={onStateChanged}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <View style={styles.content}>
        {isRefreshing ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <View
            style={[
              styles.indicator,
              {
                transform: [{ scale: 0.6 + progress * 0.4 }],
                opacity: progress,
                borderColor: theme.primary,
              },
            ]}
          />
        )}
      </View>
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
  content: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
});
