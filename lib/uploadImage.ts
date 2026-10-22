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

function getFileExt(uri: string, fallback: string) {
  return uri.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase() || fallback;
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
 * 长边超过 1600 的等比缩到 1600，并统一转 JPEG 重编码（0.85）；
 * 本来就不大的图直接传原文件，不白白掉一次画质。
 */
export async function prepareContentImage(
  uri: string,
  width: number,
  height: number,
): Promise<string> {
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
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const url = await uploadFile(uri, mimeType, `upload-${Date.now()}.${ext}`);

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
