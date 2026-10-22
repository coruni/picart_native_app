import { ArticleData } from "@/types/article";
import GestureImageViewer from "@/components/media/GestureImageViewer";
import { getImageUrl } from "@/lib/image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import AsyncImage from "../ui/AsyncImage";
import ThemedText from "../ui/ThemedText";

type ArticleSwiperProps = {
  article: ArticleData;
  images: ArticleData["images"];
  onCommentSubmitted?: () => void;
  onArticleInteractionChange?: (
    updates: Partial<
      Pick<
        ArticleData,
        "isLiked" | "likes" | "isFavorited" | "favoriteCount" | "commentCount"
      >
    >,
  ) => void;
};

const DOT_SIZE = 5.5;
const SMALL_DOT_SIZE = 3;
const DOT_MARGIN = 2;
const SLOT_WIDTH = DOT_SIZE + DOT_MARGIN * 2;
const VISIBLE_COUNT = 5;
const PADDING_H = 2;
const LOCK_SLOT = 3;
/**
 * 相册区高度上限。下限压得很低是故意的：只要比图片本身比例高，
 * contain 就会在上下留白，所以宁可让横幅图矮一点，也不要撑高留白
 */
const MIN_IMAGE_HEIGHT = 100;
const MAX_IMAGE_HEIGHT = 480;
/** 量不到尺寸时先按 4:3 占位，量到再换 */
const FALLBACK_IMAGE_RATIO = 3 / 4;
/** 按 URL 缓存高宽比，同一张图只量一次 */
const imageRatioCache = new Map<string, number>();

/**
 * 图片的高宽比（height / width）。
 *
 * 相册区高度直接由它算，所以必须是**真正展示的那张图**的比例：
 * 老数据的 images 只有字符串地址，对象数据的 width/height 是原图尺寸，
 * 而实际渲染的是缩略图，两者比例可能被裁过。比例对不上时
 * contain 会在上下留白，表现出来就是「相册下面多一段空白」。
 */
function useImageRatio(url: string | null, fallback: number) {
  const [measured, setMeasured] = useState<{
    url: string;
    ratio: number;
  } | null>(null);

  useEffect(() => {
    if (!url || imageRatioCache.has(url)) return;

    let cancelled = false;
    Image.getSize(
      url,
      (w, h) => {
        if (w <= 0 || h <= 0) return;
        const next = h / w;
        imageRatioCache.set(url, next);
        if (!cancelled) setMeasured({ url, ratio: next });
      },
      () => {},
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  const cached = url ? imageRatioCache.get(url) : undefined;
  const measuredRatio = measured?.url === url ? measured.ratio : undefined;
  return cached ?? measuredRatio ?? fallback;
}

export default function ArticleSwiper({
  article,
  images,
  onCommentSubmitted,
  onArticleInteractionChange,
}: ArticleSwiperProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [translateX] = useState(() => new Animated.Value(0));
  const pagerRef = useRef<PagerView>(null);
  const total = images.length;
  const { width } = useWindowDimensions();
  const viewerImages = images.map((item) => {
    const viewerUrl =
      typeof item === "string" ? item : getImageUrl(item, "large") || item.url;
    const originalUrl =
      typeof item === "string"
        ? item
        : getImageUrl(item, "original") || item.url;

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

  // 相册区高度按「实际展示的首张图」的比例算，比例和容器一致才不会上下留白。
  // 对象数据先用 width/height 兜底首帧，量到真实比例再覆盖。
  const firstItem = images[0];
  const firstImageUrl = firstItem
    ? (getImageUrl(firstItem, "large") ??
      (typeof firstItem === "string" ? firstItem : firstItem.url))
    : null;
  const metadataRatio =
    firstItem && typeof firstItem !== "string" && firstItem.width > 0
      ? firstItem.height / firstItem.width
      : FALLBACK_IMAGE_RATIO;
  const firstImageRatio = useImageRatio(firstImageUrl, metadataRatio);
  const firstImageHeight = Math.min(
    Math.max(firstImageRatio * width, MIN_IMAGE_HEIGHT),
    MAX_IMAGE_HEIGHT,
  );

  useEffect(() => {
    const s = Math.min(Math.max(0, currentPage - LOCK_SLOT), maxShift);
    Animated.timing(translateX, {
      toValue: -s * SLOT_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentPage, maxShift, translateX]);

  return (
    <GestureImageViewer
      article={article}
      author={article.author}
      images={viewerImages}
      onCommentSubmitted={onCommentSubmitted}
      onArticleInteractionChange={onArticleInteractionChange}
    >
      {({ open }) => (
        <View style={[styles.container, { height: firstImageHeight }]}>
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
