import ThemedText from "@/components/ui/ThemedText";
import { normalizeImageUrl } from "@/lib/image";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  EMOJI_IMAGE_SIZE,
  EMOJI_PANEL_TOOLBAR_HEIGHT,
} from "./composerConstants";
import type { EmojiGroup, EmojiItem } from "./composerTypes";

/** 指示器尺寸对齐项目 tab 的 tabIndicator：20×4 圆角胶囊 */
const CATEGORY_INDICATOR_WIDTH = 20;

type EmojiPanelProps = {
  groups: EmojiGroup[];
  selectedGroupIndex: number;
  selectedItems: EmojiItem[];
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  cardColor: string;
  secondaryBackgroundColor: string;
  onSelectGroup: (index: number) => void;
  onSelectEmoji: (emoji: EmojiItem) => void;
};

function EmojiPanel({
  groups,
  selectedGroupIndex,
  selectedItems,
  primaryColor,
  secondaryColor,
  borderColor,
  cardColor,
  secondaryBackgroundColor,
  onSelectGroup,
  onSelectEmoji,
}: EmojiPanelProps) {
  const { t } = useTranslation();

  // 分类按钮的横向布局，用来把胶囊指示器挪到选中项正下方。
  // 用 ref 存布局避免每次 onLayout 都触发重渲染，只有位置变了才 setState。
  const categoryLayoutsRef = useRef<Record<number, { x: number; width: number }>>(
    {},
  );
  const [indicatorX, setIndicatorX] = useState(0);

  const moveIndicatorTo = useCallback((index: number) => {
    const layout = categoryLayoutsRef.current[index];
    if (!layout) return;
    setIndicatorX(layout.x + layout.width / 2 - CATEGORY_INDICATOR_WIDTH / 2);
  }, []);

  useEffect(() => {
    moveIndicatorTo(selectedGroupIndex);
  }, [moveIndicatorTo, selectedGroupIndex]);

  const handleCategoryLayout = useCallback(
    (index: number, x: number, width: number) => {
      categoryLayoutsRef.current[index] = { x, width };
      if (index === selectedGroupIndex) {
        setIndicatorX(x + width / 2 - CATEGORY_INDICATOR_WIDTH / 2);
      }
    },
    [selectedGroupIndex],
  );

  return (
    <View style={styles.emojiPanel}>
      <View
        style={[
          styles.emojiCategoryBar,
          {
            borderBottomColor: borderColor,
            backgroundColor: cardColor,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.emojiCategoryContent}
        >
          <Pressable
            style={({ pressed }) => [
              styles.emojiCategoryButton,
              pressed && { backgroundColor: secondaryBackgroundColor },
            ]}
            onPress={() => onSelectGroup(0)}
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              handleCategoryLayout(0, x, width);
            }}
          >
            <ThemedText
              size={13}
              fontWeight="600"
              color={selectedGroupIndex === 0 ? primaryColor : secondaryColor}
            >
              {t("commentComposer.allEmoji")}
            </ThemedText>
          </Pressable>
          {groups.map((group, index) => {
            const firstEmoji = group.items[0];
            const categoryIndex = index + 1;
            const active = selectedGroupIndex === categoryIndex;
            return (
              <Pressable
                key={`${group.name}-${index}`}
                style={({ pressed }) => [
                  styles.emojiCategoryButton,
                  pressed && { backgroundColor: secondaryBackgroundColor },
                ]}
                onPress={() => onSelectGroup(categoryIndex)}
                onLayout={(event) => {
                  const { x, width } = event.nativeEvent.layout;
                  handleCategoryLayout(categoryIndex, x, width);
                }}
              >
                {firstEmoji ? (
                  <Image
                    source={{ uri: normalizeImageUrl(firstEmoji.url) }}
                    style={styles.emojiCategoryImage}
                    resizeMode="contain"
                  />
                ) : (
                  <ThemedText
                    size={12}
                    color={active ? primaryColor : secondaryColor}
                  >
                    {group.name.slice(0, 2)}
                  </ThemedText>
                )}
              </Pressable>
            );
          })}
          {/* 项目 tab 同款指示器：主色胶囊，落在选中分类正下方 */}
          <View
            pointerEvents="none"
            style={[
              styles.emojiCategoryIndicator,
              { left: indicatorX, backgroundColor: primaryColor },
            ]}
          />
        </ScrollView>
      </View>
      <ScrollView
        style={styles.emojiList}
        contentContainerStyle={styles.emojiGrid}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {selectedItems.map((emoji) => (
          <Pressable
            key={emoji.id}
            style={styles.emojiButton}
            onPress={() => onSelectEmoji(emoji)}
          >
            <Image
              source={{ uri: normalizeImageUrl(emoji.url) }}
              style={styles.emojiImage}
              resizeMode="contain"
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// 表情列表动辄上百个 Image，父组件在键盘/面板切换时会频繁重渲染。
// props 全部是稳定引用（state / useMemo / useCallback），memo 后可以完全跳过。
export default memo(EmojiPanel);

const styles = StyleSheet.create({
  emojiPanel: {
    flex: 1,
  },
  emojiList: {
    flex: 1,
  },
  emojiCategoryBar: {
    height: EMOJI_PANEL_TOOLBAR_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emojiCategoryContent: {
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 6,
    // 撑满整条高度，指示器才好按 bottom 贴着底边走
    height: EMOJI_PANEL_TOOLBAR_HEIGHT,
  },
  emojiCategoryButton: {
    minWidth: 36,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  /** 高度 / 圆角 / 颜色对齐项目 tab 的 tabIndicator */
  emojiCategoryIndicator: {
    position: "absolute",
    bottom: 4,
    width: CATEGORY_INDICATOR_WIDTH,
    height: 4,
    borderRadius: 2,
  },
  emojiCategoryImage: {
    width: 24,
    height: 24,
  },
  emojiGrid: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emojiButton: {
    width: EMOJI_IMAGE_SIZE + 4,
    height: EMOJI_IMAGE_SIZE + 4,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiImage: {
    width: EMOJI_IMAGE_SIZE,
    height: EMOJI_IMAGE_SIZE,
  },
});
