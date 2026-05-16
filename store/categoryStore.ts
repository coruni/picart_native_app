import { api } from "@/api";
import { CategoryControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import { create } from "zustand";

export type ParentCategory = CategoryControllerFindAll200ResponseDataDataInner;

interface CategoryState {
  categories: ParentCategory[] | null;
}

export const useCategoryStore = create<CategoryState>()(() => ({
  categories: null,
}));

// 请求去重（不放入 store，避免不可序列化对象）
let fetchPromise: Promise<void> | null = null;

/** 立即返回缓存（可能为 null，未加载完时） */
export function getCachedCategories(): ParentCategory[] | null {
  return useCategoryStore.getState().categories;
}

/** 订阅数据更新，返回取消订阅函数 */
export function subscribeCategories(
  fn: (data: ParentCategory[]) => void,
): () => void {
  return useCategoryStore.subscribe((state, prev) => {
    if (state.categories !== prev.categories && state.categories) {
      fn(state.categories);
    }
  });
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
      useCategoryStore.setState({
        categories: roots.length > 0 ? roots : all,
      });
    } catch (e) {
      fetchPromise = null;
      console.error("[categoryStore] prefetch failed:", e);
    }
  })();
  return fetchPromise;
}

/** 强制刷新（忽略已有缓存） */
export async function refreshCategories(): Promise<void> {
  fetchPromise = null;
  useCategoryStore.setState({ categories: null });
  await prefetchCategories();
}
