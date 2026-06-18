import { useTheme } from "@/hooks/useTheme";
import { Eye, EyeOff, X } from "lucide-react-native";
import { type ComponentType, forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";
import ThemedText from "./ThemedText";

interface FloatInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "onBlur" | "style"
> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  style?: ViewStyle;
  /**
   * Underlying input component. Pass `BottomSheetTextInput` from
   * @gorhom/bottom-sheet when used inside a bottom sheet so the sheet can
   * track focus for keyboard avoidance. Defaults to RN's `TextInput`.
   */
  InputComponent?: ComponentType<any>;
}

/** Minimal handle exposed by FloatInput's ref — enough to focus/blur. */
export type FloatInputHandle = Pick<TextInput, "focus" | "blur">;

// 容器高度与 wrapper 顶部留白（给浮起的 label 腾空间）
const CONTAINER_H = 54;
const LABEL_OFFSET = 9; // wrapper paddingTop，等于 label 浮起后中心到 wrapper 顶的距离

export const FloatInput = forwardRef<FloatInputHandle, FloatInputProps>(
  function FloatInput(
    {
      label,
      value,
      onChangeText,
      onBlur,
      error,
      secureTextEntry,
      style,
      InputComponent = TextInput,
      ...props
    },
    ref,
  ) {
    const { theme, colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [hidden, setHidden] = useState(secureTextEntry ?? false);

  const floatAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const hasValue = Boolean(value);
  const isFloating = isFocused || hasValue;

  useEffect(() => {
    if (!isFocused) {
      Animated.timing(floatAnim, {
        toValue: hasValue ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [hasValue, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!hasValue) {
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.();
  };

  // 默认：label 在容器垂直居中位置
  // 浮起：label 中心对齐容器顶部边框（= LABEL_OFFSET - lineHeight/2 ≈ 2）
  const labelTop = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [LABEL_OFFSET + (CONTAINER_H - 16) / 2, 2],
  });
  const labelSize = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 11],
  });

    const labelColor = error
      ? "#ef4444"
      : isFocused
        ? colors.primary
        : theme.secondary;
    const borderColor = error
      ? "#ef4444"
      : isFocused
        ? colors.primary
        : theme.border;
    const showClear = !secureTextEntry && hasValue;
    const showEye = Boolean(secureTextEntry);

    const Input = InputComponent as ComponentType<any>;

    return (
      <View style={[styles.wrapper, style]}>
        {/* 边框容器 */}
        <View style={[styles.container, { borderColor }]}>
          <Input
            ref={ref}
          style={[styles.input, { color: theme.foreground }]}
          cursorColor={colors.primary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={hidden}
          placeholderTextColor="transparent"
          selectionColor={colors.primary}
          {...props}
        />

        {(showClear || showEye) && (
          <View style={styles.rightSlot}>
            {showEye ? (
              <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8}>
                {hidden ? (
                  <EyeOff size={18} color={theme.secondary} />
                ) : (
                  <Eye size={18} color={theme.secondary} />
                )}
              </Pressable>
            ) : (
              <Pressable onPress={() => onChangeText("")} hitSlop={8}>
                <X size={18} color={theme.secondary} />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* 浮动 label — wrapper 的兄弟节点，可超出容器顶部 */}
      <Animated.Text
        numberOfLines={1}
        pointerEvents="none"
        style={[
          styles.label,
          {
            top: labelTop,
            fontSize: labelSize,
            color: labelColor,
            // 浮起时用容器背景色遮住边框，形成"label 坐在边框上"的效果
            backgroundColor: isFloating ? theme.card : "transparent",
          },
        ]}
      >
        {label}
      </Animated.Text>

      {Boolean(error) && (
        <ThemedText size={12} color="#ef4444" style={styles.errorText}>
          {error}
        </ThemedText>
      )}
    </View>
  );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: LABEL_OFFSET,
    position: "relative",
  },
  container: {
    height: CONTAINER_H,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    position: "absolute",
    // left: 14(input padding) - 3(label horizontal padding) = 11
    left: 11,
    lineHeight: 16,
    fontWeight: "400",
    paddingHorizontal: 3,
  },
  input: {
    flex: 1,
    height: CONTAINER_H,
    fontSize: 15,
    textAlignVertical: "center",
  },
  rightSlot: {
    paddingLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});
