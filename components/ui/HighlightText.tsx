import { useTheme } from "@/hooks/useTheme";
import ThemedText, { type TextVariant } from "@/components/ui/ThemedText";
import type { TextStyle } from "react-native";

type HighlightTextProps = {
  text: string;
  keyword?: string;
  size?: number;
  fontWeight?: TextStyle["fontWeight"];
  color?: string;
  variant?: TextVariant;
  numberOfLines?: number;
};

/**
 * 将 text 中匹配 keyword 的片段用 primary 色高亮（大小写不敏感、支持多处匹配）。
 * 未匹配部分沿用传入的颜色/变体。
 */
export default function HighlightText({
  text,
  keyword,
  size,
  fontWeight,
  color,
  variant,
  numberOfLines,
}: HighlightTextProps) {
  const { theme } = useTheme();
  const trimmed = keyword?.trim();

  const baseProps = { size, fontWeight, color, variant, numberOfLines };

  if (!trimmed) {
    return <ThemedText {...baseProps}>{text}</ThemedText>;
  }

  const lowerText = text.toLowerCase();
  const lowerKeyword = trimmed.toLowerCase();
  const segments: { value: string; match: boolean }[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerKeyword, cursor);
    if (matchIndex === -1) {
      segments.push({ value: text.slice(cursor), match: false });
      break;
    }
    if (matchIndex > cursor) {
      segments.push({ value: text.slice(cursor, matchIndex), match: false });
    }
    segments.push({
      value: text.slice(matchIndex, matchIndex + trimmed.length),
      match: true,
    });
    cursor = matchIndex + trimmed.length;
  }

  return (
    <ThemedText {...baseProps}>
      {segments.map((seg, index) =>
        seg.match ? (
          <ThemedText
            key={index}
            size={size}
            fontWeight={fontWeight}
            color={theme.primary}
          >
            {seg.value}
          </ThemedText>
        ) : (
          seg.value
        ),
      )}
    </ThemedText>
  );
}
