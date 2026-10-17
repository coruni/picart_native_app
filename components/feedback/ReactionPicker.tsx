import {
  REACTION_IMAGES,
  REACTION_LABEL_KEYS,
  REACTION_TYPES,
  type ReactionType,
} from "@/constants/reactions";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

export type ReactionAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  /** 长按目标在窗口坐标下的位置，表态条锚在它正上方 */
  anchor: ReactionAnchor | null;
  selected?: ReactionType | null;
  onSelect: (type: ReactionType) => void;
  onClose: () => void;
};

const GAP = 8;
const SCREEN_PADDING = 12;
const PILL_PADDING = 4;
const MIN_ITEM = 38;
const MAX_ITEM = 44;

export default function ReactionPicker({
  visible,
  anchor,
  selected,
  onSelect,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  // 实例级动画值：用 state 持有而非 ref，避免在 render 期间读 ref.current
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [progress, visible]);

  if (!anchor) return null;

  // 7 个表情要在一行里放得下：宽屏 44，320dp 的老机型自动收到 41
  const availableWidth =
    screenWidth - SCREEN_PADDING * 2 - PILL_PADDING * 2;
  const itemSize = Math.max(
    MIN_ITEM,
    Math.min(MAX_ITEM, Math.floor(availableWidth / REACTION_TYPES.length)),
  );
  const iconSize = Math.round(itemSize * 0.68);
  const pillWidth = itemSize * REACTION_TYPES.length + PILL_PADDING * 2;
  const pillHeight = itemSize + PILL_PADDING * 2;

  const top = Math.max(SCREEN_PADDING, anchor.y - pillHeight - GAP);
  const left = Math.max(
    SCREEN_PADDING,
    Math.min(
      anchor.x + anchor.width / 2 - pillWidth / 2,
      screenWidth - pillWidth - SCREEN_PADDING,
    ),
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
        <Animated.View
          style={[
            styles.pill,
            {
              top,
              left,
              width: pillWidth,
              height: pillHeight,
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: progress,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [GAP, 0],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {REACTION_TYPES.map((type) => {
            const isSelected = selected === type;
            return (
              <Pressable
                key={type}
                style={[
                  styles.item,
                  {
                    width: itemSize,
                    height: itemSize,
                  },
                  isSelected && { backgroundColor: `${theme.primary}1A` },
                ]}
                onPress={() => onSelect(type)}
                accessibilityRole="button"
                accessibilityLabel={t(REACTION_LABEL_KEYS[type])}
                accessibilityState={{ selected: isSelected }}
              >
                <Image
                  source={REACTION_IMAGES[type]}
                  style={{ width: iconSize, height: iconSize }}
                  contentFit="contain"
                  transition={0}
                />
              </Pressable>
            );
          })}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  pill: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: PILL_PADDING,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
});
