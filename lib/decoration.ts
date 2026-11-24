import achievementActivePng from "@/assets/images/decoration/achievement_active.png";
import achievementPng from "@/assets/images/decoration/achievement.png";
import avatarActivePng from "@/assets/images/decoration/avatar_active.png";
import avatarPng from "@/assets/images/decoration/avatar.png";
import commentActivePng from "@/assets/images/decoration/comment_active.png";
import commentPng from "@/assets/images/decoration/comment.png";
import type { ImageSourcePropType } from "react-native";

// 装饰品的类型与取值归一化。

export type DecorationType = "AVATAR_FRAME" | "COMMENT_BUBBLE" | "ACHIEVEMENT_BADGE";

export const DECORATION_TYPES: readonly DecorationType[] = [
  "AVATAR_FRAME",
  "COMMENT_BUBBLE",
  "ACHIEVEMENT_BADGE",
] as const;

// 竖 Tab 的图标：直接复用网页端 `assets/images/account/decoration/` 下的 168×168 素材
export const DECORATION_TYPE_IMAGES: Record<
  DecorationType,
  { icon: ImageSourcePropType; iconActive: ImageSourcePropType }
> = {
  AVATAR_FRAME: { icon: avatarPng, iconActive: avatarActivePng },
  COMMENT_BUBBLE: { icon: commentPng, iconActive: commentActivePng },
  ACHIEVEMENT_BADGE: { icon: achievementPng, iconActive: achievementActivePng },
};

// 各分类在移动端的网格列数。
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