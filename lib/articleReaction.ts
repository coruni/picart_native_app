import type { ReactionType } from "@/constants/reactions";

export type ReactionCounts = Record<string, number>;

export type ReactionState = {
  reactionStats: ReactionCounts;
  userReaction: ReactionType | null;
  isLiked: boolean;
  likes: number;
};

type ApplyReactionInput = {
  reactionStats?: ReactionCounts | null;
  userReaction?: string | null;
  likes?: number | null;
  next: ReactionType;
};

/**
 * 表态切换的唯一状态推导：同一表情再点一次取消，换表情时同时扣掉旧的那个。
 * 点赞数优先用各表情计数之和（与后端 `reactionStats` 同源），
 * 全为 0 的旧数据回退到原 `likes` 计数上做 ±1。
 */
export function applyReaction({
  reactionStats,
  userReaction,
  likes,
  next,
}: ApplyReactionInput): ReactionState {
  const stats: ReactionCounts = { ...(reactionStats ?? {}) };
  const current = userReaction && userReaction !== next ? userReaction : null;
  const wasReacted = userReaction === next;

  if (wasReacted) {
    stats[next] = Math.max(0, (stats[next] ?? 0) - 1);
  } else {
    if (current) {
      stats[current] = Math.max(0, (stats[current] ?? 0) - 1);
    }
    stats[next] = (stats[next] ?? 0) + 1;
  }

  const nextUserReaction = wasReacted ? null : next;
  const total = Object.values(stats).reduce((sum, value) => sum + (value || 0), 0);
  const likesDelta = wasReacted ? -1 : current ? 0 : 1;
  const baseLikes = Math.max(0, likes ?? 0);

  return {
    reactionStats: stats,
    userReaction: nextUserReaction,
    isLiked: nextUserReaction !== null,
    likes: total > 0 ? total : Math.max(0, baseLikes + likesDelta),
  };
}
