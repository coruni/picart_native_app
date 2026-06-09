/**
 * ArticleVideoPlayer
 *
 * 架构：
 * - 非全屏：Video 渲染在 inline placeholder 内，完全正常的文档流布局
 * - 全屏：打开 Modal，Modal 内重建一个 Video，seek 到当前时间，接续播放
 * - 切回非全屏：关闭 Modal，inline Video 恢复，seek 到当前时间
 *
 * 这是在 ScrollView 场景下最稳定的方案，避免了所有坐标测量问题。
 * 代价：全屏切换时有约 <200ms 的重新 seek，视觉上几乎不可察觉。
 */
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
} from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
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
  onFullscreenChange?: (fullscreen: boolean) => void;
};

function formatTime(value: number): string {
  const totalSeconds = Math.max(Math.floor(value || 0), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function ArticleVideoPlayer({
  videoUrl,
  cover,
  onFullscreenChange,
}: ArticleVideoPlayerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions(); // kept for potential future use

  // Two separate refs — one for inline, one for fullscreen Modal
  const inlineVideoRef = useRef<VideoRef>(null);
  const fullscreenVideoRef = useRef<VideoRef>(null);
  const progressWidthRef = useRef(1);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [inlineControlsVisible, setInlineControlsVisible] = useState(false);
  const [fullscreenControlsVisible, setFullscreenControlsVisible] =
    useState(false);
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const coverUrl = useMemo(() => getImageUrl(cover, "large"), [cover]);
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  // ─── handlers ────────────────────────────────────────────────────────────

  const handleLoad = useCallback((event: OnLoadData) => {
    setDuration(event.duration || 0);
  }, []);

  const handleProgress = useCallback((event: OnProgressData) => {
    setCurrentTime(event.currentTime || 0);
  }, []);

  const handlePress = useCallback(() => {
    if (!videoUrl) return;
    setInlineControlsVisible(true);
  }, [videoUrl]);

  const handleTogglePlayback = useCallback(() => setPaused((v) => !v), []);

  const handleEnterFullscreen = useCallback(() => {
    // Snapshot current time so fullscreen Video can seek to it after load
    setIsFullscreen(true);
    setFullscreenControlsVisible(true);
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleExitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setFullscreenControlsVisible(false);
    onFullscreenChange?.(false);
  }, [onFullscreenChange]);

  // After fullscreen Video loads, seek to current time for seamless handoff
  const handleFullscreenLoad = useCallback(
    (event: OnLoadData) => {
      setDuration(event.duration || 0);
      if (currentTime > 0) {
        fullscreenVideoRef.current?.seek(currentTime);
      }
    },
    [currentTime],
  );

  // After returning to inline, seek inline Video to current time
  useEffect(() => {
    if (!isFullscreen && currentTime > 0) {
      // Small delay to let the inline Video mount before seeking
      const id = setTimeout(() => {
        inlineVideoRef.current?.seek(currentTime);
      }, 80);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  const handleProgressLayout = useCallback((e: LayoutChangeEvent) => {
    progressWidthRef.current = Math.max(e.nativeEvent.layout.width, 1);
  }, []);

  const seekToLocation = useCallback(
    (locationX: number) => {
      if (!duration) return;
      const ratio = Math.min(
        Math.max(locationX / progressWidthRef.current, 0),
        1,
      );
      const t = duration * ratio;
      // Seek whichever Video is active
      (isFullscreen ? fullscreenVideoRef : inlineVideoRef).current?.seek(t);
      setCurrentTime(t);
    },
    [duration, isFullscreen],
  );

  const seekPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => seekToLocation(e.nativeEvent.locationX),
        onPanResponderMove: (e) => seekToLocation(e.nativeEvent.locationX),
      }),
    [seekToLocation],
  );

  useEffect(
    () => () => {
      onFullscreenChange?.(false);
    },
    [onFullscreenChange],
  );

  // ─── shared UI builders ───────────────────────────────────────────────────

  const renderControls = (fullscreen: boolean) => (
    <View style={styles.controlsOverlay}>
      <Pressable
        style={styles.absoluteFill}
        onPress={() => {
          if (fullscreen) {
            setFullscreenControlsVisible(false);
            return;
          }
          setInlineControlsVisible(false);
        }}
      />

      {fullscreen && (
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          <Pressable
            style={styles.backButton}
            onPress={handleExitFullscreen}
            hitSlop={10}
          >
            <ChevronLeft color="white" size={28} />
          </Pressable>
        </View>
      )}

      <Pressable
        style={styles.centerButton}
        onPress={handleTogglePlayback}
        hitSlop={12}
      >
        {paused ? (
          <Play color="white" fill="white" size={34} />
        ) : (
          <Pause color="white" fill="white" size={34} />
        )}
      </Pressable>

      <View
        style={[
          styles.controlBar,
          { paddingBottom: fullscreen ? insets.bottom + 12 : 12 },
        ]}
      >
        <ThemedText size={16} color="white" style={styles.timeText}>
          {formatTime(currentTime)}
        </ThemedText>

        <View
          style={styles.seekWrap}
          onLayout={handleProgressLayout}
          {...seekPanResponder.panHandlers}
        >
          <View style={styles.seekTrack}>
            <View
              style={[
                styles.seekFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <View
            pointerEvents="none"
            style={[styles.seekThumb, { left: `${progress * 100}%` }]}
          />
        </View>

        <ThemedText size={16} color="white" style={styles.timeText}>
          {formatTime(duration)}
        </ThemedText>

        <Pressable
          style={styles.fullscreenButton}
          onPress={fullscreen ? handleExitFullscreen : handleEnterFullscreen}
          hitSlop={10}
        >
          {fullscreen ? (
            <Minimize color="white" size={22} />
          ) : (
            <Maximize color="white" size={22} />
          )}
        </Pressable>
      </View>
    </View>
  );

  const renderAmbientBar = () => (
    <View style={styles.progressTrack} pointerEvents="none">
      <View
        style={[
          styles.progressFill,
          { width: `${progress * 100}%`, backgroundColor: colors.primary },
        ]}
      />
    </View>
  );

  const renderVideoNode = (
    ref: React.RefObject<VideoRef | null>,
    fullscreen: boolean,
  ) =>
    videoUrl ? (
      <Video
        ref={ref}
        source={{ uri: videoUrl }}
        poster={{ source: { uri: coverUrl }, resizeMode: "cover" }}
        resizeMode={"cover"}
        paused={paused || fullscreen !== isFullscreen}
        controls={false}
        progressUpdateInterval={250}
        onLoad={fullscreen ? handleFullscreenLoad : handleLoad}
        onProgress={handleProgress}
        style={styles.absoluteFill}
      />
    ) : (
      <AsyncImage
        source={coverUrl}
        contentFit="contain"
        style={styles.absoluteFill}
        showLoading={false}
      />
    );

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Inline player (always in document flow, no positioning tricks) ── */}
      <View style={styles.placeholder}>
        {renderVideoNode(inlineVideoRef, false)}

        {inlineControlsVisible ? (
          renderControls(false)
        ) : (
          <>
            <Pressable style={styles.absoluteFill} onPress={handlePress} />
            {renderAmbientBar()}
          </>
        )}
      </View>

      {/* ── Fullscreen Modal (mounts only when needed) ── */}
      <Modal
        visible={isFullscreen}
        transparent={false}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleExitFullscreen}
      >
        <StatusBar style="light" hidden={false} animated={false} />

        <View style={styles.fullscreenContainer}>
          {/* Tap-anywhere overlay to show/hide controls */}
          <Pressable
            style={styles.absoluteFill}
            onPress={() => setFullscreenControlsVisible((v) => !v)}
          />

          {/* Top bar — always reserves space so video doesn't shift */}
          <View style={[styles.fsTopBar, { paddingTop: insets.top }]}>
            <Pressable
              style={styles.backButton}
              onPress={handleExitFullscreen}
              hitSlop={10}
            >
              <ChevronLeft color="white" size={28} />
            </Pressable>
          </View>

          {/* Video — flex:1 so it takes all space between top bar and control bar */}
          <View style={styles.fsVideoArea}>
            {renderVideoNode(fullscreenVideoRef, true)}
            <Pressable
              style={styles.absoluteFill}
              onPress={() => setFullscreenControlsVisible((v) => !v)}
            />
            {/* Play/pause centred over video, shown when controls visible */}
            {fullscreenControlsVisible && (
              <View style={styles.fsCenterButton} pointerEvents="box-none">
                <Pressable
                  style={styles.centerButton}
                  onPress={handleTogglePlayback}
                  hitSlop={12}
                >
                  {paused ? (
                    <Play color="white" fill="white" size={34} />
                  ) : (
                    <Pause color="white" fill="white" size={34} />
                  )}
                </Pressable>
              </View>
            )}
          </View>

          {/* Control bar — fixed height, always below video */}
          {fullscreenControlsVisible ? (
            <View
              style={[
                styles.fsControlBar,
                { paddingBottom: insets.bottom + 8 },
              ]}
            >
                <ThemedText size={15} color="white" style={styles.timeText}>
                  {formatTime(currentTime)}
                </ThemedText>

                <View
                  style={styles.seekWrap}
                  onLayout={handleProgressLayout}
                  {...seekPanResponder.panHandlers}
                >
                  <View style={styles.seekTrack}>
                    <View
                      style={[
                        styles.seekFill,
                        {
                          width: `${progress * 100}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <View
                    pointerEvents="none"
                    style={[styles.seekThumb, { left: `${progress * 100}%` }]}
                  />
                </View>

                <ThemedText size={15} color="white" style={styles.timeText}>
                  {formatTime(duration)}
                </ThemedText>

                <Pressable
                  style={styles.fullscreenButton}
                  onPress={handleExitFullscreen}
                  hitSlop={10}
                >
                  <Minimize color="white" size={22} />
                </Pressable>
            </View>
          ) : (
            <Pressable
              style={[
                styles.fsHiddenControlsTouchArea,
                { paddingBottom: insets.bottom + 8 },
              ]}
              onPress={() => setFullscreenControlsVisible(true)}
            />
          )}
          {!fullscreenControlsVisible && (
            <View style={styles.fsAmbientTrack} pointerEvents="none">
              <View
                style={[
                  styles.fsAmbientFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // ── Inline ───────────────────────────────────────────────────────────────
  placeholder: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    overflow: "hidden",
  },

  // ── Fullscreen ───────────────────────────────────────────────────────────
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "column",
  },
  fsTopBar: {
    paddingHorizontal: 12,
    paddingBottom: 4,
    minHeight: 44,
    justifyContent: "flex-end",
  },
  fsVideoArea: {
    flex: 1,
    overflow: "hidden",
  },
  /**
   * Bottom control bar — sits BELOW the video in the column layout.
   * Fixed content so controls never overlap the video.
   */
  fsControlBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    minHeight: 56,
    gap: 12,
  },
  fsHiddenControlsTouchArea: {
    minHeight: 56,
  },
  fsAmbientTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  fsAmbientFill: {
    height: "100%",
  },
  /** Play/pause absolute-centred inside fsVideoArea */
  fsCenterButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Controls ─────────────────────────────────────────────────────────────
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },
  controlBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 12,
  },
  timeText: {
    minWidth: 48,
    textAlign: "center",
  },
  seekWrap: {
    flex: 1,
    height: 24,
    justifyContent: "center",
  },
  seekTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.72)",
    overflow: "hidden",
  },
  seekFill: { height: "100%" },
  seekThumb: {
    position: "absolute",
    top: 6,
    width: 14,
    height: 14,
    marginLeft: -7,
    borderRadius: 7,
    backgroundColor: "white",
  },
  fullscreenButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Ambient progress bar ─────────────────────────────────────────────────
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  progressFill: { height: "100%" },

  // ── Utility ──────────────────────────────────────────────────────────────
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default memo(ArticleVideoPlayer);
