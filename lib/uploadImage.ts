import { getAxiosInstance } from "@/api";
import type {
  DtoUploadDto,
  UploadControllerUploadAvatar200Response,
} from "@/api/generated";
import { translateApiMessage } from "@/lib/apiMessage";
import { getUploadConfig } from "@/store/uploadConfigStore";
import { File as ExpoFile } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export type UploadKind = "image" | "video";

// 文件超过服务端体积上限。
export class FileTooLargeError extends Error {
  readonly kind: UploadKind;
  readonly size: number;
  readonly limit: number;

  constructor(kind: UploadKind, size: number, limit: number) {
    super(`${kind} is larger than the upload limit`);
    this.name = "FileTooLargeError";
    this.kind = kind;
    this.size = size;
    this.limit = limit;
  }
}

/** 超时就当没拿到：拿不到配置宁可放过，也不能把界面卡死 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
    );
  });
}

// 拿不到配置时返回 null 并且不拦截：配置接口挂了不能连带把发布也堵死，这种情况交给服务端兜底。
export async function getUploadSizeLimit(
  kind: UploadKind,
): Promise<number | null> {
  const config = await withTimeout(getUploadConfig(), CONFIG_TIMEOUT_MS);
  const bytes = config?.limits?.max_size?.[kind]?.bytes;
  return typeof bytes === "number" && bytes > 0 ? bytes : null;
}

// 从 axios 错误里取服务端给的说明（后端回 key 的已经翻好了）。
export function getServerErrorMessage(error: unknown): string | null {
  const message = (
    error as { response?: { data?: { message?: unknown } } } | undefined
  )?.response?.data?.message;
  if (Array.isArray(message)) {
    const first = message.find(
      (item): item is string => typeof item === "string" && !!item.trim(),
    );
    return first ? translateApiMessage(first) : null;
  }
  if (typeof message !== "string" || !message.trim()) return null;
  return translateApiMessage(message);
}

/** 有没有拿到服务端响应。没有响应基本就是断网 / 超时 / 服务不可达 */
export function hasServerResponse(error: unknown): boolean {
  return !!(error as { response?: unknown } | undefined)?.response;
}

/** 上传请求是否因为超时结束（没有响应，但和服务不可达要分开说） */
export function isTimeoutError(error: unknown): boolean {
  const typed = error as
    | { code?: string; message?: string; response?: unknown }
    | undefined;
  if (typed?.response) return false;
  if (typed?.code === "ECONNABORTED" || typed?.code === "ETIMEDOUT") return true;
  return /timeout/i.test(typed?.message ?? "");
}

/** 上传请求是否被服务端以「文件太大」为由拒绝 */
export function isTooLargeRejection(error: unknown): boolean {
  const status = (error as { response?: { status?: number } } | undefined)
    ?.response?.status;
  // 413 是标准的 Payload Too Large；部分网关拒大包会回 400
  if (status === 413) return true;

  const message = getServerErrorMessage(error)?.toLowerCase() ?? "";
  return /(too large|file size|payload|exceed|larger than|超出|过大|太大)/.test(
    message,
  );
}

/** 正文插图的长边上限：再大的原图上传慢、解码吃内存，正文里也用不上 */
const CONTENT_IMAGE_MAX_EDGE = 1600;
const CONTENT_IMAGE_QUALITY = 0.85;

/** 上传专用超时：远离全局 30 秒的普通接口限制，给大文件慢慢传 */
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

// 读配置的超时。配置接口在 401 时会被拦截器改成「永不 resolve 的 promise」（等登录跳转），不设上限的话选视频这一步会一直悬在那里，界面看起来像点了没反应。
const CONFIG_TIMEOUT_MS = 3000;

// 通用文件上传
const FILE_ENDPOINT = "/upload/file";
// 头像 / 背景图要用这条：服务端会先过一遍图片审核，通用上传不过审
const AVATAR_ENDPOINT = "/upload/avatar";

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

// 注意 gif 必须显式列出：漏掉会被当成 jpeg 上传，服务端按类型校验时直接拒。
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

// 动图只有首帧能被解码成位图，任何重编码都会把动画压没，所以这类文件必须原样上传。
export function isGifSource(uri: string, mimeType?: string | null): boolean {
  if (mimeType?.toLowerCase() === "image/gif") return true;
  return getFileExt(uri, "") === "gif";
}

/** 本地文件大小。取不到（content:// 等特殊 uri）返回 null，交给服务端判定 */
function getLocalFileSize(uri: string): number | null {
  try {
    const size = new ExpoFile(uri).size;
    return typeof size === "number" && size > 0 ? size : null;
  } catch {
    return null;
  }
}

async function uploadFile(
  uri: string,
  mimeType: string,
  fileName: string,
  kind: UploadKind,
  endpoint: string,
): Promise<DtoUploadDto> {
  // 本地先卡一道：把几十上百 MB 的包整个发上去再等服务端拒绝，用户看到的就是一个转很久的圈加一句「发布失败」，完全不知道原因。
  const limit = await getUploadSizeLimit(kind);
  const size = getLocalFileSize(uri);
  if (limit && size && size > limit) {
    throw new FileTooLargeError(kind, size, limit);
  }

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  const response = await getAxiosInstance().post<UploadControllerUploadAvatar200Response>(
    endpoint,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      // 全局 axios 只给 30 秒，那是给普通 JSON 接口的。
      timeout: UPLOAD_TIMEOUT_MS,
    },
  );

  const uploaded = response.data.data?.[0];
  if (!uploaded?.url) {
    throw new Error("File upload failed");
  }
  return uploaded;
}

// 审核不通过的文件服务端也可能先落了库，这里一律当失败，别把违规图存进资料。
function pickImageUrl(uploaded: DtoUploadDto): string {
  const rejected =
    uploaded.audit_status?.toLowerCase().includes("reject") ||
    uploaded.audit_result?.passed === false;
  const url = uploaded.url ?? "";
  if (rejected || !url || url.includes("/images/blocked.webp")) {
    throw new Error("Image upload failed");
  }
  return url;
}

function buildImageUpload(
  uri: string,
  fileNamePrefix: string,
): { mimeType: string; fileName: string } {
  const ext = getFileExt(uri, "jpg");
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    mimeType: IMAGE_MIME_BY_EXT[ext] ?? "image/jpeg",
    fileName: `${fileNamePrefix}-${unique}.${ext}`,
  };
}

// 正文插图上传前压一道。GIF 动图直接跳过（重编码会丢动画）
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

// 上传单张本地图片，返回服务器 URL。
export async function uploadSingleImage(uri: string): Promise<string> {
  const { mimeType, fileName } = buildImageUpload(uri, "upload");
  const uploaded = await uploadFile(
    uri,
    mimeType,
    fileName,
    "image",
    FILE_ENDPOINT,
  );
  return pickImageUrl(uploaded);
}

// 头像 / 背景图单独走审核接口，返回服务器 URL。
export async function uploadAvatarImage(uri: string): Promise<string> {
  const { mimeType, fileName } = buildImageUpload(uri, "avatar");
  const uploaded = await uploadFile(
    uri,
    mimeType,
    fileName,
    "image",
    AVATAR_ENDPOINT,
  );
  return pickImageUrl(uploaded);
}

// 上传单个本地视频，返回服务器 URL。
export async function uploadSingleVideo(
  uri: string,
  mimeType?: string | null,
): Promise<string> {
  const ext = getFileExt(uri, "mp4");
  const resolvedMimeType = mimeType?.startsWith("video/")
    ? mimeType
    : (VIDEO_MIME_BY_EXT[ext] ?? "video/mp4");
  const uploaded = await uploadFile(
    uri,
    resolvedMimeType,
    `upload-${Date.now()}.${ext}`,
    "video",
    FILE_ENDPOINT,
  );
  return uploaded.url ?? "";
}
