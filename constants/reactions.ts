import angry from "@/assets/images/reaction/angry.png";
import dislike from "@/assets/images/reaction/dislike.png";
import haha from "@/assets/images/reaction/haha.png";
import like from "@/assets/images/reaction/like.png";
import love from "@/assets/images/reaction/love.png";
import sad from "@/assets/images/reaction/sad.png";
import wow from "@/assets/images/reaction/wow.png";

/** 与后端 `ArticleLikeDtoReactionTypeEnum` 一一对应，顺序即表态条的展示顺序 */
export const REACTION_TYPES = [
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
  "dislike",
] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

/** `require()` 出来的资源句柄，交付给 expo-image 的 source */
export const REACTION_IMAGES: Record<ReactionType, number> = {
  like,
  love,
  haha,
  wow,
  sad,
  angry,
  dislike,
};

/** 表情在 i18n 里的完整 key，用于无障碍播报 */
export const REACTION_LABEL_KEYS: Record<ReactionType, string> = {
  like: "article.reactions.like",
  love: "article.reactions.love",
  haha: "article.reactions.haha",
  wow: "article.reactions.wow",
  sad: "article.reactions.sad",
  angry: "article.reactions.angry",
  dislike: "article.reactions.dislike",
};

export function isReactionType(value: unknown): value is ReactionType {
  return (
    typeof value === "string" &&
    (REACTION_TYPES as readonly string[]).includes(value)
  );
}
