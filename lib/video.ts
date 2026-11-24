import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { VideoPlayer, VideoThumbnail } from "expo-video";

/** 封面帧最大宽度：列表卡片按 16:9 展示，640 已经够清晰又不吃内存 */
export const VIDEO_COVER_MAX_WIDTH = 640;
// 高度上界必须一起给。Android 侧只传 maxWidth 时会拿 Int.MAX_VALUE 补 height
export const VIDEO_COVER_MAX_HEIGHT = Math.round(
  (VIDEO_COVER_MAX_WIDTH * 9) / 16,
);

/** 首尾各留一点，避免取到黑场 */
const FRAME_EDGE_PADDING = 0.04;

/** 在时间轴上均匀取 count 个点，单位秒 */
export function buildFrameTimes(
  durationSeconds: number,
  count: number,
): number[] {
  if (!(durationSeconds > 0) || count <= 0) return [];
  if (count === 1) return [Number((durationSeconds * FRAME_EDGE_PADDING).toFixed(3))];

  return Array.from({ length: count }, (_, index) => {
    const ratio =
      FRAME_EDGE_PADDING +
      (index / (count - 1)) * (1 - FRAME_EDGE_PADDING * 2);
    return Number((durationSeconds * ratio).toFixed(3));
  });
}

/** 秒 → mm:ss，超过一小时补上小时段 */
export function formatVideoTime(seconds?: number | null): string {
  const total = Math.max(Math.floor(seconds ?? 0), 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = String(total % 60).padStart(2, "0");
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${secs}`;
  return `${String(minutes).padStart(2, "0")}:${secs}`;
}

/** 字节 → 8.4 MB / 912 KB，拿不到大小返回 null */
export function formatVideoSize(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1) return `${megabytes.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// 抽帧必须一次一帧：并发会让原生同时解多张大图，直接 OOM 甚至崩在原生层
export async function extractVideoFrames(
  player: VideoPlayer,
  times: number[],
  options: {
    onFrame?: (thumbnail: VideoThumbnail) => void;
    isCancelled?: () => boolean;
  } = {},
): Promise<VideoThumbnail[]> {
  const { onFrame, isCancelled } = options;
  const frames: VideoThumbnail[] = [];

  for (const time of times) {
    if (isCancelled?.()) break;

    const [thumbnail] = await player.generateThumbnailsAsync([time], {
      maxWidth: VIDEO_COVER_MAX_WIDTH,
      maxHeight: VIDEO_COVER_MAX_HEIGHT,
    });
    if (!thumbnail) break;

    frames.push(thumbnail);
    onFrame?.(thumbnail);
  }

  return frames;
}

// 从正在预览的播放器上抓某一时刻的帧（「用当前画面」）。播放器归调用方所有，这里不释放。
export async function captureVideoFrame(
  player: VideoPlayer,
  time: number,
): Promise<VideoThumbnail | null> {
  const [thumbnail] = await player.generateThumbnailsAsync([Math.max(time, 0)], {
    maxWidth: VIDEO_COVER_MAX_WIDTH,
    maxHeight: VIDEO_COVER_MAX_HEIGHT,
  });
  return thumbnail ?? null;
}

// 把播放器定位到指定秒数。
export function seekVideoPlayer(player: VideoPlayer, seconds: number): void {
  player.currentTime = Math.max(seconds, 0);
}

/** 帧落盘成 JPEG：上传和封面预览都需要一个真实的文件路径 */
export async function saveVideoFrameImage(
  thumbnail: VideoThumbnail,
): Promise<string> {
  const context = ImageManipulator.manipulate(thumbnail);
  const image = await context.renderAsync();
  const { uri } = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.9,
  });
  return uri;
}
