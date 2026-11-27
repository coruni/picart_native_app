import { api } from "@/api";
import type { ConfigControllerGetPublicConfigs200Response } from "@/api/generated";
import { create } from "zustand";

type ConfigGroups = NonNullable<ConfigControllerGetPublicConfigs200Response["data"]>;

// 后端按 group 分组返回（{ site: { site_name }, upload: {...} }），
// 页面一律按扁平 key 取，这里摊平一层，键冲突时后面的组覆盖前面的。
export type PublicConfigs = Record<string, any>;

function flattenGroups(groups: ConfigGroups | undefined): PublicConfigs {
  const flat: PublicConfigs = {};
  for (const value of Object.values(groups ?? {})) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flat, value);
    }
  }
  return flat;
}

interface ConfigState {
  config: PublicConfigs | null;
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  fetchConfig: async () => {
    try {
      const res = await api.configControllerGetPublicConfigs();
      set({ config: flattenGroups(res.data.data) });
    } catch {
      // 静默失败，不影响启动
    }
  },
}));
