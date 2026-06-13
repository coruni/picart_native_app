import { api } from "@/api";
import {
  getUploadConfig,
  type UploadConfig,
} from "@/store/uploadConfigStore";
import * as Crypto from "expo-crypto";
import { File as ExpoFile } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import type { ImagePickerAsset } from "expo-image-picker";

type UploadableFile = {
  uri: string;
  name: string;
  type: string;
};

export async function uploadCommentImages(
  assets: ImagePickerAsset[],
  onProgress?: (progress: number) => void,
): Promise<string[]> {
  const config = await getUploadConfig();
  validateFileCount(assets, config);

  const metadata = await buildUploadMetadata(assets);
  const uploadFiles = await Promise.all(
    assets.map((asset) => prepareUploadFile(asset, config)),
  );
  uploadFiles.forEach((file) => validateUploadFile(file, config));

  onProgress?.(1);
  const response = await api.uploadControllerUploadFile(
    uploadFiles as unknown as File,
    undefined,
    undefined,
    undefined,
    undefined,
    metadata,
    {
      headers: { "Content-Type": null },
      onUploadProgress: (event) => {
        if (!event.total) return;
        const next = Math.max(
          1,
          Math.min(99, Math.round((event.loaded / event.total) * 100)),
        );
        onProgress?.(next);
      },
    },
  );
  const uploadedUrls = response.data.data
    .map((item) => item.url)
    .filter((url): url is string => Boolean(url));

  if (
    uploadedUrls.length !== uploadFiles.length ||
    uploadedUrls.some((url) => url.includes("/images/blocked.webp"))
  ) {
    throw new Error("Image upload failed");
  }

  onProgress?.(100);
  return uploadedUrls;
}

function validateFileCount(
  assets: ImagePickerAsset[],
  config: UploadConfig,
): void {
  const maxFileCount = Number.parseInt(config.limits.maxFileCount, 10);
  if (Number.isFinite(maxFileCount) && assets.length > maxFileCount) {
    throw new Error("Too many images");
  }
}

function validateUploadFile(
  uploadFile: UploadableFile,
  config: UploadConfig,
): void {
  const allowedImageTypes = config.allowedMimeTypes.image;

  if (
    allowedImageTypes.length > 0 &&
    !allowedImageTypes.includes(uploadFile.type)
  ) {
    throw new Error("Unsupported image type");
  }

  const file = new ExpoFile(uploadFile.uri);
  const maxImageSize = config.limits.maxSize.image.bytes;
  if (file.size > maxImageSize) {
    throw new Error("Image is too large");
  }
}

async function prepareUploadFile(
  asset: ImagePickerAsset,
  config: UploadConfig,
): Promise<UploadableFile> {
  const mimeType = getAssetMimeType(asset);
  const fileName = getAssetFileName(asset, mimeType);
  const originalFile = {
    uri: asset.uri,
    name: fileName,
    type: mimeType,
  };
  const allowedImageTypes = config.allowedMimeTypes.image;
  const mustConvertType =
    allowedImageTypes.length > 0 && !allowedImageTypes.includes(mimeType);
  const shouldCompress =
    (config.imageProcessing.compressionEnabled || mustConvertType) &&
    mimeType !== "image/gif" &&
    ((asset.fileSize ?? 0) >= 100 * 1024 || mustConvertType);

  if (!shouldCompress) {
    return originalFile;
  }

  const outputMimeType = getOutputMimeType(config, mimeType, allowedImageTypes);
  const converted = await manipulateWithFallback(asset, config, outputMimeType);
  const resizedFile = new ExpoFile(converted.result.uri);

  if (!mustConvertType && asset.fileSize && resizedFile.size >= asset.fileSize) {
    return originalFile;
  }

  return {
    uri: converted.result.uri,
    name: replaceFileExtension(fileName, converted.mimeType),
    type: converted.mimeType,
  };
}

async function manipulateWithFallback(
  asset: ImagePickerAsset,
  config: UploadConfig,
  outputMimeType: string,
): Promise<{ result: ImageManipulator.ImageResult; mimeType: string }> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      asset.uri,
      getResizeActions(asset, config),
      {
        compress: normalizeQuality(config.imageProcessing.quality),
        format: getManipulatorFormat(outputMimeType),
      },
    );
    return { result, mimeType: outputMimeType };
  } catch (error) {
    console.warn("[comment-upload] image manipulation failed, retrying jpeg", error);
    const result = await ImageManipulator.manipulateAsync(asset.uri, getResizeActions(asset, config), {
      compress: normalizeQuality(config.imageProcessing.quality),
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return { result, mimeType: "image/jpeg" };
  }
}

function getResizeActions(
  asset: ImagePickerAsset,
  config: UploadConfig,
): ImageManipulator.Action[] {
  const maxWidth = config.imageProcessing.maxWidth || config.compression.image.maxWidth;
  const maxHeight = config.imageProcessing.maxHeight;

  if (!asset.width || !asset.height) return [];
  if (asset.width <= maxWidth && asset.height <= maxHeight) return [];

  const ratio = Math.min(maxWidth / asset.width, maxHeight / asset.height);
  return [
    {
      resize: {
        width: Math.round(asset.width * ratio),
        height: Math.round(asset.height * ratio),
      },
    },
  ];
}

async function buildUploadMetadata(assets: ImagePickerAsset[]): Promise<string> {
  const metadata = await Promise.all(
    assets.map(async (asset) => {
      const file = new ExpoFile(asset.uri);
      const bytes = await file.bytes();
      const hashBuffer = await Crypto.digest(
        Crypto.CryptoDigestAlgorithm.SHA256,
        bytes,
      );
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return {
        hash,
        name: getAssetFileName(asset, getAssetMimeType(asset)),
      };
    }),
  );

  return JSON.stringify(metadata);
}

function getAssetMimeType(asset: ImagePickerAsset): string {
  return asset.mimeType || mimeTypeFromUri(asset.uri) || "image/jpeg";
}

function getAssetFileName(asset: ImagePickerAsset, mimeType: string): string {
  if (asset.fileName) return asset.fileName;
  return `comment-image-${Date.now()}.${extensionFromMimeType(mimeType)}`;
}

function getOutputMimeType(
  config: UploadConfig,
  fallbackMimeType: string,
  allowedImageTypes: string[],
): string {
  const normalizedFormat = config.imageProcessing.format.toLowerCase();
  if (
    normalizedFormat === "png" &&
    allowedImageTypes.includes("image/png")
  ) {
    return "image/png";
  }
  if (fallbackMimeType === "image/png" && allowedImageTypes.includes("image/png")) {
    return "image/png";
  }
  if (allowedImageTypes.length === 0 || allowedImageTypes.includes("image/jpeg")) {
    return "image/jpeg";
  }
  if (allowedImageTypes.includes(fallbackMimeType)) return fallbackMimeType;
  return allowedImageTypes[0] ?? "image/jpeg";
}

function getManipulatorFormat(mimeType: string): ImageManipulator.SaveFormat {
  if (mimeType === "image/png") return ImageManipulator.SaveFormat.PNG;
  return ImageManipulator.SaveFormat.JPEG;
}

function normalizeQuality(quality: number): number {
  if (quality > 1) return Math.max(0, Math.min(1, quality / 100));
  return Math.max(0, Math.min(1, quality));
}

function replaceFileExtension(fileName: string, mimeType: string): string {
  return `${fileName.replace(/\.[^/.]+$/, "")}.${extensionFromMimeType(mimeType)}`;
}

function extensionFromMimeType(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "jpg";
}

function mimeTypeFromUri(uri: string): string | null {
  const extension = uri.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase();
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "gif") return "image/gif";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  return null;
}
