import type { ComposerMode, PanelMode } from "./composerTypes";

export type TransitionState =
  | { phase: "idle"; mode: ComposerMode }
  | { phase: "dismissing-keyboard"; pendingMode: PanelMode }
  | { phase: "raising-keyboard"; pendingKeyboardFocus: boolean };

export type TransitionAction =
  | { type: "open-panel"; target: PanelMode }
  | { type: "show-keyboard"; fromPanel: boolean }
  | { type: "keyboard-hidden" }
  | { type: "keyboard-visible" }
  | { type: "settle" }
  | { type: "reset" };

export const initialTransitionState: TransitionState = {
  phase: "idle",
  mode: "keyboard",
};

export function transitionReducer(
  state: TransitionState,
  action: TransitionAction,
): TransitionState {
  switch (action.type) {
    case "open-panel": {
      if (state.phase === "idle" && state.mode === action.target) {
        return { phase: "raising-keyboard", pendingKeyboardFocus: true };
      }
      if (state.phase === "raising-keyboard") return state;
      if (
        state.phase === "dismissing-keyboard" &&
        state.pendingMode === action.target
      ) {
        return state;
      }
      if (state.phase === "idle" && state.mode === "keyboard") {
        return { phase: "dismissing-keyboard", pendingMode: action.target };
      }
      if (state.phase === "idle") {
        return { phase: "idle", mode: action.target };
      }
      if (state.phase === "dismissing-keyboard") {
        return { phase: "dismissing-keyboard", pendingMode: action.target };
      }
      return state;
    }

    case "show-keyboard":
      if (state.phase === "raising-keyboard") return state;
      return {
        phase: "raising-keyboard",
        pendingKeyboardFocus: action.fromPanel,
      };

    case "keyboard-hidden":
      if (state.phase === "dismissing-keyboard") {
        return { phase: "idle", mode: state.pendingMode };
      }
      return state;

    case "keyboard-visible":
      if (state.phase === "raising-keyboard") {
        return { phase: "idle", mode: "keyboard" };
      }
      return state;

    case "settle": {
      const mode =
        state.phase === "idle"
          ? state.mode
          : state.phase === "dismissing-keyboard"
            ? state.pendingMode
            : "keyboard";
      return { phase: "idle", mode };
    }

    case "reset":
      return { phase: "idle", mode: "keyboard" };
  }
}
