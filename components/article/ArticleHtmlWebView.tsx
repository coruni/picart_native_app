import { ArticleData } from "@/app/article/[id]";
import GestureImageViewer from "@/components/ui/GestureImageViewer";
import {
  extractPreviewImageUrls,
  prepareRichTextHtmlForDisplay,
} from "@/components/ui/RenderHtml";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

type ArticleInteractionPatch = Partial<
  Pick<
    ArticleData,
    | "isLiked"
    | "likes"
    | "isFavorited"
    | "favoriteCount"
    | "commentCount"
    | "reactionStats"
    | "userReaction"
  >
>;

type Props = {
  article?: ArticleData;
  source: { html: string };
  contentWidth?: number;
  style?: StyleProp<ViewStyle>;
  selectable?: boolean;
  onReady?: () => void;
  onCommentSubmitted?: () => void;
  onArticleInteractionChange?: (updates: ArticleInteractionPatch) => void;
};

function annotateImageIndices(html: string, urls: string[]): string {
  if (urls.length === 0) return html;
  return html.replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
    if (/\bdata-image-index\b/.test(attrs)) return full;
    const classMatch = attrs.match(
      /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
    );
    const cls = classMatch?.[1] ?? classMatch?.[2] ?? classMatch?.[3] ?? "";
    if (cls.includes("emoji") || cls.includes("ql-emoji")) return full;
    const srcMatch = attrs.match(
      /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
    );
    const src = srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3] ?? "";
    if (!src) return full;
    const viewerUrl = getImageUrl(src, "large");
    if (!viewerUrl) return full;
    const idx = urls.indexOf(viewerUrl);
    if (idx < 0) return full;
    return `<img${attrs} data-image-index="${idx}">`;
  });
}

function escapeForStyle(value: string): string {
  return value.replace(/[<>&]/g, "");
}

type DocOptions = {
  body: string;
  selectable: boolean;
  fg: string;
  primary: string;
  border: string;
  secondaryBg: string;
};

function buildHtmlDocument(opts: DocOptions): string {
  const fg = escapeForStyle(opts.fg);
  const primary = escapeForStyle(opts.primary);
  const border = escapeForStyle(opts.border);
  const secondaryBg = escapeForStyle(opts.secondaryBg);
  const selectVal = opts.selectable ? "text" : "none";

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
  :root { color-scheme: light dark; }
  html, body {
    margin: 0; padding: 0;
    -webkit-text-size-adjust: 100%;
    font-size: 16px;
    color: ${fg};
    background: transparent;
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica,
      Arial, system-ui, sans-serif;
    word-wrap: break-word;
    overflow-wrap: break-word;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    width: 100%;
    user-select: ${selectVal};
    -webkit-user-select: ${selectVal};
  }
  ::selection { background: ${primary}; color: #ffffff; }
  ::-moz-selection { background: ${primary}; color: #ffffff; }
  p { line-height: 24px; margin: 0; }
  ol, ul { margin: 0 0 12px 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  em { font-style: italic; }
  u { text-decoration: underline; }
  s { text-decoration: line-through; }
  strong { font-weight: 700; }
  pre {
    background: ${secondaryBg};
    border-radius: 12px;
    padding: 0 12px;
  }
  h1 { font-size: 26px; line-height: 32px; font-weight: 700; margin: 8px 0 12px; }
  h2 { font-size: 22px; line-height: 28px; font-weight: 700; margin: 6px 0 12px; }
  h3 { font-size: 20px; line-height: 24px; font-weight: 700; margin: 4px 0 12px; }
  h4 { font-size: 18px; line-height: 20px; font-weight: 700; margin: 4px 0 12px; }
  h5 { font-size: 16px; line-height: 18px; font-weight: 700; margin: 4px 0 12px; }
  h6 { font-size: 15px; line-height: 16px; font-weight: 700; margin: 4px 0 12px; }
  blockquote { border-left-color: ${border}; }
  a { color: ${primary}; text-decoration: none; }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 8px 0;
    display: block;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
  }
  img.emoji, img.ql-emoji {
    display: inline;
    width: 32px;
    height: 32px;
    margin: 0;
    border-radius: 0;
    vertical-align: text-bottom;
  }

  .ql-editor { width: 100%; padding-left: 0; padding-right: 0; }
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-justify { text-align: justify; }
  .ql-direction-rtl { direction: rtl; text-align: right; }
  .ql-indent-0 { padding-left: 0; }
  .ql-indent-1 { padding-left: 28px; }
  .ql-indent-2 { padding-left: 56px; }
  .ql-indent-3 { padding-left: 84px; }
  .ql-indent-4 { padding-left: 112px; }
  .ql-indent-5 { padding-left: 140px; }
  .ql-indent-6 { padding-left: 168px; }
  .ql-indent-7 { padding-left: 196px; }
  .ql-indent-8 { padding-left: 224px; }

  .ql-code-block-container {
    background: ${secondaryBg};
    border-radius: 12px;
    padding: 10px 12px;
    margin: 8px 0 12px;
  }
  .ql-code-block {
    font-family: Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 20px;
    color: ${fg};
  }
  .ql-ui { width: 0; height: 0; opacity: 0; }

  .ql-size-small { font-size: 13px; line-height: 16px; }
  .ql-size-large { font-size: 20px; line-height: 24px; }
  .ql-size-huge  { font-size: 28px; line-height: 32px; }
  .ql-size-14px { font-size: 14px; line-height: 17px; }
  .ql-size-16px { font-size: 16px; line-height: 19px; }
  .ql-size-18px { font-size: 18px; line-height: 21px; }
  .ql-size-20px { font-size: 20px; line-height: 24px; }
  .ql-size-22px { font-size: 22px; line-height: 26px; }
  .ql-size-24px { font-size: 24px; line-height: 28px; }
  .ql-size-26px { font-size: 26px; line-height: 30px; }
  .ql-size-28px { font-size: 28px; line-height: 32px; }
  .ql-size-30px { font-size: 30px; line-height: 34px; }
  .ql-size-32px { font-size: 32px; line-height: 36px; }

  .ql-font-monospace { font-family: Menlo, Consolas, monospace; }
  .ql-font-serif { font-family: "Times New Roman", Georgia, serif; }
</style>
</head>
<body>${opts.body}
<script>
(function () {
  function post(msg) {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }
  }
  var lastHeight = 0;
  function sendSize() {
    // 用 body.scrollHeight 测量实际内容高度；documentElement.scrollHeight 会把 WebView 视口高度当最小值，
    // 导致从译文切回更短的原文时高度不会缩小。
    var h =
      document.body.scrollHeight ||
      document.documentElement.scrollHeight ||
      0;
    if (h !== lastHeight) {
      lastHeight = h;
      post({ type: "size", height: h });
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var img = t.closest("img[data-image-index]");
    if (img) {
      var idx = parseInt(img.getAttribute("data-image-index"), 10);
      if (!isNaN(idx)) {
        e.preventDefault();
        post({ type: "image", index: idx });
        return;
      }
    }
    var a = t.closest("a[href]");
    if (a) {
      var href = a.getAttribute("href");
      if (href && href.charAt(0) !== "#") {
        e.preventDefault();
        post({ type: "link", url: href });
      }
    }
  }, false);

  var imgs = document.querySelectorAll("img");
  sendSize();
  imgs.forEach(function (img) {
    if (img.complete) return;
    img.addEventListener("load", sendSize);
    img.addEventListener("error", sendSize);
  });

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(sendSize).observe(document.body);
  } else {
    window.addEventListener("resize", sendSize, false);
  }
})();
true;
</script>
</body></html>`;
}

function ArticleHtmlWebViewBase({
  article,
  source,
  contentWidth,
  style,
  selectable = false,
  onReady,
  onCommentSubmitted,
  onArticleInteractionChange,
}: Props) {
  const { theme } = useTheme();
  const [height, setHeight] = useState<number>(1);
  const openRef = useRef<((index?: number) => void) | null>(null);
  const onReadyFiredRef = useRef(false);

  const preparedHtml = useMemo(
    () => prepareRichTextHtmlForDisplay(source.html ?? ""),
    [source.html],
  );
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
  const annotatedHtml = useMemo(
    () => annotateImageIndices(preparedHtml, previewImageUrls),
    [preparedHtml, previewImageUrls],
  );

  const documentHtml = useMemo(
    () =>
      buildHtmlDocument({
        body: annotatedHtml,
        selectable,
        fg: theme.foreground,
        primary: theme.primary,
        border: theme.border,
        secondaryBg: theme.secondaryBackground,
      }),
    [
      annotatedHtml,
      selectable,
      theme.foreground,
      theme.primary,
      theme.border,
      theme.secondaryBackground,
    ],
  );

  useEffect(() => {
    onReadyFiredRef.current = false;
  }, [documentHtml]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let msg: { type?: string; index?: number; url?: string; height?: number };
      try {
        msg = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }
      if (!msg || typeof msg.type !== "string") return;

      if (msg.type === "size" && typeof msg.height === "number") {
        const next = Math.max(1, Math.round(msg.height));
        setHeight((prev) => (Math.abs(prev - next) < 1 ? prev : next));
        if (!onReadyFiredRef.current) {
          onReadyFiredRef.current = true;
          onReady?.();
        }
        return;
      }
      if (msg.type === "image" && typeof msg.index === "number") {
        openRef.current?.(msg.index);
        return;
      }
      if (msg.type === "link" && typeof msg.url === "string") {
        void Linking.openURL(msg.url).catch(() => {});
      }
    },
    [onReady],
  );

  const handleShouldStartLoadWithRequest = useCallback(
    (req: { url: string }) => {
      const url = req.url;
      if (
        !url ||
        url === "about:blank" ||
        url.startsWith("about:") ||
        url.startsWith("data:") ||
        url.startsWith("file:")
      ) {
        return true;
      }
      void Linking.openURL(url).catch(() => {});
      return false;
    },
    [],
  );

  const handleRenderProcessGone = useCallback(
    (event: { nativeEvent: { didCrash?: boolean } }) => {
      console.warn(
        "[ArticleHtmlWebView] WebView render process gone:",
        event.nativeEvent,
      );
    },
    [],
  );

  const handleContentProcessDidTerminate = useCallback(() => {
    console.warn("[ArticleHtmlWebView] WebView content process terminated");
  }, []);

  const handleError = useCallback(
    (event: { nativeEvent: { description?: string; code?: number } }) => {
      console.warn("[ArticleHtmlWebView] WebView error:", event.nativeEvent);
    },
    [],
  );

  const renderBody = useCallback(
    (open?: (index?: number) => void) => {
      openRef.current = open ?? null;
      if (!preparedHtml) {
        return <View style={[{ width: contentWidth, height: 0 }, style]} />;
      }
      return (
        <View
          style={[{ width: contentWidth, height, overflow: "hidden" }, style]}
        >
          <WebView
            originWhitelist={["*"]}
            source={{ html: documentHtml }}
            style={styles.webView}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onMessage={handleMessage}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            onError={handleError}
            onRenderProcessGone={handleRenderProcessGone}
            onContentProcessDidTerminate={handleContentProcessDidTerminate}
            javaScriptEnabled
            domStorageEnabled={false}
            setSupportMultipleWindows={false}
            allowsBackForwardNavigationGestures={false}
          />
        </View>
      );
    },
    [
      contentWidth,
      documentHtml,
      handleContentProcessDidTerminate,
      handleError,
      handleMessage,
      handleRenderProcessGone,
      handleShouldStartLoadWithRequest,
      height,
      preparedHtml,
      style,
    ],
  );

  if (viewerImages.length > 0 && article) {
    return (
      <GestureImageViewer
        article={article}
        author={article.author}
        images={viewerImages}
        onCommentSubmitted={onCommentSubmitted}
        onArticleInteractionChange={onArticleInteractionChange}
      >
        {({ open }) => renderBody(open)}
      </GestureImageViewer>
    );
  }

  return renderBody();
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default memo(ArticleHtmlWebViewBase);
