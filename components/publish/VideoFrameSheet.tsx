import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import { Image } from "expo-image";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { createVideoPlayer, type VideoThumbnail } from "expo-video";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface VideoFrameSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface VideoFrameSheetProps {
  /** 视频本地 uri */
  videoUri: string;
  /** 视频时长（毫秒），用于均匀取帧 */
  duration?: number;
  onSelect: (uri: string) => void;
  onDismiss?: () => void;
}

/** 取几帧：足够挑出想要的画面，又不会太慢 */
const FRAME_COUNT = 8;
/** 取帧高度，宽度按 16:9 推出来 */
const FRAME_HEIGHT = 54;
const FRAME_GAP = 8;
/** 首尾各留一点，避免取到黑场 */
const EDGE_PADDING = 0.04;
/** 缩略图最大宽度，面板里够清楚即可 */
const THUMB_MAX_WIDTH = 640;

const VideoFrameSheet = forwardRef<VideoFrameSheetRef, VideoFrameSheetProps>(
  function VideoFrameSheet(
    { videoUri, duration = 0, onSelect, onDismiss },
    ref,
  ) {
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const sheetRef = useRef<BottomSheetModal>(null);

    const [frames, setFrames] = useState<VideoThumbnail[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        present: () => sheetRef.current?.present(),
        dismiss: () => sheetRef.current?.dismiss(),
      }),
      [],
    );

    // 打开面板时用 expo-video 一次性抽出整条时间轴的帧
    useEffect(() => {
      if (!videoUri || duration <= 0) return;
      let cancelled = false;
      const player = createVideoPlayer(videoUri);

      (async () => {
        setLoading(true);
        setSelectedIndex(null);
        setFrames([]);

        try {
          // generateThumbnailsAsync 的时间单位是秒
          const times = Array.from({ length: FRAME_COUNT }, (_, index) => {
            const ratio =
              EDGE_PADDING +
              (index / Math.max(1, FRAME_COUNT - 1)) * (1 - EDGE_PADDING * 2);
            return Number(((duration / 1000) * ratio).toFixed(3));
          });

          const thumbnails = await player.generateThumbnailsAsync(times, {
            maxWidth: THUMB_MAX_WIDTH,
          });
          if (!cancelled) setFrames(thumbnails);
        } catch (error) {
          console.error("Failed to generate video thumbnails:", error);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => {
        cancelled = true;
        // 面板关掉就释放原生播放器，避免占用解码资源
        player.release();
      };
    }, [duration, videoUri]);

    const handleConfirm = useCallback(async () => {
      if (selectedIndex == null) return;
      const thumbnail = frames[selectedIndex];
      if (!thumbnail) return;

      setSaving(true);
      try {
        // 缩略图是原生图像引用，落盘成文件才能上传
        const context = ImageManipulator.manipulate(thumbnail);
        const image = await context.renderAsync();
        const { uri } = await image.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.9,
        });
        onSelect(uri);
        sheetRef.current?.dismiss();
      } catch (error) {
        console.error("Failed to save video frame:", error);
      } finally {
        setSaving(false);
      }
    }, [frames, onSelect, selectedIndex]);

    const renderBackdrop = useCallback(
      (props: ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
          pressBehavior="close"
        />
      ),
      [],
    );

    // 固定档位 + flex 撑满，和项目里其它带列表的 sheet 一致
    const snapPoints = [Math.round(windowHeight * 0.46)];

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        stackBehavior="switch"
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        onDismiss={() => {
          setSelectedIndex(null);
          onDismiss?.();
        }}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.titleRow}>
            <ThemedText fontWeight="600" size={16}>
              {t("publish.videoFrame.title")}
            </ThemedText>
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("cancel")}
              onPress={() => sheetRef.current?.dismiss()}
              style={styles.closeButton}
            >
              <HugeIcon
                icon={Cancel01Icon}
                size={18}
                color={theme.mutedForeground}
              />
            </Pressable>
          </View>

          <ThemedText size={12} color={theme.mutedForeground}>
            {t("publish.videoFrame.hint")}
          </ThemedText>

          {/* 横向滚动手势归 ScrollView，用 BottomSheetScrollView 会被面板的拖拽抢走 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.frameList}
            style={styles.frameScroll}
          >
            {frames.map((thumbnail, index) => {
              const active = selectedIndex === index;
              return (
                <Pressable
                  key={thumbnail.requestedTime ?? index}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setSelectedIndex(index)}
                  style={[
                    styles.frameTile,
                    {
                      backgroundColor: theme.muted,
                      borderColor: active ? colors.primary : "transparent",
                    },
                  ]}
                >
                  <Image
                    source={thumbnail}
                    style={styles.frameImage}
                    contentFit="cover"
                  />
                </Pressable>
              );
            })}

            {frames.length === 0 ? (
              <View style={styles.frameLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            disabled={selectedIndex == null || saving}
            onPress={() => {
              void handleConfirm();
            }}
            style={[
              styles.confirmButton,
              {
                backgroundColor:
                  selectedIndex != null ? colors.primary : theme.muted,
                marginBottom: insets.bottom + 8,
              },
            ]}
          >
            {saving || (loading && selectedIndex == null) ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <ThemedText
                size={15}
                fontWeight="600"
                color={selectedIndex != null ? "#ffffff" : theme.mutedForeground}
              >
                {t("publish.videoFrame.confirm")}
              </ThemedText>
            )}
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default VideoFrameSheet;

const styles = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  frameScroll: {
    flexGrow: 0,
    marginTop: 12,
    // 和底部按钮留出间距，面板高度紧张时也不会贴在一起
    marginBottom: 24,
  },
  frameList: {
    flexDirection: "row",
    alignItems: "center",
    gap: FRAME_GAP,
  },
  frameTile: {
    width: Math.round((FRAME_HEIGHT * 16) / 9),
    height: FRAME_HEIGHT,
    borderRadius: 8,
    borderWidth: 2,
    overflow: "hidden",
  },
  frameImage: {
    width: "100%",
    height: "100%",
  },
  frameLoading: {
    width: FRAME_HEIGHT * 2,
    height: FRAME_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    marginTop: "auto",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
