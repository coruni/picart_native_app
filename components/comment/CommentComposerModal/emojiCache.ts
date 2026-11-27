import { api } from "@/api";
import type { DtoEmojiDto } from "@/api/generated";
import { Directory, File, Paths } from "expo-file-system";

import { EMOJI_CACHE_FILE_NAME } from "./composerConstants";
import type { EmojiCachePayload, EmojiGroup, EmojiItem } from "./composerTypes";

let cachedEmojiPayload: EmojiCachePayload | null = null;
let emojiRefreshPromise: Promise<EmojiCachePayload | null> | null = null;
let emojiPrimePromise: Promise<void> | null = null;

export function getCachedEmojiPayload(): EmojiCachePayload | null {
  return cachedEmojiPayload;
}

export async function primeEmojiCache(): Promise<void> {
  if (emojiPrimePromise) return emojiPrimePromise;
  emojiPrimePromise = (async () => {
    const cachedPayload = await readEmojiCache();
    const remotePayload = await fetchEmojiPayload();
    if (
      remotePayload &&
      remotePayload.signature !== cachedPayload?.signature
    ) {
      await writeEmojiCache(remotePayload);
    }
  })().finally(() => {
    emojiPrimePromise = null;
  });
  return emojiPrimePromise;
}

export async function readEmojiCache(): Promise<EmojiCachePayload | null> {
  if (cachedEmojiPayload) return cachedEmojiPayload;
  try {
    const file = getEmojiCacheFile();
    if (!file.exists) return null;
    const parsed: unknown = JSON.parse(await file.text());
    if (!isEmojiCachePayload(parsed)) return null;
    cachedEmojiPayload = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeEmojiCache(
  payload: EmojiCachePayload,
): Promise<void> {
  try {
    const file = getEmojiCacheFile();
    file.write(JSON.stringify(payload));
    cachedEmojiPayload = payload;
  } catch {
    // Cache only. The composer can still use in-memory API data.
  }
}

export async function fetchEmojiPayload(): Promise<EmojiCachePayload | null> {
  if (emojiRefreshPromise) return emojiRefreshPromise;
  emojiRefreshPromise = api
    .emojiControllerFindAll()
    .then((response) => {
      const groups = normalizeEmojiGroups(response.data.data?.list ?? []);
      const payload = { groups, signature: createEmojiSignature(groups) };
      return groups.length > 0 ? payload : null;
    })
    .finally(() => {
      emojiRefreshPromise = null;
    });
  return emojiRefreshPromise;
}

function getEmojiCacheFile(): File {
  const directory = new Directory(Paths.document, "comment-composer");
  directory.create({ intermediates: true, idempotent: true });
  return new File(directory, EMOJI_CACHE_FILE_NAME);
}

function normalizeEmojiGroups(
  emojis: DtoEmojiDto[],
): EmojiGroup[] {
  // 新接口返回扁平列表，按 category 自行分组。
  const buckets = new Map<string, EmojiItem[]>();
  for (const emoji of emojis) {
    const item = normalizeEmojiItem(emoji);
    if (!item) continue;
    const name = emoji.category?.trim() || "默认";
    const bucket = buckets.get(name);
    if (bucket) bucket.push(item);
    else buckets.set(name, [item]);
  }
  return Array.from(buckets, ([name, items]) => ({
    name,
    count: items.length,
    items,
  })).filter((group) => group.items.length > 0);
}

function normalizeEmojiItem(
  item: DtoEmojiDto,
): EmojiItem | null {
  if (!item.id || !item.url) return null;
  return {
    id: item.id,
    name: item.name ?? item.code ?? String(item.id),
    url: item.url,
    code: item.code,
    width: item.width,
    height: item.height,
    updatedAt: item.updated_at,
  };
}

function createEmojiSignature(groups: EmojiGroup[]): string {
  return JSON.stringify(
    groups.map((group) => [
      group.name,
      group.count,
      group.items.map((item) => [
        item.id,
        item.url,
        item.updatedAt ?? "",
        item.width ?? 0,
        item.height ?? 0,
      ]),
    ]),
  );
}

function isEmojiCachePayload(value: unknown): value is EmojiCachePayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<EmojiCachePayload>;
  return (
    typeof payload.signature === "string" && Array.isArray(payload.groups)
  );
}
