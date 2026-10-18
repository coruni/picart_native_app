import { useCallback, useEffect, useRef, useState } from "react";
import type { NativeSyntheticEvent } from "react-native";
import type {
  EnrichedTextInputInstance,
  OnChangeSelectionEvent,
  OnChangeStateEvent,
} from "react-native-enriched-html";

// 富文本编辑器是无状态的原生输入框，撤销/重做只能靠 HTML 快照。
// 每次停顿后再取一次 HTML，避免每个字符都走一次原生解析。
const HISTORY_LIMIT = 50;
const SNAPSHOT_DELAY_MS = 600;
// setValue 会触发 onChangeText，用这个标记跳过由撤销/重做自己引发的变化
const APPLY_GUARD_MS = 300;

export interface RichTextSelection {
  start: number;
  end: number;
  text: string;
}

interface HistoryState {
  stack: string[];
  index: number;
}

export interface UseArticleRichTextOptions {
  onChangeText?: (text: string) => void;
}

export interface ArticleRichTextToolbarState {
  canUndo: boolean;
  canRedo: boolean;
}

export function useArticleRichText({
  onChangeText,
}: UseArticleRichTextOptions = {}) {
  const inputRef = useRef<EnrichedTextInputInstance | null>(null);
  const selectionRef = useRef<RichTextSelection>({ start: 0, end: 0, text: "" });
  const historyRef = useRef<HistoryState>({ stack: [""], index: 0 });
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applyingHistoryRef = useRef(false);
  const applyGuardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 切换发布类型会重挂编辑器；用于丢弃上一份编辑器还在路上的异步快照
  const historyVersionRef = useRef(0);

  const [focused, setFocused] = useState(false);
  const [activeState, setActiveState] = useState<OnChangeStateEvent | null>(
    null,
  );
  const [historyState, setHistoryState] = useState<ArticleRichTextToolbarState>(
    { canUndo: false, canRedo: false },
  );

  const syncHistoryState = useCallback(() => {
    const history = historyRef.current;
    setHistoryState({
      canUndo: history.index > 0,
      canRedo: history.index < history.stack.length - 1,
    });
  }, []);

  // 纯文本基线：首帧 defaultValue 回填不算用户改动。
  // 撤销按钮要立刻可用，真正写快照的动作仍由 600ms 防抖完成。
  const lastTextRef = useRef<string | null>(null);
  const markUndoAvailable = useCallback(() => {
    setHistoryState((prev) =>
      prev.canUndo && !prev.canRedo ? prev : { canUndo: true, canRedo: false },
    );
  }, []);

  const getHTML = useCallback(async () => {
    try {
      return (await inputRef.current?.getHTML()) ?? "";
    } catch {
      return "";
    }
  }, []);

  const clearSnapshotTimer = useCallback(() => {
    if (snapshotTimerRef.current) {
      clearTimeout(snapshotTimerRef.current);
      snapshotTimerRef.current = null;
    }
  }, []);

  const pushHistory = useCallback(
    (html: string) => {
      const history = historyRef.current;
      if (history.stack[history.index] === html) return;

      history.stack = [
        ...history.stack.slice(0, history.index + 1),
        html,
      ].slice(-HISTORY_LIMIT);
      history.index = history.stack.length - 1;
      syncHistoryState();
    },
    [syncHistoryState],
  );

  const captureSnapshot = useCallback(async () => {
    // 编辑器已经卸载（切换类型）时 getHTML 只会返回空串，别把它记进新历史
    if (!inputRef.current) return;

    const version = historyVersionRef.current;
    const html = await getHTML();
    if (version !== historyVersionRef.current) return;
    if (!inputRef.current || applyingHistoryRef.current) return;
    pushHistory(html);
  }, [getHTML, pushHistory]);

  const scheduleSnapshot = useCallback(() => {
    clearSnapshotTimer();
    snapshotTimerRef.current = setTimeout(() => {
      snapshotTimerRef.current = null;
      void captureSnapshot();
    }, SNAPSHOT_DELAY_MS);
  }, [captureSnapshot, clearSnapshotTimer]);

  useEffect(() => {
    return () => {
      clearSnapshotTimer();
      if (applyGuardTimerRef.current) clearTimeout(applyGuardTimerRef.current);
    };
  }, [clearSnapshotTimer]);

  const handleFocus = useCallback(() => setFocused(true), []);
  // 失焦时立刻补一次快照：工具栏改格式不一定触发 onChangeText，
  // 不补这一下，暂停 600ms 内的最后一次改动可能撤不回去。
  const handleBlur = useCallback(() => {
    setFocused(false);
    clearSnapshotTimer();
    void captureSnapshot();
  }, [captureSnapshot, clearSnapshotTimer]);

  const handleChangeText = useCallback(
    (event: NativeSyntheticEvent<{ value: string }>) => {
      const value = event.nativeEvent.value;
      // 首帧回填时 lastTextRef 还是 null，不算「用户改动」
      const changed = lastTextRef.current !== null && lastTextRef.current !== value;
      lastTextRef.current = value;
      onChangeText?.(value);
      if (applyingHistoryRef.current) return;
      if (changed) markUndoAvailable();
      scheduleSnapshot();
    },
    [markUndoAvailable, onChangeText, scheduleSnapshot],
  );

  // 工具栏的加粗 / 标题 / 对齐 / 插图等命令只改 HTML、不改纯文本，
  // onChangeText 不会触发，撤销栈需要由工具栏主动通知一次。
  const markContentChanged = useCallback(() => {
    if (applyingHistoryRef.current) return;
    markUndoAvailable();
    scheduleSnapshot();
  }, [markUndoAvailable, scheduleSnapshot]);

  const handleSelectionChange = useCallback(
    (event: NativeSyntheticEvent<OnChangeSelectionEvent>) => {
      const { start, end, text } = event.nativeEvent;
      selectionRef.current = { start, end, text };
    },
    [],
  );

  const handleStateChange = useCallback(
    (event: NativeSyntheticEvent<OnChangeStateEvent>) => {
      setActiveState(event.nativeEvent);
    },
    [],
  );

  // 撤销/重做前先把当前内容记下来，避免刚输入的内容还停留在快照间隔内
  const applyHistory = useCallback(
    async (direction: -1 | 1) => {
      clearSnapshotTimer();
      await captureSnapshot();
      const history = historyRef.current;
      const nextIndex = history.index + direction;
      if (nextIndex < 0 || nextIndex >= history.stack.length) return;

      history.index = nextIndex;
      applyingHistoryRef.current = true;
      inputRef.current?.setValue(history.stack[nextIndex]);
      syncHistoryState();

      if (applyGuardTimerRef.current) clearTimeout(applyGuardTimerRef.current);
      applyGuardTimerRef.current = setTimeout(() => {
        applyingHistoryRef.current = false;
      }, APPLY_GUARD_MS);
    },
    [captureSnapshot, clearSnapshotTimer, syncHistoryState],
  );

  const undo = useCallback(() => {
    void applyHistory(-1);
  }, [applyHistory]);

  const redo = useCallback(() => {
    void applyHistory(1);
  }, [applyHistory]);

  // 切换发布类型时编辑框会卸载重挂，历史必须一起清空；
  // seedHtml 用来把新挂载时的初始内容作为撤销起点。
  const resetHistory = useCallback(
    (seedHtml = "") => {
      clearSnapshotTimer();
      historyVersionRef.current += 1;
      lastTextRef.current = null;
      historyRef.current = { stack: [seedHtml], index: 0 };
      syncHistoryState();
    },
    [clearSnapshotTimer, syncHistoryState],
  );

  return {
    inputRef,
    selectionRef,
    focused,
    activeState,
    historyState,
    handleFocus,
    handleBlur,
    handleChangeText,
    handleSelectionChange,
    handleStateChange,
    markContentChanged,
    getHTML,
    undo,
    redo,
    resetHistory,
  };
}

export type ArticleRichTextController = ReturnType<typeof useArticleRichText>;
