import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export type SaveImageResult = "saved" | "denied" | "failed";

// 相册按扩展名判断 mime，拿不到可信扩展名时统一按 jpg 存
const SAFE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"];

function extensionOf(url: string): string {
  const matched = /\.([a-zA-Z0-9]{2,5})(?:[?#]|$)/.exec(url);
  const ext = matched?.[1]?.toLowerCase();

  return ext && SAFE_EXTENSIONS.includes(ext) ? ext : "jpg";
}

/** 下载远程图片并写进系统相册；只返回结果，提示文案交给调用方 */
export async function saveImageToLibrary(
  url: string,
): Promise<SaveImageResult> {
  try {
    // writeOnly=true：只要「添加到相册」这一个权限，不去读用户已有的照片
    const permission = await MediaLibrary.requestPermissionsAsync(true);
    if (!permission.granted) {
      return "denied";
    }
  } catch {
    return "denied";
  }

  const target = new File(
    Paths.cache,
    `picart-save-${Date.now()}.${extensionOf(url)}`,
  );

  try {
    const downloaded = await File.downloadFileAsync(url, target, {
      idempotent: true,
    });
    // saveToLibraryAsync 在 SDK 56 已废弃（调了直接抛），新入口是 Asset.create
    await MediaLibrary.Asset.create(downloaded.uri);

    return "saved";
  } catch {
    return "failed";
  } finally {
    // 存进相册后这份缓存就没用了，留着只占空间
    try {
      if (target.exists) target.delete();
    } catch {
      // 删不掉也不影响已经保存的结果
    }
  }
}
