import type { RichTextContentItem } from "react-native-rich-text-fabric";

export type ComposerMode = "keyboard" | "emoji" | "image";
export type PanelMode = Exclude<ComposerMode, "keyboard">;

export type CommentComposerModalProps = {
  articleId?: string;
  parentId?: number | string;
  replyToName?: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

export type EmojiItem = {
  id: number;
  name: string;
  url: string;
  code?: string;
  width?: number;
  height?: number;
  updatedAt?: string;
};

export type EmojiGroup = {
  name: string;
  count: number;
  items: EmojiItem[];
};

export type EmojiCachePayload = {
  signature: string;
  groups: EmojiGroup[];
};

export type RichContentChangeHandler = (
  content: RichTextContentItem[],
) => void;
