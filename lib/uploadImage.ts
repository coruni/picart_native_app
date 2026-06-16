import { getAxiosInstance } from "@/api";
import type { UploadControllerUploadFile201Response } from "@/api/generated";

/**
 * 上传单张本地图片，返回服务器 URL。
 * uri 来自 expo-image-picker 或 expo-image-manipulator 的本地路径。
 */
export async function uploadSingleImage(uri: string): Promise<string> {
  const ext = uri.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const fileName = `upload-${Date.now()}.${ext}`;

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
  if (!url || url.includes("/images/blocked.webp")) {
    throw new Error("Image upload failed");
  }
  return url;
}
