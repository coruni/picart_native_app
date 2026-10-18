import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

/**
 * 底部导航图标（圆润风格）
 *
 * 设计约定：
 * - 统一 24×24 视框，线宽 2（与 `HugeIcon` 的 `ICON_STROKE_WIDTH` 同口径），端点 / 拐角全部 round
 * - 未激活：仅描边（inactiveColor），内部留空
 * - 激活：整体实心填充（activeColor），内部结构用 surfaceColor 挖空，
 *   因此 surfaceColor 必须传入 tabBar 的实际背景色，暗色模式才不会露白
 */

export type TabIconName = "home" | "circle" | "message" | "profile";

export type TabBarIconProps = {
  name: TabIconName;
  focused?: boolean;
  size?: number;
  /** 未激活描边色 */
  color?: string;
  /** 激活主色 */
  activeColor?: string;
  /** 激活态镂空色，应与 tabBar 背景色一致 */
  surfaceColor?: string;
  strokeWidth?: number;
};

/** 首页：圆角屋顶 + 拱形门 */
const HOME_BODY =
  "M3.5 11.35C3.5 10.6 3.78 9.88 4.3 9.38L10.55 3.35C11.36 2.57 12.64 2.57 13.45 3.35L19.7 9.38C20.22 9.88 20.5 10.6 20.5 11.35V17.35C20.5 19.2 19 20.7 17.15 20.7H6.85C5 20.7 3.5 19.2 3.5 17.35Z";
const HOME_DOOR =
  "M9.35 20.7V17.15C9.35 15.7 10.5 14.55 12 14.55C13.5 14.55 14.65 15.7 14.65 17.15V20.7";

/** 圈子：两枚交叠的圆，表示圈层与连接 */
const CIRCLE_A = { cx: 9.3, cy: 9.3, r: 5.9 };
const CIRCLE_B = { cx: 15.3, cy: 15.1, r: 4.8 };

/** 消息：圆角气泡 + 左下圆尾 */
const MESSAGE_BODY =
  "M6.6 4.4H17.4C19.15 4.4 20.55 5.8 20.55 7.55V13.35C20.55 15.1 19.15 16.5 17.4 16.5H11.4L8 19.55C7.2 20.25 5.5 19.7 5.5 18.6V16.1C4.35 15.35 3.45 14.05 3.45 12.55V7.55C3.45 5.8 4.85 4.4 6.6 4.4Z";
const MESSAGE_DOTS = [
  { cx: 8.15, cy: 10.45 },
  { cx: 12, cy: 10.45 },
  { cx: 15.85, cy: 10.45 },
];

/** 我的：圆头 + 圆肩 */
const PROFILE_HEAD = { cx: 12, cy: 8.15, r: 3.95 };
const PROFILE_BODY =
  "M4.5 20.8C4.5 17 7.85 14.5 12 14.5C16.15 14.5 19.5 17 19.5 20.8";

export function TabBarIcon({
  name,
  focused = false,
  size = 25,
  color = "#6b7280",
  activeColor = "#6680ff",
  surfaceColor = "#ffffff",
  strokeWidth = 2,
}: TabBarIconProps) {
  const stroke = focused ? activeColor : color;
  const fill = focused ? activeColor : "none";
  const line = {
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === "home" && (
        <>
          <Path d={HOME_BODY} fill={fill} {...line} />
          <Path
            d={focused ? `${HOME_DOOR}Z` : HOME_DOOR}
            fill={focused ? surfaceColor : "none"}
            stroke={focused ? surfaceColor : stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {name === "circle" && (
        <>
          {/* 后层圆：先描边，激活时实心 */}
          <Circle
            {...CIRCLE_B}
            fill={fill}
            stroke={focused ? surfaceColor : stroke}
            strokeWidth={focused ? strokeWidth + 0.3 : strokeWidth}
          />
          {/* 未激活时用背景色加粗描边，把后层圆在前层圆内部的线段清掉，形成前后层叠。
              裁切描边必须比「前层圆描边 + 后层圆描边」更宽，否则两圆相交处会露出后层圆的弧线：
              宽度 = strokeWidth（前层） + strokeWidth + 0.3（后层） + 0.4（余量）。 */}
          {!focused && (
            <Circle
              {...CIRCLE_A}
              fill="none"
              stroke={surfaceColor}
              strokeWidth={strokeWidth * 2 + 0.7}
            />
          )}
          {/* 前层圆 */}
          <Circle
            {...CIRCLE_A}
            fill={fill}
            stroke={focused ? surfaceColor : stroke}
            strokeWidth={focused ? strokeWidth + 0.3 : strokeWidth}
          />
        </>
      )}

      {name === "message" && (
        <>
          <Path d={MESSAGE_BODY} fill={fill} {...line} />
          {focused &&
            MESSAGE_DOTS.map((dot, i) => (
              <Circle key={i} {...dot} r={1.4} fill={surfaceColor} />
            ))}
        </>
      )}

      {name === "profile" && (
        <>
          <Path
            d={focused ? `${PROFILE_BODY}Z` : PROFILE_BODY}
            fill={fill}
            {...line}
          />
          <Circle {...PROFILE_HEAD} fill={fill} {...line} />
        </>
      )}
    </Svg>
  );
}

export default TabBarIcon;
