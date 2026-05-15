import { api } from "@/api";
import { ArticleControllerFindAll200Response } from "@/api/generated";

export type ArticleItem =
  ArticleControllerFindAll200Response["data"]["data"][number];

// ── 模块级单例缓存（key → 第一页数据）────────────────────────────
const cache = new Map<string, ArticleItem[]>();
const inflight = new Map<string, Promise<void>>();

export function getCachedArticles(key: string): ArticleItem[] | null {
  return cache.get(key) ?? null;
}

export function setCachedArticles(key: string, data: ArticleItem[]): void {
  cache.set(key, data);
}

export function invalidateArticleCache(key: string): void {
  cache.delete(key);
  inflight.delete(key);
}

/** 预加载指定 key 的第一页数据（幂等，重复调用安全） */
async function prefetch(
  key: string,
  fetcher: () => Promise<ArticleItem[]>,
): Promise<void> {
  if (cache.has(key)) return;
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = fetcher()
    .then((data) => {
      cache.set(key, data);
      inflight.delete(key);
    })
    .catch((e) => {
      inflight.delete(key);
      console.error("[articleStore] prefetch failed:", key, e);
    });
  inflight.set(key, p);
  return p;
}

const HOME_KEY = "home";
const PAGE_SIZE = 20;

/** app 启动时预加载首页 feed（popular 排序） */
export function prefetchHomeFeed(): Promise<void> {
  return prefetch(HOME_KEY, async () => {
    const { data: res } = await api.articleControllerFindAll(
      1,
      PAGE_SIZE,
      undefined,
      undefined,
      "popular",
    );
    return res.data.data ?? [];
  });
}

/** 预加载某个圈子分类的第一页文章 */
export function prefetchCircleFeed(categoryId: number): Promise<void> {
  return prefetch(`circle:${categoryId}`, async () => {
    const { data: res } = await api.articleControllerFindAll(
      1,
      PAGE_SIZE,
      undefined,
      categoryId,
    );
    return res.data.data ?? [];
  });
}
