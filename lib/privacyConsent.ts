import { LEGAL_VERSION } from "@/locales/legal";
import * as SecureStore from "expo-secure-store";

// 隐私同意记录：只存版本号和同意时间，不涉及个人信息。
const STORAGE_KEY = "app.privacyConsent";

export interface ConsentRecord {
  version: string;
  agreedAt: string;
}

/** 读不到 / 版本对不上都算没同意过，宁可多弹一次 */
export async function readConsent(): Promise<ConsentRecord | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== LEGAL_VERSION) return null;
    return {
      version: parsed.version,
      agreedAt: parsed.agreedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function saveConsent(): Promise<void> {
  const record: ConsentRecord = {
    version: LEGAL_VERSION,
    agreedAt: new Date().toISOString(),
  };
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(record));
}

type Listener = () => void;
const listeners = new Set<Listener>();

/** 撤回同意后要让根布局立刻退回弹窗，这里给个极简订阅 */
export function subscribeConsentCleared(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 撤回同意：删掉记录，下次（包括本次）都重新征得 */
export async function clearConsent(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
  listeners.forEach((listener) => listener());
}
