import React, { memo, useMemo } from "react";
import { ColorValue, ViewStyle, StyleProp } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

/**
 * Hugeicons 图标的原始数据形态：`[标签名, 属性表]` 组成的只读数组。
 *
 * 免费版图标是纯数据（不是 React 组件），统一由 `HugeIcon` 渲染成 SVG。
 */
export type HugeIconData =
  | readonly (readonly [
      string,
      { readonly [key: string]: string | number },
    ])[]
  | ([string, { [key: string]: string | number }])[];

/**
 * 全局描边线宽。图标数据自带 1.5 的细线，统一在这里加粗到 2，
 * 让所有图标保持一致的加粗线条；需要特殊线宽时在调用处显式传 `strokeWidth` 覆盖。
 */
export const ICON_STROKE_WIDTH = 2;

/** 强调用的加粗线宽（话题 `#`、小尺寸勾选等），约为常规描边的 1.5 倍 */
export const TOPIC_STROKE_WIDTH = 3;

/**
 * 加粗描边会让线条以路径为中心向外扩半个线宽。Hugeicons 的图形画在 24×24 视框内，
 * 部分图标（如 `HashtagIcon`）的外沿本来就贴着 1.5 ~ 21.5，线宽一加粗就会被视框裁掉。
 * 这里把视框四周各留出 1px 余量再等比放大，视觉尺寸不变，只是不再切边。
 */
const VIEW_BOX_PADDING = 1;
const VIEW_BOX = `-${VIEW_BOX_PADDING} -${VIEW_BOX_PADDING} ${24 + VIEW_BOX_PADDING * 2} ${24 + VIEW_BOX_PADDING * 2}`;

export interface HugeIconProps {
  icon: HugeIconData;
  size?: number;
  color?: ColorValue;
  /** 实心态填充色。描边图标（免费版全部为描边）需同时给 `strokeWidth={0}` 才能纯实心 */
  fill?: ColorValue;
  /** 覆盖全局线宽；不传则使用 `ICON_STROKE_WIDTH` */
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

type ShapeProps = Record<string, string | number>;

const SHAPES: Record<string, React.ComponentType<any>> = {
  path: Path,
  circle: Circle,
  ellipse: Ellipse,
  rect: Rect,
};

const HugeIcon = memo(
  ({ icon, size = 20, color = "currentColor", fill, strokeWidth }: HugeIconProps) => {
    const shapes = useMemo(
      () =>
        icon.map((entry, index) => {
          const [tag, attrs] = entry;
          const Shape = SHAPES[tag];
          if (!Shape) return null;

          // Hugeicons 的每个 shape 都自带一个 `key` 字段，直接 spread 会触发
          // React 的 "props object containing a key prop is being spread" 警告。
          // 这里显式挑出可渲染属性，既剔掉 key，也避免把未知字段透传给 react-native-svg。
          const resolved: ShapeProps = {};
          for (const name in attrs) {
            if (name === "key") continue;
            resolved[name] = attrs[name] as string | number;
          }

          if (resolved.stroke === "currentColor") {
            resolved.stroke = color as string;
          }
          // 始终覆盖图标数据自带的线宽（1.5），保证"加粗线条"是默认且统一的。
          // strokeWidth=0 是刻意的实心/填充用法，需要原样保留。
          const resolvedStrokeWidth = strokeWidth ?? ICON_STROKE_WIDTH;
          if (resolvedStrokeWidth === 0) {
            delete resolved.strokeWidth;
            resolved.stroke = "none";
          } else {
            resolved.strokeWidth = resolvedStrokeWidth;
          }
          if (fill != null) {
            resolved.fill = fill as string;
          }

          return <Shape key={index} {...resolved} />;
        }),
      [color, fill, icon, strokeWidth],
    );

    return (
      <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none">
        {shapes}
      </Svg>
    );
  },
);

HugeIcon.displayName = "HugeIcon";

export default HugeIcon;
