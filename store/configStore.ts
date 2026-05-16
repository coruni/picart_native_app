import { api } from "@/api";
import type { ConfigControllerGetPublicConfigs200ResponseData } from "@/api/generated";
import { create } from "zustand";

interface ConfigState {
  config: ConfigControllerGetPublicConfigs200ResponseData | null;
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  fetchConfig: async () => {
    try {
      const res = await api.configControllerGetPublicConfigs();
      set({ config: res.data.data });
    } catch {
      // 静默失败，不影响启动
    }
  },
}));
