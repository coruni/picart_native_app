import ThemedText from "@/components/ui/ThemedText";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  EMOJI_IMAGE_SIZE,
  EMOJI_PANEL_TOOLBAR_HEIGHT,
} from "./composerConstants";
import type { EmojiGroup, EmojiItem } from "./composerTypes";

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

export default function EmojiPanel({
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
          contentContainerStyle={styles.emojiCategoryContent}
        >
          <Pressable
            style={[
              styles.emojiCategoryButton,
              selectedGroupIndex === 0 && {
                backgroundColor: secondaryBackgroundColor,
              },
            ]}
            onPress={() => onSelectGroup(0)}
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
                style={[
                  styles.emojiCategoryButton,
                  active && {
                    backgroundColor: secondaryBackgroundColor,
                  },
                ]}
                onPress={() => onSelectGroup(categoryIndex)}
              >
                {firstEmoji ? (
                  <Image
                    source={{ uri: firstEmoji.url }}
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
        </ScrollView>
      </View>
      <ScrollView
        style={styles.emojiList}
        contentContainerStyle={styles.emojiGrid}
        showsVerticalScrollIndicator={false}
      >
        {selectedItems.map((emoji) => (
          <Pressable
            key={emoji.id}
            style={styles.emojiButton}
            onPress={() => onSelectEmoji(emoji)}
          >
            <Image
              source={{ uri: emoji.url }}
              style={styles.emojiImage}
              resizeMode="contain"
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

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
  },
  emojiCategoryButton: {
    minWidth: 36,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
