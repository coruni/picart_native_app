import type { DtoCommentDto } from "@/api/generated";

type CommentReply = NonNullable<DtoCommentDto["replies"]>[number];

export function dedupeReplies<T extends { id?: string }>(replies?: T[]): T[] {
  if (!replies?.length) {
    return [];
  }

  const seenIds = new Set<string>();

  return replies.filter((reply) => {
    if (reply.id == null) {
      return true;
    }

    if (seenIds.has(String(reply.id))) {
      return false;
    }

    seenIds.add(String(reply.id));
    return true;
  });
}

export function getReplyKey(reply: CommentReply | DtoCommentDto, index: number) {
  if (reply.id != null) {
    return `reply-${reply.id}`;
  }

  return `reply-fallback-${reply.parent_id ?? "root"}-${
    reply.created_at ?? "unknown"
  }-${index}`;
}
