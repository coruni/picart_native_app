import { api } from "@/api";
import type {
  EmojiControllerFindAll200ResponseDataGroupsInner,
  EmojiControllerFindAll200ResponseDataGroupsInnerItemsInner,
} from "@/api/generated";
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
    .emojiControllerFindAll(true)
    .then((response) => {
      const groups = normalizeEmojiGroups(response.data.data.groups ?? []);
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
  groups: EmojiControllerFindAll200ResponseDataGroupsInner[],
): EmojiGroup[] {
  return groups
    .map((group, index) => {
      const items = (group.items ?? [])
        .map(normalizeEmojiItem)
        .filter((item): item is EmojiItem => item !== null);
      return {
        name: group.name?.trim() || `Group ${index + 1}`,
        count: group.count ?? items.length,
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}

function normalizeEmojiItem(
  item: EmojiControllerFindAll200ResponseDataGroupsInnerItemsInner,
): EmojiItem | null {
  if (!item.id || !item.url) return null;
  return {
    id: item.id,
    name: item.name ?? item.code ?? String(item.id),
    url: item.url,
    code: item.code,
    width: item.width,
    height: item.height,
    updatedAt: item.updatedAt,
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
