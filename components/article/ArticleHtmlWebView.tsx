import { ArticleData } from "@/app/article/[id]";
import GestureImageViewer from "@/components/media/GestureImageViewer";
import {
  extractPreviewImageUrls,
  prepareRichTextHtmlForDisplay,
} from "@/components/rich-text/RenderHtml";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  WebView,
  WebViewMessageEvent,
  type WebView as WebViewHandle,
} from "react-native-webview";

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

// 把主题色转成带透明度的描边色，避免把色值写死在文档样式里
function withAlpha(hex: string, alpha: number): string {
  const raw = hex.trim().replace("#", "");
  if (raw.length !== 6 && raw.length !== 8) return hex;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type DocOptions = {
  body: string;
  selectable: boolean;
  fg: string;
  primary: string;
  border: string;
  secondaryBg: string;
  mediaBorder: string;
};

type DocStyleOptions = Omit<DocOptions, "body">;

// 文档内运行时脚本。同一份脚本同时用于 buildHtmlDocument（首屏）和
// swapBody 注入脚本，保证两条路径的尺寸上报/交互行为完全一致。
const DOC_SCRIPT = `(function () {
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
  if (!window.__articleDocBound) {
    window.__articleDocBound = true;
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
  }

  // 记录每个 img 的当前地址：换正文后已加载过的图片不会被重置，
  // 只给「真正需要新加载」的图片挂监听，避免译文回流时图片重新闪一下。
  var seenImgs = window.__articleDocImgs;
  if (!seenImgs) {
    seenImgs = window.__articleDocImgs = new WeakMap();
  }

  window.__articleBindBody = function () {
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        var key = img.getAttribute("src") || "";
        if (seenImgs.get(img) === key) return;
        seenImgs.set(img, key);
        if (img.complete) return;
        img.addEventListener("load", sendSize);
        img.addEventListener("error", sendSize);
      })(imgs[i]);
    }
    if (!window.__articleDocObserved && typeof ResizeObserver !== "undefined") {
      window.__articleDocObserved = true;
      new ResizeObserver(sendSize).observe(document.body);
    }
    sendSize();
  };

  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", sendSize, false);
  }
  window.__articleBindBody();
})();
true;`;

/** 运行时替换正文：不触发文档重载，已加载过的图片保持原样 */
const DOC_SWAP_BODY = `(function () {
  if (!window.__articleSwapBody) {
    window.__articleSwapBody = function (html) {
      var container = document.getElementById("article-body");
      if (!container) return;
      container.innerHTML = html;
      // 保留阅读位置：译文普遍比原文短，按滚动比例换算回来
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (window.__articleBindBody) window.__articleBindBody();
      var nextScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (nextScrollable > 0 && ratio > 0) {
        window.scrollTo(0, Math.min(nextScrollable, ratio * nextScrollable));
      }
    };
  }
})();
true;`;

function buildStyleBlock(opts: DocStyleOptions): string {
  const fg = escapeForStyle(opts.fg);
  const primary = escapeForStyle(opts.primary);
  const border = escapeForStyle(opts.border);
  const secondaryBg = escapeForStyle(opts.secondaryBg);
  const mediaBorder = escapeForStyle(opts.mediaBorder);
  const selectVal = opts.selectable ? "text" : "none";

  return `<style>
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
    /* 行高用无单位倍数，跟着各段自己的字号走。
       写死的 px 会被大字号的 span / 标题撑破，也会把 web 的 1.78 带进来 */
    line-height: 1.6;
  }
  ::selection { background: ${primary}; color: #ffffff; }
  ::-moz-selection { background: ${primary}; color: #ffffff; }
  p { margin: 0; }
  ol, ul { margin: 0 0 12px 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  em { font-style: italic; }
  u { text-decoration: underline; }
  s { text-decoration: line-through; }
  strong { font-weight: 700; }
  code {
    font-family: Menlo, Consolas, monospace;
    font-size: 13px;
    background: ${secondaryBg};
    border-radius: 4px;
    padding: 1px 4px;
  }
  pre code { background: transparent; padding: 0; }
  ul[data-type="checkbox"] { list-style: none; margin: 0 0 12px 0; padding-left: 0; }
  ul[data-type="checkbox"] > li { position: relative; padding-left: 24px; }
  ul[data-type="checkbox"] > li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 3px;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 1.5px solid ${border};
    border-radius: 4px;
    background: transparent;
  }
  ul[data-type="checkbox"] > li[checked]::before {
    background: ${primary};
    border-color: ${primary};
  }
  ul[data-type="checkbox"] > li[checked]::after {
    content: "";
    position: absolute;
    left: 5.5px;
    top: 6px;
    width: 5px;
    height: 9px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  pre {
    background: ${secondaryBg};
    border-radius: 12px;
    padding: 10px 12px;
    overflow-x: auto;
  }
  /* 标题用略紧的比例，正文 1.6 在 22px 上会拉太开 */
  h1 { font-size: 22px; line-height: 1.35; font-weight: 700; margin: 8px 0 12px; }
  h2 { font-size: 20px; line-height: 1.35; font-weight: 700; margin: 6px 0 12px; }
  h3 { font-size: 18px; line-height: 1.35; font-weight: 700; margin: 4px 0 12px; }
  h4 { font-size: 16px; line-height: 1.35; font-weight: 700; margin: 4px 0 12px; }
  h5 { font-size: 15px; line-height: 1.35; font-weight: 700; margin: 4px 0 12px; }
  h6 { font-size: 14px; line-height: 1.35; font-weight: 700; margin: 4px 0 12px; }
  blockquote { border-left-color: ${border}; }
  a { color: ${primary}; text-decoration: none; }

  img {
    box-sizing: border-box;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid ${mediaBorder};
    margin: 8px auto;
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
    border: none;
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
    color: ${fg};
  }
  .ql-ui { width: 0; height: 0; opacity: 0; }

  /* 字号类只写字号：行高由无单位倍数继承，各档自己算 */
  .ql-size-small { font-size: 13px; }
  .ql-size-large { font-size: 20px; }
  .ql-size-huge  { font-size: 28px; }
  .ql-size-14px { font-size: 14px; }
  .ql-size-16px { font-size: 16px; }
  .ql-size-18px { font-size: 18px; }
  .ql-size-20px { font-size: 20px; }
  .ql-size-22px { font-size: 22px; }
  .ql-size-24px { font-size: 24px; }
  .ql-size-26px { font-size: 26px; }
  .ql-size-28px { font-size: 28px; }
  .ql-size-30px { font-size: 30px; }
  .ql-size-32px { font-size: 32px; }

  .ql-font-monospace { font-family: Menlo, Consolas, monospace; }
  .ql-font-serif { font-family: "Times New Roman", Georgia, serif; }
</style>`;
}

function buildHtmlDocument(opts: DocOptions): string {
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
${buildStyleBlock(opts)}
</head>
<body><div id="article-body">${opts.body}</div>
<script>
${DOC_SCRIPT}
</script>
<script>
${DOC_SWAP_BODY}
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
  // 不放进 ref：主题/可选中切换有新文档时要重新放行一次 onReady，正文替换时不重置
  const [readyToken, setReadyToken] = useState(0);
  const readyTokenRef = useRef(0);
  const onReadyFiredTokenRef = useRef(-1);

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

  const docStyleOptions = useMemo<DocStyleOptions>(
    () => ({
      selectable,
      fg: theme.foreground,
      primary: theme.primary,
      border: theme.border,
      secondaryBg: theme.secondaryBackground,
      mediaBorder: withAlpha(theme.foreground, 0.12),
    }),
    [
      selectable,
      theme.foreground,
      theme.primary,
      theme.border,
      theme.secondaryBackground,
    ],
  );

  // 首屏文档只生成一次；之后正文变化走 swapBody 注入，主题变化走下面的 effect，
  // 都不重挂 WebView（整篇重新 loadUrl 会让所有 <img> 重新加载，图片就会闪）。
  const webViewRef = useRef<WebViewHandle | null>(null);
  const styleSignature = JSON.stringify(docStyleOptions);
  const initialDocumentRef = useRef({ body: "", html: "" });
  const previousStyleSignatureRef = useRef(styleSignature);
  const wasInitializedRef = useRef(false);

  useEffect(() => {
    const doc = initialDocumentRef.current;
    if (!doc.html) {
      if (!annotatedHtml) return;
      doc.body = annotatedHtml;
      doc.html = buildHtmlDocument({ body: annotatedHtml, ...docStyleOptions });
      previousStyleSignatureRef.current = styleSignature;
      wasInitializedRef.current = true;
      readyTokenRef.current += 1;
      setReadyToken(readyTokenRef.current);
      return;
    }

    if (styleSignature !== previousStyleSignatureRef.current) {
      // 主题 / 可选中状态变化：同正文换新文档，放行一次 onReady
      previousStyleSignatureRef.current = styleSignature;
      doc.html = buildHtmlDocument({ body: doc.body, ...docStyleOptions });
      readyTokenRef.current += 1;
      setReadyToken(readyTokenRef.current);
      return;
    }

    if (!annotatedHtml || annotatedHtml === doc.body) return;
    doc.body = annotatedHtml;
    if (!wasInitializedRef.current) {
      doc.html = buildHtmlDocument({ body: annotatedHtml, ...docStyleOptions });
      return;
    }
    // 正文（原文 ↔ 译文）只需替换 body 内容，已加载过的图片保持原样
    webViewRef.current?.injectJavaScript(
      `(function(){if(window.__articleSwapBody){window.__articleSwapBody(${JSON.stringify(
        annotatedHtml,
      )});}})();true;`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotatedHtml, styleSignature]);

  const documentHtml = initialDocumentRef.current.html;

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
        if (onReadyFiredTokenRef.current !== readyToken) {
          onReadyFiredTokenRef.current = readyToken;
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
    [onReady, readyToken],
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
            ref={webViewRef}
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
