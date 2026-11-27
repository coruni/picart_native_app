import type { IconType } from "@/components/ui/ThemedIcon";
import AtSignIcon from "@hugeicons/core-free-icons/AtSignIcon";
import Notification01Icon from "@hugeicons/core-free-icons/Notification01Icon";
import FavouriteIcon from "@hugeicons/core-free-icons/FavouriteIcon";
import Megaphone01Icon from "@hugeicons/core-free-icons/Megaphone01Icon";
import Message02Icon from "@hugeicons/core-free-icons/Message02Icon";
import MessageCircleReplyIcon from "@hugeicons/core-free-icons/MessageCircleReplyIcon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";

// 通知的展示类型。后端 `notificationType` 是自由字符串（openapi 里只有 `type: string`，没有枚举）
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
  // 点赞/评论是通知页里出现最多的两种类型，色阶比其余类型深一档，避免在浅色底板上看起来发灰。
  like: { Icon: FavouriteIcon, accent: "#E11D48", tint: "#E11D4824" },
  comment: { Icon: Message02Icon, accent: "#2563EB", tint: "#2563EB24" },
  reply: { Icon: MessageCircleReplyIcon, accent: "#8B5CF6", tint: "#8B5CF61F" },
  mention: { Icon: AtSignIcon, accent: "#0EA5E9", tint: "#0EA5E91F" },
  follow: { Icon: UserAdd01Icon, accent: "#10B981", tint: "#10B9811F" },
  system: { Icon: Megaphone01Icon, accent: "#F59E0B", tint: "#F59E0B1F" },
  announcement: { Icon: Megaphone01Icon, accent: "#F59E0B", tint: "#F59E0B1F" },
  default: { Icon: Notification01Icon, accent: "#8B93A7", tint: "#8B93A71F" },
};

// 顺序即优先级：reply 要排在 comment 前面（后端常见 comment_reply 这类复合值）
const RE_LIKE = /like|favorite|favourite|collect|upvote|thumb|点赞|赞/;
const RE_REPLY = /reply|回复/;
const RE_MENTION = /mention|@|提及/;
const RE_COMMENT = /comment|评论/;
const RE_FOLLOW = /follow|关注/;
const RE_ANNOUNCEMENT = /broadcast|announce|notice|bulletin|公告|广播/;
const RE_SYSTEM = /system|系统/;

type KindSource = {
  notification_type?: string;
  type?: string;
  is_broadcast?: boolean;
};

// 把后端返回的类型字段归并成展示类型。
export function resolveNotificationKind(
  source: KindSource,
  fallback: NotificationKind = "default",
): NotificationKind {
  const raw = `${source.notification_type ?? ""} ${source.type ?? ""}`
    .toLowerCase()
    .trim();
  if (!raw) return source.is_broadcast ? "announcement" : fallback;

  if (RE_LIKE.test(raw)) return "like";
  if (RE_REPLY.test(raw)) return "reply";
  if (RE_MENTION.test(raw)) return "mention";
  if (RE_COMMENT.test(raw)) return "comment";
  if (RE_FOLLOW.test(raw)) return "follow";
  if (RE_ANNOUNCEMENT.test(raw)) return "announcement";
  if (RE_SYSTEM.test(raw)) return "system";
  return source.is_broadcast ? "announcement" : fallback;
}
