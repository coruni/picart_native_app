import type {
  CommentControllerFindAll200ResponseDataDataInner,
  CommentControllerFindAll200ResponseDataDataInnerRepliesInner,
} from "@/api/generated";

type CommentReply =
  NonNullable<CommentControllerFindAll200ResponseDataDataInner["replies"]>[number];

export function dedupeReplies(
  replies?: CommentControllerFindAll200ResponseDataDataInner["replies"],
) {
  if (!replies?.length) {
    return [];
  }

  const seenIds = new Set<number>();

  return replies.filter((reply) => {
    if (reply.id == null) {
      return true;
    }

    if (seenIds.has(reply.id)) {
      return false;
    }

    seenIds.add(reply.id);
    return true;
  });
}

export function getReplyKey(
  reply: CommentReply | CommentControllerFindAll200ResponseDataDataInnerRepliesInner,
  index: number,
) {
  if (reply.id != null) {
    return `reply-${reply.id}`;
  }

  return `reply-fallback-${reply.parent?.id ?? "root"}-${
    reply.createdAt ?? "unknown"
  }-${index}`;
}
