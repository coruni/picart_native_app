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

export interface HugeIconProps {
  icon: HugeIconData;
  size?: number;
  color?: ColorValue;
  /** 实心态填充色。描边图标（免费版全部为描边）需同时给 `strokeWidth={0}` 才能纯实心 */
  fill?: ColorValue;
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
          if (strokeWidth != null) {
            resolved.strokeWidth = strokeWidth;
          }
          if (fill != null) {
            resolved.fill = fill as string;
          }

          return <Shape key={index} {...resolved} />;
        }),
      [color, fill, icon, strokeWidth],
    );

    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {shapes}
      </Svg>
    );
  },
);

HugeIcon.displayName = "HugeIcon";

export default HugeIcon;
