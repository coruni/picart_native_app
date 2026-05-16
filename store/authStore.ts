import { api } from "@/api";
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

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  profile: AuthProfile | null;
  isLoggedIn: boolean;
  hasHydrated: boolean;
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void;
  setProfile: (profile: AuthProfile) => void;
  fetchProfile: () => Promise<void>;
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
    set({ token, refreshToken, user, isLoggedIn: true });
    secureWrite(KEYS.token, token);
    secureWrite(KEYS.refreshToken, refreshToken);
    secureWrite(KEYS.user, user);
  },

  setProfile: (profile) => {
    set({ profile });
    secureWrite(KEYS.profile, profile);
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.userControllerGetProfile();
      const profile = data.data;
      set({ profile });
      secureWrite(KEYS.profile, profile);
    } catch {
      // 静默失败，保留已有缓存
    }
  },

  clearAuth: () => {
    set({
      token: null,
      refreshToken: null,
      user: null,
      profile: null,
      isLoggedIn: false,
    });
    secureDelete(KEYS.token);
    secureDelete(KEYS.refreshToken);
    secureDelete(KEYS.user);
    secureDelete(KEYS.profile);
  },

  hydrate: async () => {
    const [token, refreshToken, user, profile] = await Promise.all([
      secureRead<string>(KEYS.token),
      secureRead<string>(KEYS.refreshToken),
      secureRead<AuthUser>(KEYS.user),
      secureRead<AuthProfile>(KEYS.profile),
    ]);
    set({
      token,
      refreshToken,
      user,
      profile,
      isLoggedIn: !!token,
      hasHydrated: true,
    });
  },
}));

/** api/client.ts 读取 token 用（非 React 环境） */
export function getAuthState() {
  return useAuthStore.getState();
}

/** 便捷导出，供非 hook 场景使用 */
export const setAuth = (token: string, refreshToken: string, user: AuthUser) =>
  useAuthStore.getState().setAuth(token, refreshToken, user);

export const clearAuth = () => useAuthStore.getState().clearAuth();

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isLoggedIn;
}
