import {
  UserControllerGetProfile200ResponseData,
  UserControllerLogin201ResponseData,
} from "@/api/generated";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type AuthUser = UserControllerLogin201ResponseData;
export type AuthProfile = UserControllerGetProfile200ResponseData;

const KEYS = {
  token: "auth.token",
  refreshToken: "auth.refreshToken",
  user: "auth.user",
  profile: "auth.profile",
} as const;

const SECURE_STORE_CHUNK_SIZE = 1800;
let hydratePromise: Promise<void> | null = null;
let authMutationVersion = 0;

// SecureStore 单 key 最大 2048 字节，逐字段存储规避限制
async function secureRead<T>(key: string): Promise<T | null> {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function secureWrite(key: string, value: unknown): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

async function secureDelete(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

async function secureReadChunked<T>(key: string): Promise<T | null> {
  try {
    const count = await secureRead<number>(`${key}.count`);
    if (!count) return secureRead<T>(key);

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

async function secureWriteChunked(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  const chunks = raw.match(new RegExp(`.{1,${SECURE_STORE_CHUNK_SIZE}}`, "g"));

  await secureDeleteChunked(key);
  if (!chunks?.length) return;

  await Promise.all(
    chunks.map((chunk, index) =>
      SecureStore.setItemAsync(`${key}.${index}`, chunk),
    ),
  );
  await secureWrite(`${key}.count`, chunks.length);
}

async function secureDeleteChunked(key: string): Promise<void> {
  const count = await secureRead<number>(`${key}.count`);
  await Promise.all([
    secureDelete(key),
    secureDelete(`${key}.count`),
    ...(count
      ? Array.from({ length: count }, (_, index) =>
          secureDelete(`${key}.${index}`),
        )
      : []),
  ]);
}

function profileFromUser(user: AuthUser): AuthProfile {
  return user as unknown as AuthProfile;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  profile: AuthProfile | null;
  isLoggedIn: boolean;
  hasHydrated: boolean;
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void;
  setProfile: (profile: AuthProfile) => void;
  clearAuth: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  profile: null,
  isLoggedIn: false,
  hasHydrated: false,

  setAuth: (token, refreshToken, user) => {
    authMutationVersion += 1;
    const profile = profileFromUser(user);
    set({
      token,
      refreshToken,
      user,
      profile,
      isLoggedIn: true,
      hasHydrated: true,
    });
    secureWrite(KEYS.token, token);
    secureWrite(KEYS.refreshToken, refreshToken);
    secureWrite(KEYS.user, user);
    secureWriteChunked(KEYS.profile, profile);
  },

  setProfile: (profile) => {
    set({ profile });
    secureWriteChunked(KEYS.profile, profile);
    // profile 数据较大，使用分片写入 SecureStore。
  },

  clearAuth: () => {
    authMutationVersion += 1;
    set({
      token: null,
      refreshToken: null,
      user: null,
      profile: null,
      isLoggedIn: false,
      hasHydrated: true,
    });
    secureDelete(KEYS.token);
    secureDelete(KEYS.refreshToken);
    secureDelete(KEYS.user);
    secureDeleteChunked(KEYS.profile);
  },

  hydrate: async () => {
    if (useAuthStore.getState().hasHydrated) return;
    if (hydratePromise) return hydratePromise;

    const hydrateVersion = authMutationVersion;
    hydratePromise = (async () => {
      const [token, refreshToken, user, profile] = await Promise.all([
        secureRead<string>(KEYS.token),
        secureRead<string>(KEYS.refreshToken),
        secureRead<AuthUser>(KEYS.user),
        secureReadChunked<AuthProfile>(KEYS.profile),
      ]);

      if (hydrateVersion !== authMutationVersion) return;

      set({
        token,
        refreshToken,
        user,
        profile: profile ?? (user ? profileFromUser(user) : null),
        isLoggedIn: !!token,
        hasHydrated: true,
      });
    })().finally(() => {
      hydratePromise = null;
    });

    return hydratePromise;
  },
}));

/** api/client.ts 读取 token 用（非 React 环境） */
export function getAuthState() {
  return useAuthStore.getState();
}

export async function ensureAuthHydrated(): Promise<void> {
  const state = useAuthStore.getState();
  if (state.hasHydrated) return;
  await state.hydrate();
}

/** 便捷导出，供非 hook 场景使用 */
export const setAuth = (token: string, refreshToken: string, user: AuthUser) =>
  useAuthStore.getState().setAuth(token, refreshToken, user);

export const clearAuth = () => useAuthStore.getState().clearAuth();

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isLoggedIn;
}
