import {
  DEFAULT_KEYBOARD_HEIGHT,
  KEYBOARD_HEIGHT_STORAGE_KEY,
  MIN_KEYBOARD_HEIGHT,
} from "@/components/comment/CommentComposerModal/composerConstants";
import * as SecureStore from "expo-secure-store";

/**
 * Shared keyboard-height cache used wherever the app needs to pre-size a
 * panel that should match the system keyboard (chat feature panel, comment
 * composer emoji panel, etc.). Persisting to SecureStore lets us render the
 * panel at the correct height on first open, before the keyboard has ever
 * appeared in the current session.
 *
 * Storage key remains the composer's original key so existing user data
 * carries over.
 */

let cachedKeyboardHeight = DEFAULT_KEYBOARD_HEIGHT;
let hydratePromise: Promise<number> | null = null;

export function getCachedKeyboardHeight(): number {
  return cachedKeyboardHeight;
}

export async function loadPersistedKeyboardHeight(): Promise<number> {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    try {
      const raw = await SecureStore.getItemAsync(KEYBOARD_HEIGHT_STORAGE_KEY);
      if (!raw) return cachedKeyboardHeight;
      const value = Number(raw);
      if (Number.isFinite(value) && value >= MIN_KEYBOARD_HEIGHT) {
        cachedKeyboardHeight = value;
      }
      return cachedKeyboardHeight;
    } catch {
      return cachedKeyboardHeight;
    }
  })();
  return hydratePromise;
}

export async function persistKeyboardHeight(height: number): Promise<void> {
  if (!Number.isFinite(height) || height < MIN_KEYBOARD_HEIGHT) return;
  if (Math.abs(height - cachedKeyboardHeight) < 1) return;
  cachedKeyboardHeight = height;
  try {
    await SecureStore.setItemAsync(KEYBOARD_HEIGHT_STORAGE_KEY, String(height));
  } catch {
    // Optimization only — silently ignore.
  }
}

export {
  DEFAULT_KEYBOARD_HEIGHT,
  KEYBOARD_HEIGHT_STORAGE_KEY,
  MIN_KEYBOARD_HEIGHT,
};
