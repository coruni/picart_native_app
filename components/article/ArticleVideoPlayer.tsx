import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import Slider from "@react-native-community/slider";
import { useIsFocused } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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

function ArticleVideoPlayer({ videoUrl, cover }: ArticleVideoPlayerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const videoRef = useRef<VideoRef>(null);
  const isSeekingRef = useRef(false);
  // 离开当前页面（如进入评论详情）前的播放状态，回到页面时据此恢复
  const pausedBeforeBlurRef = useRef(true);
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
  const [fullscreenOverlayVisible, setFullscreenOverlayVisible] =
    useState(false);
  const [stableFullscreenTopInset] = useState(() => insets.top);
  // 追踪视频是否已加载完成
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // 追踪视频是否处于缓冲状态
  const [isBuffering, setIsBuffering] = useState(false);
  // 追踪视频是否播放完成（用于显示重播按钮）
  const [isEnded, setIsEnded] = useState(false);

  const coverUrl = useMemo(() => getImageUrl(cover, "large"), [cover]);
  const progress = duration > 0 ? Math.min(displayTime / duration, 1) : 0;
  const isFullscreenLandscape = fullscreenOrientation === "landscape";
  const fullscreenTopInset = isFullscreenLandscape
    ? 0
    : stableFullscreenTopInset;
  const fullscreenBottomInset = isFullscreenLandscape ? 0 : insets.bottom;
  const fullscreenTopHeight = fullscreenTopInset + 52;
  const fullscreenBottomHeight = fullscreenBottomInset + 56;

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
    setFullscreenControlsVisible(true);
    await lockFullscreenOrientation();
    videoRef.current?.presentFullscreenPlayer();
  }, [lockFullscreenOrientation]);

  const handleExitFullscreen = useCallback(() => {
    videoRef.current?.dismissFullscreenPlayer();
    setFullscreenOverlayVisible(false);
  }, []);

  const handleFullscreenDidPresent = useCallback(() => {
    setFullscreenOverlayVisible(true);
  }, []);

  const handleFullscreenWillDismiss = useCallback(() => {
    setFullscreenOverlayVisible(false);
  }, []);

  const handleFullscreenDidDismiss = useCallback(() => {
    setFullscreenControlsVisible(true);
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
      paused ||
      isSeekingRef.current ||
      duration <= 0 ||
      isBuffering
    ) {
      return;
    }

    const tick = () => {
      // 在每一帧检查状态
      if (!isVideoLoaded || paused || isSeekingRef.current || isBuffering) {
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
  }, [clearProgressAnimation, duration, paused, isVideoLoaded, isBuffering]);

  // 离开页面（push 评论详情等）时暂停视频，回到页面时恢复之前的播放状态
  useEffect(() => {
    if (!isFocused) {
      pausedBeforeBlurRef.current = paused;
      if (!paused) {
        setPaused(true);
      }
      return;
    }

    if (!pausedBeforeBlurRef.current) {
      lastProgressTimeRef.current = displayTime;
      lastProgressTimestampRef.current = Date.now();
      setPaused(false);
    }
    // 仅在焦点切换时执行，paused/displayTime 作为读取快照而非依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const renderSeekbar = () => (
    <Slider
      style={styles.seekSlider}
      minimumValue={0}
      maximumValue={duration || 1}
      value={displayTime}
      disabled={!duration || !isVideoLoaded}
      minimumTrackTintColor={colors.primary}
      maximumTrackTintColor="rgba(255,255,255,0.72)"
      thumbTintColor="white"
      onSlidingStart={handleSeekStart}
      onValueChange={handleSeekChange}
      onSlidingComplete={handleSeekComplete}
    />
  );

  const renderBottomControls = (fullscreen: boolean) => (
    <View
      style={[
        fullscreen ? styles.fullscreenControlBar : styles.controlBar,
        fullscreen
          ? {
              height: fullscreenBottomHeight,
              paddingBottom: fullscreenBottomInset + 8,
              backgroundColor: isFullscreenLandscape ? "transparent" : "#000",
            }
          : { paddingBottom: 12 },
      ]}
    >
      <ThemedText
        size={fullscreen ? 15 : 16}
        color="white"
        style={styles.timeText}
      >
        {formatTime(displayTime)}
      </ThemedText>
      {renderSeekbar()}
      <ThemedText
        size={fullscreen ? 15 : 16}
        color="white"
        style={styles.timeText}
      >
        {isVideoLoaded ? formatTime(duration) : "--:--"}
      </ThemedText>
      <Pressable
        style={styles.fullscreenButton}
        onPress={fullscreen ? handleExitFullscreen : handleEnterFullscreen}
        hitSlop={10}
      >
        {fullscreen ? (
          <Minimize color="white" size={18} />
        ) : (
          <Maximize color="white" size={18} />
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
        <RotateCcw color="white" size={24} />
      ) : paused ? (
        <Play color="white" fill="white" size={26} />
      ) : (
        <Pause color="white" fill="white" size={26} />
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
            poster={{ source: { uri: coverUrl }, resizeMode: "contain" }}
            resizeMode="contain"
            paused={paused}
            controls={false}
            fullscreenAutorotate
            fullscreenOrientation={fullscreenOrientation}
            controlsStyles={{
              hideNavigationBarOnFullScreenMode: false,
              hideNotificationBarOnFullScreenMode: isFullscreenLandscape,
            }}
            progressUpdateInterval={80}
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onBuffer={handleBuffer}
            onEnd={handleEnd}
            onFullscreenPlayerDidPresent={handleFullscreenDidPresent}
            onFullscreenPlayerWillDismiss={handleFullscreenWillDismiss}
            onFullscreenPlayerDidDismiss={handleFullscreenDidDismiss}
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
        visible={fullscreenOverlayVisible}
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
          <View
            style={[
              styles.fullscreenTopBar,
              {
                height: fullscreenTopHeight,
                paddingTop: fullscreenTopInset,
                backgroundColor: isFullscreenLandscape ? "transparent" : "#000",
              },
            ]}
          >
            <Pressable
              style={styles.backButton}
              onPress={handleExitFullscreen}
              hitSlop={10}
            >
              <ChevronLeft color="white" size={23} />
            </Pressable>
          </View>

          {isBuffering || !isVideoLoaded ? (
            <View
              style={[
                styles.fullscreenCenter,
                { top: fullscreenTopHeight, bottom: fullscreenBottomHeight },
              ]}
              pointerEvents="none"
            >
              <ActivityIndicator color="white" size="small" />
            </View>
          ) : (
            <>
              {fullscreenControlsVisible && (
                <View
                  style={[
                    styles.fullscreenCenter,
                    {
                      top: fullscreenTopHeight,
                      bottom: fullscreenBottomHeight,
                    },
                  ]}
                  pointerEvents="box-none"
                >
                  {renderCenterPlayback()}
                </View>
              )}

              {fullscreenControlsVisible ? (
                renderBottomControls(true)
              ) : (
                <View style={styles.fullscreenAmbientTrack} pointerEvents="none">
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
              )}
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
