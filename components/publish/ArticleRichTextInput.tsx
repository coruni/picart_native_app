import { useTheme } from "@/hooks/useTheme";
import { useMemo, type RefObject } from "react";
import type { NativeSyntheticEvent } from "react-native";
import {
  EnrichedTextInput,
  type EnrichedTextInputInstance,
  type HtmlStyle,
  type OnChangeSelectionEvent,
  type OnChangeStateEvent,
  type OnChangeTextEvent,
} from "react-native-enriched-html";

export const ARTICLE_EDITOR_MIN_HEIGHT = 220;

interface ArticleRichTextInputProps {
  ref?: RefObject<EnrichedTextInputInstance | null>;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (event: NativeSyntheticEvent<OnChangeTextEvent>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeSelection?: (
    event: NativeSyntheticEvent<OnChangeSelectionEvent>,
  ) => void;
  onChangeState?: (event: NativeSyntheticEvent<OnChangeStateEvent>) => void;
}

export default function ArticleRichTextInput({
  ref,
  defaultValue,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  onChangeSelection,
  onChangeState,
}: ArticleRichTextInputProps) {
  const { theme, colors } = useTheme();

  const htmlStyle = useMemo<HtmlStyle>(
    () => ({
      // 字号 / 行高取自 web 端 article/ql-editor-content.css，
      // 两端编辑器同一段文字的折行位置才一致
      h1: { fontSize: 27, bold: true },
      h2: { fontSize: 22, bold: true },
      h3: { fontSize: 19, bold: true },
      h4: { fontSize: 17, bold: true },
      blockquote: {
        borderColor: theme.border,
        borderWidth: 3,
        gapWidth: 14,
        color: theme.secondary,
      },
      codeblock: {
        color: theme.foreground,
        borderRadius: 8,
        backgroundColor: theme.muted,
      },
      code: {
        color: colors.primary,
        backgroundColor: theme.muted,
      },
      a: {
        color: colors.primary,
        textDecorationLine: "underline",
      },
      ol: {
        marginLeft: 16,
        gapWidth: 8,
        markerColor: theme.mutedForeground,
      },
      ul: {
        marginLeft: 16,
        gapWidth: 8,
        bulletColor: colors.primary,
        bulletSize: 6,
      },
    }),
    [
      colors.primary,
      theme.border,
      theme.foreground,
      theme.muted,
      theme.mutedForeground,
      theme.secondary,
    ],
  );

  return (
    <EnrichedTextInput
      ref={ref}
      defaultValue={defaultValue}
      placeholder={placeholder}
      placeholderTextColor={theme.mutedForeground}
      cursorColor={colors.primary}
      selectionColor={colors.primary + "33"}
      autoCapitalize="sentences"
      // 让输入框随内容长高，滚动交给外层 ScrollView
      scrollEnabled={false}
      allowFontScaling={false}
      htmlStyle={htmlStyle}
      onFocus={onFocus}
      onBlur={onBlur}
      onChangeText={onChangeText}
      onChangeSelection={onChangeSelection}
      onChangeState={onChangeState}
      style={{
        minHeight: ARTICLE_EDITOR_MIN_HEIGHT,
        paddingVertical: 8,
        color: theme.foreground,
        // web 端正文是 16px / 1.78
        fontSize: 16,
        lineHeight: 28,
      }}
    />
  );
}
