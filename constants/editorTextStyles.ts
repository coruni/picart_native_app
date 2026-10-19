/**
 * 文章编辑器的文字颜色 / 背景色 / 字号选项。
 * 颜色取中低明度，保证在浅色和深色两套主题下都能读。
 */
export const EDITOR_TEXT_COLORS = [
  "#E5484D",
  "#F76808",
  "#FFB224",
  "#46A758",
  "#12A594",
  "#0091FF",
  "#6E56CF",
  "#E93D82",
  "#8B8D98",
];

/** 背景色偏浅，避免把正文压得看不清 */
export const EDITOR_HIGHLIGHT_COLORS = [
  "#FFE58F",
  "#FFD8B2",
  "#C9F2D8",
  "#CCE7FF",
  "#E6DAFF",
  "#FFD6E7",
  "#E6E6E6",
];

/** 与 ArticleRichTextInput 的 fontSize 保持一致，作为字号阶梯的基准 */
export const EDITOR_BASE_FONT_SIZE = 15;

/** A⁺ / A⁻ 与字号面板共用的阶梯 */
export const EDITOR_FONT_SIZES: number[] = [12, 14, 15, 18, 22, 26];

/** 沿阶梯走一步；已经在两端时停在原地 */
export function stepFontSize(current: number, step: 1 | -1): number {
  const index = EDITOR_FONT_SIZES.indexOf(current);
  const base =
    index >= 0 ? index : EDITOR_FONT_SIZES.indexOf(EDITOR_BASE_FONT_SIZE);
  const next = Math.min(
    EDITOR_FONT_SIZES.length - 1,
    Math.max(0, base + step),
  );
  return EDITOR_FONT_SIZES[next] ?? EDITOR_BASE_FONT_SIZE;
}
