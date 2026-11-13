import { getAxiosInstance } from "@/api";
import type { UploadControllerUploadFile201Response } from "@/api/generated";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

/** 正文插图的长边上限：再大的原图上传慢、解码吃内存，正文里也用不上 */
const CONTENT_IMAGE_MAX_EDGE = 1600;
const CONTENT_IMAGE_QUALITY = 0.85;

const VIDEO_MIME_BY_EXT: Record<string, string> = {
  mp4: "video/mp4",
  m4v: "video/x-m4v",
  mov: "video/quicktime",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  flv: "video/x-flv",
  "3gp": "video/3gpp",
  ogv: "video/ogg",
};

/**
 * 图片扩展名 → MIME。
 * 注意 gif 必须显式列出：漏掉会被当成 jpeg 上传，服务端按类型校验时直接拒。
 */
const IMAGE_MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
};

function getFileExt(uri: string, fallback: string) {
  return uri.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase() || fallback;
}

/**
 * 是否动图（GIF）。
 * 动图只有首帧能被解码成位图，任何重编码都会把动画压没，所以这类文件必须原样上传。
 */
export function isGifSource(uri: string, mimeType?: string | null): boolean {
  if (mimeType?.toLowerCase() === "image/gif") return true;
  return getFileExt(uri, "") === "gif";
}

async function uploadFile(
  uri: string,
  mimeType: string,
  fileName: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  const response = await getAxiosInstance().post<UploadControllerUploadFile201Response>(
    "/upload/file",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  const url = response.data.data?.[0]?.url;
  if (!url) {
    throw new Error("File upload failed");
  }
  return url;
}

/**
 * 正文插图上传前压一道。
 * GIF 动图直接跳过（重编码会丢动画）；
 * 长边超过 1600 的等比缩到 1600，并统一转 JPEG 重编码（0.85）；
 * 本来就不大的图直接传原文件，不白白掉一次画质。
 */
export async function prepareContentImage(
  uri: string,
  width: number,
  height: number,
  mimeType?: string | null,
): Promise<string> {
  if (isGifSource(uri, mimeType)) return uri;

  const maxEdge = Math.max(width, height);
  if (maxEdge > 0 && maxEdge <= CONTENT_IMAGE_MAX_EDGE) return uri;

  const context = ImageManipulator.manipulate(uri);
  if (maxEdge > CONTENT_IMAGE_MAX_EDGE) {
    // 只给长边，另一边按比例自动算
    context.resize(
      width >= height
        ? { width: CONTENT_IMAGE_MAX_EDGE }
        : { height: CONTENT_IMAGE_MAX_EDGE },
    );
  }

  const image = await context.renderAsync();
  const { uri: compressedUri } = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: CONTENT_IMAGE_QUALITY,
  });
  return compressedUri;
}

/**
 * 上传单张本地图片，返回服务器 URL。
 * uri 来自 expo-image-picker 或 expo-image-manipulator 的本地路径。
 */
export async function uploadSingleImage(uri: string): Promise<string> {
  const ext = getFileExt(uri, "jpg");
  const mimeType = IMAGE_MIME_BY_EXT[ext] ?? "image/jpeg";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const url = await uploadFile(uri, mimeType, `upload-${unique}.${ext}`);

  if (url.includes("/images/blocked.webp")) {
    throw new Error("Image upload failed");
  }
  return url;
}

/**
 * 上传单个本地视频，返回服务器 URL。
 * mimeType 优先取选择器给出的值，缺失时按文件扩展名推断。
 */
export async function uploadSingleVideo(
  uri: string,
  mimeType?: string | null,
): Promise<string> {
  const ext = getFileExt(uri, "mp4");
  const resolvedMimeType = mimeType?.startsWith("video/")
    ? mimeType
    : (VIDEO_MIME_BY_EXT[ext] ?? "video/mp4");
  return uploadFile(uri, resolvedMimeType, `upload-${Date.now()}.${ext}`);
}
