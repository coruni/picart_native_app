import HugeIcon from "@/components/ui/HugeIcon";
import { useTheme } from "@/hooks/useTheme";
import Megaphone01Icon from "@hugeicons/core-free-icons/Megaphone01Icon";
import Notification01Icon from "@hugeicons/core-free-icons/Notification01Icon";

const SIZE = 24;

// 消息页顶部两张入口卡片的图标。
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
