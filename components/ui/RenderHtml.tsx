import { ArticleData } from "@/app/article/[id]";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleProp,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import RenderHtml, {
  CustomTextualRenderer,
  HTMLContentModel,
  HTMLElementModel,
  MixedStyleDeclaration,
} from "react-native-render-html";
import AsyncImage from "./AsyncImage";
import GestureImageViewer from "./GestureImageViewer";
import ThemedText from "./ThemedText";

const RE_QL_CURSOR = /<span class="ql-cursor">.*?<\/span>/g;
const RE_FEFF = /&#xFEFF;|&#xfeff;|&#65279;|\uFEFF/g;
const RE_CONTENTEDITABLE = /\scontenteditable="(?:true|false)"/g;
const RE_COMMENTS = /<!--[\s\S]*?-->/g;
const RE_DANGEROUS_TAGS =
  /<\/?(script|style|object|embed|form|input|button|textarea|select|option|meta|link|base|math)[^>]*>/gi;
const RE_INLINE_EVENT = /\son[a-z-]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_SRCDOC_ATTR = /\ssrcdoc\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_JS_URL =
  /\s(href|src|poster)\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi;
const RE_UNSAFE_DATA_URL =
  /\s(href|src|poster)\s*=\s*("data:(?!image\/)[^"]*"|'data:(?!image\/)[^']*'|data:(?!image\/)[^\s>]+)/gi;
const RE_VIDEO_OVERLAY = /<div class="ql-video-overlay"[^>]*><\/div>/g;
const QUILL_INDENT_SIZE = 28;
const QUILL_SIZE_STYLES: Record<string, MixedStyleDeclaration> = {
  "ql-size-small": { fontSize: 13, lineHeight: 20 },
  "ql-size-large": { fontSize: 20, lineHeight: 30 },
  "ql-size-huge": { fontSize: 28, lineHeight: 40 },
};
const QUILL_FONT_STYLES: Record<string, MixedStyleDeclaration> = {
  "ql-font-monospace": {
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
  },
  "ql-font-serif": {
    fontFamily: Platform.select({
      ios: "Times New Roman",
      default: "serif",
    }),
  },
};
const QUILL_CODE_FONT_FAMILY = Platform.select({
  ios: "Menlo",
  default: "monospace",
});

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

function extractInlineTextStyle(styleAttr?: string): TextStyle | undefined {
  if (!styleAttr) return undefined;

  const style: TextStyle = {};

  for (const declaration of styleAttr.split(";")) {
    const [rawProperty, ...rawValueParts] = declaration.split(":");
    if (!rawProperty || rawValueParts.length === 0) continue;

    const property = rawProperty.trim().toLowerCase();
    const value = rawValueParts.join(":").trim();
    if (!value) continue;

    if (property === "color") {
      style.color = value;
    }

    if (property === "background-color") {
      style.backgroundColor = value;
    }
  }

  return Object.keys(style).length ? style : undefined;
}

interface HtmlImageProps {
  src: string;
  contentWidth: number;
  onPress?: () => void;
}

const HtmlImage = memo(({ src, contentWidth, onPress }: HtmlImageProps) => {
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
  const image = (
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

  if (!onPress) {
    return image;
  }

  return <Pressable onPress={onPress}>{image}</Pressable>;
});

HtmlImage.displayName = "HtmlImage";

const customHTMLElementModels = {
  img: HTMLElementModel.fromCustomModel({
    tagName: "img",
    contentModel: HTMLContentModel.mixed,
  }),
};

function extractPreviewImageUrls(html: string): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  const imgTagPattern = /<img\b[^>]*>/gi;
  const srcPattern = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
  const classPattern = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

  for (const match of html.matchAll(imgTagPattern)) {
    const tag = match[0];
    const srcMatch = tag.match(srcPattern);
    const src = srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3] ?? "";
    const classMatch = tag.match(classPattern);
    const className =
      classMatch?.[1] ?? classMatch?.[2] ?? classMatch?.[3] ?? "";

    if (
      !src ||
      !isSafeUrl(src) ||
      className.includes("emoji") ||
      className.includes("ql-emoji")
    ) {
      continue;
    }

    const viewerUrl = getImageUrl(src, "large");
    if (!viewerUrl || seen.has(viewerUrl)) {
      continue;
    }

    seen.add(viewerUrl);
    urls.push(viewerUrl);
  }

  return urls;
}

type RenderHtmlProps = {
  article?: ArticleData;
  style?: StyleProp<ViewStyle>;
  source: { html: string };
  contentWidth?: number;
  tagsStyles?: Record<string, object>;
  classesStyles?: Record<string, MixedStyleDeclaration>;
  numberOfLines?: number;
  baseStyle?: MixedStyleDeclaration;
  onReady?: () => void;
  onCommentSubmitted?: () => void;
  onArticleInteractionChange?: (
    updates: Partial<
      Pick<
        ArticleData,
        "isLiked" | "likes" | "isFavorited" | "favoriteCount" | "commentCount"
      >
    >,
  ) => void;
};

const RenderHtmlComponent = ({
  article,
  source,
  contentWidth,
  tagsStyles,
  classesStyles,
  style,
  numberOfLines,
  baseStyle,
  onReady,
  onCommentSubmitted,
  onArticleInteractionChange,
}: RenderHtmlProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const resolvedWidth = contentWidth ?? windowWidth;

  const preparedHtml = useMemo(
    () => prepareRichTextHtmlForDisplay(source.html),
    [source.html],
  );
  const { theme } = useTheme();
  const quillClassesStyles = useMemo(() => {
    const indentStyles = Object.fromEntries(
      Array.from({ length: 8 }, (_, index) => [
        `ql-indent-${index + 1}`,
        { paddingLeft: QUILL_INDENT_SIZE * (index + 1) },
      ]),
    ) as Record<string, MixedStyleDeclaration>;

    return {
      "ql-editor": {
        width: "100%",
        paddingLeft: 0,
        paddingRight: 0,
      },
      "ql-align-center": { textAlign: "center" },
      "ql-align-right": { textAlign: "right" },
      "ql-align-justify": { textAlign: "justify" },
      "ql-direction-rtl": {
        direction: "rtl",
        writingDirection: "rtl",
        textAlign: "right",
      },
      "ql-indent-0": { paddingLeft: 0 },
      "ql-code-block-container": {
        backgroundColor: theme.secondaryBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 8,
        marginBottom: 12,
      },
      "ql-code-block": {
        fontFamily: QUILL_CODE_FONT_FAMILY,
        fontSize: 13,
        lineHeight: 20,
        color: theme.foreground,
      },
      "ql-ui": {
        width: 0,
        height: 0,
        opacity: 0,
      },
      ...indentStyles,
      ...QUILL_SIZE_STYLES,
      ...QUILL_FONT_STYLES,
      ...classesStyles,
    };
  }, [classesStyles, theme.foreground, theme.secondaryBackground]);
  const previewImageUrls = useMemo(
    () => extractPreviewImageUrls(preparedHtml),
    [preparedHtml],
  );
  const viewerImages = useMemo(
    () =>
      previewImageUrls.map((url) => ({
        previewUrl: url,
        viewerUrl: url,
        originalUrl: getImageUrl(url, "original") || url,
      })),
    [previewImageUrls],
  );

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
        <ThemedText numberOfLines={numberOfLines} ellipsizeMode="tail">
          {plainText}
        </ThemedText>
      </View>
    );
  }

  const createRenderers = (open?: (index?: number) => void) => {
    const textStyleFallbackRenderer: CustomTextualRenderer = ({
      TDefaultRenderer,
      ...props
    }) => {
      const attrs = props.tnode.attributes as Record<string, string>;
      const inlineTextStyle = extractInlineTextStyle(attrs.style);

      if (!inlineTextStyle) {
        return <TDefaultRenderer {...props} />;
      }

      return (
        <TDefaultRenderer
          {...props}
          textProps={{
            ...props.textProps,
            style: [props.textProps.style, inlineTextStyle],
          }}
        />
      );
    };

    const renderers = {
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

        const viewerUrl = getImageUrl(src, "large");
        const imageIndex = viewerUrl ? previewImageUrls.indexOf(viewerUrl) : -1;

        return (
          <HtmlImage
            src={src}
            contentWidth={resolvedWidth}
            onPress={
              open && imageIndex >= 0 ? () => open(imageIndex) : undefined
            }
          />
        );
      },
      span: textStyleFallbackRenderer,
      strong: textStyleFallbackRenderer,
      em: textStyleFallbackRenderer,
      u: textStyleFallbackRenderer,
      s: textStyleFallbackRenderer,
      a: textStyleFallbackRenderer,
    };

    return renderers;
  };

  const content = (open?: (index?: number) => void) => (
    <View style={[{ width: "100%" }, style]} onLayout={handleLayout}>
      <RenderHtml
        contentWidth={resolvedWidth}
        source={{ html: preparedHtml }}
        baseStyle={{
          width: "100%",
          fontSize: 16,
          color: theme.foreground,
          ...baseStyle,
        }}
        classesStyles={quillClassesStyles}
        renderers={createRenderers(open)}
        defaultTextProps={{ selectionColor: theme.primary }}
        customHTMLElementModels={customHTMLElementModels}
        tagsStyles={{
          div: { overflow: "hidden" },
          p: {
            lineHeight: 24,
            marginTop: 0,
            marginBottom: 0,
          },
          ol: {
            marginTop: 0,
            marginBottom: 12,
            paddingLeft: 20,
          },
          ul: {
            marginTop: 0,
            marginBottom: 12,
            paddingLeft: 20,
          },
          li: {
            marginBottom: 6,
          },
          em: {
            fontStyle: "italic",
          },
          u: {
            textDecorationLine: "underline",
          },
          s: {
            textDecorationLine: "line-through",
          },
          strong: {
            fontWeight: "700",
          },
          pre: {
            backgroundColor: theme.secondaryBackground,
            borderRadius: 12,
            paddingHorizontal: 12,
          },
          h1: {
            fontSize: 26,
            lineHeight: 32,
            fontWeight: "700",
            marginTop: 8,
            marginBottom: 12,
          },
          h2: {
            fontSize: 22,
            lineHeight: 28,
            fontWeight: "700",
            marginTop: 6,
            marginBottom: 12,
          },
          h3: {
            fontSize: 20,
            lineHeight: 24,
            fontWeight: "700",
            marginTop: 4,
            marginBottom: 12,
          },
          h4: {
            fontSize: 18,
            lineHeight: 20,
            fontWeight: "700",
            marginTop: 4,
            marginBottom: 12,
          },
          h5: {
            fontSize: 16,
            lineHeight: 18,
            fontWeight: "700",
            marginTop: 4,
            marginBottom: 12,
          },
          h6: {
            fontSize: 15,
            lineHeight: 16,
            fontWeight: "700",
            marginTop: 4,
            marginBottom: 12,
          },
          blockquote: { borderLeftColor: theme.border },
          ...tagsStyles,
        }}
      />
    </View>
  );

  if (viewerImages.length > 0) {
    return (
      <GestureImageViewer
        article={article}
        author={article?.author}
        images={viewerImages}
        onCommentSubmitted={onCommentSubmitted}
        onArticleInteractionChange={onArticleInteractionChange}
      >
        {({ open }) => content(open)}
      </GestureImageViewer>
    );
  }

  return content();
};

export default memo(RenderHtmlComponent);
