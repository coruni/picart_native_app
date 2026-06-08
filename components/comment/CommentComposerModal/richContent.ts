import type {
  RichTextContentItem,
  RichTextInputImageItem,
} from "react-native-rich-text-fabric";

import { STICKER_SIZE } from "./composerConstants";
import type { EmojiGroup, EmojiItem } from "./composerTypes";

type CommentEmojiImageItem = RichTextInputImageItem & {
  commentEmbedType?: "emoji";
  emojiName?: string;
};

type SerializeRichContentOptions = {
  emojiGroups?: EmojiGroup[];
};

export function hasRichContent(
  items: RichTextContentItem[],
  plainContent: string,
): boolean {
  return plainContent.trim().length > 0 || items.some(isRichImageItem);
}

export function getRichPlainText(items: RichTextContentItem[]): string {
  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (item.type === "text") return item.text;
      if (item.type === "image") return "[image]";
      return "";
    })
    .join("");
}

export function serializeRichContentToHtml(
  items: RichTextContentItem[],
  options: SerializeRichContentOptions = {},
): string {
  const emojiTitleByUrl = createEmojiTitleByUrl(options.emojiGroups ?? []);
  return items
    .map((item) => {
      if (typeof item === "string") return escapeHtml(item);
      if (item.type === "text") return escapeHtml(item.text);
      if (item.type === "image") {
        const src = getImageSource(item);
        if (!src) return "";
        const emojiTitle = getEmojiTitle(item, emojiTitleByUrl);
        if (emojiTitle) return serializeEmojiImage(src, emojiTitle);
        return `<img src="${escapeHtml(src)}" />`;
      }
      return "";
    })
    .join("");
}

export function createEmojiImageItem(emoji: EmojiItem): RichTextInputImageItem {
  return {
    type: "image",
    image: emoji.url,
    imageStyle: { width: STICKER_SIZE, height: STICKER_SIZE },
    commentEmbedType: "emoji",
    emojiName: emoji.name,
  } as CommentEmojiImageItem;
}

function isRichImageItem(
  item: RichTextContentItem,
): item is RichTextInputImageItem {
  return typeof item === "object" && item !== null && item.type === "image";
}

function getImageSource(item: RichTextInputImageItem): string {
  if (typeof item.image === "string") return item.image;
  if (
    typeof item.image === "object" &&
    item.image !== null &&
    "uri" in item.image &&
    typeof item.image.uri === "string"
  ) {
    return item.image.uri;
  }
  return "";
}

function getEmojiTitle(
  item: RichTextInputImageItem,
  emojiTitleByUrl: Map<string, string>,
): string {
  const maybeEmoji = item as CommentEmojiImageItem;
  if (maybeEmoji.commentEmbedType === "emoji" && maybeEmoji.emojiName) {
    return maybeEmoji.emojiName;
  }
  const src = getImageSource(item);
  return emojiTitleByUrl.get(src) ?? "";
}

function createEmojiTitleByUrl(groups: EmojiGroup[]): Map<string, string> {
  return new Map(
    groups.flatMap((group) =>
      group.items.map((emoji) => [emoji.url, emoji.name] as const),
    ),
  );
}

function serializeEmojiImage(src: string, title: string): string {
  const escapedSrc = escapeHtml(src);
  const escapedTitle = escapeHtml(title);
  return `<span class="ql-emoji-embed" title="${escapedTitle}"><span><img src="${escapedSrc}" class="ql-emoji-embed__img" alt="${escapedTitle}"></span></span>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
