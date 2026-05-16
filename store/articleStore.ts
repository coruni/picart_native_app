import { api } from "@/api";
import { ArticleControllerFindAll200Response } from "@/api/generated";
import { create } from "zustand";

export type ArticleItem =
  ArticleControllerFindAll200Response["data"]["data"][number];

interface ArticleCacheState {
  cache: Record<string, ArticleItem[]>;
}

export const useArticleCacheStore = create<ArticleCacheState>()(() => ({
  cache: {},
}));

// 请求去重（不放入 store）
const inflight = new Map<string, Promise<void>>();

export function getCachedArticles(key: string): ArticleItem[] | null {
  return useArticleCacheStore.getState().cache[key] ?? null;
}

export function setCachedArticles(key: string, data: ArticleItem[]): void {
  useArticleCacheStore.setState((s) => ({
    cache: { ...s.cache, [key]: data },
  }));
}

export function invalidateArticleCache(key: string): void {
  useArticleCacheStore.setState((s) => {
    const { [key]: _, ...rest } = s.cache;
    return { cache: rest };
  });
  inflight.delete(key);
}

/** 预加载指定 key 的第一页数据（幂等，重复调用安全） */
async function prefetch(
  key: string,
  fetcher: () => Promise<ArticleItem[]>,
): Promise<void> {
  if (useArticleCacheStore.getState().cache[key]) return;
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = fetcher()
    .then((data) => {
      setCachedArticles(key, data);
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
