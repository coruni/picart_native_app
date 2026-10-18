import HugeIcon from "@/components/ui/HugeIcon";
import { useTheme } from "@/hooks/useTheme";
import Megaphone01Icon from "@hugeicons/core-free-icons/Megaphone01Icon";
import Notification01Icon from "@hugeicons/core-free-icons/Notification01Icon";

const SIZE = 24;

/**
 * 消息页顶部两张入口卡片的图标。
 *
 * 直接使用 Hugeicons 图标库，与列表里的通知类型图标保持同一套视觉：
 * - 通知：铃铛（与 `notificationKind.ts` 的 default 图标一致）。
 * - 系统：喇叭（与 system / announcement 类型图标一致）。
 *
 * 颜色仍从主题派生，`active` 时用语义色，否则退回次要文字色。
 */
export function NotificationsIcon({ active }: { active?: boolean }) {
  const { theme } = useTheme();

  return (
    <HugeIcon
      icon={Notification01Icon}
      size={SIZE}
      color={active ? theme.primary : theme.mutedForeground}
    />
  );
}

/** 系统消息类型色，与 `notificationKind.ts` 的 system 保持一致 */
const SYSTEM_ACCENT = "#D97706";

export function SystemIcon({ active }: { active?: boolean }) {
  const { theme } = useTheme();

  return (
    <HugeIcon
      icon={Megaphone01Icon}
      size={SIZE}
      color={active ? SYSTEM_ACCENT : theme.mutedForeground}
    />
  );
}
