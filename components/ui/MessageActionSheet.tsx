import { useCallback } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemedText from "./ThemedText";

export type MessageAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type MessageActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  actions: MessageAction[];
};

export default function MessageActionSheet({
  visible,
  onClose,
  actions,
}: MessageActionSheetProps) {
  const insets = useSafeAreaInsets();

  const handleAction = useCallback(
    (action: MessageAction) => {
      onClose();
      action.onPress();
    },
    [onClose],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={styles.sheetContent}>
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
                  size={17}
                  color={action.destructive ? "#FF3B30" : "#007AFF"}
                >
                  {action.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.actionItemPressed,
            ]}
            onPress={onClose}
          >
            <ThemedText size={17} color="#007AFF" fontWeight="600">
              取消
            </ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    paddingHorizontal: 8,
  },
  sheetContent: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    overflow: "hidden",
  },
  actionItem: {
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  actionItemPressed: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
});
