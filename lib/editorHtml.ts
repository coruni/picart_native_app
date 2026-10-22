/**
 * 把 web 编辑器（Quill）产出的 HTML 收敛成原生编辑器能正确渲染的形态。
 *
 * 原生的图片是按 `width` / `height` 分配版面的，两个属性缺失时附件被排成
 * 0×0 —— 表现就是「图片回填不出来」。Quill 的图片是
 * `<div class="ql-image-wrapper"><img src="..."></div>`，既没有尺寸，
 * 外层 div 和 caption 原生也不认识，所以这里统一改写成裸 `<img>` 并补上尺寸。
 */
import { EDITOR_BASE_FONT_SIZE } from "@/constants/editorTextStyles";
import { normalizeImageUrl } from "@/lib/image";
import { Image } from "react-native";

/** 量不到真实尺寸时的占位比例，至少让图片占一块可见的版面 */
const IMAGE_FALLBACK_RATIO = 0.5625;
const IMAGE_MEASURE_TIMEOUT_MS = 6000;
/**
 * 图片最大宽度要比编辑区窄一截。
 * 图片铺满整行时该行没有可点的空白，光标就放不进去（插不了字、改不了行）。
 */
export const ARTICLE_IMAGE_EDGE_GAP = 32;

/** 页面左右内边距之和，编辑器所在容器的可用宽度靠它算 */
const ARTICLE_EDITOR_SIDE_PADDING = 32;

/** 编辑器正文的可用宽度：窗口宽减去页面内边距 */
export function getEditorContentWidth(windowWidth: number) {
  return Math.max(Math.round(windowWidth) - ARTICLE_EDITOR_SIDE_PADDING, 1);
}
const ALIGN_CLASS_RE = /\bql-align-(center|right)\b/i;
const SIZE_CLASS_RE = /\bql-size-(\d+)px\b/i;
const STYLE_ATTR_RE = /style\s*=\s*(?:"([^"]*)"|'([^']*)')/i;
const BLOCK_TAG_RE = /<(p|h[1-6]|li|div)\b([^>]*)>/gi;
const SIZED_BLOCK_RE = /<(p|h[1-6]|li)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const CAPTION_RE =
  /<(p|figcaption)\b[^>]*class\s*=\s*["'][^"']*ql-image-caption[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi;
const IMAGE_WRAPPER_RE =
  /<div\b[^>]*class\s*=\s*["'][^"']*ql-image-wrapper[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
const IMAGE_TAG_RE = /<img\b[^>]*?\/?>/gi;
/** 单次取用不能用带 g 的那个：exec 会推进 lastIndex，连续的 img 会被跳过 */
const SINGLE_IMAGE_TAG_RE = /<img\b[^>]*?\/?>/i;

const TOKEN_PREFIX = "@@EDITOR_IMAGE_";
const TOKEN_SUFFIX = "@@";
const PARAGRAPH_RE = /<p\b([^>]*)>([\s\S]*?)<\/p>/gi;
/** 只用来切段落列表，不需要捕获组 */
const PARAGRAPH_LIST_RE = /<p\b[^>]*>[\s\S]*?<\/p>/gi;

function readAttr(tag: string, name: string) {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
    "i",
  ).exec(tag);
  return match ? (match[1] ?? match[2] ?? "") : "";
}

function sanitizeAttrValue(value: string) {
  // 原生解析器直接取引号之间的原文，不做实体解码，所以只清掉会破坏标签的字符
  return value.replace(/["<>]/g, "").replace(/\s+/g, " ").trim();
}

function fitIntoWidth(
  naturalWidth: number,
  naturalHeight: number,
  contentWidth: number,
) {
  const width = Math.max(Math.round(naturalWidth), 1);
  const height = Math.max(Math.round(naturalHeight), 1);
  if (width <= contentWidth) {
    return { width, height };
  }
  return {
    width: contentWidth,
    height: Math.max(Math.round((contentWidth * height) / width), 1),
  };
}

function measureImageSize(
  src: string,
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (size: { width: number; height: number } | null) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(size);
    };

    timer = setTimeout(() => finish(null), IMAGE_MEASURE_TIMEOUT_MS);

    Image.getSize(
      src,
      (width, height) =>
        finish(width > 0 && height > 0 ? { width, height } : null),
      () => finish(null),
    );
  });
}

/** 判断某个位置是否已经在段落内部，避免把 <p> 再套一层 */
function isInsideParagraph(source: string, index: number) {
  const before = source.slice(0, index).toLowerCase();
  return before.lastIndexOf("<p") > before.lastIndexOf("</p");
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, "")
    .trim();
}

/**
 * 图片是块级元素、在 web 上由 `.ql-image-wrapper` 居中；
 * 原生图片是行内附件，本身没有对齐能力，只能把「只放了图」的段落设成居中。
 */
function centerImageParagraphs(html: string) {
  return html.replace(PARAGRAPH_RE, (match, attrs: string, inner: string) => {
    if (!/<img\b/i.test(inner)) return match;
    // 段里还有正文就不动，否则正文会跟着居中
    if (stripTags(inner)) return match;
    // 用户手选过的对齐保留，不覆盖
    const styleMatch = STYLE_ATTR_RE.exec(attrs);
    if (styleMatch) {
      if (/text-align\s*:/i.test(attrs)) return match;
      const existing = (styleMatch[1] ?? styleMatch[2] ?? "").trim();
      const merged = existing
        ? `text-align:center;${existing}`
        : "text-align:center";
      return `<p${attrs.replace(STYLE_ATTR_RE, `style="${merged}"`)}>${inner}</p>`;
    }
    return `<p${attrs} style="text-align:center">${inner}</p>`;
  });
}

/**
 * 段落里是不是只有这张图。
 * 插图后用它决定要不要把这一段居中：段里还有正文时居中会把正文一起带歪。
 */
export function isImageAloneInParagraph(html: string, src: string) {
  const block = html
    .match(PARAGRAPH_LIST_RE)
    ?.find((item) => item.includes(src));
  // 拿不到最新 HTML（原生解析还在路上）时按「只有图」处理：
  // 插图本来就是为了让它单独占一行
  if (!block) return true;
  return stripTags(block) === "";
}

function buildImageTag(
  src: string,
  alt: string,
  width: number,
  height: number,
) {
  const safeAlt = sanitizeAttrValue(alt);
  const altPart = safeAlt ? ` alt="${safeAlt}"` : "";
  return `<img src="${sanitizeAttrValue(src)}" width="${width}" height="${height}"${altPart}/>`;
}

interface PendingImage {
  token: string;
  src: string;
  alt: string;
  declaredWidth: number;
  declaredHeight: number;
}

export async function prepareArticleHtml(
  html: string,
  contentWidth: number,
): Promise<string> {
  if (!html) return "";

  const availableWidth = Math.max(
    Math.round(contentWidth) - ARTICLE_IMAGE_EDGE_GAP,
    1,
  );
  let output = html;

  // 原生只认行内 font-size，Quill 存的是 ql-size-* 类
  output = output.replace(
    SIZED_BLOCK_RE,
    (match, tag: string, attrs: string, inner: string) => {
      const size = SIZE_CLASS_RE.exec(attrs)?.[1];
      if (!size || Number(size) === EDITOR_BASE_FONT_SIZE) return match;
      return `<${tag}${attrs}><span style="font-size:${size}px">${inner}</span></${tag}>`;
    },
  );

  // 原生按 style 读对齐，Quill 存的是 ql-align-* 类
  output = output.replace(BLOCK_TAG_RE, (match, tag: string, attrs: string) => {
    const align = ALIGN_CLASS_RE.exec(attrs)?.[1];
    if (!align) return match;

    const styleMatch = STYLE_ATTR_RE.exec(attrs);
    const existing = (styleMatch?.[1] ?? styleMatch?.[2] ?? "").trim();
    // 已经带对齐样式就别再叠一遍（重复跑会越长越长）
    if (/text-align\s*:/i.test(existing)) return match;

    const merged = existing
      ? `text-align:${align};${existing}`
      : `text-align:${align}`;

    const nextAttrs = styleMatch
      ? attrs.replace(STYLE_ATTR_RE, `style="${merged}"`)
      : `${attrs} style="${merged}"`;
    return `<${tag}${nextAttrs}>`;
  });

  // caption 是 web 独有的可编辑图注，原生没有对应结构
  output = output.replace(CAPTION_RE, "");

  const pending: PendingImage[] = [];
  const registerImage = (tag: string) => {
    const src = normalizeImageUrl(readAttr(tag, "src"));
    if (!src) return null;

    const token = `${TOKEN_PREFIX}${pending.length}${TOKEN_SUFFIX}`;
    pending.push({
      token,
      src,
      alt: readAttr(tag, "alt"),
      declaredWidth: Number(readAttr(tag, "width")) || 0,
      declaredHeight: Number(readAttr(tag, "height")) || 0,
    });
    return token;
  };

  // 外层 wrapper 只保留图片本身，图片改成原生序列化时用的裸 <img>
  output = output.replace(IMAGE_WRAPPER_RE, (_match, inner: string) => {
    const tag = SINGLE_IMAGE_TAG_RE.exec(inner)?.[0];
    const token = tag ? registerImage(tag) : null;
    return token ? `<p>${token}</p>` : "";
  });

  // 每张图单独成段，否则连续的图片会挤在同一行
  output = output.replace(
    IMAGE_TAG_RE,
    (tag, offset: number, source: string) => {
      const token = registerImage(tag);
      if (!token) return "";
      return isInsideParagraph(source, offset) ? token : `<p>${token}</p>`;
    },
  );

  const resolved = await Promise.all(
    pending.map(async (item) => {
      if (item.declaredWidth > 0 && item.declaredHeight > 0) {
        return {
          ...item,
          size: fitIntoWidth(
            item.declaredWidth,
            item.declaredHeight,
            availableWidth,
          ),
        };
      }

      const natural = await measureImageSize(item.src);
      return {
        ...item,
        size: natural
          ? fitIntoWidth(natural.width, natural.height, availableWidth)
          : {
              width: availableWidth,
              height: Math.max(
                Math.round(availableWidth * IMAGE_FALLBACK_RATIO),
                1,
              ),
            },
      };
    }),
  );

  for (const item of resolved) {
    output = output.replace(item.token, () =>
      buildImageTag(item.src, item.alt, item.size.width, item.size.height),
    );
  }

  return centerImageParagraphs(output);
}

/**
 * 提交前把原生序列化出的裸 `<img>` 收敛成 web 端认识的结构。
 *
 * 块级图（照片）要包 `div.ql-image-wrapper`：少了这层 wrapper，web 端 Quill
 * 认不出这张图（它的 image blot 就是这个 div），再从网页编辑一次图片就全丢了。
 * 尺寸不带回去：web 用 `max-width:100%` 自适应列宽，写死宽度图片会缩水。
 *
 * 行内图（表情）**不能包**：`<div>` 塞进 `<p>` 会被浏览器挤出来，整段被拆成
 * 「文字 / 居中大图 / 文字」三段，表情还会变成独占一行的块级图。
 */
export function toArticleHtml(html: string): string {
  if (!html) return "";
  return stripDividerAnchors(html).replace(
    /<p\b([^>]*)>\s*<img\b([^>]*?)\/?>\s*<\/p>|<img\b([^>]*?)\/?>/gi,
    (
      _match,
      blockAttrs: string | undefined,
      blockImg: string | undefined,
      inlineImg: string | undefined,
      offset: number,
      source: string,
    ) => {
      // 图独占一段
      if (blockAttrs !== undefined) {
        const tag = blockImg ?? "";
        // 一段只有一个表情：包成块级图就成了整行大图，保持段落 + 行内图
        return isEmojiSized(tag)
          ? `<p${blockAttrs}>${buildWebInlineImage(tag)}</p>`
          : buildWebBlockImage(tag);
      }

      const tag = inlineImg ?? "";
      // 已经包过 wrapper 的图（web 回流的 HTML、或本函数重复调用）原样保留，
      // 否则会再套一层 div
      if (/\bql-image\b/.test(tag)) return `<img${tag}>`;
      if (isInsideParagraph(source, offset)) {
        // 段里夹着文字的图：包 wrapper 会把 <p> 拆散；大图也不能套 ql-emoji
        // （阅读页的样式会把它缩成 32px）。表情保持行内，大图原样留着。
        return isEmojiSized(tag)
          ? buildWebInlineImage(tag)
          : buildWebBareImage(tag);
      }
      // 段落之外的图仍然按块级处理，只是小尺寸的补一层段落免得贴着上一段
      return isEmojiSized(tag)
        ? `<p>${buildWebInlineImage(tag)}</p>`
        : buildWebBlockImage(tag);
    },
  );
}

/** 表情图上限定：超过这个尺寸就当正文照片处理 */
const EMOJI_MAX_SIZE = 48;

function isEmojiSized(tag: string) {
  const width = Number(readAttr(tag, "width")) || 0;
  const height = Number(readAttr(tag, "height")) || 0;
  return (
    width > 0 &&
    height > 0 &&
    width <= EMOJI_MAX_SIZE &&
    height <= EMOJI_MAX_SIZE
  );
}

function buildWebBlockImage(tag: string) {
  const src = sanitizeAttrValue(readAttr(tag, "src"));
  if (!src) return "";
  const alt = sanitizeAttrValue(readAttr(tag, "alt"));
  const altPart = alt ? ` alt="${alt}"` : "";
  return `<div class="ql-image-wrapper"><img src="${src}" class="ql-image"${altPart}></div>`;
}

/** 行内图：`ql-emoji` 是阅读页把它按行内渲染的钩子，尺寸原样带回去 */
function buildWebInlineImage(tag: string) {
  const src = sanitizeAttrValue(readAttr(tag, "src"));
  if (!src) return "";
  const alt = sanitizeAttrValue(readAttr(tag, "alt"));
  const altPart = alt ? ` alt="${alt}"` : "";
  const width = Number(readAttr(tag, "width")) || 0;
  const height = Number(readAttr(tag, "height")) || 0;
  const sizePart =
    width > 0 && height > 0 ? ` width="${width}" height="${height}"` : "";
  return `<img src="${src}" class="ql-emoji"${sizePart}${altPart}>`;
}

/** 段内的大图：什么都不加，交给两端各自的行内图规则（加 class 会被缩成表情大小） */
function buildWebBareImage(tag: string) {
  const src = sanitizeAttrValue(readAttr(tag, "src"));
  if (!src) return "";
  const alt = sanitizeAttrValue(readAttr(tag, "alt"));
  const altPart = alt ? ` alt="${alt}"` : "";
  const width = Number(readAttr(tag, "width")) || 0;
  const height = Number(readAttr(tag, "height")) || 0;
  const sizePart =
    width > 0 && height > 0 ? ` width="${width}" height="${height}"` : "";
  return `<img src="${src}"${sizePart}${altPart}>`;
}

/**
 * 分割线是「借链接插一段横线，再延迟摘掉链接」的产物。
 * 摘链那一步没跑完就发布，正文里会留下 `href="#"` 的死链，提交前兜一层。
 */
function stripDividerAnchors(html: string) {
  return html.replace(
    /<a\b[^>]*href\s*=\s*["']#["'][^>]*>([\s\S]*?)<\/a>/gi,
    "$1",
  );
}
