import { useTheme } from "@/hooks/useTheme";
import { X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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
  const { theme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(fixedHeight ?? 0);

  // true = height not yet measured, keep sheet invisible
  const [measuring, setMeasuring] = useState(!fixedHeight);

  const translateY = useRef(new Animated.Value(sheetHeight || 9999)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animate = (toValue: number, onDone?: () => void) => {
    Animated.timing(translateY, {
      toValue,
      duration: animationDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone?.();
    });
  };

  const slideIn = (h: number) => {
    translateY.setValue(h);
    opacity.setValue(1);
    animate(0);
  };

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      setMeasuring(!fixedHeight);
      setSheetHeight(fixedHeight ?? 0);
      translateY.setValue(fixedHeight ?? 9999);
      setIsMounted(true);

      if (fixedHeight) {
        slideIn(fixedHeight);
      }
    } else if (isMounted) {
      // Slide out then unmount
      animate(sheetHeight || 9999, () => {
        setIsMounted(false);
        setMeasuring(!fixedHeight);
      });
    }
  }, [visible]);

  const onSheetLayout = (measuredHeight: number) => {
    if (fixedHeight || !measuring) return;
    setSheetHeight(measuredHeight);
    setMeasuring(false);
    slideIn(measuredHeight);
  };

  const close = () => onClose?.(false);

  if (!isMounted) return null;

  return (
    <Modal
      transparent
      visible
      statusBarTranslucent
      animationType="none"
      onRequestClose={close}
    >
      {/* Overlay — fade in with sheet */}
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

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.card,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            opacity,
            ...(measuring && {
              position: "absolute",
              top: 99999,
              bottom: undefined,
            }),
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
