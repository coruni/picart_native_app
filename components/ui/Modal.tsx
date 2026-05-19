import { useTheme } from "@/hooks/useTheme";
import { X } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
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
  height,
  children,
  modalStyle,
  overlayStyle,
  showCloseButton = true,
  borderRadius = 16,
  closeButtonPostion = "top-right",
  title,
}: Props) {
  const { theme } = useTheme();

  const close = useCallback(() => onClose?.(false), [onClose]);

  return (
    <>
      <Modal
        transparent
        visible={visible}
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
        hardwareAccelerated
        onRequestClose={close}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={[styles.overlayBase, overlayStyle]}
            onPress={close}
          />
        </View>
      </Modal>

      <Modal
        transparent
        visible={visible}
        statusBarTranslucent
        navigationBarTranslucent
        animationType="slide"
        hardwareAccelerated
        onRequestClose={close}
      >
        <View style={styles.modalRoot} pointerEvents="box-none">
          <Pressable style={styles.dismissLayer} onPress={close} />

          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.card,
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius,
              },
              height ? { height } : undefined,
              modalStyle,
            ]}
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
                  closeButtonPostion === "top-left"
                    ? { left: 14 }
                    : { right: 14 },
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
          </View>
        </View>
      </Modal>
    </>
  );
}

const CLOSE_BTN_SIZE = 28;

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dismissLayer: {
    ...StyleSheet.absoluteFillObject,
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
