import { useTheme } from "@/hooks/useTheme";
import { setStatusBarStyle } from "expo-status-bar";
import { X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  visible: boolean;
  onClose?: (visible: boolean) => void;
  height?: number;
  animationDuration?: number;
  children?: React.ReactNode;
  modalStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  showCloseButton?: boolean;
  borderRadius?: number;
  closeButtonPostion?: "top-right" | "top-left";
  title?: string | React.ReactNode;
};

export default function Popup({
  visible,
  onClose,
  height: fixedHeight,
  animationDuration = 300,
  children,
  modalStyle,
  overlayStyle,
  showCloseButton = true,
  borderRadius = 16,
  closeButtonPostion = "top-right",
  title,
}: Props) {
  const { theme, isDark } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(fixedHeight ?? 0);
  const [measuring, setMeasuring] = useState(!fixedHeight);

  // 记录打开前的状态栏样式
  const prevStatusBarStyle = useRef<"light" | "dark">("dark");

  const translateY = useRef(new Animated.Value(fixedHeight ?? 9999)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // 用 ref 追踪当前动画，避免竞态
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const openFrameRef = useRef<number | null>(null);

  const runAnimation = useCallback(
    (toY: number, toOpacity: number, onDone?: () => void) => {
      // 取消上一个未完成的动画
      animationRef.current?.stop();
      animationRef.current = Animated.parallel([
        Animated.timing(translateY, {
          toValue: toY,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: toOpacity,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]);
      animationRef.current.start(({ finished }) => {
        if (finished) onDone?.();
      });
    },
    [animationDuration, opacity, translateY],
  );

  const slideIn = useCallback(
    (h: number) => {
      translateY.setValue(h);
      opacity.setValue(0);
      runAnimation(0, 1);
    },
    [opacity, runAnimation, translateY],
  );

  useEffect(() => {
    if (visible) {
      // 打开：记录当前状态栏样式，切换为 light
      // 通过读取主题来判断当前状态栏应该是什么色
      // 保存当前值后切换
      prevStatusBarStyle.current = isDark ? "light" : "dark";
      setStatusBarStyle("light", false);

      setMeasuring(!fixedHeight);
      setSheetHeight(fixedHeight ?? 0);
      translateY.setValue(fixedHeight ?? 9999);
      opacity.setValue(0);
      setIsMounted(true);

      if (fixedHeight) {
        openFrameRef.current = requestAnimationFrame(() => {
          slideIn(fixedHeight);
          openFrameRef.current = null;
        });
      }
    } else if (isMounted) {
      if (openFrameRef.current !== null) {
        cancelAnimationFrame(openFrameRef.current);
        openFrameRef.current = null;
      }
      // 关闭动画结束后恢复状态栏
      runAnimation(sheetHeight || 9999, 0, () => {
        setStatusBarStyle(prevStatusBarStyle.current, true);
        setIsMounted(false);
        setMeasuring(!fixedHeight);
      });
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps
  // ↑ 故意只依赖 visible，其他值通过 ref/稳定引用访问，避免重复触发

  useEffect(
    () => () => {
      if (openFrameRef.current !== null) {
        cancelAnimationFrame(openFrameRef.current);
      }
      animationRef.current?.stop();
    },
    [],
  );

  const onSheetLayout = useCallback(
    (measuredHeight: number) => {
      if (fixedHeight || !measuring) return;
      setSheetHeight(measuredHeight);
      setMeasuring(false);
      slideIn(measuredHeight);
    },
    [fixedHeight, measuring, slideIn],
  );

  const close = useCallback(() => onClose?.(false), [onClose]);

  if (!isMounted) return null;

  return (
    <Modal
      transparent
      visible
      statusBarTranslucent
      animationType="none"
      hardwareAccelerated
      onRequestClose={close}
    >
      <Animated.View
        style={[styles.overlayBase, overlayStyle, { opacity }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={close}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.card,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            // measuring 阶段完全隐藏，不用 opacity 以免影响动画初始值
            ...(measuring && styles.hiddenMeasure),
          },
          fixedHeight ? { height: fixedHeight } : undefined,
          { transform: [{ translateY }] },
          modalStyle,
        ]}
        onLayout={(e) => onSheetLayout(e.nativeEvent.layout.height)}
      >
        {title && (
          <View style={styles.titleContainer}>
            {typeof title === "string" ? (
              <Text style={{ color: theme.secondary, fontWeight: "500" }}>
                {title}
              </Text>
            ) : (
              title
            )}
          </View>
        )}

        {showCloseButton && (
          <Pressable
            style={[
              styles.closeButton,
              closeButtonPostion === "top-left" ? { left: 14 } : { right: 14 },
            ]}
            hitSlop={10}
            onPress={close}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X color={theme.secondary} size={20} />
          </Pressable>
        )}

        {children}
      </Animated.View>
    </Modal>
  );
}

const CLOSE_BTN_SIZE = 28;

const styles = StyleSheet.create({
  overlayBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  // measuring 阶段：移出屏幕且不可见，但仍可测量布局
  hiddenMeasure: {
    opacity: 0,
    position: "absolute",
    bottom: -9999,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    width: CLOSE_BTN_SIZE,
    height: CLOSE_BTN_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
