// 富文本正文的「有没有东西可显示」判定 + 纯文本预览。

const RE_HTML_TAGS = /<[^>]*>/g;
const RE_NBSP = /&nbsp;|&#160;/gi;
/** 内嵌媒体：表情是 <img>，正文里的照片也是 <img>，视频/音频按同样口径算内容 */
const RE_EMBED_MEDIA = /<(?:img|video|audio|iframe)\b/i;
/** 表情 span 要先于其它标签处理，它内部还套着 <img> */
const RE_EMOJI_SPAN =
  /<span\b[^>]*class="[^"]*ql-emoji-embed[^"]*"[^>]*>[\s\S]*?<\/span>/gi;
const RE_TITLE_ATTR = /\btitle\s*=\s*(?:"([^"]*)"|'([^']*)')/i;
const RE_MEDIA_TAG = /<(?:img|video|audio|iframe)\b[^>]*\/?>/gi;
const RE_BLOCK_BREAK = /<br\s*\/?>|<\/(?:p|div)>/gi;

/** 正文里有没有内嵌媒体（表情图、图片、视频…） */
export function hasEmbeddedMedia(html?: string | null): boolean {
  return RE_EMBED_MEDIA.test(html ?? "");
}

/** 剥标签 + 反转义 nbsp 后的可读文字，用来判空 / 做纯文本预览 */
export function htmlToPlainText(html?: string | null): string {
  return (html ?? "").replace(RE_HTML_TAGS, "").replace(RE_NBSP, " ").trim();
}

/** 正文 HTML 本身有没有可渲染的东西：文字或内嵌媒体 */
export function hasRenderableHtml(html?: string | null): boolean {
  return hasEmbeddedMedia(html) || htmlToPlainText(html).length > 0;
}

/** 整条评论 / 回复有没有可渲染的东西：正文 + 附件图 */
export function hasRenderableContent(
  content?: string | null,
  images?: readonly unknown[] | null,
): boolean {
  return hasRenderableHtml(content) || Boolean(images?.length);
}

// 富文本转纯文本预览（引用、复制、通知摘要这类只能显示文字的地方）。
export function htmlToPreviewText(
  html?: string | null,
  options: { imagePlaceholder?: string; emojiPlaceholder?: string } = {},
): string {
  const raw = html ?? "";
  if (!raw) return "";

  const emojiPlaceholder = options.emojiPlaceholder ?? "";
  const imagePlaceholder = options.imagePlaceholder ?? "";

  return decodeBasicEntities(
    raw
      .replace(RE_EMOJI_SPAN, (span) => {
        const title = readTitle(span);
        return title ? `[${title}]` : emojiPlaceholder;
      })
      .replace(RE_BLOCK_BREAK, " ")
      .replace(RE_MEDIA_TAG, () => imagePlaceholder)
      .replace(RE_HTML_TAGS, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function readTitle(span: string): string {
  const match = RE_TITLE_ATTR.exec(span);
  return (match?.[1] ?? match?.[2] ?? "").trim();
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}
