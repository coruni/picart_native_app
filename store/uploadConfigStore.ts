import { api } from "@/api";
import type { UploadControllerGetUploadConfig200ResponseData } from "@/api/generated";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type UploadConfig = UploadControllerGetUploadConfig200ResponseData;

const STORAGE_KEY = "upload.config";
const SECURE_STORE_CHUNK_SIZE = 1800;

let fetchPromise: Promise<UploadConfig> | null = null;
let hydratePromise: Promise<void> | null = null;

interface UploadConfigState {
  config: UploadConfig | null;
  hasHydrated: boolean;
  hydrate: () => Promise<void>;
  fetchConfig: () => Promise<UploadConfig>;
}

export const useUploadConfigStore = create<UploadConfigState>((set) => ({
  config: null,
  hasHydrated: false,

  hydrate: async () => {
    if (useUploadConfigStore.getState().hasHydrated) return;
    if (hydratePromise) return hydratePromise;

    hydratePromise = readChunked<UploadConfig>(STORAGE_KEY)
      .then((config) => {
        set({ config, hasHydrated: true });
      })
      .finally(() => {
        hydratePromise = null;
      });

    return hydratePromise;
  },

  fetchConfig: async () => {
    if (fetchPromise) return fetchPromise;

    fetchPromise = api
      .uploadControllerGetUploadConfig()
      .then(async (response) => {
        const config = response.data.data;
        set({ config, hasHydrated: true });
        await writeChunked(STORAGE_KEY, config);
        return config;
      })
      .finally(() => {
        fetchPromise = null;
      });

    return fetchPromise;
  },
}));

export async function getUploadConfig(): Promise<UploadConfig> {
  const store = useUploadConfigStore.getState();
  if (!store.hasHydrated) {
    await store.hydrate();
  }

  const cached = useUploadConfigStore.getState().config;
  if (cached) return cached;

  return useUploadConfigStore.getState().fetchConfig();
}

async function readChunked<T>(key: string): Promise<T | null> {
  try {
    const countRaw = await SecureStore.getItemAsync(`${key}.count`);
    const count = countRaw ? Number(countRaw) : 0;

    if (!count) {
      const raw = await SecureStore.getItemAsync(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }

    const chunks = await Promise.all(
      Array.from({ length: count }, (_, index) =>
        SecureStore.getItemAsync(`${key}.${index}`),
      ),
    );
    if (chunks.some((chunk) => chunk === null)) return null;
    return JSON.parse(chunks.join("")) as T;
  } catch {
    return null;
  }
}

async function writeChunked(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  const chunks = raw.match(new RegExp(`.{1,${SECURE_STORE_CHUNK_SIZE}}`, "g"));

  await deleteChunked(key);
  if (!chunks?.length) return;

  await Promise.all(
    chunks.map((chunk, index) =>
      SecureStore.setItemAsync(`${key}.${index}`, chunk),
    ),
  );
  await SecureStore.setItemAsync(`${key}.count`, String(chunks.length));
}

async function deleteChunked(key: string): Promise<void> {
  const countRaw = await SecureStore.getItemAsync(`${key}.count`);
  const count = countRaw ? Number(countRaw) : 0;
  await Promise.all([
    SecureStore.deleteItemAsync(key),
    SecureStore.deleteItemAsync(`${key}.count`),
    ...Array.from({ length: count }, (_, index) =>
      SecureStore.deleteItemAsync(`${key}.${index}`),
    ),
  ]);
}
