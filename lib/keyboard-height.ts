import {
  DEFAULT_KEYBOARD_HEIGHT,
  KEYBOARD_HEIGHT_STORAGE_KEY,
  MIN_KEYBOARD_HEIGHT,
} from "@/components/comment/CommentComposerModal/composerConstants";
import * as SecureStore from "expo-secure-store";
import { Keyboard, Platform } from "react-native";
import {
  KeyboardController,
  KeyboardEvents,
} from "react-native-keyboard-controller";

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

export type LiveKeyboardPhase = "hidden" | "showing" | "shown" | "hiding";

export type LiveKeyboardEventType =
  | "willShow"
  | "didShow"
  | "willHide"
  | "didHide";

export type LiveKeyboardSnapshot = {
  /** Whether the keyboard is currently showing or visible with height > 0 */
  isVisible: boolean;
  phase: LiveKeyboardPhase;
  /** Raw platform keyboard height in dp (same unit as KeyboardController.state().height) */
  height: number;
  /** Transition duration reported by the platform, in ms */
  duration: number;
  updatedAt: number;
};

export type LiveKeyboardListener = (
  snapshot: LiveKeyboardSnapshot,
  eventType: LiveKeyboardEventType,
) => void;

const liveListeners = new Set<LiveKeyboardListener>();
let liveListenersAttached = false;
let lastShowEventAt = 0;

function readPlatformKeyboardState(): LiveKeyboardSnapshot {
  const now = Date.now();
  const kcVisible = KeyboardController.isVisible();
  const kcHeight = KeyboardController.state().height ?? 0;
  if (kcVisible && kcHeight > 0) {
    return {
      isVisible: true,
      phase: "shown",
      height: kcHeight,
      duration: 0,
      updatedAt: now,
    };
  }

  const rnMetricsHeight = Keyboard.metrics()?.height ?? 0;
  const rnVisible =
    typeof Keyboard.isVisible === "function"
      ? Keyboard.isVisible()
      : rnMetricsHeight > 0;
  if (rnVisible && rnMetricsHeight > 0) {
    return {
      isVisible: true,
      phase: "shown",
      height: rnMetricsHeight,
      duration: 0,
      updatedAt: now,
    };
  }

  return {
    isVisible: false,
    phase: "hidden",
    height: 0,
    duration: 0,
    updatedAt: now,
  };
}

let liveSnapshot: LiveKeyboardSnapshot = {
  isVisible: false,
  phase: "hidden",
  height: 0,
  duration: 0,
  updatedAt: 0,
};

function emitLiveSnapshot(
  next: LiveKeyboardSnapshot,
  eventType: LiveKeyboardEventType,
): void {
  liveSnapshot = next;
  liveListeners.forEach((listener) => {
    listener(next, eventType);
  });
}

function ensureLiveKeyboardListeners(): void {
  if (liveListenersAttached) return;
  liveListenersAttached = true;

  liveSnapshot = readPlatformKeyboardState();

  if (Platform.OS === "web") return;

  // Subscribe to ALL four KeyboardController events.
  // react-native-keyboard-controller's built-in useKeyboardState only listens to
  // keyboardWillShow + keyboardDidHide; during rapid close -> reopen on Android,
  // a late keyboardDidHide from the previous close can arrive after the new
  // keyboardWillShow, leaving useKeyboardState stuck at isVisible=false even after
  // keyboardDidShow fires with the real height. Listening to keyboardDidShow as well
  // self-heals immediately.
  KeyboardEvents.addListener("keyboardWillShow", (event) => {
    const now = Date.now();
    const height =
      event.height > 0
        ? event.height
        : liveSnapshot.height > 0
          ? liveSnapshot.height
          : (Keyboard.metrics()?.height ?? 0);
    if (height <= 0) return;
    lastShowEventAt = now;
    emitLiveSnapshot(
      {
        isVisible: true,
        phase: "showing",
        height,
        duration: event.duration ?? 0,
        updatedAt: now,
      },
      "willShow",
    );
  });

  KeyboardEvents.addListener("keyboardDidShow", (event) => {
    const now = Date.now();
    const height =
      event.height > 0
        ? event.height
        : liveSnapshot.height > 0
          ? liveSnapshot.height
          : (Keyboard.metrics()?.height ?? 0);
    if (height <= 0) return;
    lastShowEventAt = now;
    emitLiveSnapshot(
      {
        isVisible: true,
        phase: "shown",
        height,
        duration: event.duration ?? 0,
        updatedAt: now,
      },
      "didShow",
    );
  });

  KeyboardEvents.addListener("keyboardWillHide", (event) => {
    const now = Date.now();
    emitLiveSnapshot(
      {
        isVisible: false,
        phase: "hiding",
        height: 0,
        duration: event.duration ?? 0,
        updatedAt: now,
      },
      "willHide",
    );
  });

  KeyboardEvents.addListener("keyboardDidHide", (event) => {
    const now = Date.now();
    emitLiveSnapshot(
      {
        isVisible: false,
        phase: "hidden",
        height: 0,
        duration: event.duration ?? 0,
        updatedAt: now,
      },
      "didHide",
    );
  });

  // Fallback to RN's built-in Keyboard events for cases where KeyboardController
  // doesn't receive insets (e.g. inside an Android native Modal Dialog such as
  // GestureImageViewer) or misses a show event.
  Keyboard.addListener("keyboardDidShow", (event) => {
    const height = event.endCoordinates?.height ?? 0;
    if (height <= 0) return;
    if (liveSnapshot.isVisible && liveSnapshot.height >= MIN_KEYBOARD_HEIGHT) {
      return;
    }
    const now = Date.now();
    lastShowEventAt = now;
    emitLiveSnapshot(
      {
        isVisible: true,
        phase: "shown",
        height,
        duration: event.duration ?? 0,
        updatedAt: now,
      },
      "didShow",
    );
  });

  Keyboard.addListener("keyboardDidHide", (event) => {
    const now = Date.now();
    // Ignore stale RN hide if KeyboardController just reported a newer show.
    if (now - lastShowEventAt < 200) return;
    if (KeyboardController.isVisible()) return;
    if (!liveSnapshot.isVisible && liveSnapshot.phase === "hidden") return;
    emitLiveSnapshot(
      {
        isVisible: false,
        phase: "hidden",
        height: 0,
        duration: event.duration ?? 0,
        updatedAt: now,
      },
      "didHide",
    );
  });
}

export function getLiveKeyboardSnapshot(): LiveKeyboardSnapshot {
  ensureLiveKeyboardListeners();
  return liveSnapshot;
}

export function subscribeLiveKeyboard(
  listener: LiveKeyboardListener,
): () => void {
  ensureLiveKeyboardListeners();
  liveListeners.add(listener);
  return () => {
    liveListeners.delete(listener);
  };
}

/**
 * Actively cross-checks our cached live snapshot against KeyboardController
 * and RN Keyboard.metrics(), healing any desynchronized hidden state if the
 * keyboard is actually visible on screen.
 */
export function reconcileLiveKeyboard(): LiveKeyboardSnapshot {
  ensureLiveKeyboardListeners();
  const platform = readPlatformKeyboardState();
  if (platform.isVisible && platform.height > 0) {
    if (
      !liveSnapshot.isVisible ||
      Math.abs(liveSnapshot.height - platform.height) >= 1
    ) {
      lastShowEventAt = platform.updatedAt;
      emitLiveSnapshot(platform, "didShow");
    }
  }
  return liveSnapshot;
}

export {
  DEFAULT_KEYBOARD_HEIGHT,
  KEYBOARD_HEIGHT_STORAGE_KEY,
  MIN_KEYBOARD_HEIGHT,
};
