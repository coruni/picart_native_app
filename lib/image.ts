import { ImageData } from "@/types/api";

export type ImageSource = ImageData | string | null | undefined;

export type ImageSize = "small" | "medium" | "large" | "original";

/**
 * 图片地址归一化的两个基准站。
 *
 * 这里直接读 `process.env.EXPO_PUBLIC_*`（构建期内联），而不是 import
 * `@/api/client`：后者会连带引入 axios / expo-router / zustand store，
 * 而 store 又会回头引用图片工具，容易形成循环依赖。
 */
const API_ORIGIN = toOrigin(process.env.EXPO_PUBLIC_API_URL);
const WEB_ORIGIN = toOrigin(process.env.EXPO_PUBLIC_WEB_URL);

function toOrigin(value?: string): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  const match = /^(https?:)\/\/([^/?#]+)/i.exec(raw);
  return match ? `${match[1].toLowerCase()}//${match[2]}` : null;
}

/** 本机 / 内网地址：开发时后端常跑在 http 上，不能强制升级成 https */
const LOCAL_HOST_RE =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?$/i;

/** 取二级域名，用来判断「是不是我们自己的域名」 */
function registrableDomain(host: string): string {
  const labels = host.toLowerCase().split(".").filter(Boolean);
  return labels.length <= 2 ? labels.join(".") : labels.slice(-2).join(".");
}

const OWN_DOMAINS = new Set(
  [API_ORIGIN, WEB_ORIGIN]
    .map((origin) => origin && /^https?:\/\/([^/?#]+)/i.exec(origin)?.[1])
    .filter((host): host is string => !!host)
    .map((host) => registrableDomain(host.replace(/:\d+$/, ""))),
);

function isOwnHost(hostWithPort: string): boolean {
  const host = hostWithPort.replace(/:\d+$/, "").toLowerCase();
  if (OWN_DOMAINS.size === 0) return true;
  const domain = registrableDomain(host);
  return OWN_DOMAINS.has(domain);
}

/**
 * 把后端返回的图片地址整理成可以直接交给 `Image` / `WebView` 的绝对地址。
 *
 * 需要处理的三种历史数据（后端不同时期写入的）：
 * 1. `http://api.cerylab.com/uploads/...` —— 明文 HTTP。
 *    开发包（debug manifest 里 `usesCleartextTraffic=true`）能加载，
 *    但 release 包在 Android 9+ 默认禁止明文流量，图片会全部加载失败。
 *    自己的域名都支持 HTTPS，这里统一升级，避免依赖放宽明文策略。
 * 2. `/uploads/2026/...` —— 根相对路径，交给 `Image` 无法解析。
 *    以 `/uploads/` 开头的挂在 API 主机上，其余根路径挂在 Web 站点上。
 * 3. `//api.cerylab.com/uploads/...` —— 协议相对路径，同样补全协议。
 */
export function normalizeImageUrl(
  value?: string | null,
): string | undefined {
  if (typeof value !== "string") return undefined;

  let url = value.trim();
  if (!url) return undefined;

  // 本地文件 / 内联数据 / 原生相册标识，保持原样
  if (/^(data:|blob:|file:|content:|ph:|assets-library:|asset:)/i.test(url)) {
    return url;
  }

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  if (url.startsWith("/")) {
    const base = /^\/uploads\//i.test(url)
      ? (API_ORIGIN ?? WEB_ORIGIN)
      : (WEB_ORIGIN ?? API_ORIGIN);
    if (base) url = `${base}${url}`;
  }

  const httpMatch = /^http:\/\/([^/?#]+)/i.exec(url);
  if (httpMatch && isOwnHost(httpMatch[1]) && !LOCAL_HOST_RE.test(httpMatch[1])) {
    url = `https://${url.slice("http://".length)}`;
  }

  return url;
}

const SIZE_KEY_MAP: Record<Exclude<ImageSize, "original">, keyof ImageData["thumbnails"]> = {
  small: "thumb",
  medium: "medium",
  large: "large",
};

export function getImageUrl(
  source: ImageSource,
  size: ImageSize = "original",
): string | undefined {
  if (!source) return undefined;

  if (typeof source === "string") {
    return normalizeImageUrl(source);
  }

  if (size !== "original") {
    const thumbKey = SIZE_KEY_MAP[size];
    const thumbnail = thumbKey ? normalizeImageUrl(source.thumbnails?.[thumbKey]) : undefined;
    if (thumbnail) return thumbnail;
  }

  // `original` 是相对路径（/uploads/xxx-original.webp），只在 url 缺失时兜底
  return normalizeImageUrl(source.url) ?? normalizeImageUrl(source.original);
}

export function getImageSource(
  source: ImageSource,
  size: ImageSize = "original",
): string | ImageData | undefined {
  if (!source) return undefined;

  if (typeof source === "string") {
    return normalizeImageUrl(source);
  }

  const url = getImageUrl(source, size);
  if (url) {
    return url;
  }

  return source;
}
