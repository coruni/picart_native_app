import { ArticleData } from "@/app/article/[id]";
import GestureImageViewer from "@/components/ui/GestureImageViewer";
import { getImageUrl } from "@/lib/image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import AsyncImage from "../ui/AsyncImage";
import ThemedText from "../ui/ThemedText";

type ArticleSwiperProps = {
  images: ArticleData["images"];
};

const DOT_SIZE = 5.5;
const SMALL_DOT_SIZE = 3;
const DOT_MARGIN = 2;
const SLOT_WIDTH = DOT_SIZE + DOT_MARGIN * 2;
const VISIBLE_COUNT = 5;
const PADDING_H = 2;
const LOCK_SLOT = 3;

export default function ArticleSwiper({ images }: ArticleSwiperProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [translateX] = useState(() => new Animated.Value(0));
  const pagerRef = useRef<PagerView>(null);
  const total = images.length;
  const { width } = useWindowDimensions();
  const viewerImages = images.map((item) => {
    const viewerUrl =
      typeof item === "string" ? item : getImageUrl(item, "large") || item.url;
    const originalUrl =
      typeof item === "string" ? item : getImageUrl(item, "original") || item.url;

    return {
      imageData: typeof item === "string" ? undefined : item,
      previewUrl: viewerUrl,
      viewerUrl,
      originalUrl,
      width: typeof item === "string" ? undefined : item.width,
      height: typeof item === "string" ? undefined : item.height,
      sizeBytes: typeof item === "string" ? undefined : item.size,
    };
  });

  // 滚动宽度 大于5张时才使用5 否则使用images。length
  const SCROLL_WINDOW_WIDTH =
    SLOT_WIDTH * (images.length > 5 ? 5 : images.length);
  const INDICATOR_WIDTH = SCROLL_WINDOW_WIDTH + PADDING_H * 2;
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

  // 记录首张图片高度 如果没有使用默认高度,适配屏幕宽度
  const firstImageHeight =
    typeof images[0] === "string"
      ? 380
      : (images[0].height / images[0].width) * width;

  useEffect(() => {
    const s = Math.min(Math.max(0, currentPage - LOCK_SLOT), maxShift);
    Animated.timing(translateX, {
      toValue: -s * SLOT_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentPage, maxShift, translateX]);

  return (
    <GestureImageViewer images={viewerImages}>
      {({ open }) => (
        <View
          style={[
            styles.container,
            { minHeight: 180, maxHeight: 480, height: firstImageHeight },
          ]}
        >
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
                <Pressable
                  key={index}
                  style={styles.page}
                  onPress={() => open(index)}
                >
                  <AsyncImage source={{ uri: src }} style={styles.image} />
                </Pressable>
              );
            })}
          </PagerView>
          {total > 1 && (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                padding: 1,
                paddingHorizontal: 6,
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <ThemedText
                color="white"
                size={12}
              >{`${currentPage + 1}/${images.length}`}</ThemedText>
            </View>
          )}
          {total > 1 && (
            <View style={styles.indicatorWrapper}>
              <View style={[styles.indicatorOuter, { width: INDICATOR_WIDTH }]}>
                <View
                  style={[styles.scrollWindow, { width: SCROLL_WINDOW_WIDTH }]}
                >
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
      )}
    </GestureImageViewer>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  pager: { flex: 1 },
  page: { flex: 1 },
  image: { width: "100%", height: "100%", objectFit: "contain" },
  indicatorWrapper: {
    position: "absolute",
    bottom: 10,
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
