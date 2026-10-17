import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";
import ThemedText from "../ui/ThemedText";

export type FloatingMenuAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

export type FloatingMenuAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type FloatingActionMenuProps = {
  visible: boolean;
  anchor: FloatingMenuAnchor | null;
  actions: FloatingMenuAction[];
  onClose: () => void;
};

const MENU_HEIGHT = 44;
// Gap between bubble and menu. Negative overlap lets the menu sit closer
// to the message, matching the system text-selection toolbar's tight
// placement just above the selected line.
const MENU_GAP = -4;
const SCREEN_PADDING = 12;

export default function FloatingActionMenu({
  visible,
  anchor,
  actions,
  onClose,
}: FloatingActionMenuProps) {
  const { theme } = useTheme();
  // Reset measured width whenever the menu hides, so the next show measures
  // fresh (action lists can differ between messages, e.g. recall vs copy).
  const [menuWidth, setMenuWidth] = useState(0);
  useEffect(() => {
    if (!visible) setMenuWidth(0);
  }, [visible]);

  if (!anchor || actions.length === 0) return null;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Prefer above the anchor; flip below if not enough space.
  const placeAbove = anchor.y >= MENU_HEIGHT + MENU_GAP + SCREEN_PADDING;
  let top = placeAbove
    ? anchor.y - MENU_HEIGHT - MENU_GAP
    : anchor.y + anchor.height + MENU_GAP;
  top = Math.max(
    SCREEN_PADDING,
    Math.min(top, screenHeight - MENU_HEIGHT - SCREEN_PADDING),
  );

  // Center horizontally over anchor, then clamp to screen edges.
  let left = anchor.x + anchor.width / 2 - menuWidth / 2;
  left = Math.max(
    SCREEN_PADDING,
    Math.min(left, screenWidth - menuWidth - SCREEN_PADDING),
  );

  const measured = menuWidth > 0;

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
            styles.menu,
            {
              top,
              left: measured ? left : 0,
              opacity: measured ? 1 : 0,
              backgroundColor: theme.card,
            },
          ]}
          onLayout={(e) => setMenuWidth(e.nativeEvent.layout.width)}
        >
          {actions.map((action, index) => (
            <View key={index} style={styles.actionWrapper}>
              {index > 0 && (
                <View
                  style={[styles.divider, { backgroundColor: theme.border }]}
                />
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.action,
                  pressed && {
                    backgroundColor: theme.secondaryBackground,
                  },
                ]}
                onPress={() => {
                  onClose();
                  action.onPress();
                }}
              >
                <ThemedText
                  size={15}
                  color={action.destructive ? "#FF3B30" : theme.text}
                >
                  {action.label}
                </ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    height: MENU_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  action: {
    paddingHorizontal: 14,
    height: 36,
    justifyContent: "center",
    borderRadius: 18,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
  },
});
