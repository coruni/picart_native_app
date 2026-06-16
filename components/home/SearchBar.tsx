import api from "@/api/client";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

const ITEM_HEIGHT = 20;
const DISPLAY_DURATION = 2800;
const ANIM_DURATION = 380;

function HotWordMarquee({ words }: { words: string[] }) {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(ITEM_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (words.length === 0) return;

    translateY.setValue(ITEM_HEIGHT);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -ITEM_HEIGHT,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((i) => (i + 1) % words.length);
      });
    }, DISPLAY_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, words]);

  if (words.length === 0) return null;

  return (
    <View style={styles.marqueeClip}>
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.marqueeText,
          { color: theme.secondary, transform: [{ translateY }], opacity },
        ]}
      >
        {words[index]}
      </Animated.Text>
    </View>
  );
}

export default function SearchBar() {
  const { theme } = useTheme();
  const [hotWords, setHotWords] = useState<string[]>([]);

  useEffect(() => {
    api
      .articleControllerFindHotSearch(10)
      .then((res) => {
        const words = res.data?.data?.data?.map((k) => k.keyword) ?? [];
        setHotWords(words);
      })
      .catch(() => {});
  }, []);

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.secondaryBackground }]}
    >
      <Ionicons name="search-outline" size={15} color={theme.secondary} />
      <HotWordMarquee words={hotWords} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    gap: 6,
  },
  marqueeClip: {
    flex: 1,
    height: ITEM_HEIGHT,
    overflow: "hidden",
    justifyContent: "center",
  },
  marqueeText: {
    fontSize: 13,
    lineHeight: ITEM_HEIGHT,
  },
});
