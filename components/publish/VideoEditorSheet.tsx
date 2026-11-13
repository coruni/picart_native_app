import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  buildFrameTimes,
  captureVideoFrame,
  formatVideoSize,
  formatVideoTime,
  saveVideoFrameImage,
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
import RotateCcwIcon from "@hugeicons/core-free-icons/RotateCcwIcon";
import Video01Icon from "@hugeicons/core-free-icons/Video01Icon";
import { Image } from "expo-image";
import {
  useVideoPlayer,
  VideoView,
  type VideoPlayer,
  type VideoThumbnail,
} from "expo-video";
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
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Video, {
  ViewType,
  type OnBufferData,
  type OnLoadData,
  type OnProgressData,
  type OnVideoErrorData,
  type VideoRef,
} from "react-native-video";
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

/** Promise 超时兜底：超时就当拿不到，绝不让 UI 一直转圈 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
    );
  });
}

/** 从已抽好的帧里挑最接近目标时间的一帧 */
function nearestFrame(
  frames: VideoThumbnail[],
  seconds: number,
): VideoThumbnail | null {
  let best: VideoThumbnail | null = null;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const frame of frames) {
    const diff = Math.abs((frame.requestedTime ?? 0) - seconds);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = frame;
    }
  }
  return best;
}

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
        // 内容区不接管拖拽：里面的进度条是原生 SeekBar，面板的 pan 手势会把
        // 横向拖动判成「下拉关闭」，表现就是拇指刚碰到进度条面板就跟着走、
        // 或者进度条根本拖不动。关闭内容手势后，拖动进度条、横滑帧条都归控件自己，
        // 面板仍可通过顶部把手拖动关闭，遮罩点击与右上角关闭按钮不受影响。
        enableContentPanningGesture={false}
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

/**
 * 视频编辑器主体。
 *
 * 播放用 `react-native-video`，只有 `paused` 一个开关：
 * 之前用 expo-video 的 `player.play()`，在部分 ROM 上起播后立刻被原生层
 * pause（音频焦点申请失败就会这样），JS 侧完全拦不住 —— 试过
 * audioMixingMode 的 auto / duckOthers / mixWithOthers、切后台再回前台、
 * 去掉 VideoView 单独跑，全都在 play 之后 0.1~0.3 秒被按掉。
 * 换 react-native-video 后播放状态完全由 `paused` 决定，不再有这种自愈需求。
 *
 * 抽帧仍用 expo-video：它的 `generateThumbnailsAsync` 好用，而且这个实例
 * 只取帧、从不播放，不会碰到上面那个问题。
 */
function VideoEditorBody({
  videoUri,
  fallbackDuration,
  fileName,
  fileSize,
  onDone,
}: VideoEditorBodyProps) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  const videoRef = useRef<VideoRef>(null);

  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  /** 播放器报的时长（秒），比外面传进来的毫秒值更可信 */
  const [mediaDuration, setMediaDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // 拖动进度条期间冻结播放进度回写，否则滑块会被 JS 拽回去
  const seekingRef = useRef(false);
  const [seekValue, setSeekValue] = useState<number | null>(null);
  const wasPlayingRef = useRef(false);
  // 文案只精确到秒，整秒没变就不 setState
  const labelSecondRef = useRef(-1);

  // 抽帧专用播放器：只调 generateThumbnailsAsync，永远不 play
  const thumbPlayer = useVideoPlayer(videoUri, (instance) => {
    instance.muted = true;
  });
  const [frames, setFrames] = useState<VideoThumbnail[]>([]);
  const [framesDone, setFramesDone] = useState(false);
  /** 抽帧完成后才挂播放器：两个播放器同时解同一份视频会让 expo 抽帧挂死 */
  const [playerVisible, setPlayerVisible] = useState(false);
  /** 帧的镜像，避免把 frames 塞进 captureAt 的依赖里 */
  const framesRef = useRef<VideoThumbnail[]>([]);
  const [choice, setChoice] = useState<CoverChoice | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);

  const durationSeconds = mediaDuration || fallbackDuration / 1000;
  const displayTime = seekValue ?? currentTime;

  const handleLoad = useCallback((event: OnLoadData) => {
    setMediaDuration(event.duration || 0);
    setLoaded(true);
    setFailed(false);
  }, []);

  const handleProgress = useCallback((event: OnProgressData) => {
    if (seekingRef.current) return;
    setCurrentTime(event.currentTime || 0);
  }, []);

  const handleBuffer = useCallback((_event: OnBufferData) => {
    // 缓冲交给原生播放器自己转圈，这里不做任何状态切换，
    // 否则 seek 时 onBuffer 一来一回会让遮罩闪一下
  }, []);

  const handleError = useCallback((_event: OnVideoErrorData) => {
    setFailed(true);
    setLoaded(false);
  }, []);

  const handleEnd = useCallback(() => {
    seekingRef.current = false;
    setSeekValue(null);
    setPaused(true);
    setEnded(true);
    setCurrentTime(durationSeconds);
  }, [durationSeconds]);

  /** 定位到某一秒：拖动松手、点帧条都走这里 */
  const seekTo = useCallback((seconds: number) => {
    const target = Math.max(seconds, 0);
    videoRef.current?.seek(target);
    setCurrentTime(target);
    setEnded(false);
  }, []);

  const togglePlayback = useCallback(() => {
    // 停在片尾时先回卷，否则 paused=false 也是原地不动
    if (ended) {
      videoRef.current?.seek(0);
      setCurrentTime(0);
      setEnded(false);
      setPaused(false);
      return;
    }
    setPaused((prev) => !prev);
  }, [ended]);

  // 连续拖动时只认最后一次抓帧，避免先回来的旧帧覆盖新选择
  const captureSeqRef = useRef(0);

  /** 抓指定秒数的帧并选中：拖动进度条、点「用当前画面」都走这里 */
  const captureAt = useCallback(
    async (seconds: number) => {
      const seq = ++captureSeqRef.current;
      setCapturing(true);
      try {
        // 停在片尾时按最后一帧取，MediaMetadataRetriever 越界会直接返回 null
        const time = Math.min(
          Math.max(seconds, 0),
          Math.max(durationSeconds - 0.05, 0),
        );
        // 播放器在跑的时候抓帧可能不返回，超时就用已抽好的最近一帧顶上
        const grabbed = await withTimeout(
          captureVideoFrame(thumbPlayer, time),
          1500,
        );
        const thumbnail = grabbed ?? nearestFrame(framesRef.current, time);
        if (!thumbnail || seq !== captureSeqRef.current) return;
        // index 为 null 表示「自由选帧」，帧条上不高亮任何一格
        setChoice({ thumbnail, index: null });
      } finally {
        if (seq === captureSeqRef.current) setCapturing(false);
      }
    },
    [durationSeconds, thumbPlayer],
  );

  /** 用预览停住的这一帧当封面 */
  const captureCurrentFrame = useCallback(() => {
    if (capturing) return;
    setPaused(true);
    void captureAt(currentTime);
  }, [captureAt, capturing, currentTime]);

  // scheduleCapture 定义在后面，用 ref 让松手回调拿到最新实现
  const scheduleCaptureRef = useRef<((seconds: number) => void) | null>(null);

  const handleSelectFrame = useCallback(
    (thumbnail: VideoThumbnail, index: number) => {
      // 点缩略图要把预览一起挪过去，否则选中的帧和画面对不上，
      // 用户看不出自己到底选了哪一帧
      setPaused(true);
      seekTo(thumbnail.requestedTime ?? 0);
      setChoice({ thumbnail, index });
    },
    [seekTo],
  );

  // 松手后延迟 120ms 抓帧：连续拖两下只取最后一次，
  // 也避免两帧同时在解码器里解（4K 视频很容易吃满内存）
  const scrubCaptureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const clearScrubCapture = useCallback(() => {
    if (scrubCaptureTimerRef.current) {
      clearTimeout(scrubCaptureTimerRef.current);
      scrubCaptureTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearScrubCapture, [clearScrubCapture]);

  const scheduleCapture = useCallback(
    (value: number) => {
      clearScrubCapture();
      scrubCaptureTimerRef.current = setTimeout(() => {
        scrubCaptureTimerRef.current = null;
        void captureAt(value);
      }, 120);
    },
    [captureAt, clearScrubCapture],
  );

  useEffect(() => {
    scheduleCaptureRef.current = scheduleCapture;
  }, [scheduleCapture]);

  // 拿到时长就把整条时间轴的帧铺出来。
  //
  // 这里刻意不等抽帧播放器的 status：它没挂 VideoView，不会去 prepare 画面，
  // status 可能一直停在 loading，拿它当门槛会一帧都抽不出来。
  // generateThumbnailsAsync 只要求 player 有 source，所以直接抽、失败就等一拍重试。
  const requestedUriRef = useRef<string | null>(null);
  useEffect(() => {
    if (requestedUriRef.current === videoUri) return;

    const seconds = durationSeconds;
    // 拿不到时长就别抽了，界面会退化成「取不出帧」的提示
    if (!(seconds > 0)) return;

    requestedUriRef.current = videoUri;
    let cancelled = false;
    const times = buildFrameTimes(seconds, FRAME_COUNT);

    (async () => {
      for (const time of times) {
        if (cancelled) return;
        // 每帧都要有超时兜底：抽帧调用偶尔会永远不返回
        const thumbnail = await withTimeout(
          captureVideoFrame(thumbPlayer, time),
          2000,
        );
        if (!thumbnail || cancelled) continue;
        framesRef.current = [...framesRef.current, thumbnail];
        setFrames((prev) => [...prev, thumbnail]);
        // 默认拿第一帧当封面：用户什么都不挑也能有张像样的卡片图
        setChoice((prev) => prev ?? { thumbnail, index: 0 });
      }

      if (cancelled) return;
      setFramesDone(true);
      // 帧抽完才把播放器挂上来
      setPlayerVisible(true);
    })();

    return () => {
      cancelled = true;
    };
    // 注意：不要把抽帧播放器的 status 放进依赖。抽帧途中状态一旦从 loading
    // 变成 readyToPlay，effect 就会 cleanup（cancelled = true），抽到一半直接断掉，
    // 而重启又被 requestedUriRef 挡住 —— 表现就是「只有一两帧，再也不动了」。
  }, [durationSeconds, thumbPlayer, videoUri]);

  // 抽帧再慢也不能一直占着预览区：到点就把播放器挂上来
  useEffect(() => {
    if (playerVisible) return;
    const timer = setTimeout(() => setPlayerVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [playerVisible]);

  const handleDone = useCallback(async () => {
    if (saving) return;
    // 还没落地的拖动抓帧不要了，否则它可能在保存后覆盖 choice
    clearScrubCapture();
    if (!choice) {
      onDone(null);
      return;
    }

    setPaused(true);
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
  }, [choice, clearScrubCapture, onDone, saving]);

  const framesUnavailable = frames.length === 0 && framesDone;
  const metaText = [
    durationSeconds > 0 ? formatVideoTime(durationSeconds) : null,
    formatVideoSize(fileSize),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <VideoStage
        videoRef={videoRef}
        thumbPlayer={thumbPlayer}
        videoUri={videoUri}
        playerVisible={playerVisible}
        poster={frames[0] ?? null}
        framesDone={framesDone}
        paused={paused}
        ended={ended}
        loaded={loaded}
        failed={failed}
        onToggle={togglePlayback}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onBuffer={handleBuffer}
        onError={handleError}
        onEnd={handleEnd}
      />

      <View style={styles.timeRow}>
        <ThemedText size={11} color={theme.mutedForeground}>
          {formatVideoTime(displayTime)}
        </ThemedText>
        <Slider
          style={styles.seekbar}
          minimumValue={0}
          maximumValue={Math.max(durationSeconds, 1)}
          value={displayTime}
          disabled={!(durationSeconds > 0)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={theme.mutedForeground + "55"}
          thumbTintColor={colors.primary}
          onSlidingStart={() => {
            seekingRef.current = true;
            labelSecondRef.current = -1;
            // 拖动前记下播放状态，松手后恢复，否则拖一下就再也播不动
            wasPlayingRef.current = !paused && !ended;
            if (!paused) setPaused(true);
          }}
          onValueChange={(value) => {
            const second = Math.floor(value);
            if (second === labelSecondRef.current) return;
            labelSecondRef.current = second;
            setSeekValue(value);
          }}
          onSlidingComplete={(value) => {
            // 只在松手时定位：拖动过程中反复 seek 会让解码器不断 flush，
            // 画面上就是「一下黑一下亮」的闪烁
            seekingRef.current = false;
            setSeekValue(null);
            seekTo(value);
            if (wasPlayingRef.current) setPaused(false);
            wasPlayingRef.current = false;
            scheduleCaptureRef.current?.(value);
          }}
        />
        <ThemedText size={11} color={theme.mutedForeground}>
          {durationSeconds > 0 ? formatVideoTime(durationSeconds) : "--:--"}
        </ThemedText>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText size={13} fontWeight="600">
          {t("publish.videoEditor.coverTitle")}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          hitSlop={6}
          disabled={capturing}
          onPress={captureCurrentFrame}
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

/** 预览区圆角半径：必须与 styles.stage 的 borderRadius 一致 */
const STAGE_RADIUS = 12;

/**
 * 圆角遮罩路径：「外层矩形」+「内层圆角矩形」，配合 fillRule="evenodd"
 * 只会填充两者的差集 —— 也就是四个角上那四小块弧形三角。
 *
 * 为什么需要它：react-native-video 的 TextureView 不吃父层的 overflow:hidden，
 * 视频画面会把四个直角盖到圆角外面去。普通 View 拼不出弧形三角（borderRadius
 * 只能裁掉圆角、留不出圆角外的形状），只能用 path 精确画出来。
 */
function buildCornerMaskPath(width: number, height: number, radius: number) {
  // 尺寸比圆角还小时直接铺满，宁可方角也不要画出错位的弧
  if (width < radius * 2 || height < radius * 2) {
    return `M0,0 H${width} V${height} H0 Z`;
  }
  const r = radius;
  return [
    // 外矩形（顺时针）
    `M0,0 H${width} V${height} H0 Z`,
    // 内圆角矩形（顺时针）
    `M${r},0 H${width - r}`,
    `A${r},${r} 0 0 1 ${width},${r}`,
    `V${height - r}`,
    `A${r},${r} 0 0 1 ${width - r},${height}`,
    `H${r}`,
    `A${r},${r} 0 0 1 0,${height - r}`,
    `V${r}`,
    `A${r},${r} 0 0 1 ${r},0 Z`,
  ].join(" ");
}

/**
 * 预览区单独 memo。
 *
 * 播放时 onProgress 每 0.2 秒让父组件重渲染一次，这里隔离开：
 * `paused` / `loaded` 这些 prop 不变时 Video 不会收到原生 props 更新，
 * 播放不会被打断。
 */
const VideoStage = memo(function VideoStage({
  videoRef,
  thumbPlayer,
  videoUri,
  playerVisible,
  poster,
  framesDone,
  paused,
  ended,
  loaded,
  failed,
  onToggle,
  onLoad,
  onProgress,
  onBuffer,
  onError,
  onEnd,
}: {
  videoRef: React.RefObject<VideoRef | null>;
  /** 抽帧用播放器，只借它渲染一个隐藏 surface */
  thumbPlayer: VideoPlayer;
  videoUri: string;
  /** 抽帧完成后才挂播放器，之前先用首帧占位 */
  playerVisible: boolean;
  poster: VideoThumbnail | null;
  /** 抽帧用 surface 只在抽帧期间存在 */
  framesDone: boolean;
  paused: boolean;
  ended: boolean;
  loaded: boolean;
  failed: boolean;
  onToggle: () => void;
  onLoad: (event: OnLoadData) => void;
  onProgress: (event: OnProgressData) => void;
  onBuffer: (event: OnBufferData) => void;
  onError: (event: OnVideoErrorData) => void;
  onEnd: () => void;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // 遮罩要按预览区的真实尺寸画；只有尺寸变化时才更新，避免多余重渲染
  const [maskSize, setMaskSize] = useState({ width: 0, height: 0 });
  const handleStageLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMaskSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  return (
    <View style={styles.stageWrap} onLayout={handleStageLayout}>
      <View style={styles.stage}>
        {playerVisible ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.stageVideo}
            resizeMode="contain"
            paused={paused}
            controls={false}
            repeat={false}
            // 面板里必须用 TextureView：SurfaceView 会盖在同层视图之上
            // （圆角、播放按钮、进度条都会被压住）
            viewType={ViewType.TEXTURE}
            progressUpdateInterval={200}
            onLoad={onLoad}
            onProgress={onProgress}
            onBuffer={onBuffer}
            onError={onError}
            onEnd={onEnd}
          />
        ) : poster ? (
          <Image source={poster} style={styles.stageVideo} contentFit="contain" />
        ) : null}

        {/* 抽帧用 surface：只在抽帧阶段存在。
            抽完就卸载，否则这个整块大小的原生视频视图会吃掉预览区的点击 */}
        {!framesDone ? (
          <VideoView
            player={thumbPlayer}
            style={styles.thumbSurface}
            nativeControls={false}
            contentFit="contain"
            surfaceType="textureView"
            pointerEvents="none"
          />
        ) : null}

        <View style={styles.stagePlay} pointerEvents="none">
          <HugeIcon
            icon={ended ? RotateCcwIcon : paused ? PlayIcon : PauseIcon}
            size={22}
            color="#ffffff"
            fill="#ffffff"
          />
        </View>

        {failed ? (
          <View style={styles.stageLoading} pointerEvents="none">
            <ThemedText size={12} color="#ffffff">
              {t("publish.videoEditor.loadFailed")}
            </ThemedText>
          </View>
        ) : null}
        {!failed && !loaded ? (
          <View style={styles.stageLoading} pointerEvents="none">
            <ActivityIndicator color="#ffffff" size="small" />
          </View>
        ) : null}
      </View>

      {/* 四角遮罩：盖住 TextureView 溢出的直角。
          必须放在 stage 外面 —— stage 自己的 overflow:hidden 会把它一起裁掉，
          这正是上一版圆角没生效的原因 */}
      {maskSize.width > 0 ? (
        <Svg
          style={StyleSheet.absoluteFill}
          width={maskSize.width}
          height={maskSize.height}
          pointerEvents="none"
        >
          <Path
            d={buildCornerMaskPath(maskSize.width, maskSize.height, STAGE_RADIUS)}
            fill={theme.card}
            fillRule="evenodd"
          />
        </Svg>
      ) : null}

      {/* 整块预览区都可点：小圆钮的触摸区在部分机型上不容易命中。
          必须放在最后，保证它在所有浮层之上 */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("publish.videoEditor.previewToggle")}
        onPress={onToggle}
        style={styles.stageTap}
      />
    </View>
  );
});

/**
 * 帧条单独 memo：播放时 onProgress 每 0.2s 触发一次父组件重渲染，
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
  /** 预览区外层：16:9 定尺寸，本身不裁剪，圆角遮罩要盖在这一层上 */
  stageWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginTop: 4,
  },
  /** 预览区：黑底 + 圆角。对普通视图（占位图、加载态）裁剪有效 */
  stage: {
    width: "100%",
    height: "100%",
    borderRadius: STAGE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  stageVideo: {
    width: "100%",
    height: "100%",
    // TextureView 不吃父层裁剪，这行对视频无效（圆角由 SVG 遮罩负责），
    // 保留是为了让占位图和视频的底色一致
    backgroundColor: "transparent",
  },
  /**
   * 抽帧 surface：必须垫成整块大小。
   * 缩成 1x1 时 expo 的 generateThumbnailsAsync 抽到第二帧就不再返回（挂死），
   * 尺寸给足后能稳定抽满整条时间轴。它全程 opacity 0，只做取帧用。
   */
  thumbSurface: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  /** 盖满预览区的点击层：点哪里都能播放/暂停 */
  stageTap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
