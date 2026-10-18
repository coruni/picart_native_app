import { getAxiosInstance } from "@/api";
import type { UploadControllerUploadFile201Response } from "@/api/generated";

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
