import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  buildFrameTimes,
  captureVideoFrame,
  extractVideoFrames,
  formatVideoSize,
  formatVideoTime,
  saveVideoFrameImage,
  seekVideoPlayer,
} from "@/lib/video";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import PauseIcon from "@hugeicons/core-free-icons/PauseIcon";
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon";
import Video01Icon from "@hugeicons/core-free-icons/Video01Icon";
import { useEvent, useEventListener } from "expo";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView, type VideoThumbnail } from "expo-video";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
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

export interface VideoEditorSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface VideoEditorSheetProps {
  /** 视频本地 uri（编辑态也可能是远端地址） */
  videoUri: string;
  /** 视频时长（毫秒）；远端视频可能没有，届时从播放器读 */
  duration?: number;
  fileName?: string;
  fileSize?: number;
  /** 确认后的封面：本地图片 uri；null 表示这次没选出封面 */
  onConfirm: (coverUri: string | null) => void;
  onDismiss?: () => void;
}

/** 帧条取几帧：能铺满一屏，又不至于抽太久 */
const FRAME_COUNT = 10;
const FRAME_HEIGHT = 52;
const FRAME_GAP = 6;

interface CoverChoice {
  thumbnail: VideoThumbnail;
  /** 帧条上的索引；null 表示「用当前画面」抓下来的 */
  index: number | null;
}

const VideoEditorSheet = forwardRef<VideoEditorSheetRef, VideoEditorSheetProps>(
  function VideoEditorSheet(
    { videoUri, duration = 0, fileName, fileSize, onConfirm, onDismiss },
    ref,
  ) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const sheetRef = useRef<BottomSheetModal>(null);

    // 面板关闭时整块内容都不挂载：播放器和抽帧都只在打开后才存在，
    // 选完视频不会在后台偷偷解码
    const [open, setOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          setOpen(true);
          sheetRef.current?.present();
        },
        dismiss: () => sheetRef.current?.dismiss(),
      }),
      [],
    );

    const renderBackdrop = useCallback(
      (props: ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    // snapPoints 必须是稳定引用：每次渲染都给新数组，BottomSheet 会重算布局
    const snapPoints = useMemo(
      () => [Math.min(Math.round(windowHeight * 0.86), 760)],
      [windowHeight],
    );

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
          setOpen(false);
          onDismiss?.();
        }}
      >
        <BottomSheetView
          style={[styles.content, { paddingBottom: insets.bottom + 12 }]}
        >
          <View style={styles.header}>
            <ThemedText fontWeight="600" size={16}>
              {t("publish.videoEditor.title")}
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

          {open ? (
            <VideoEditorBody
              videoUri={videoUri}
              fallbackDuration={duration}
              fileName={fileName}
              fileSize={fileSize}
              onDone={(coverUri) => {
                onConfirm(coverUri);
                sheetRef.current?.dismiss();
              }}
            />
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

interface VideoEditorBodyProps {
  videoUri: string;
  /** 毫秒 */
  fallbackDuration: number;
  fileName?: string;
  fileSize?: number;
  onDone: (coverUri: string | null) => void;
}

function VideoEditorBody({
  videoUri,
  fallbackDuration,
  fileName,
  fileSize,
  onDone,
}: VideoEditorBodyProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  // 播放器随内容一起挂载/卸载，expo-video 的 hook 负责释放
  const player = useVideoPlayer(videoUri, (instance) => {
    instance.timeUpdateEventInterval = 0.2;
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const [currentTime, setCurrentTime] = useState(0);
  // 拖动期间暂停把播放进度写回 currentTime：Slider 在 Android 上被
  // 「手指位置」和「受控 value」同时更新时容易抖甚至崩，拖动时让它自己跟手。
  const seekingRef = useRef(false);
  useEventListener(player, "timeUpdate", ({ currentTime: time }) => {
    if (seekingRef.current) return;
    setCurrentTime(time);
  });

  const [frames, setFrames] = useState<VideoThumbnail[]>([]);
  const [framesDone, setFramesDone] = useState(false);
  const [choice, setChoice] = useState<CoverChoice | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);
  // 拖动进度条时用它盖住实时进度，避免手指和播放进度抢滑块
  const [seekValue, setSeekValue] = useState<number | null>(null);

  const isReady = status === "readyToPlay";
  const durationSeconds = player.duration || fallbackDuration / 1000;
  const displayTime = seekValue ?? currentTime;
  // 播放器没就绪、或正在抽帧时先转圈；抽完仍为空才提示取不到
  const framesPending =
    !isReady || (!framesDone && frames.length === 0 && durationSeconds > 0);
  const framesUnavailable = isReady && frames.length === 0 && !framesPending;
  const metaText = [
    durationSeconds > 0 ? formatVideoTime(durationSeconds) : null,
    formatVideoSize(fileSize),
  ]
    .filter(Boolean)
    .join(" · ");

  // 时长一就绪就把整条时间轴的帧铺出来。
  // 用 requestedUriRef 挡住 isReady 抖动：status 在 loading ↔ readyToPlay
  // 之间来回跳时，effect 会重跑，不挡的话就会反复抽帧、反复建播放器。
  const requestedUriRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isReady) return;
    if (requestedUriRef.current === videoUri) return;

    const seconds = player.duration || fallbackDuration / 1000;
    // 拿不到时长就别抽了，界面会退化成「取不出帧」的提示
    if (!(seconds > 0)) return;

    requestedUriRef.current = videoUri;
    let cancelled = false;

    (async () => {
      try {
        // 抽帧时先停住：边播边抓会在部分机型上和视频解码抢资源
        player.pause();
        await extractVideoFrames(player, buildFrameTimes(seconds, FRAME_COUNT), {
          isCancelled: () => cancelled,
          onFrame: (thumbnail) => {
            if (cancelled) return;
            setFrames((prev) => [...prev, thumbnail]);
            // 默认拿第一帧当封面：用户什么都不挑也能有张像样的卡片图
            setChoice((prev) => prev ?? { thumbnail, index: 0 });
          },
        });
      } catch (error) {
        // 抽帧失败通常是编码/机型问题，用户还能退回「用当前画面」
        console.error("Failed to extract video frames:", error);
        // 允许下次 isReady 变化时重试
        requestedUriRef.current = null;
      } finally {
        if (!cancelled) setFramesDone(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fallbackDuration, isReady, player, videoUri]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) player.pause();
    else player.play();
  }, [isPlaying, player]);

  const handleSelectFrame = useCallback(
    (thumbnail: VideoThumbnail, index: number) => {
      setChoice({ thumbnail, index });
    },
    [],
  );

  /** 用预览停住的这一帧当封面 */
  const captureCurrentFrame = useCallback(async () => {
    if (capturing || !isReady) return;
    player.pause();
    setCapturing(true);
    try {
      // 停在片尾时按最后一帧取，MediaMetadataRetriever 越界会直接返回 null
      const time = Math.min(displayTime, Math.max(durationSeconds - 0.05, 0));
      const thumbnail = await captureVideoFrame(player, time);
      if (thumbnail) setChoice({ thumbnail, index: null });
    } catch (error) {
      console.error("Failed to capture current frame:", error);
    } finally {
      setCapturing(false);
    }
  }, [capturing, displayTime, durationSeconds, isReady, player]);

  const handleDone = useCallback(async () => {
    if (saving) return;
    if (!choice) {
      onDone(null);
      return;
    }

    player.pause();
    setSaving(true);
    try {
      const coverUri = await saveVideoFrameImage(choice.thumbnail);
      onDone(coverUri);
    } catch (error) {
      console.error("Failed to save video cover frame:", error);
      onDone(null);
    } finally {
      setSaving(false);
    }
  }, [choice, onDone, player, saving]);

  return (
    <>
      <View style={styles.stage}>
        <VideoView
          player={player}
          style={styles.stageVideo}
          contentFit="contain"
          nativeControls={false}
          // SurfaceView 会盖在同层视图之上（圆角、播放按钮、进度条都会被压住），
          // 面板里必须用 TextureView
          surfaceType="textureView"
        />
        <Pressable
          accessibilityRole="button"
          onPress={togglePlayback}
          style={styles.stagePlay}
          hitSlop={12}
        >
          <HugeIcon
            icon={isPlaying ? PauseIcon : PlayIcon}
            size={22}
            color="#ffffff"
            fill="#ffffff"
          />
        </Pressable>
        {status === "loading" || status === "idle" ? (
          <View style={styles.stageLoading} pointerEvents="none">
            <ActivityIndicator color="#ffffff" size="small" />
          </View>
        ) : null}
        {status === "error" ? (
          <View style={styles.stageLoading} pointerEvents="none">
            <ThemedText size={12} color="#ffffff">
              {t("publish.videoEditor.loadFailed")}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.timeRow}>
        <ThemedText size={11} color={theme.mutedForeground}>
          {formatVideoTime(displayTime)}
        </ThemedText>
        <Slider
          style={styles.seekbar}
          minimumValue={0}
          maximumValue={Math.max(durationSeconds, 1)}
          // 传 currentTime 而不是 displayTime：拖动时 currentTime 被冻结，
          // Slider 不会被 JS 侧的 value 拽回去
          value={currentTime}
          disabled={!isReady}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={theme.mutedForeground + "55"}
          thumbTintColor={colors.primary}
          onSlidingStart={() => {
            seekingRef.current = true;
          }}
          onValueChange={setSeekValue}
          onSlidingComplete={(value) => {
            seekVideoPlayer(player, value);
            seekingRef.current = false;
            setCurrentTime(value);
            setSeekValue(null);
          }}
        />
        <ThemedText size={11} color={theme.mutedForeground}>
          {isReady ? formatVideoTime(durationSeconds) : "--:--"}
        </ThemedText>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText size={13} fontWeight="600">
          {t("publish.videoEditor.coverTitle")}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          hitSlop={6}
          disabled={!isReady || capturing}
          onPress={() => {
            void captureCurrentFrame();
          }}
          style={styles.currentAction}
        >
          {capturing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View style={styles.currentActionInner}>
              {/* 帧条上没高亮时，说明当前选的是「当前画面」 */}
              {choice?.index === null ? (
                <HugeIcon
                  icon={CheckmarkCircle02Icon}
                  size={13}
                  color={colors.primary}
                />
              ) : null}
              <ThemedText size={12} color={colors.primary}>
                {t("publish.videoEditor.useCurrent")}
              </ThemedText>
            </View>
          )}
        </Pressable>
      </View>

      {/* 横向手势归 ScrollView，用 BottomSheetScrollView 会被面板拖拽抢走 */}
      <FrameStrip
        frames={frames}
        activeIndex={choice?.index ?? null}
        unavailable={framesUnavailable}
        onSelect={handleSelectFrame}
      />

      <View style={styles.metaRow}>
        <HugeIcon icon={Video01Icon} size={14} color={theme.mutedForeground} />
        <ThemedText
          size={11}
          color={theme.mutedForeground}
          numberOfLines={1}
          style={styles.flex}
        >
          {[fileName, metaText].filter(Boolean).join(" · ")}
        </ThemedText>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={saving}
        onPress={() => {
          void handleDone();
        }}
        style={[styles.confirmButton, { backgroundColor: colors.primary }]}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <ThemedText size={15} fontWeight="600" color="#ffffff">
            {t("publish.videoEditor.confirm")}
          </ThemedText>
        )}
      </Pressable>

      <ThemedText
        size={11}
        color={theme.mutedForeground}
        style={styles.footnote}
      >
        {t("publish.videoEditor.hint")}
      </ThemedText>
    </>
  );
}

/**
 * 帧条单独 memo：播放时 timeUpdate 每 0.2s 触发一次父组件重渲染，
 * 不隔离的话 10 张缩略图会被反复 diff，低端机上容易掉帧。
 */
const FrameStrip = memo(function FrameStrip({
  frames,
  activeIndex,
  unavailable,
  onSelect,
}: {
  frames: VideoThumbnail[];
  activeIndex: number | null;
  unavailable: boolean;
  onSelect: (thumbnail: VideoThumbnail, index: number) => void;
}) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.frameList}
      style={styles.frameScroll}
    >
      {frames.map((thumbnail, index) => {
        const active = activeIndex === index;
        return (
          <Pressable
            key={`${String(thumbnail.requestedTime ?? index)}-${index}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(thumbnail, index)}
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
            {active ? (
              <View style={styles.frameCheck}>
                <HugeIcon
                  icon={CheckmarkCircle02Icon}
                  size={16}
                  color={colors.primary}
                />
              </View>
            ) : null}
          </Pressable>
        );
      })}

      {frames.length === 0 ? (
        <View style={styles.framePlaceholder}>
          {unavailable ? (
            <ThemedText size={11} color={theme.mutedForeground}>
              {t("publish.videoEditor.framesFailed")}
            </ThemedText>
          ) : (
            <ActivityIndicator color={colors.primary} size="small" />
          )}
        </View>
      ) : null}
    </ScrollView>
  );
});

export default VideoEditorSheet;

const styles = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  /** 预览区：16:9 黑底，视频按 contain 放进画面 */
  stage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000000",
    marginTop: 4,
  },
  stageVideo: {
    width: "100%",
    height: "100%",
  },
  stagePlay: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },
  stageLoading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  seekbar: {
    flex: 1,
    height: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  currentAction: {
    minWidth: 72,
    alignItems: "flex-end",
  },
  currentActionInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  frameScroll: {
    flexGrow: 0,
    marginTop: 10,
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
  frameCheck: {
    position: "absolute",
    right: 2,
    bottom: 2,
  },
  framePlaceholder: {
    minWidth: 200,
    height: FRAME_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  confirmButton: {
    marginTop: "auto",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footnote: {
    marginTop: 8,
    textAlign: "center",
  },
});
