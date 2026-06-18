import { getLocales } from "expo-localization";
import i18n from "i18next";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

/**
 * 用户偏好设置：外观、语言、自动翻译。
 * 使用 SecureStore 持久化，App 启动时 hydrate。
 */

export type AppearanceMode = "auto" | "light" | "dark";
export type LanguageMode = "auto" | "zh" | "en";

const STORAGE_KEY = "app.settings";

/** 本地推送通知开关，仅控制 App 端通知展示，不与后端同步 */
export interface PushSettings {
  pushComment: boolean;
  pushLike: boolean;
  pushFollow: boolean;
  pushRecommend: boolean;
  pushFollowing: boolean;
}

export type PushSettingKey = keyof PushSettings;

interface PersistedSettings {
  appearance: AppearanceMode;
  language: LanguageMode;
  autoTranslate: boolean;
  push: PushSettings;
}

const DEFAULT_PUSH_SETTINGS: PushSettings = {
  pushComment: true,
  pushLike: true,
  pushFollow: true,
  pushRecommend: true,
  pushFollowing: true,
};

const DEFAULT_SETTINGS: PersistedSettings = {
  appearance: "auto",
  language: "auto",
  autoTranslate: true,
  push: DEFAULT_PUSH_SETTINGS,
};

/** 把语言偏好解析为 i18next 实际使用的语言代码 */
export function resolveLanguage(mode: LanguageMode): "zh" | "en" {
  if (mode === "auto") {
    const systemLang = getLocales()[0]?.languageCode ?? "en";
    return systemLang.startsWith("zh") ? "zh" : "en";
  }
  return mode;
}

interface SettingsState extends PersistedSettings {
  hasHydrated: boolean;
  setAppearance: (mode: AppearanceMode) => void;
  setLanguage: (mode: LanguageMode) => void;
  setAutoTranslate: (enabled: boolean) => void;
  setPushSetting: (key: PushSettingKey, enabled: boolean) => void;
  hydrate: () => Promise<void>;
}

async function persist(settings: PersistedSettings): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // 持久化失败不阻塞 UI
  }
}

function snapshot(state: SettingsState): PersistedSettings {
  return {
    appearance: state.appearance,
    language: state.language,
    autoTranslate: state.autoTranslate,
    push: state.push,
  };
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...DEFAULT_SETTINGS,
  hasHydrated: false,

  setAppearance: (mode) => {
    set({ appearance: mode });
    void persist(snapshot(get()));
  },

  setLanguage: (mode) => {
    set({ language: mode });
    void i18n.changeLanguage(resolveLanguage(mode));
    void persist(snapshot(get()));
  },

  setAutoTranslate: (enabled) => {
    set({ autoTranslate: enabled });
    void persist(snapshot(get()));
  },

  setPushSetting: (key, enabled) => {
    set({ push: { ...get().push, [key]: enabled } });
    void persist(snapshot(get()));
  },

  hydrate: async () => {
    if (get().hasHydrated) return;
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<PersistedSettings>;
        const parsed: PersistedSettings = {
          ...DEFAULT_SETTINGS,
          ...stored,
          push: { ...DEFAULT_PUSH_SETTINGS, ...stored.push },
        };
        set({ ...parsed, hasHydrated: true });
        void i18n.changeLanguage(resolveLanguage(parsed.language));
        return;
      }
    } catch {
      // 读取失败用默认值
    }
    set({ hasHydrated: true });
  },
}));

/** 非 hook 场景读取（如翻译服务判断是否启用自动翻译） */
export function getSettingsState() {
  return useSettingsStore.getState();
}
