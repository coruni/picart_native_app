import achievementActivePng from "@/assets/images/decoration/achievement_active.png";
import achievementPng from "@/assets/images/decoration/achievement.png";
import avatarActivePng from "@/assets/images/decoration/avatar_active.png";
import avatarPng from "@/assets/images/decoration/avatar.png";
import commentActivePng from "@/assets/images/decoration/comment_active.png";
import commentPng from "@/assets/images/decoration/comment.png";
import type { ImageSourcePropType } from "react-native";

/**
 * 装饰品的类型与取值归一化。
 *
 * 后端把 `rarity` / `obtainMethod` / `type` 都当裸 string 返回（没有生成联合类型），
 * 因此这里必须容忍未知值——查不到就落到兜底，不让页面崩在脏数据上。
 *
 * 设计约束（`docs/design/DESIGN_CONSTRAINTS.md` §2.1）：
 * 主色只有 `#6680ff` 一个值；通知类型色是「有意的一组编码色」且 MUST NOT 扩散成通用语义色。
 * 同理，稀有度**不配彩虹色**：普通/稀有/史诗/传说四色已从 UI 移除，只作为文案出现。
 * 若后续要强调稀有度，优先用细色条，不要改成彩色文字。
 */

export type DecorationType = "AVATAR_FRAME" | "COMMENT_BUBBLE" | "ACHIEVEMENT_BADGE";

export const DECORATION_TYPES: readonly DecorationType[] = [
  "AVATAR_FRAME",
  "COMMENT_BUBBLE",
  "ACHIEVEMENT_BADGE",
] as const;

/**
 * 竖 Tab 的图标：直接复用网页端 `assets/images/account/decoration/` 下的 168×168 素材，
 * 与网页端一致地分「未激活 / 激活」两态（激活态是带主色描边的那张）。
 * 图标名 MUST 在 `dist/esm/` 中真实存在——Hugeicons 免费版有 6000+ 个导出，
 * 命名不统一（`LockIcon` 无编号、`SquareUserRoundIcon` 而非 `UserSquare01Icon`）。
 */
export const DECORATION_TYPE_IMAGES: Record<
  DecorationType,
  { icon: ImageSourcePropType; iconActive: ImageSourcePropType }
> = {
  AVATAR_FRAME: { icon: avatarPng, iconActive: avatarActivePng },
  COMMENT_BUBBLE: { icon: commentPng, iconActive: commentActivePng },
  ACHIEVEMENT_BADGE: { icon: achievementPng, iconActive: achievementActivePng },
};

/**
 * 各分类在移动端的网格列数。
 *
 * 参考网页端 `(decoration)` 路由在窄屏下的表现，但按移动端可用宽度重新定：
 * - 头像框预览是方形贴图，两列排布信息密度刚好
 * - 评论气泡要露出气泡配色与文案，成就徽章要露出徽章图与获得时间，单列才不挤
 */
export const DECORATION_COLUMNS: Record<DecorationType, 1 | 2> = {
  AVATAR_FRAME: 2,
  COMMENT_BUBBLE: 1,
  ACHIEVEMENT_BADGE: 1,
};

export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

const RARITY_KEYS: readonly Rarity[] = [
  "COMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
] as const;

/** 归一化稀有度；未知值一律落到 COMMON（同时覆盖 null / undefined / 空串） */
export function normalizeRarity(value?: string | null): Rarity {
  const upper = (value ?? "").toUpperCase() as Rarity;
  return RARITY_KEYS.includes(upper) ? upper : "COMMON";
}

/** 归一化装饰品类型；无法识别时返回 null（调用方据此跳过，不静默归入某一类） */
export function normalizeDecorationType(
  value?: string | null,
): DecorationType | null {
  const upper = (value ?? "").toUpperCase() as DecorationType;
  return DECORATION_TYPES.includes(upper) ? upper : null;
}

/** 获取方式的 i18n 后缀，拼在 `decorationPage.obtain.` 之后 */
export function obtainMethodKey(value?: string | null): string {
  switch ((value ?? "").toUpperCase()) {
    case "PURCHASE":
      return "purchase";
    case "ACTIVITY":
      return "activity";
    case "GIFT":
      return "gift";
    case "ACHIEVEMENT":
      return "achievement";
    default:
      return "default";
  }
}