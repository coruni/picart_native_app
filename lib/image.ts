import { ImageData } from "@/types/api";

export type ImageSource = ImageData | string | null | undefined;

export function getImageUrl(
  source: ImageSource,
  size: "small" | "medium" | "large" | "original" = "original",
): string | undefined {
  if (!source) return undefined;

  if (typeof source === "string") {
    return source;
  }

  // 缩略图键映射：small 对应 thumb
  const sizeKeyMap: Record<string, keyof ImageData["thumbnails"]> = {
    small: "thumb",
    medium: "medium",
    large: "large",
  };

  if (size !== "original") {
    const thumbKey = sizeKeyMap[size];
    if (thumbKey && source.thumbnails?.[thumbKey]) {
      return source.thumbnails[thumbKey];
    }
  }

  return source.url;
}

export function getImageSource(
  source: ImageSource,
  size: "small" | "medium" | "large" | "original" = "original",
): string | ImageData | undefined {
  if (!source) return undefined;

  if (typeof source === "string") {
    return source;
  }

  const url = getImageUrl(source, size);
  if (url) {
    return url;
  }

  return source;
}
