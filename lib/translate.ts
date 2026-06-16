import i18n from "i18next";

/**
 * 微软翻译服务封装（Edge 免费翻译接口）。
 * 用于全局翻译用户产生的内容（文章标题、简介、评论等）。
 *
 * 流程：
 * 1. GET https://edge.microsoft.com/translate/auth 获取 JWT 鉴权 token（有效期约 10 分钟）
 * 2. POST https://api.cognitive.microsofttranslator.com/translate 发起翻译
 *
 * 特性：
 * - token 内存缓存并自动刷新
 * - 译文内存缓存：相同 (目标语言, 原文) 只翻译一次
 * - 请求合并：同一帧内的多次单条翻译会自动合并成一次 POST，
 *   适合列表中大量卡片各自触发翻译的场景
 */

const AUTH_ENDPOINT = "https://edge.microsoft.com/translate/auth";
const TRANSLATE_ENDPOINT =
  "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
/** token 缓存时长（毫秒）：官方有效期约 10 分钟，留出余量提前刷新 */
const TOKEN_TTL = 8 * 60 * 1000;

/** 单次请求最多合并的文本条数，超过则立即发出一批 */
const MAX_BATCH = 50;
/** 合并窗口（毫秒）：收集这段时间内的翻译请求后统一发出 */
const FLUSH_DELAY = 16;

/** 微软翻译支持的目标语言代码（BCP-47 子集，按需扩充） */
export type TranslateLang = "zh-Hans" | "zh-Hant" | "en";

interface MicrosoftTranslateItem {
  detectedLanguage?: { language: string; score: number };
  translations: {
    text: string;
    to: string;
    sentLen?: { srcSentLen: number[]; transSentLen: number[] };
  }[];
}

/** i18n 语言代码 -> 微软翻译语言代码 */
function mapI18nLangToTranslate(lng: string): TranslateLang {
  if (lng.startsWith("zh")) {
    // 繁体（zh-Hant / zh-TW / zh-HK / zh-MO）走繁体，其余简体
    if (/hant|tw|hk|mo/i.test(lng)) return "zh-Hant";
    return "zh-Hans";
  }
  return "en";
}

/** 取当前 i18n 语言对应的翻译目标语言 */
export function getCurrentTargetLang(): TranslateLang {
  return mapI18nLangToTranslate(i18n.language || "en");
}

// 鉴权 token 缓存
let cachedToken: string | null = null;
let tokenExpireAt = 0;
let tokenPromise: Promise<string> | null = null;

/** 获取微软翻译鉴权 token，命中缓存则复用 */
async function getAuthToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpireAt) {
    return cachedToken;
  }
  if (tokenPromise) return tokenPromise;

  tokenPromise = (async () => {
    const response = await fetch(AUTH_ENDPOINT, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Translate auth failed: HTTP ${response.status}`);
    }
    const token = (await response.text()).trim();
    if (!token) {
      throw new Error("Translate auth returned empty token");
    }
    cachedToken = token;
    tokenExpireAt = Date.now() + TOKEN_TTL;
    return token;
  })().finally(() => {
    tokenPromise = null;
  });

  return tokenPromise;
}

// 译文内存缓存：key = `${to}::${text}`，value = 译文
const cache = new Map<string, string>();

function cacheKey(to: TranslateLang, text: string): string {
  return `${to}::${text}`;
}

// 进行中的请求：同一 key 的并发翻译复用同一个 Promise，避免重复请求
type Deferred = {
  promise: Promise<string>;
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
};
const inflight = new Map<string, Deferred>();

// 待发送队列：按目标语言分组收集原文
const pending = new Map<TranslateLang, string[]>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function createDeferred(): Deferred {
  let resolve!: (value: string) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** 向微软翻译服务发送一批文本，返回原始响应数组 */
async function requestTranslate(
  texts: string[],
  to: TranslateLang,
  textType: "plain" | "html" = "plain",
): Promise<MicrosoftTranslateItem[]> {
  const token = await getAuthToken();
  const url = `${TRANSLATE_ENDPOINT}&to=${encodeURIComponent(to)}&textType=${textType}&includeSentenceLength=false`;

  const send = (authToken: string) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(texts.map((text) => ({ Text: text }))),
    });

  let response = await send(token);

  // token 过期（401/403）时强制刷新一次再重试
  if (response.status === 401 || response.status === 403) {
    cachedToken = null;
    tokenExpireAt = 0;
    response = await send(await getAuthToken());
  }

  if (!response.ok) {
    throw new Error(`Translate request failed: HTTP ${response.status}`);
  }

  return (await response.json()) as MicrosoftTranslateItem[];
}

/** 发出某目标语言队列中已收集的全部文本 */
function flushLang(to: TranslateLang, texts: string[]): void {
  void (async () => {
    try {
      const data = await requestTranslate(texts, to);
      texts.forEach((source, index) => {
        const translated = data[index]?.translations?.[0]?.text;
        const key = cacheKey(to, source);
        const deferred = inflight.get(key);
        if (typeof translated === "string") {
          cache.set(key, translated);
          deferred?.resolve(translated);
        } else {
          deferred?.resolve(source);
        }
        inflight.delete(key);
      });
    } catch (error) {
      texts.forEach((source) => {
        const key = cacheKey(to, source);
        inflight.get(key)?.reject(error);
        inflight.delete(key);
      });
    }
  })();
}

/** 处理所有目标语言的待发送队列 */
function flushAll(): void {
  flushTimer = null;
  for (const [to, texts] of pending) {
    if (texts.length > 0) flushLang(to, texts);
  }
  pending.clear();
}

/** 把单条文本加入合并队列，返回其译文 Promise */
function enqueue(text: string, to: TranslateLang): Promise<string> {
  const key = cacheKey(to, text);

  const existing = inflight.get(key);
  if (existing) return existing.promise;

  const deferred = createDeferred();
  inflight.set(key, deferred);

  const queue = pending.get(to) ?? [];
  queue.push(text);
  pending.set(to, queue);

  // 队列达到上限立即发出当前语言这批
  if (queue.length >= MAX_BATCH) {
    pending.set(to, []);
    flushLang(to, queue);
  } else if (flushTimer === null) {
    flushTimer = setTimeout(flushAll, FLUSH_DELAY);
  }

  return deferred.promise;
}

/**
 * 翻译单条文本，目标语言默认跟随当前 i18n 语言。
 * - 空字符串原样返回，不发请求
 * - 命中缓存直接返回
 * - 否则进入合并队列，与同帧内的其他翻译合并成一次请求
 */
export async function translateText(
  text: string,
  to: TranslateLang = getCurrentTargetLang(),
): Promise<string> {
  if (!text || !text.trim()) return text;

  const cached = cache.get(cacheKey(to, text));
  if (cached !== undefined) return cached;

  return enqueue(text, to);
}

/**
 * 批量翻译一组文本，返回与入参顺序、长度一一对应的译文数组。
 * 内部复用合并队列与缓存，空串原样返回。
 *
 * @param texts 待翻译文本数组
 * @param to    目标语言，默认跟随当前 i18n 语言
 */
export async function translateBatch(
  texts: string[],
  to: TranslateLang = getCurrentTargetLang(),
): Promise<string[]> {
  if (texts.length === 0) return [];
  return Promise.all(texts.map((text) => translateText(text, to)));
}

/** 清空翻译内存缓存（如切换语言或需要释放内存时调用） */
export function clearTranslateCache(): void {
  cache.clear();
}

export interface TranslateHtmlResult {
  html: string;
  detectedLang: string | null;
}

/**
 * 翻译 HTML 内容。
 * 使用 textType=html，微软翻译会保留标签只翻译文本节点。
 * 不进入合并队列（HTML 大且每篇文章唯一），直接发请求，有内存缓存。
 *
 * @param html 含 HTML 标签的原文
 * @param to   目标语言，默认跟随当前 i18n 语言
 */
export async function translateHtml(
  html: string,
  to: TranslateLang = getCurrentTargetLang(),
): Promise<TranslateHtmlResult> {
  if (!html || !html.trim()) return { html, detectedLang: null };

  const key = `html::${cacheKey(to, html)}`;
  const detectedKey = `detected::${cacheKey(to, html)}`;
  const cached = cache.get(key);
  if (cached !== undefined) {
    return { html: cached, detectedLang: cache.get(detectedKey) ?? null };
  }

  const data = await requestTranslate([html], to, "html");
  const translated = data[0]?.translations?.[0]?.text ?? html;
  const detectedLang = data[0]?.detectedLanguage?.language ?? null;
  cache.set(key, translated);
  if (detectedLang) cache.set(detectedKey, detectedLang);
  return { html: translated, detectedLang };
}
