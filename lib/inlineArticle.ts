import { normalizeImageUrl } from "@/lib/image";

/** 内联帖子卡片所需的最小元数据，发布时由 picker 的 InlinePost 推导得到 */
export interface InlineArticleMeta {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  cover: string;
  views: number;
}

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? "";

export const postLink = (id: string) => `${WEB_URL}/article/${id}`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 属性值用单引号包裹，所以把单引号也转义掉，避免 JSON 里的撇号提前截断属性 */
function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function formatViews(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  }
  return String(count);
}

/** 封面：有图就铺满，没图退化为占位图标（和网页端 blot 同款 SVG） */
function coverHtml(cover?: string): string {
  const src = cover ? normalizeImageUrl(cover) : "";
  if (src) {
    return `<div class="inline-article-cover"><img src="${escapeAttr(
      src,
    )}" alt="" loading="lazy" /></div>`;
  }
  return `<div class="inline-article-cover inline-article-cover-placeholder">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>`;
}

function avatarHtml(avatar?: string): string {
  const src = avatar ? normalizeImageUrl(avatar) : "";
  if (src) {
    return `<img src="${escapeAttr(
      src,
    )}" alt="" class="inline-article-author-avatar-img" />`;
  }
  return `<div class="inline-article-author-avatar-fallback">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>`;
}

/**
 * 生成网页端 `InlineArticleListBlot` 同结构的卡片块。
 *
 * 阅读端（WebView）用 `inline-article.css` 渲染，编辑器（enriched-html）无法存储
 * 这种块，所以正文里只放普通链接，发布时由 `upgradeInlinePosts` 升级成这里的结构。
 * `data-articles` 保留原始元数据，方便网页端再次编辑时还原。
 */
export function buildInlineArticleListHtml(posts: InlineArticleMeta[]): string {
  if (!posts.length) return "";
  const articles = posts.map((p) => ({
    id: p.id,
    title: p.title,
    authorName: p.authorName,
    authorAvatar: p.authorAvatar,
    cover: p.cover,
    views: p.views,
  }));
  const dataAttr = escapeAttr(JSON.stringify(articles));
  const cards = posts
    .map((post) => {
      const title = post.title || `Post #${post.id}`;
      return `<div class="inline-article-card" data-article-id="${escapeAttr(
        post.id,
      )}">
  <div class="inline-article-wrapper">
    ${coverHtml(post.cover)}
    <div class="inline-article-content">
      <div class="inline-article-title">${escapeHtml(title)}</div>
      <div class="inline-article-meta">
        <div class="inline-article-author">
          <div class="inline-article-author-avatar">${avatarHtml(
            post.authorAvatar,
          )}</div>
          <span class="inline-article-author-name">${escapeHtml(
            post.authorName,
          )}</span>
        </div>
        <div class="inline-article-views">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>${formatViews(post.views)}</span>
        </div>
      </div>
    </div>
  </div>
</div>`;
    })
    .join("");
  return `<div class="ql-inline-article-list" contenteditable="false" data-articles='${dataAttr}'>${cards}</div>`;
}

/**
 * 把正文里内联帖子选择器生成的 `📄 标题` 链接，替换成 `ql-inline-article-list` 卡片块。
 *
 * 只认带 `📄` 前缀且指向 `/article/<id>` 的链接——那是本 App 选择器插入的标记；
 * 用户手打的外链不会带这个前缀，原样保留。元数据来自发布时维护的 map（编辑器存不下块）。
 */
const INLINE_POST_LINK =
  /<a\s+([^>]*?)href="([^"]*?\/article\/(\d+)(?:[^"]*))"([^>]*)>\s*📄[\s\S]*?<\/a>/gi;

export function upgradeInlinePosts(
  html: string,
  map: Record<string, InlineArticleMeta>,
): string {
  if (!html || Object.keys(map).length === 0) return html;
  return html.replace(
    INLINE_POST_LINK,
    (_match, _pre: string, _href: string, id: string) => {
      const meta = map[id];
      if (!meta) return _match;
      return buildInlineArticleListHtml([meta]);
    },
  );
}
