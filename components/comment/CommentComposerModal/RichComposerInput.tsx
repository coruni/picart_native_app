import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
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
    placeholderTextColor,
    placeholderStyle,
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

  useEffect(() => {
    const target = getTarget();
    if (target) {
      textInputNodesRef.current.add(target);
      const timer = setTimeout(onReady, 0);
      return () => {
        clearTimeout(timer);
        clearKeyboardTarget();
      };
    }
    return () => clearKeyboardTarget();
  }, [clearKeyboardTarget, getTarget, onReady, textInputNodesRef]);

  useImperativeHandle(ref, () => ({ setKeyboardTarget, clearKeyboardTarget }), [
    clearKeyboardTarget,
    setKeyboardTarget,
  ]);

  const handleFocus = useCallback(() => {
    setKeyboardTarget();
    onFocus();
  }, [onFocus, setKeyboardTarget]);

  const handleBlur = useCallback(() => {
    clearKeyboardTarget();
    onBlur();
  }, [clearKeyboardTarget, onBlur]);

  const handlePress = useCallback(() => {
    setKeyboardTarget();
    onPress();
  }, [onPress, setKeyboardTarget]);

  return (
    <Pressable
      ref={wrapperRef}
      style={[styles.inputWrap, { height }]}
      onPress={handlePress}
    >
      <RichTextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        placeholderStyle={placeholderStyle}
        multiline
        onContentChange={onContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        cursorColor={cursorColor}
        inheritInsertedStyle={false}
        defaultTextStyle={defaultTextStyle}
        defaultImageStyle={defaultImageStyle}
        style={styles.input}
      />
    </Pressable>
  );
});

export default RichComposerInput;

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
