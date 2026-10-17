import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { findNodeHandle, Pressable, StyleSheet, View } from "react-native";
import {
  RichTextInput,
  type RichTextContentItem,
  type RichTextInputRef,
} from "react-native-rich-text-fabric";

import { COMPOSER_INPUT_HEIGHT } from "./composerConstants";

type RichComposerInputProps = {
  inputRef: React.RefObject<RichTextInputRef | null>;
  height: number;
  placeholder: string;
  placeholderTextColor: string;
  placeholderStyle: { fontSize: number; lineHeight: number; color: string };
  cursorColor: string;
  defaultTextStyle: { fontSize: number; lineHeight: number; color: string };
  defaultImageStyle: { width: number; height: number };
  onContentChange: (content: RichTextContentItem[]) => void;
  onReady: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onPress: () => void;
};

export type RichComposerInputHandle = {
  setKeyboardTarget: () => void;
  clearKeyboardTarget: () => void;
};

const RichComposerInput = forwardRef<
  RichComposerInputHandle,
  RichComposerInputProps
>(function RichComposerInput(
  {
    inputRef,
    height,
    placeholder,
    placeholderStyle,
    placeholderTextColor,
    cursorColor,
    defaultTextStyle,
    defaultImageStyle,
    onContentChange,
    onReady,
    onFocus,
    onBlur,
    onPress,
  },
  ref,
) {
  const wrapperRef = useRef<View>(null);
  const { animatedKeyboardState, textInputNodesRef } = useBottomSheetInternal();

  // 父组件每次重渲染都会重建这些回调。若让它们进入下面 effect 的依赖，
  // 键盘每显隐一次就会 clearKeyboardTarget() 一次 —— BottomSheet 会丢失
  // 键盘避让目标，表现为「键盘起来了但 sheet 不跟着动」。用 ref 切断依赖。
  const onReadyRef = useRef(onReady);
  const onFocusRef = useRef(onFocus);
  const onBlurRef = useRef(onBlur);
  const onPressRef = useRef(onPress);
  useEffect(() => {
    onReadyRef.current = onReady;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;
    onPressRef.current = onPress;
  }, [onBlur, onFocus, onPress, onReady]);

  const getTarget = useCallback(() => {
    return findNodeHandle(wrapperRef.current) ?? undefined;
  }, []);

  const setKeyboardTarget = useCallback(() => {
    const target = getTarget();
    if (!target) return;
    textInputNodesRef.current.add(target);
    animatedKeyboardState.set((s) => ({ ...s, target }));
  }, [animatedKeyboardState, getTarget, textInputNodesRef]);

  const clearKeyboardTarget = useCallback(() => {
    const target = getTarget();
    if (!target) return;
    const ks = animatedKeyboardState.get();
    if (ks.target === target) {
      animatedKeyboardState.set((s) => ({ ...s, target: undefined }));
    }
    textInputNodesRef.current.delete(target);
  }, [animatedKeyboardState, getTarget, textInputNodesRef]);

  // 只在挂载/卸载时执行：注册键盘目标 + 通知父组件已就绪。
  useEffect(() => {
    const target = getTarget();
    if (target) {
      textInputNodesRef.current.add(target);
      const timer = setTimeout(() => onReadyRef.current(), 0);
      return () => {
        clearTimeout(timer);
        clearKeyboardTarget();
      };
    }
    return () => clearKeyboardTarget();
  }, [clearKeyboardTarget, getTarget, textInputNodesRef]);

  useImperativeHandle(ref, () => ({ setKeyboardTarget, clearKeyboardTarget }), [
    clearKeyboardTarget,
    setKeyboardTarget,
  ]);

  const handleFocus = useCallback(() => {
    setKeyboardTarget();
    onFocusRef.current();
  }, [setKeyboardTarget]);

  const handleBlur = useCallback(() => {
    clearKeyboardTarget();
    onBlurRef.current();
  }, [clearKeyboardTarget]);

  const handlePress = useCallback(() => {
    setKeyboardTarget();
    onPressRef.current();
  }, [setKeyboardTarget]);

  const inputStyle = {
    height,
    minHeight: height,
  } as const;

  return (
    <Pressable
      ref={wrapperRef}
      style={[styles.inputWrap, inputStyle]}
      onPress={handlePress}
    >
      <RichTextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderStyle={placeholderStyle}
        placeholderTextColor={placeholderTextColor}
        multiline
        onContentChange={onContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        cursorColor={cursorColor}
        inheritInsertedStyle={false}
        defaultTextStyle={defaultTextStyle}
        defaultImageStyle={defaultImageStyle}
        style={[styles.input, inputStyle]}
      />
    </Pressable>
  );
});

// props 已全部稳定（ref / useMemo / useCallback），memo 后父组件的
// 键盘与面板状态切换不会连带重渲染输入框。
export default memo(RichComposerInput);

const styles = StyleSheet.create({
  inputWrap: {
    paddingHorizontal: 16,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  input: {
    height: "100%",
    minHeight: COMPOSER_INPUT_HEIGHT,
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    textAlignVertical: "top",
  },
});
