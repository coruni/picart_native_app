import { getImageUrl } from "@/lib/image";
import {
    StyleProp,
    Text,
    useWindowDimensions,
    View,
    ViewStyle,
} from "react-native";
import RenderHtml from "react-native-render-html";
import AsyncImage from "./AsyncImage";

// 预编译正则
const RE_NBSP = /&nbsp;/gi;
const RE_LT = /&lt;/gi;
const RE_GT = /&gt;/gi;
const RE_QUOT = /&quot;/gi;
const RE_APOS = /&#39;/gi;
const RE_AMP = /&amp;/gi;
const RE_QL_CURSOR = /<span class="ql-cursor">.*?<\/span>/g;
const RE_FEFF = /&#xFEFF;|&#xfeff;|&#65279;|\uFEFF/g;
const RE_CONTENTEDITABLE = /\scontenteditable="(?:true|false)"/g;
const RE_COMMENTS = /<!--[\s\S]*?-->/g;
const RE_DANGEROUS_TAGS =
  /<\/?\(script|style|object|embed|form|input|button|textarea|select|option|meta|link|base|math\)[^>]*>/gi;
const RE_INLINE_EVENT = /\son[a-z-]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_STYLE_ATTR = /\sstyle\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_SRCDOC_ATTR = /\ssrcdoc\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const RE_JS_URL =
  /\s\(href|src|poster\)\s*=\s*("javascript:[^"]*"|'javascript:[^"]*'|javascript:[^\s>]+)/gi;
const RE_UNSAFE_DATA_URL =
  /\s\(href|src|poster\)\s*=\s*("data:(?!image\/)[^"]*"|'data:(?!image\/)[^"]*'|data:(?!image\/)[^\s>]+)/gi;
const RE_VIDEO_OVERLAY = /<div class="ql-video-overlay"[^>]*><\/div>/g;

// 允许的视频域名白名单
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

// HTML 实体解码
function decodeHtmlEntities(value: string): string {
  return value
    .replace(RE_NBSP, " ")
    .replace(RE_LT, "<")
    .replace(RE_GT, ">")
    .replace(RE_QUOT, '"')
    .replace(RE_APOS, "'")
    .replace(RE_AMP, "&");
}

// 移除富文本编辑器伪影
function stripRichTextEditorArtifacts(html: string): string {
  return html
    .replace(RE_QL_CURSOR, "")
    .replace(RE_FEFF, "")
    .replace(RE_CONTENTEDITABLE, "");
}

// 检查URL是否安全
function isSafeUrl(value: string): boolean {
  const normalized = value.trim();
  return (
    !!normalized &&
    /^(https?:|mailto:|tel:|\/|#|data:image\/|blob:)/i.test(normalized)
  );
}

// 检查视频URL是否安全
function isSafeVideoUrl(value: string): boolean {
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

// 基础HTML清理
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

// 准备富文本HTML用于显示
function prepareRichTextHtmlForDisplay(html: string): string {
  const stripped = stripRichTextEditorArtifacts(html);
  const sanitized = sanitizeHtmlWithFallback(stripped);
  const withoutCaption = sanitized.replace(
    /<p\s+class="ql-image-caption"[^>]*>(?:[\s\S]*?)<\/p>/gi,
    "",
  );
  return withoutCaption.replace(RE_VIDEO_OVERLAY, "");
}

// 剥离 HTML 标签，获取纯文本
function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type RenderHtmlProps = {
  style?: StyleProp<ViewStyle>;
  source: { html: string };
  contentWidth?: number;
  tagsStyles?: { [key: string]: any };
  numberOfLines?: number;
};

const RenderHtmlComponent = ({
  source,
  contentWidth,
  tagsStyles,
  style,
  numberOfLines,
}: RenderHtmlProps) => {
  const { width } = useWindowDimensions();

  const preparedHtml = prepareRichTextHtmlForDisplay(source.html);

  if (numberOfLines) {
    const plainText = stripHtmlTags(preparedHtml);
    return (
      <View style={[{ width: "100%" }, style]}>
        <Text numberOfLines={numberOfLines} ellipsizeMode="tail">
          {plainText}
        </Text>
      </View>
    );
  }

  const renderers = {
    img: ({ tnode }: any) => {
      const { src } = tnode.attributes;
      return (
        <AsyncImage
          source={getImageUrl(src)}
          style={{ width: "100%", height: "auto", maxWidth: width }}
          contentFit="cover"
        />
      );
    },
  };

  return (
    <View style={[{ width: "100%" }, style]}>
      <RenderHtml
        contentWidth={contentWidth ?? width}
        source={{ html: preparedHtml }}
        baseStyle={{ width: "100%" }}
        renderers={renderers}
        tagsStyles={tagsStyles}
      />
    </View>
  );
};

export default RenderHtmlComponent;
