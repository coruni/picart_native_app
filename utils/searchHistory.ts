import * as SecureStore from "expo-secure-store";

/**
 * 搜索历史本地存储：复用 SecureStore，去重，新词置顶，最多保留 MAX_HISTORY 条。
 * 失败静默处理，不阻塞 UI。
 */

const STORAGE_KEY = "search.history";
const MAX_HISTORY = 10;

export async function getSearchHistory(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

async function persist(history: string[]): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // 持久化失败不阻塞 UI
  }
}

export async function addSearchHistory(word: string): Promise<string[]> {
  const keyword = word.trim();
  if (!keyword) return getSearchHistory();
  const history = await getSearchHistory();
  const next = [keyword, ...history.filter((w) => w !== keyword)].slice(
    0,
    MAX_HISTORY,
  );
  await persist(next);
  return next;
}

export async function removeSearchHistory(word: string): Promise<string[]> {
  const history = await getSearchHistory();
  const next = history.filter((w) => w !== word);
  await persist(next);
  return next;
}

export async function clearSearchHistory(): Promise<void> {
  await persist([]);
}
