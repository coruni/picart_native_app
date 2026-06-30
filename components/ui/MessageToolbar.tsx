import { useCallback } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemedText from "./ThemedText";

export type MessageToolbarAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type MessageToolbarProps = {
  visible: boolean;
  onClose: () => void;
  actions: MessageToolbarAction[];
  position?: { x: number; y: number };
};

export default function MessageToolbar({
  visible,
  onClose,
  actions,
  position = { x: 0, y: 0 },
}: MessageToolbarProps) {
  const insets = useSafeAreaInsets();

  const handleAction = useCallback(
    (action: MessageToolbarAction) => {
      onClose();
      action.onPress();
    },
    [onClose],
  );

  if (!visible || actions.length === 0) {
    return null;
  }

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View />
      </Pressable>
      <Animated.View
        style={[
          styles.toolbarContainer,
          {
            top: Math.min(position.y, 300),
            left: Math.max(8, Math.min(position.x - 60, 200)),
            right: 8,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.toolbarContent}>
          {actions.map((action, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
              onPress={() => handleAction(action)}
            >
              <ThemedText
                size={14}
                color={action.destructive ? "#FF3B30" : "#ffffff"}
              >
                {action.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  toolbarContainer: {
    position: "absolute",
  },
  toolbarContent: {
    backgroundColor: "rgba(50,50,50,0.95)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionItemPressed: {
    opacity: 0.7,
  },
});
