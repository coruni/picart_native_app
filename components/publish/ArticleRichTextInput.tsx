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
      // 字号对齐阅读页（ArticleHtmlWebView 的 h1~h6 = 22/20/18/16/15/14），
      // 不跟 web 的 clamp 字号走：手机屏窄，27px 的 h1 一行放不下几个字
      h1: { fontSize: 22, bold: true },
      h2: { fontSize: 20, bold: true },
      h3: { fontSize: 18, bold: true },
      h4: { fontSize: 16, bold: true },
      h5: { fontSize: 15, bold: true },
      h6: { fontSize: 14, bold: true },
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
        // 正文 16 / 行高 26（1.6 倍）。别跟 web 的 1.78（16/28），
        // 手机屏窄，太松反而更难读；阅读页的 WebView 也是 1.6，两边一致。
        // 原生只会把行高「撑大」不会压小，标题（22/20/18/16）不受影响。
        fontSize: 16,
        lineHeight: 26,
      }}
    />
  );
}
