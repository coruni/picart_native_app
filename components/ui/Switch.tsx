import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 16;
const PADDING = 4;
const OFFSET = TRACK_WIDTH - THUMB_SIZE - PADDING * 2;

/**
 * 开关组件（React Native 版）。
 * 带滑块动画与 loading 态，参考 picart_next 的 Switch 设计。
 *
 * @example
 * <Switch checked={value} onCheckedChange={setValue} />
 */
export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  loading = false,
}: SwitchProps) {
  const { theme, colors } = useTheme();
  const progress = useDerivedValue(() =>
    withTiming(checked ? 1 : 0, { duration: 200 }),
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#c1ccd9", colors.primary],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * OFFSET }],
  }));

  const interactionDisabled = disabled || loading;

  return (
    <Pressable
      hitSlop={8}
      disabled={interactionDisabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={interactionDisabled && styles.disabled}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View
          style={[styles.thumb, { backgroundColor: theme.card }, thumbStyle]}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={checked ? colors.primary : "#9ca3af"}
              style={styles.loader}
            />
          ) : (
            <View style={styles.eyes}>
              <View
                style={[
                  styles.eye,
                  { backgroundColor: checked ? colors.primary : "#9ca3af" },
                ]}
              />
              <View
                style={[
                  styles.eye,
                  { backgroundColor: checked ? colors.primary : "#9ca3af" },
                ]}
              />
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: PADDING,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  eyes: {
    flexDirection: "row",
    gap: 3,
  },
  eye: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  loader: {
    transform: [{ scale: 0.6 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Switch;
