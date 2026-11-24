import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import Slider from "@react-native-community/slider";
import { useIsFocused } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import Maximize01Icon from "@hugeicons/core-free-icons/Maximize01Icon";
import Minimize01Icon from "@hugeicons/core-free-icons/Minimize01Icon";
import PauseIcon from "@hugeicons/core-free-icons/PauseIcon";
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon";
import RotateCcwIcon from "@hugeicons/core-free-icons/RotateCcwIcon";
import HugeIcon from "@/components/ui/HugeIcon";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Video, {
  type OnLoadData,
  type OnProgressData,
  type VideoRef,
} from "react-native-video";

type ArticleVideoPlayerProps = {
  videoUrl?: string | null;
  cover?: string | ImageData | null;
};

function formatTime(value: number): string {
  const totalSeconds = Math.max(Math.floor(value || 0), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// 进度条分 1000 档：原生 SeekBar 默认只切 128 档，长视频上一档好几秒，播放时看到的就是「一卡一卡」，档位加密后每帧都有位移，和底部细进度条一致
const SEEK_STEPS = 1000;

function ArticleVideoPlayer({ videoUrl, cover }: ArticleVideoPlayerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const videoRef = useRef<VideoRef>(null);
  /** 最新进度的镜像，供事件回调读取，避免闭包拿到旧值 */
  const displayTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const progressAnimationFrameRef = useRef<number | null>(null);
  const lastProgressTimeRef = useRef(0);
  const lastProgressTimestampRef = useRef(0);
  const initialOrientationLockRef =
    useRef<ScreenOrientation.OrientationLock | null>(null);
  const [duration, setDuration] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [fullscreenOrientation, setFullscreenOrientation] = useState<
    "landscape" | "portrait"
  >("portrait");
  const [inlineControlsVisible, setInlineControlsVisible] = useState(false);
  const [fullscreenControlsVisible, setFullscreenControlsVisible] =
    useState(true);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [stableFullscreenTopInset] = useState(() => insets.top);
  /** 全屏控件（顶栏 / 播放按钮 / 底栏）的统一显隐透明度，淡入淡出都走它 */
  const [chromeOpacity] = useState(() => new Animated.Value(1));
  // 追踪视频是否已加载完成
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // 追踪视频是否处于缓冲状态
  const [isBuffering, setIsBuffering] = useState(false);
  // 追踪视频是否播放完成（用于显示重播按钮）
  const [isEnded, setIsEnded] = useState(false);

  // 离开页面（push 评论详情等）自动暂停，回来自动续播
  const shouldBePaused = paused || !isFocused;

  const coverUrl = useMemo(() => getImageUrl(cover, "large"), [cover]);
  const progress = duration > 0 ? Math.min(displayTime / duration, 1) : 0;
  const isFullscreenLandscape = fullscreenOrientation === "landscape";
  // 横屏时状态栏仍然占着顶部（沉浸是否生效跟 Modal / 机型有关），不能把 top 抹成 0，否则返回按钮直接顶进状态栏。
  const fullscreenTopInset = Math.max(
    insets.top,
    stableFullscreenTopInset,
    12,
  );
  // 横屏的挖孔 / 侧边手势条都在左右两侧，水平方向也要避开
  const fullscreenSideInset = isFullscreenLandscape
    ? Math.max(insets.left, insets.right)
    : 0;
  const fullscreenBottomInset = isFullscreenLandscape ? 0 : insets.bottom;
  const fullscreenTopHeight = fullscreenTopInset + 52;
  const fullscreenBottomHeight = fullscreenBottomInset + 56;

  // 事件回调里要读到最新进度（进出全屏要做进度交接），走 ref 免得闭包拿旧值
  useEffect(() => {
    displayTimeRef.current = displayTime;
  }, [displayTime]);

  // 全屏控件整组淡入淡出：顶栏（返回）、中心播放键、底栏共用一个透明度，隐藏时再关掉 pointerEvents，避免透明按钮仍然吃点击。
  useEffect(() => {
    Animated.timing(chromeOpacity, {
      toValue: fullscreenControlsVisible ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [chromeOpacity, fullscreenControlsVisible]);

  const clearProgressAnimation = useCallback(() => {
    if (progressAnimationFrameRef.current !== null) {
      cancelAnimationFrame(progressAnimationFrameRef.current);
      progressAnimationFrameRef.current = null;
    }
  }, []);

  const handleLoad = useCallback((event: OnLoadData) => {
    setDuration(event.duration || 0);
    setIsVideoLoaded(true);
    setIsBuffering(false);
    const { width, height, orientation } = event.naturalSize;
    const isLandscape =
      orientation === "landscape" ||
      (width > 0 && height > 0 && width > height);
    setFullscreenOrientation(isLandscape ? "landscape" : "portrait");
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsVideoLoaded(false);
    setIsBuffering(true);
    setIsEnded(false);
    setInlineControlsVisible(true);
  }, []);

  const handleProgress = useCallback((event: OnProgressData) => {
    if (!isSeekingRef.current && event.currentTime !== undefined) {
      const nextTime = event.currentTime || 0;
      lastProgressTimeRef.current = nextTime;
      lastProgressTimestampRef.current = Date.now();
      setDisplayTime(nextTime);
      // 如果有有效的进度数据，认为视频正在播放
      setIsBuffering(false);
    }
  }, []);

  const handleBuffer = useCallback((event: { isBuffering: boolean }) => {
    setIsBuffering(event.isBuffering);
  }, []);

  const lockFullscreenOrientation = useCallback(async () => {
    try {
      initialOrientationLockRef.current ??=
        await ScreenOrientation.getOrientationLockAsync();
      await ScreenOrientation.lockAsync(
        isFullscreenLandscape
          ? ScreenOrientation.OrientationLock.LANDSCAPE
          : ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    } catch {
      initialOrientationLockRef.current = null;
    }
  }, [isFullscreenLandscape]);

  const restoreOrientationLock = useCallback(async () => {
    const initialOrientationLock = initialOrientationLockRef.current;
    initialOrientationLockRef.current = null;

    try {
      if (initialOrientationLock != null) {
        await ScreenOrientation.lockAsync(initialOrientationLock);
      } else {
        await ScreenOrientation.unlockAsync();
      }
    } catch {
      try {
        await ScreenOrientation.unlockAsync();
      } catch {
        // Some devices reject orientation changes while fullscreen is closing.
      }
    }
  }, []);

  const handleEnterFullscreen = useCallback(async () => {
    // 原生全屏 Dialog 负责显示画面（同一个播放实例，不重新加载），控件层等 Dialog 真正展示出来再开（见 handleFullscreenDidPresent）
    await lockFullscreenOrientation();
    videoRef.current?.presentFullscreenPlayer();
  }, [lockFullscreenOrientation]);

  /** 原生全屏 Dialog 已经显示：这时再开透明的控件层，层级才在它上面 */
  const handleFullscreenDidPresent = useCallback(() => {
    setFullscreenControlsVisible(true);
    // 上一次在全屏里把控件关掉后透明度可能是 0，进全屏先归位
    chromeOpacity.setValue(1);
    setFullscreen(true);
  }, [chromeOpacity]);

  const handleExitFullscreen = useCallback(() => {
    setFullscreen(false);
    videoRef.current?.dismissFullscreenPlayer();
  }, []);

  /** 原生 Dialog 关闭（自己按返回键 / 我们的按钮都走这里）：同步收起控件层并还方向 */
  const handleFullscreenWillDismiss = useCallback(() => {
    setFullscreen(false);
    void restoreOrientationLock();
  }, [restoreOrientationLock]);

  const handleTogglePlayback = useCallback(() => {
    setPaused((value) => {
      if (value) {
        lastProgressTimeRef.current = displayTime;
        lastProgressTimestampRef.current = Date.now();
      }
      return !value;
    });
  }, [displayTime]);

  const handleEnd = useCallback(() => {
    clearProgressAnimation();
    isSeekingRef.current = false;
    lastProgressTimeRef.current = duration;
    lastProgressTimestampRef.current = Date.now();
    setDisplayTime(duration);
    setPaused(true);
    setIsEnded(true);
  }, [clearProgressAnimation, duration]);

  const handleReplay = useCallback(() => {
    setIsEnded(false);
    isSeekingRef.current = false;
    lastProgressTimeRef.current = 0;
    lastProgressTimestampRef.current = Date.now();
    setDisplayTime(0);
    // 全屏用的是同一个实例，直接 seek 即可
    videoRef.current?.seek(0);
    setPaused(false);
  }, []);

  const handleSeekStart = useCallback(() => {
    clearProgressAnimation();
    isSeekingRef.current = true;
  }, [clearProgressAnimation]);

  const handleSeekChange = useCallback((value: number) => {
    setDisplayTime(value);
  }, []);

  const handleSeekComplete = useCallback((value: number) => {
    isSeekingRef.current = false;
    lastProgressTimeRef.current = value;
    lastProgressTimestampRef.current = Date.now();
    setDisplayTime(value);
    setIsEnded(false);
    videoRef.current?.seek(value);
  }, []);

  useEffect(() => {
    clearProgressAnimation();

    // 只有视频加载完成、没有暂停、没有拖动进度、没有缓冲时才运行进度动画
    if (
      !isVideoLoaded ||
      shouldBePaused ||
      isSeekingRef.current ||
      duration <= 0 ||
      isBuffering
    ) {
      return;
    }

    // 从当前显示进度重新起算：暂停 / 离开页面期间 onProgress 不再回调，不重置基准的话回来第一帧会把这段空档一次性算进进度，画面直接跳一段
    lastProgressTimeRef.current = displayTimeRef.current;
    lastProgressTimestampRef.current = Date.now();

    const tick = () => {
      // 在每一帧检查状态
      if (
        !isVideoLoaded ||
        shouldBePaused ||
        isSeekingRef.current ||
        isBuffering
      ) {
        progressAnimationFrameRef.current = null;
        return;
      }

      const elapsedSeconds = Math.max(
        0,
        (Date.now() - lastProgressTimestampRef.current) / 1000,
      );
      const nextDisplayTime = Math.min(
        duration,
        lastProgressTimeRef.current + elapsedSeconds,
      );

      // 确保进度不会超过当前缓冲位置（如果已知）
      setDisplayTime((current) =>
        Math.abs(current - nextDisplayTime) < 0.016 ? current : nextDisplayTime,
      );

      progressAnimationFrameRef.current = requestAnimationFrame(tick);
    };

    progressAnimationFrameRef.current = requestAnimationFrame(tick);

    return clearProgressAnimation;
  }, [
    clearProgressAnimation,
    duration,
    shouldBePaused,
    isVideoLoaded,
    isBuffering,
  ]);

  const renderSeekbar = () => {
    const seekbarMax = Math.max(duration, 1);
    return (
      <Slider
        style={styles.seekSlider}
        minimumValue={0}
        maximumValue={seekbarMax}
        step={seekbarMax / SEEK_STEPS}
        value={Math.min(displayTime, duration || 0)}
        disabled={!duration || !isVideoLoaded}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor="rgba(255,255,255,0.72)"
        thumbTintColor="white"
        onSlidingStart={handleSeekStart}
        onValueChange={handleSeekChange}
        onSlidingComplete={handleSeekComplete}
      />
    );
  };

  const renderBottomControls = (isFullscreenView: boolean) => (
    <View
      style={[
        isFullscreenView ? styles.fullscreenControlBar : styles.controlBar,
        isFullscreenView
          ? {
              height: fullscreenBottomHeight,
              paddingBottom: fullscreenBottomInset + 8,
              paddingLeft: 18 + fullscreenSideInset,
              paddingRight: 18 + fullscreenSideInset,
            }
          : { paddingBottom: 12 },
      ]}
    >
      <ThemedText
        size={isFullscreenView ? 15 : 16}
        color="white"
        style={styles.timeText}
      >
        {formatTime(displayTime)}
      </ThemedText>
      {renderSeekbar()}
      <ThemedText
        size={isFullscreenView ? 15 : 16}
        color="white"
        style={styles.timeText}
      >
        {isVideoLoaded ? formatTime(duration) : "--:--"}
      </ThemedText>
      <Pressable
        style={styles.fullscreenButton}
        onPress={
          isFullscreenView ? handleExitFullscreen : handleEnterFullscreen
        }
        hitSlop={10}
      >
        {isFullscreenView ? (
          <HugeIcon icon={Minimize01Icon} color="white" size={20} />
        ) : (
          <HugeIcon icon={Maximize01Icon} color="white" size={20} />
        )}
      </Pressable>
    </View>
  );

  const renderCenterPlayback = () => (
    <Pressable
      style={styles.centerButton}
      onPress={isEnded ? handleReplay : handleTogglePlayback}
      hitSlop={12}
    >
      {isEnded ? (
        <HugeIcon icon={RotateCcwIcon} color="white" size={24} />
      ) : paused ? (
        <HugeIcon icon={PlayIcon} color="white" fill="white" size={26} />
      ) : (
        <HugeIcon icon={PauseIcon} color="white" fill="white" size={26} />
      )}
    </Pressable>
  );

  return (
    <>
      <View style={styles.placeholder}>
        {videoUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            poster={
              // 没有封面时不能传 { uri: undefined }，原生侧会拿空地址去加载直接崩
              coverUrl
                ? { source: { uri: coverUrl }, resizeMode: "contain" }
                : undefined
            }
            resizeMode="contain"
            // 全屏是同一个实例被原生 Dialog 接管，进度、播放状态都不用交接
            paused={shouldBePaused}
            controls={false}
            progressUpdateInterval={80}
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onBuffer={handleBuffer}
            onEnd={handleEnd}
            // 全屏 Dialog 显示/关闭都以原生事件为准，JS 只负责叠控件层
            onFullscreenPlayerDidPresent={handleFullscreenDidPresent}
            onFullscreenPlayerWillDismiss={handleFullscreenWillDismiss}
            style={styles.absoluteFill}
          />
        ) : (
          <AsyncImage
            source={coverUrl}
            contentFit="contain"
            style={styles.absoluteFill}
            showLoading={false}
          />
        )}

        {isBuffering || !isVideoLoaded ? (
          // 加载/缓冲中：只显示加载动画，不显示其他控件
          <View style={styles.controlsOverlay} pointerEvents="none">
            <ActivityIndicator color="white" size="small" />
          </View>
        ) : inlineControlsVisible || isEnded ? (
          <View style={styles.controlsOverlay}>
            <Pressable
              style={styles.absoluteFill}
              onPress={() =>
                isEnded ? undefined : setInlineControlsVisible(false)
              }
            />
            {renderCenterPlayback()}
            {renderBottomControls(false)}
          </View>
        ) : (
          <>
            <Pressable
              style={styles.absoluteFill}
              onPress={() => videoUrl && setInlineControlsVisible(true)}
            />
            <View style={styles.progressTrack} pointerEvents="none">
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </>
        )}
      </View>

      <Modal
        visible={fullscreen}
        // 这一层只放控件，画面在下面的原生全屏 Dialog 里，所以必须透明
        transparent
        animationType="none"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={handleExitFullscreen}
      >
        <StatusBar
          style="light"
          hidden={isFullscreenLandscape}
          animated={false}
        />
        <View style={styles.fullscreenOverlay}>
          <Pressable
            style={styles.absoluteFill}
            onPress={() => setFullscreenControlsVisible((value) => !value)}
          />

          {/* 顶栏（返回）跟其他控件同一套显隐，不再常驻 */}
          <Animated.View
            style={[
              styles.fullscreenTopBar,
              {
                height: fullscreenTopHeight,
                paddingTop: fullscreenTopInset,
                paddingLeft: 12 + fullscreenSideInset,
                paddingRight: 12 + fullscreenSideInset,
                opacity: chromeOpacity,
              },
            ]}
            pointerEvents={fullscreenControlsVisible ? "auto" : "none"}
          >
            <Pressable
              style={styles.backButton}
              onPress={handleExitFullscreen}
              hitSlop={10}
            >
              <HugeIcon icon={ArrowLeft01Icon} color="white" size={24} />
            </Pressable>
          </Animated.View>

          {isBuffering || !isVideoLoaded ? (
            <View
              style={[styles.fullscreenCenter, styles.absoluteFill]}
              pointerEvents="none"
            >
              <ActivityIndicator color="white" size="small" />
            </View>
          ) : (
            <>
              {/* 控件淡出后露出的细进度条，和控件反向淡入淡出，否则会和底栏 slider 同时出现 */}
              <Animated.View
                style={[
                  styles.fullscreenAmbientTrack,
                  {
                    opacity: chromeOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  },
                ]}
                pointerEvents="none"
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </Animated.View>

              <Animated.View
                style={[styles.absoluteFill, { opacity: chromeOpacity }]}
                pointerEvents={fullscreenControlsVisible ? "box-none" : "none"}
              >
                {renderBottomControls(true)}
              </Animated.View>

              {/* 画面在 Modal 里是整屏居中的，中心按钮也得按整屏居中，不能让出上下控件条，否则安全区不等高时会偏下 */}
              <Animated.View
                style={[
                  styles.fullscreenCenter,
                  styles.absoluteFill,
                  { opacity: chromeOpacity },
                ]}
                pointerEvents={fullscreenControlsVisible ? "box-none" : "none"}
              >
                {renderCenterPlayback()}
              </Animated.View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  centerButton: {
    alignSelf: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },
  controlBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 12,
  },
  fullscreenControlBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 12,
  },
  timeText: {
    minWidth: 48,
    textAlign: "center",
  },
  seekSlider: {
    flex: 1,
    height: 32,
  },
  fullscreenButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  progressFill: {
    height: "100%",
  },
  fullscreenOverlay: {
    flex: 1,
    // 画面在下面的原生全屏 Dialog 里，这层只叠控件，必须全透明
    backgroundColor: "transparent",
  },
  fullscreenTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenCenter: {
    position: "absolute",
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenAmbientTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
});

export default memo(ArticleVideoPlayer);
