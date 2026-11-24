import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
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
  onUnmount?: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onPress: () => void;
};

// 评论富文本输入框。注意：刻意不再向 @gorhom/bottom-sheet 写入 `animatedKeyboardState.target`。
function RichComposerInput({
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
  onUnmount,
  onFocus,
  onBlur,
  onPress,
}: RichComposerInputProps) {
  const onReadyRef = useRef(onReady);
  const onUnmountRef = useRef(onUnmount);
  const onFocusRef = useRef(onFocus);
  const onBlurRef = useRef(onBlur);
  const onPressRef = useRef(onPress);

  useEffect(() => {
    onReadyRef.current = onReady;
    onUnmountRef.current = onUnmount;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;
    onPressRef.current = onPress;
  }, [onBlur, onFocus, onPress, onReady, onUnmount]);

  // 仅在挂载/卸载时执行：通知父组件新的原生输入框实例已就绪，卸载时立刻复位就绪标志，避免下次打开时父组件读到上一次会话残留的 inputReadyRef = true。
  useEffect(() => {
    const timer = setTimeout(() => onReadyRef.current(), 0);
    return () => {
      clearTimeout(timer);
      onUnmountRef.current?.();
    };
  }, []);

  const handleFocus = useCallback(() => {
    onFocusRef.current();
  }, []);

  const handleBlur = useCallback(() => {
    onBlurRef.current();
  }, []);

  const handlePress = useCallback(() => {
    onPressRef.current();
  }, []);

  const inputStyle = useMemo(
    () => ({
      height,
      minHeight: height,
    }),
    [height],
  );

  return (
    <Pressable style={[styles.inputWrap, inputStyle]} onPress={handlePress}>
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
}

// props 已全部稳定（ref / useMemo / useCallback），memo 后父组件的键盘与面板状态切换不会连带重渲染输入框。
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
