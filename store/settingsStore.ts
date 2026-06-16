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

interface PersistedSettings {
  appearance: AppearanceMode;
  language: LanguageMode;
  autoTranslate: boolean;
}

const DEFAULT_SETTINGS: PersistedSettings = {
  appearance: "auto",
  language: "auto",
  autoTranslate: true,
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

  hydrate: async () => {
    if (get().hasHydrated) return;
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
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
