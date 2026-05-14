import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import RenderHtml, {
  CustomBlockRenderer,
  HTMLContentModel,
  HTMLElementModel,
} from "react-native-render-html";
import AsyncImage from "./AsyncImage";

const RE_QL_CURSOR = /<span class="ql-cursor">.*?<\/span>/g;
const RE_FEFF = /&#xFEFF;|&#xfeff;|&#65279;|\uFEFF/g;
const RE_CONTENTEDITABLE = /\scontenteditable="(?:true|false)"/g;
const RE_COMMENTS = /<!--[\s\S]*?-->/g;
const RE_DANGEROUS_TAGS =
  /<\/?(script|style|object|embed|form|input|button|textarea|select|option|meta|link|base|math)[^>]*>/gi;
const RE_INLINE_EVENT = /\son[a-z-]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_STYLE_ATTR = /\sstyle\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_SRCDOC_ATTR = /\ssrcdoc\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_JS_URL =
  /\s(href|src|poster)\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi;
const RE_UNSAFE_DATA_URL =
  /\s(href|src|poster)\s*=\s*("data:(?!image\/)[^"]*"|'data:(?!image\/)[^']*'|data:(?!image\/)[^\s>]+)/gi;
const RE_VIDEO_OVERLAY = /<div class="ql-video-overlay"[^>]*><\/div>/g;

// ─── 允许的视频域名白名单 ──────────────────────────────────────────────────────
const ALLOWED_VIDEO_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "bilibili.com",
  "www.bilibili.com",
  "player.bilibili.com",
  "b23.tv",
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
];

function stripRichTextEditorArtifacts(html: string): string {
  return html
    .replace(RE_QL_CURSOR, "")
    .replace(RE_FEFF, "")
    .replace(RE_CONTENTEDITABLE, "");
}

export function isSafeUrl(value: string): boolean {
  const normalized = value.trim();
  return (
    !!normalized &&
    /^(https?:|mailto:|tel:|\/|#|data:image\/|blob:)/i.test(normalized)
  );
}

export function isSafeVideoUrl(value: string): boolean {
  const normalized = value.trim();
  if (!normalized) return false;
  if (!/^(https?:|\/\/)/i.test(normalized)) return false;
  try {
    const url = new URL(
      normalized.startsWith("//") ? "https:" + normalized : normalized,
    );
    return ALLOWED_VIDEO_DOMAINS.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

function sanitizeHtmlWithFallback(html: string): string {
  return html
    .replace(RE_COMMENTS, "")
    .replace(RE_DANGEROUS_TAGS, "")
    .replace(RE_INLINE_EVENT, "")
    .replace(RE_STYLE_ATTR, "")
    .replace(RE_SRCDOC_ATTR, "")
    .replace(RE_JS_URL, "")
    .replace(RE_UNSAFE_DATA_URL, "");
}

function prepareRichTextHtmlForDisplay(html: string): string {
  const stripped = stripRichTextEditorArtifacts(html);
  const sanitized = sanitizeHtmlWithFallback(stripped);
  const withoutCaption = sanitized.replace(
    /<p\s+class="ql-image-caption"[^>]*>(?:[\s\S]*?)<\/p>/gi,
    "",
  );
  return withoutCaption.replace(RE_VIDEO_OVERLAY, "");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

function stripHtmlTags(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|blockquote|pre|tr)>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

interface HtmlImageProps {
  src: string;
  contentWidth: number;
}

const HtmlImage = memo(({ src, contentWidth }: HtmlImageProps) => {
  const resolvedSrc = getImageUrl(src, "large");

  // null 表示尺寸尚未获取，此时不渲染 AsyncImage
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    Image.getSize(
      resolvedSrc!,
      (w: number, h: number) => {
        if (cancelled) return;
        setImageHeight(
          w > 0 && h > 0
            ? Math.round((contentWidth * h) / w)
            : Math.round(contentWidth * 0.5625), // 异常时回退 16:9
        );
      },
      () => {
        if (cancelled) return;
        // 获取失败也要给高度，让图片能渲染（可能有缓存）
        setImageHeight(Math.round(contentWidth * 0.5625));
      },
    );

    return () => {
      cancelled = true;
    };
  }, [resolvedSrc, contentWidth]);

  // 尺寸未就绪：渲染等高占位，保持文档流，不渲染 AsyncImage
  if (imageHeight === null) {
    return (
      <View
        style={{
          width: contentWidth,
          height: Math.round(contentWidth * 0.5625),
          marginVertical: 8,
        }}
      />
    );
  }

  // 尺寸就绪：一次性渲染，高度不再变化，AsyncImage 不会重挂载
  return (
    <View
      style={{
        width: contentWidth,
        height: imageHeight,
        marginVertical: 8,
      }}
    >
      <AsyncImage
        source={resolvedSrc}
        cachePolicy="disk"
        style={{
          width: contentWidth,
          height: imageHeight,
          borderRadius: 12,
        }}
        contentFit="contain"
      />
    </View>
  );
});

HtmlImage.displayName = "HtmlImage";

const customHTMLElementModels = {
  img: HTMLElementModel.fromCustomModel({
    tagName: "img",
    contentModel: HTMLContentModel.mixed,
  }),
};

type RenderHtmlProps = {
  style?: StyleProp<ViewStyle>;
  source: { html: string };
  contentWidth?: number;
  tagsStyles?: Record<string, object>;
  numberOfLines?: number;

  onReady?: () => void;
};

const RenderHtmlComponent = ({
  source,
  contentWidth,
  tagsStyles,
  style,
  numberOfLines,
  onReady,
}: RenderHtmlProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const resolvedWidth = contentWidth ?? windowWidth;

  const preparedHtml = useMemo(
    () => prepareRichTextHtmlForDisplay(source.html),
    [source.html],
  );
  const { theme } = useTheme();

  const handleLayout = useCallback(
    (_e: LayoutChangeEvent) => {
      onReady?.();
    },
    [onReady],
  );

  if (numberOfLines) {
    const plainText = stripHtmlTags(preparedHtml);
    return (
      <View style={[{ width: "100%" }, style]} onLayout={handleLayout}>
        <Text numberOfLines={numberOfLines} ellipsizeMode="tail">
          {plainText}
        </Text>
      </View>
    );
  }

  const renderers: { img: CustomBlockRenderer } = {
    img: (props) => {
      const attrs = props.tnode.attributes as Record<string, string>;
      const src = attrs.src ?? "";
      const className = attrs.class ?? "";

      if (!src || !isSafeUrl(src)) return null;

      // emoji 图片固定 32×32，不走动态高度逻辑
      if (className.includes("emoji") || className.includes("ql-emoji")) {
        return (
          <View style={{ width: 32, height: 32 }}>
            <AsyncImage
              source={getImageUrl(src, "large")}
              cachePolicy="disk"
              style={{ width: 32, height: 32 }}
              contentFit="contain"
            />
          </View>
        );
      }

      return <HtmlImage src={src} contentWidth={resolvedWidth} />;
    },
  };

  return (
    <View style={[{ width: "100%" }, style]} onLayout={handleLayout}>
      <RenderHtml
        contentWidth={resolvedWidth}
        source={{ html: preparedHtml }}
        baseStyle={{ width: "100%", fontSize: 16 }}
        renderers={renderers}
        defaultTextProps={{ selectable: true, selectionColor: theme.primary }}
        customHTMLElementModels={customHTMLElementModels}
        tagsStyles={{
          div: { overflow: "hidden" },

          p: {
            lineHeight: 24,
          },

          ...tagsStyles,
        }}
      />
    </View>
  );
};

export default memo(RenderHtmlComponent);
