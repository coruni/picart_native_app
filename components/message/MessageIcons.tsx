import { ICON_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import { useTheme } from "@/hooks/useTheme";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const SIZE = 28;

/**
 * 消息页顶部两张入口卡片的图标。
 *
 * 与底部导航 `TabBarIcon` 同一套绘制规则：
 * 24×24 视框、`ICON_STROKE_WIDTH` 线宽、round 端点与拐角、主体大圆角。
 *
 * 颜色全部从主题派生：
 * - 通知：品牌主色 `#6680ff`，主体 12% 填充 + 实心描边（深色下填充提到 22%）。
 * - 系统：琥珀系。描边取深一档的 `#D97706`，因为在 15% 琥珀底
 *   （`#F59E0B26`）上，原 `#F59E0B` 描边对比度不足 2:1，图标会糊掉。
 *
 * 主色亮暗一致（`constants/theme.ts` 已收敛为单一 `primary`），这里只按底色
 * 调整填充透明度，不再拆色阶。
 */
export function NotificationsIcon({ active }: { active?: boolean }) {
  const { theme, isDark } = useTheme();
  const stroke = active ? theme.primary : theme.mutedForeground;
  const fill = active
    ? `${theme.primary}${isDark ? "38" : "1F"}`
    : theme.muted;

  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      {/* 顶部提环 */}
      <Circle cx={12} cy={3.9} r={1.15} fill={stroke} />
      {/* 铃体：外扩裙边，整体闭合以便填充 */}
      <Path
        d="M5.55 17.75C6.4 16.6 6.95 15.1 6.95 13.35V11.1C6.95 8.31 9.21 6.05 12 6.05C14.79 6.05 17.05 8.31 17.05 11.1V13.35C17.05 15.1 17.6 16.6 18.45 17.75C18.62 17.98 18.46 18.3 18.18 18.3H5.82C5.54 18.3 5.38 17.98 5.55 17.75Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* 铃舌 */}
      <Path
        d="M10.2 18.3C10.2 19.35 11 20.15 12 20.15C13 20.15 13.8 19.35 13.8 18.3"
        stroke={stroke}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** 系统消息类型色，与 `notificationKind.ts` 的 system 保持一致 */
const SYSTEM_ACCENT = "#F59E0B";
/** 深一档琥珀，仅用于描边 */
const SYSTEM_STROKE = "#D97706";

export function SystemIcon({ active }: { active?: boolean }) {
  const { theme, isDark } = useTheme();
  const stroke = active ? SYSTEM_STROKE : theme.mutedForeground;
  const fill = active
    ? `${SYSTEM_ACCENT}${isDark ? "38" : "2E"}`
    : theme.muted;

  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      {/* 信封：大圆角外框 */}
      <Rect
        x={3.4}
        y={5.7}
        width={17.2}
        height={12.6}
        rx={4.6}
        fill={fill}
        stroke={stroke}
        strokeWidth={ICON_STROKE_WIDTH}
      />
      {/* 信舌折线，底端圆头 */}
      <Path
        d="M5.5 8.35L10.78 12.5C11.5 13.06 12.5 13.06 13.22 12.5L18.5 8.35"
        stroke={stroke}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
