import type { HugeIconData } from "@/components/ui/HugeIcon";
import Comment01Icon from "@hugeicons/core-free-icons/Comment01Icon";
import Medal01Icon from "@hugeicons/core-free-icons/Medal01Icon";
import SquareUserRoundIcon from "@hugeicons/core-free-icons/SquareUserRoundIcon";

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
 * 竖 Tab 的图标映射。图标名 MUST 在 `dist/esm/` 中真实存在——
 * Hugeicons 免费版有 6000+ 个导出，命名不统一（`LockIcon` 无编号、
 * `SquareUserRoundIcon` 而非 `UserSquare01Icon`），新增前先确认。
 */
export const DECORATION_TYPE_ICONS: Record<DecorationType, HugeIconData> = {
  AVATAR_FRAME: SquareUserRoundIcon,
  COMMENT_BUBBLE: Comment01Icon,
  ACHIEVEMENT_BADGE: Medal01Icon,
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