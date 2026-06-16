import api from "@/api/client";
import type { BannerControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import AsyncImage from "@/components/ui/AsyncImage";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";

type Banner = BannerControllerFindAll200ResponseDataDataInner;

interface HomeBannerProps {
  /** 每张 banner 停留时长（ms），默认 4000 */
  duration?: number;
  /** true = 没有数据时保留占位高度，false = 无数据时不渲染，默认 false */
  alwaysVisible?: boolean;
  /** banner 高度，默认按 16:5 比例由屏幕宽度计算 */
  height?: number;
  /** 渲染概率 0-1，默认 0.4 */
  probability?: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DOT_SIZE = 6;
const ACTIVE_W = 28;
const DOT_GAP = 6;

export default function HomeBanner({
  duration = 4000,
  alwaysVisible = false,
  height,
  probability = 0.4,
}: HomeBannerProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const bannerHeight = height ?? Math.round((width * 5) / 16);

  // 概率判定在 mount 时固定，避免重渲染时随机变化
  const shouldRender = useRef(Math.random() < probability).current;

  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const pagerRef = useRef<PagerView>(null);
  // 用于区分自动跳页和用户手动滑动，避免双重推进
  const autoAdvancing = useRef(false);

  useEffect(() => {
    api
      .bannerControllerFindActive()
      .then(({ data }) => {
        const list = data.data ?? [];
        if (list.length > 0) setBanners(shuffle(list));
      })
      .catch(() => {});
  }, []);

  // 每当 current 变化重启进度条动画，到点后自动翻页
  useEffect(() => {
    if (banners.length === 0) return;

    progressAnim.setValue(0);
    animRef.current?.stop();

    animRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (!finished) return;
      const next = (current + 1) % banners.length;
      autoAdvancing.current = true;
      pagerRef.current?.setPage(next);
    });

    return () => {
      animRef.current?.stop();
    };
  }, [current, banners.length, duration, progressAnim]);

  const handlePageSelected = (e: { nativeEvent: { position: number } }) => {
    const pos = e.nativeEvent.position;
    if (autoAdvancing.current) {
      autoAdvancing.current = false;
    }
    setCurrent(pos);
  };

  const handlePress = () => {
    const url = banners[current]?.linkUrl;
    if (url) Linking.openURL(url).catch(() => {});
  };

  if (!shouldRender) return null;

  if (banners.length === 0) {
    if (!alwaysVisible) return null;
    return <View style={[styles.root, { height: bannerHeight }]} />;
  }

  return (
    <View>
      {/* PagerView 支持左右滑动 + 切换动画 */}
      <Pressable
        style={[styles.root, { height: bannerHeight }]}
        onPress={handlePress}
      >
        <PagerView
          ref={pagerRef}
          style={StyleSheet.absoluteFill}
          initialPage={0}
          scrollEnabled
          onPageSelected={handlePageSelected}
        >
          {banners.map((banner, i) => (
            <View key={banner.id ?? i} style={styles.page}>
              <AsyncImage
                source={{ uri: banner.imageUrl }}
                style={styles.image}
                contentFit="cover"
                showLoading={i === 0}
              />
            </View>
          ))}
        </PagerView>
      </Pressable>

      {/* 指示器：图片外部下方居中 */}
      {banners.length > 1 && (
        <View style={styles.indicators}>
          {banners.map((_, i) => {
            const isActive = i === current;

            return (
              <View
                key={i}
                style={[
                  styles.track,
                  {
                    width: isActive ? ACTIVE_W : DOT_SIZE,
                    backgroundColor: "rgba(0,0,0,0.12)",
                  },
                ]}
              >
                {isActive && (
                  <Animated.View
                    style={[
                      styles.fill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
  },
  page: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
    gap: DOT_GAP,
  },
  track: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: DOT_SIZE / 2,
  },
});
