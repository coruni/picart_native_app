import { api } from "@/api";
import { CategoryControllerFindAll200ResponseDataDataInner } from "@/api/generated";

export type ParentCategory = CategoryControllerFindAll200ResponseDataDataInner;

// ── 模块级单例缓存 ────────────────────────────────────────────────
let cache: ParentCategory[] | null = null;
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<(data: ParentCategory[]) => void>();

function notify(data: ParentCategory[]) {
  listeners.forEach((fn) => fn(data));
}

/** 立即返回缓存（可能为 null，未加载完时） */
export function getCachedCategories(): ParentCategory[] | null {
  return cache;
}

/** 订阅数据更新，返回取消订阅函数 */
export function subscribeCategories(
  fn: (data: ParentCategory[]) => void,
): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** 预加载：重复调用安全，只发一次请求 */
export function prefetchCategories(): Promise<void> {
  if (fetchPromise) return fetchPromise;
  fetchPromise = (async () => {
    try {
      const { data: res } = await api.categoryControllerFindAll(
        1,
        100,
        undefined,
        undefined,
        undefined,
        "sort",
        "asc",
      );
      const all = res.data.data ?? [];
      const roots = all.filter(
        (item) =>
          item.parentId === 0 ||
          item.parentId == null ||
          item.children.length > 0,
      );
      cache = roots.length > 0 ? roots : all;
      notify(cache);
    } catch (e) {
      fetchPromise = null; // 失败后允许重试
      console.error("[categoryStore] prefetch failed:", e);
    }
  })();
  return fetchPromise;
}

/** 强制刷新（忽略已有缓存） */
export async function refreshCategories(): Promise<void> {
  fetchPromise = null;
  cache = null;
  await prefetchCategories();
}
