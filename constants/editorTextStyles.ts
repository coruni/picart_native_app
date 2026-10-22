/**
 * 文章编辑器的文字颜色 / 背景色 / 字号选项。
 * 取值与 web 端 `src/components/editor/constants.tsx` 保持一致，
 * 两端编辑器选出来的排版才是同一套。
 */
export const EDITOR_TEXT_COLORS = [
  "rgba(0, 0, 0, 0.85)",
  "rgb(230, 230, 230)",
  "rgb(217, 217, 217)",
  "rgb(191, 191, 191)",
  "rgb(166, 166, 166)",
  "rgb(140, 140, 140)",
  "rgb(115, 115, 115)",
  "rgb(89, 89, 89)",
  "rgb(213, 255, 191)",
  "rgb(196, 255, 166)",
  "rgb(160, 251, 113)",
  "rgb(122, 216, 76)",
  "rgb(59, 177, 0)",
  "rgb(50, 150, 0)",
  "rgb(37, 112, 0)",
  "rgb(30, 89, 0)",
  "rgb(191, 255, 248)",
  "rgb(166, 255, 244)",
  "rgb(109, 242, 227)",
  "rgb(76, 217, 200)",
  "rgb(45, 178, 162)",
  "rgb(21, 143, 129)",
  "rgb(0, 102, 90)",
  "rgb(0, 77, 68)",
  "rgb(191, 232, 255)",
  "rgb(166, 222, 255)",
  "rgb(115, 204, 255)",
  "rgb(85, 185, 242)",
  "rgb(57, 166, 229)",
  "rgb(28, 128, 186)",
  "rgb(0, 81, 128)",
  "rgb(0, 65, 102)",
  "rgb(229, 191, 255)",
  "rgb(219, 166, 255)",
  "rgb(199, 115, 255)",
  "rgb(170, 80, 229)",
  "rgb(131, 21, 204)",
  "rgb(112, 12, 178)",
  "rgb(92, 0, 153)",
  "rgb(76, 0, 128)",
  "rgb(255, 191, 223)",
  "rgb(255, 166, 211)",
  "rgb(255, 115, 186)",
  "rgb(229, 80, 156)",
  "rgb(204, 51, 128)",
  "rgb(178, 27, 103)",
  "rgb(152, 0, 76)",
  "rgb(128, 0, 64)",
  "rgb(255, 196, 191)",
  "rgb(255, 173, 166)",
  "rgb(255, 111, 99)",
  "rgb(239, 34, 12)",
  "rgb(204, 71, 51)",
  "rgb(178, 41, 27)",
  "rgb(153, 18, 0)",
  "rgb(128, 15, 0)",
  "rgb(255, 219, 191)",
  "rgb(255, 192, 140)",
  "rgb(255, 164, 43)",
  "rgb(255, 122, 0)",
  "rgb(226, 100, 0)",
  "rgb(199, 89, 0)",
  "rgb(159, 72, 0)",
  "rgb(128, 57, 0)",
  "rgb(255, 238, 191)",
  "rgb(246, 214, 122)",
  "rgb(245, 201, 73)",
  "rgb(230, 179, 34)",
  "rgb(204, 159, 30)",
  "rgb(179, 140, 0)",
  "rgb(153, 102, 0)",
];

/** 背景色与文字色共用同一组色板，和 web 端一致 */
export const EDITOR_HIGHLIGHT_COLORS = EDITOR_TEXT_COLORS;

/** 与 ArticleRichTextInput 的 fontSize 保持一致，作为字号阶梯的基准 */
export const EDITOR_BASE_FONT_SIZE = 16;

/**
 * 正文里行内表情相对正文字号的倍数。
 *
 * 编辑器的插入尺寸、阅读页 WebView 的 CSS、原生渲染的表情盒子**三处同源**，
 * 别再各写各的 px（web 端写死 32px 搬到手机上比正文还大，行也顶高）。
 * 1.25 是移动端常用比例：16pt 正文 → 20pt 表情，跟行高 26 正好匹配。
 */
export const BODY_EMOJI_SCALE = 1.25;

/** 表情的插入 / 渲染尺寸（dp），由正文字号推导 */
export const BODY_EMOJI_SIZE = Math.round(
  EDITOR_BASE_FONT_SIZE * BODY_EMOJI_SCALE,
);

/** A⁺ / A⁻ 与字号面板共用的阶梯，对齐 web 端 fontSizes */
export const EDITOR_FONT_SIZES: number[] = [12, 14, 16, 18, 24, 32];

/** 沿阶梯走一步；已经在两端时停在原地 */
export function stepFontSize(current: number, step: 1 | -1): number {
  const index = EDITOR_FONT_SIZES.indexOf(current);
  const base =
    index >= 0 ? index : EDITOR_FONT_SIZES.indexOf(EDITOR_BASE_FONT_SIZE);
  const next = Math.min(EDITOR_FONT_SIZES.length - 1, Math.max(0, base + step));
  return EDITOR_FONT_SIZES[next] ?? EDITOR_BASE_FONT_SIZE;
}
