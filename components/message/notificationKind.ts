import type { IconType } from "@/components/ui/ThemedIcon";
import AtSignIcon from "@hugeicons/core-free-icons/AtSignIcon";
import Notification01Icon from "@hugeicons/core-free-icons/Notification01Icon";
import FavouriteIcon from "@hugeicons/core-free-icons/FavouriteIcon";
import Megaphone01Icon from "@hugeicons/core-free-icons/Megaphone01Icon";
import Message02Icon from "@hugeicons/core-free-icons/Message02Icon";
import MessageCircleReplyIcon from "@hugeicons/core-free-icons/MessageCircleReplyIcon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";

/**
 * 通知的展示类型。
 *
 * 后端 `notificationType` 是自由字符串（openapi 里只有 `type: string`，没有枚举），
 * 所以这里按关键词归并而不是穷举 —— 后端新增取值时会落到 default，
 * 不会出现空白图标。
 */
export type NotificationKind =
  | "like"
  | "comment"
  | "reply"
  | "mention"
  | "follow"
  | "system"
  | "announcement"
  | "default";

type KindMeta = {
  Icon: IconType;
  /** 图标主色。饱和度取中段，保证在亮/暗两种卡片底色上都够清晰 */
  accent: string;
  /** 圆形底板色 = accent 的 12% 透明度 */
  tint: string;
};

export const NOTIFICATION_KIND_META: Record<NotificationKind, KindMeta> = {
  like: { Icon: FavouriteIcon, accent: "#F43F5E", tint: "#F43F5E1F" },
  comment: { Icon: Message02Icon, accent: "#3B82F6", tint: "#3B82F61F" },
  reply: { Icon: MessageCircleReplyIcon, accent: "#8B5CF6", tint: "#8B5CF61F" },
  mention: { Icon: AtSignIcon, accent: "#0EA5E9", tint: "#0EA5E91F" },
  follow: { Icon: UserAdd01Icon, accent: "#10B981", tint: "#10B9811F" },
  system: { Icon: Megaphone01Icon, accent: "#F59E0B", tint: "#F59E0B1F" },
  announcement: { Icon: Megaphone01Icon, accent: "#F59E0B", tint: "#F59E0B1F" },
  default: { Icon: Notification01Icon, accent: "#8B93A7", tint: "#8B93A71F" },
};

// 顺序即优先级：reply 要排在 comment 前面（后端常见 comment_reply 这类复合值），
// like 排最前是因为 favorite / collect / upvote 这些近义词都归到点赞语义。
const RE_LIKE = /like|favorite|favourite|collect|upvote|thumb|点赞|赞/;
const RE_REPLY = /reply|回复/;
const RE_MENTION = /mention|@|提及/;
const RE_COMMENT = /comment|评论/;
const RE_FOLLOW = /follow|关注/;
const RE_ANNOUNCEMENT = /broadcast|announce|notice|bulletin|公告|广播/;
const RE_SYSTEM = /system|系统/;

type KindSource = {
  notificationType?: string;
  type?: string;
  isBroadcast?: boolean;
};

/**
 * 把后端返回的类型字段归并成展示类型。
 *
 * `notificationType` 缺失时退回 `type`（列表接口里 `type` 是 notification /
 * system 这类粗粒度值），两者都认不出来时用 fallback —— 互动通知默认铃铛，
 * 系统消息默认喇叭。
 */
export function resolveNotificationKind(
  source: KindSource,
  fallback: NotificationKind = "default",
): NotificationKind {
  const raw = `${source.notificationType ?? ""} ${source.type ?? ""}`
    .toLowerCase()
    .trim();
  if (!raw) return source.isBroadcast ? "announcement" : fallback;

  if (RE_LIKE.test(raw)) return "like";
  if (RE_REPLY.test(raw)) return "reply";
  if (RE_MENTION.test(raw)) return "mention";
  if (RE_COMMENT.test(raw)) return "comment";
  if (RE_FOLLOW.test(raw)) return "follow";
  if (RE_ANNOUNCEMENT.test(raw)) return "announcement";
  if (RE_SYSTEM.test(raw)) return "system";
  return source.isBroadcast ? "announcement" : fallback;
}
