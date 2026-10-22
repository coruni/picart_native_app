import i18n from "i18next";
import { franc } from "franc-min";

/**
 * 微软翻译服务封装（Edge 浏览器翻译的免鉴权端点）。
 * 用于全局翻译用户产生的内容（文章标题、简介、评论等）。
 *
 * 端点：POST https://edge.microsoft.com/translate/translatetext?from=&to=xx
 * - 请求体是**字符串数组**（不是旧 Azure 的 [{ Text }] 结构）
 * - 无需鉴权，但必须带浏览器 UA，否则返回 400 "Client Browser Version not supported"
 * - `from` 留空表示自动识别；显式传 `from=auto` 会返回空数组
 *
 * 历史：原先走 `edge.microsoft.com/translate/auth` 换 JWT 再打
 * `api.cognitive.microsofttranslator.com`，微软在 2026-07-30 关停 Edge 翻译服务后，
 * 该 token 端点对所有请求固定返回 404，整条链路失效，故改为上述免鉴权端点。
 *
 * 特性：
 * - 译文内存缓存：相同 (目标语言, 原文) 只翻译一次
 * - 请求合并：同一帧内的多次单条翻译会自动合并成一次 POST，
 *   适合列表中大量卡片各自触发翻译的场景
 * - HTML 在本地切成标签/文本节点，只送文本节点，标签与属性原样保留
 *   （新端点不认 textType=html，直接送 HTML 会把属性引号替换成中文引号并破坏标签）
 */

const TRANSLATE_ENDPOINT =
  "https://edge.microsoft.com/translate/translatetext";

/** 端点要求请求带浏览器 UA：无 UA 直接 400，UA 为 okhttp/curl 默认值则正常 */
const REQUEST_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";

/** 单次请求最多合并的文本条数，超过则立即发出一批 */
const MAX_BATCH = 50;
/** 单次请求文本总长上限，超过就拆批（端点自身限制约 5 万字符） */
const MAX_BATCH_CHARS = 4000;
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

// 译文内存缓存：key = `${to}::${text}`，value = 译文
const cache = new Map<string, string>();

// 源语言检测缓存：key = 原文，value = BCP-47 风格语言代码（如 "zh"、"en"）
const detectedLangCache = new Map<string, string>();

/**
 * 两个缓存都是进程级 Map，不设上限的话长会话里会一直累积文章全文，
 * 因此按「最多 N 条、超出淘汰最早写入」控制（FIFO，足够用且无额外开销）。
 */
const MAX_CACHE_ENTRIES = 1000;

function setBounded(
  target: Map<string, string>,
  key: string,
  value: string,
): void {
  if (!target.has(key) && target.size >= MAX_CACHE_ENTRIES) {
    const oldest = target.keys().next().value;
    if (oldest !== undefined) target.delete(oldest);
  }
  target.set(key, value);
}

/** franc ISO 639-3 -> BCP-47 主语言代码 */
const FRANC_TO_BCP47: Record<string, string> = {
  cmn: "zh", zho: "zh", yue: "zh", wuu: "zh",
  eng: "en",
  jpn: "ja",
  kor: "ko",
  fra: "fr",
  deu: "de",
  spa: "es",
  por: "pt",
  rus: "ru",
  ara: "ar",
  ita: "it",
  vie: "vi",
  tha: "th",
  ind: "id",
};

/** 按 Unicode 脚本识别 CJK 等语言，短文本也能可靠判断；无法识别返回 null */
function detectByScript(text: string): string | null {
  // 平假名/片假名 → 日文（即便夹杂汉字也优先判为日文）
  if (/[぀-ヿ]/.test(text)) return "ja";
  // 谚文 → 韩文
  if (/[가-힯ᄀ-ᇿ]/.test(text)) return "ko";
  // 汉字 → 中文
  if (/[㐀-鿿豈-﫿]/.test(text)) return "zh";
  return null;
}

/** 本地检测文本语言，返回 BCP-47 主语言代码；无法识别时返回 null；纯数字/符号返回 "num" */
function detectLangLocally(text: string): string | null {
  const plain = text.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").trim();
  if (!plain) return null;
  // 纯数字、标点、空白，无需翻译（短内容也要检测）
  if (/^[\d\s\p{P}\p{S}]+$/u.test(plain)) return "num";

  // CJK 等脚本即便很短也能可靠识别，优先处理
  const scriptLang = detectByScript(plain);
  if (scriptLang) return scriptLang;

  // 较长文本交给 franc 统计检测，保留对法语/西语等欧洲语言的识别能力
  if (plain.length >= 10) {
    const code = franc(plain, { minLength: 10 });
    if (code !== "und") return FRANC_TO_BCP47[code] ?? code.slice(0, 2);
  }

  // 短拉丁文本 franc 无法判断，本应用非 CJK 目标语言只有英文，视为英文
  const letters = plain.replace(/[\d\s\p{P}\p{S}]/gu, "");
  if (letters && /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(letters)) return "en";

  return null;
}

/** 查询某段文本检测到的源语言，缓存未命中时同步做本地检测并写入缓存 */
export function getDetectedLang(text: string): string | null {
  if (detectedLangCache.has(text)) return detectedLangCache.get(text)!;
  const detected = detectLangLocally(text);
  if (detected) setBounded(detectedLangCache, text, detected);
  return detected;
}

function cacheKey(to: TranslateLang, text: string): string {
  return `${to}::${text}`;
}

/** 同步读取译文缓存，命中返回译文，否则返回 null */
export function getCachedTranslation(text: string, to: TranslateLang): string | null {
  if (!text || !text.trim()) return null;
  return cache.get(cacheKey(to, text)) ?? null;
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

/** 向微软翻译服务发送一批文本，返回原始响应数组（顺序与入参一致） */
async function requestTranslate(
  texts: string[],
  to: TranslateLang,
): Promise<MicrosoftTranslateItem[]> {
  const url = `${TRANSLATE_ENDPOINT}?from=&to=${encodeURIComponent(to)}`;

  const send = () =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": REQUEST_USER_AGENT,
      },
      body: JSON.stringify(texts),
    });

  let response = await send();

  // 限流或网关抖动重试一次，避免列表并发翻译时整批失败
  if (response.status === 429 || response.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    response = await send();
  }

  if (!response.ok) {
    throw new Error(`Translate request failed: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Translate response is not an array");
  }

  return data as MicrosoftTranslateItem[];
}

/** 发出某目标语言队列中已收集的全部文本 */
function flushLang(to: TranslateLang, texts: string[]): void {
  void (async () => {
    try {
      const data = await requestTranslate(texts, to);
      texts.forEach((source, index) => {
        const translated = data[index]?.translations?.[0]?.text;
        const detected = data[index]?.detectedLanguage?.language;
        if (detected) setBounded(detectedLangCache, source, detected);
        const key = cacheKey(to, source);
        const deferred = inflight.get(key);
        if (typeof translated === "string") {
          setBounded(cache, key, translated);
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
  // 纯数字 / 符号没有可翻的内容：不发请求，也避免调用方把它当成译文
  if (!hasTranslatableContent(text)) return text;

  if (!detectedLangCache.has(text)) {
    const detected = detectLangLocally(text);
    if (detected) setBounded(detectedLangCache, text, detected);
  }

  const cached = cache.get(cacheKey(to, text));
  if (cached !== undefined) return cached;

  // 原文已经是目标语言时直接当译文返回，不发请求：
  // 列表里每张卡都会调这里，命中短路能省掉整屏的网络往返。
  if (isAlreadyTargetLang(detectedLangCache.get(text) ?? null, text, to)) {
    setBounded(cache, cacheKey(to, text), text);
    return text;
  }

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

/** HTML 里不需要翻译的容器，内部的文本节点原样保留 */
const HTML_SKIP_TAGS = new Set(["script", "style", "pre", "code", "kbd", "samp"]);

/** 自闭合标签，不参与嵌套栈 */
const HTML_VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type HtmlToken = { text: string; translatable: boolean };

/**
 * 把 HTML 切成「标签」与「文本节点」两类 token。
 * 只对纯文本节点做翻译，标签、属性、注释一律原样保留。
 */
function tokenizeHtml(html: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  const stack: string[] = [];

  for (const part of html.split(/(<[^>]*>)/)) {
    if (!part) continue;

    if (part.startsWith("<")) {
      tokens.push({ text: part, translatable: false });

      const name = /^<\s*\/?\s*([a-zA-Z][\w-]*)/.exec(part)?.[1]?.toLowerCase();
      if (!name) continue;

      const isClosing = /^<\s*\//.test(part);
      const isSelfClosing =
        /\/\s*>$/.test(part) || HTML_VOID_TAGS.has(name) || part.startsWith("<!");

      if (isClosing) {
        const index = stack.lastIndexOf(name);
        if (index !== -1) stack.splice(index, 1);
      } else if (!isSelfClosing) {
        stack.push(name);
      }
      continue;
    }

    const skipped = stack.some((tag) => HTML_SKIP_TAGS.has(tag));
    tokens.push({ text: part, translatable: !skipped });
  }

  return tokens;
}

/** 文本节点是否值得送翻译：至少含一个字母/汉字，纯数字与符号跳过 */
function needsTranslation(text: string): boolean {
  const plain = text.replace(/&[a-z#0-9]+;/gi, " ").trim();
  if (!plain) return false;
  if (!/\p{L}/u.test(plain)) return false;
  return !/^[\d\s\p{P}\p{S}]+$/u.test(plain);
}

/**
 * 这段内容里有没有真正值得翻译的东西。
 *
 * 纯数字（"123"）、纯符号（"· · ·"）、只有空白，或者正文里只有
 * pre/code 这类不送翻的节点时返回 false —— 这种情况翻译出来和原文一模一样，
 * 调用方不该把它当成「已翻译」，否则页面会挂出一个什么也没变的翻译标语。
 */
export function hasTranslatableContent(text: string): boolean {
  if (!text) return false;
  const plain = text
    // pre/code 里的内容本来就不送翻译，判断时也排除
    .replace(/<(script|style|pre|code|kbd|samp)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .trim();
  return needsTranslation(plain);
}

/**
 * 主脚本判定：汉字数量占优算中文，拉丁字母占优算拉丁文本。
 * 只看「有没有中文」会把中英混排的文章全判成中文，所以按占比判断。
 */
function dominantScriptIsZh(text: string): boolean | null {
  const plain = text.replace(/<[^>]*>/g, " ");
  const cjk = (plain.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? []).length;
  const latin = (plain.match(/[A-Za-z]/g) ?? []).length;
  if (cjk === 0 && latin === 0) return null;
  return cjk >= latin;
}

/**
 * 原文是否已经是目标语言（可跳过请求）。
 * - 简繁无法本地区分，zh-Hant 一律交给服务端判断
 * - 只有当目标语种的主力脚本占优时才跳过，避免混排文章被误判
 */
function isAlreadyTargetLang(detected: string | null, text: string, to: TranslateLang): boolean {
  if (!detected) return false;
  if (to === "zh-Hant") return false;

  const zhDominant = dominantScriptIsZh(text);
  if (zhDominant === null) return false;

  if (to === "zh-Hans") return detected === "zh" && zhDominant;
  return detected === to && !zhDominant;
}

/** 按条数与字符总量把下标切成若干批 */
function chunkIndices(indices: number[], texts: string[]): number[][] {
  const chunks: number[][] = [];
  let current: number[] = [];
  let chars = 0;

  for (const index of indices) {
    const size = texts[index]?.length ?? 0;
    if (current.length > 0 && (current.length >= MAX_BATCH || chars + size > MAX_BATCH_CHARS)) {
      chunks.push(current);
      current = [];
      chars = 0;
    }
    current.push(index);
    chars += size;
  }

  if (current.length > 0) chunks.push(current);
  return chunks;
}

/**
 * 翻译 HTML 内容。
 *
 * 新端点不支持 textType=html，直接送标签会被改写（属性引号变中文引号、标签错位），
 * 因此在本地按标签切分，只翻译文本节点，再按原顺序拼回去。
 * 不进入合并队列（HTML 大且每篇文章唯一），有内存缓存。
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
    const detectedLang = cache.get(detectedKey) ?? detectLangLocally(html);
    return { html: cached, detectedLang };
  }

  const localLang = detectLangLocally(html);

  // 正文里没有可翻的文字（纯数字、只有图片和标签）：原样返回
  if (!hasTranslatableContent(html)) {
    return { html, detectedLang: localLang };
  }

  // 原文已经是目标语言：不发请求，直接当译文用（调用方据此隐藏翻译标语）
  if (isAlreadyTargetLang(localLang, html, to)) {
    setBounded(cache, key, html);
    setBounded(cache, detectedKey, localLang!);
    return { html, detectedLang: localLang };
  }

  const tokens = tokenizeHtml(html);
  const indices = tokens.reduce<number[]>((acc, token, index) => {
    if (token.translatable && needsTranslation(token.text)) acc.push(index);
    return acc;
  }, []);

  if (indices.length === 0) {
    return { html, detectedLang: localLang };
  }

  let apiDetected: string | null = null;
  let succeeded = 0;
  let lastError: unknown = null;

  for (const chunk of chunkIndices(indices, tokens.map((t) => t.text))) {
    // 保留首尾空白，避免拼回去后内联元素之间粘连
    const payload = chunk.map((index) => {
      const raw = tokens[index]!.text;
      const lead = /^\s*/.exec(raw)?.[0] ?? "";
      const trail = /\s*$/.exec(raw)?.[0] ?? "";
      return raw.slice(lead.length, raw.length - trail.length);
    });

    try {
      const data = await requestTranslate(payload, to);
      succeeded += 1;

      chunk.forEach((tokenIndex, position) => {
        const raw = tokens[tokenIndex]!.text;
        const lead = /^\s*/.exec(raw)?.[0] ?? "";
        const trail = /\s*$/.exec(raw)?.[0] ?? "";
        const translated = data[position]?.translations?.[0]?.text;

        if (typeof translated === "string" && translated.trim()) {
          tokens[tokenIndex]!.text = `${lead}${translated.trim()}${trail}`;
        }
        if (!apiDetected) {
          apiDetected = data[position]?.detectedLanguage?.language ?? null;
        }
      });
    } catch (error) {
      lastError = error;
    }
  }

  // 一批都没成功才向上抛，交由调用方展示原文；部分失败保留原文片段
  if (succeeded === 0 && lastError) {
    throw lastError instanceof Error ? lastError : new Error("Translate failed");
  }

  const translatedHtml = tokens.map((token) => token.text).join("");
  const detectedLang = apiDetected ?? localLang;
  setBounded(cache, key, translatedHtml);
  if (detectedLang) setBounded(cache, detectedKey, detectedLang);

  return { html: translatedHtml, detectedLang };
}
