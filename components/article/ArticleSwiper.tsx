import { ArticleData } from "@/app/article/[id]";
import { getImageUrl } from "@/lib/image";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import AsyncImage from "../ui/AsyncImage";

type ArticleSwiperProps = {
  images: ArticleData["images"];
};

const DOT_SIZE = 6;
const SMALL_DOT_SIZE = 3;
const DOT_MARGIN = 4;
const SLOT_WIDTH = DOT_SIZE + DOT_MARGIN * 2;
const VISIBLE_COUNT = 5;
const PADDING_H = 2;
const SCROLL_WINDOW_WIDTH = SLOT_WIDTH * VISIBLE_COUNT;
const INDICATOR_WIDTH = SCROLL_WINDOW_WIDTH + PADDING_H * 2;
const LOCK_SLOT = 3;

export default function ArticleSwiper({ images }: ArticleSwiperProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const total = images.length;
  const translateX = useRef(new Animated.Value(0)).current;

  const maxShift = Math.max(0, total - VISIBLE_COUNT);
  const shift = Math.min(Math.max(0, currentPage - LOCK_SLOT), maxShift);

  // 窗口内可见的点范围
  const visibleStart = shift;
  const visibleEnd = shift + VISIBLE_COUNT - 1;

  // 边缘点：窗口内第一个和最后一个，有更多内容时缩小
  const leftEdge = visibleStart; // 左边第一个点
  const rightEdge = visibleEnd; // 右边最后一个点
  const hasLeft = shift > 0;
  const hasRight = shift < maxShift;

  useEffect(() => {
    const s = Math.min(Math.max(0, currentPage - LOCK_SLOT), maxShift);
    Animated.timing(translateX, {
      toValue: -s * SLOT_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentPage, total]);

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {images.map((item, index) => {
          const src =
            typeof item === "string" ? item : getImageUrl(item, "large");
          return (
            <AsyncImage
              key={index}
              source={{ uri: src }}
              style={styles.image}
            />
          );
        })}
      </PagerView>

      {total > 1 && (
        <View style={styles.indicatorWrapper}>
          <View style={[styles.indicatorOuter, { width: INDICATOR_WIDTH }]}>
            <View style={styles.scrollWindow}>
              <Animated.View
                style={[styles.dotsRow, { transform: [{ translateX }] }]}
              >
                {Array.from({ length: total }, (_, i) => {
                  const isActive = i === currentPage;
                  const isSmall =
                    (i === leftEdge && hasLeft) ||
                    (i === rightEdge && hasRight) ||
                    i < visibleStart ||
                    i > visibleEnd;
                  const size = isSmall ? SMALL_DOT_SIZE : DOT_SIZE;

                  return (
                    <View key={i} style={styles.dotSlot}>
                      <View
                        style={{
                          width: size,
                          height: size,
                          borderRadius: size / 2,
                          backgroundColor: isActive
                            ? "white"
                            : "rgba(255,255,255,0.4)",
                        }}
                      />
                    </View>
                  );
                })}
              </Animated.View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative", height: 480 },
  pager: { flex: 1 },
  image: { width: "100%", height: "100%" },
  indicatorWrapper: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  indicatorOuter: {
    paddingHorizontal: PADDING_H,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollWindow: {
    width: SCROLL_WINDOW_WIDTH,
    overflow: "hidden",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotSlot: {
    width: SLOT_WIDTH,
    height: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
