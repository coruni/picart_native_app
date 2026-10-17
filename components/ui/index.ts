/**
 * 设计系统基础组件（Design System Primitives）
 *
 * 这一层只放"与业务无关、可跨模块复用"的原子组件。
 * 凡是带业务语义（文章、评论、消息、用户）的组件，一律放在对应的功能目录下，
 * 不要往这里塞。
 *
 * 目录职责：
 * ├─ ui/        全局原子组件（本目录）
 * ├─ media/     图片查看、裁剪、缩放等媒体交互
 * ├─ rich-text/ HTML / Markdown 渲染
 * ├─ feedback/  浮层、菜单、轻提示
 * ├─ article/   文章相关
 * ├─ comment/   评论相关
 * ├─ message/   私信 / 通知相关
 * ├─ profile/   个人主页相关
 * ├─ home/      首页信息流相关
 * ├─ topic/     话题相关
 * ├─ search/    搜索相关
 * └─ user/      用户卡片 / 用户操作
 *
 * 变体组件（Button / Badge / Chip）优先于在页面里手写样式。
 * 页面里出现第二份相同样式的按钮时，就应该抽到这里来。
 */
export { default as AsyncImage } from "./AsyncImage";
export { Avatar } from "./Avatar";
export { default as Badge } from "./Badge";
export { default as Button } from "./Button";
export { default as Chip } from "./Chip";
export { FloatInput } from "./FloatInput";
export { default as HighlightText } from "./HighlightText";
export { default as HugeIcon } from "./HugeIcon";
export { default as Loading } from "./Loading";
export { default as Switch } from "./Switch";
export { default as ThemedIcon } from "./ThemedIcon";
export { default as ThemedText } from "./ThemedText";

export type { BadgeProps, BadgeSize, BadgeTone, BadgeVariant } from "./Badge";
export type {
  ButtonProps,
  ButtonShape,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "./Button";
export type { ChipProps, ChipSize, ChipVariant } from "./Chip";
export type { FloatInputHandle } from "./FloatInput";
export type { HugeIconData, HugeIconProps } from "./HugeIcon";
export type { IconType, IconVariant } from "./ThemedIcon";
export type { TextVariant } from "./ThemedText";
