import imageError from "@/assets/images/placeholder/image_error.webp";
import imagePlaceholder from "@/assets/images/placeholder/image_placeholder.webp";
import { useTheme } from "@/hooks/useTheme";
import { Image, ImageProps } from "expo-image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, View } from "react-native";

type AsyncImageProps = Omit<ImageProps, "placeholder"> & {
  placeholder?: ImageProps["placeholder"];
  errorImage?: any;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
};

const LOADING_SKELETON_DELAY = 120;
const loadedImageSourceKeys = new Set<string>();

function hasImageSource(source: ImageProps["source"]): boolean {
  if (!source) return false;
  if (typeof source === "string") return source.trim().length > 0;
  if (Array.isArray(source)) return source.some(hasImageSource);
  if (typeof source === "object" && "uri" in source) {
    const uri = (source as { uri?: unknown }).uri;
    return typeof uri !== "string" || uri.trim().length > 0;
  }
  return true;
}

function getImageSourceKey(source: ImageProps["source"]): string | null {
  if (!source) return null;
  if (typeof source === "string") return source.trim() || null;
  if (typeof source === "number") return `asset:${source}`;
  if (Array.isArray(source)) {
    const keys = source.map(getImageSourceKey).filter(Boolean);
    return keys.length ? keys.join("|") : null;
  }
  if (typeof source === "object" && "uri" in source) {
    const uri = (source as { uri?: unknown }).uri;
    if (typeof uri === "string") return uri.trim() || null;
  }
  return String(source);
}

function ImageSkeleton() {
  const { theme } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.42));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.42,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: theme.muted, opacity },
      ]}
    />
  );
}

const AsyncImage: React.FC<AsyncImageProps> = ({
  placeholder = imagePlaceholder,
  errorImage = imageError,
  showLoading = true,
  loadingComponent,
  errorComponent,
  style,
  source,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedSource, setResolvedSource] = useState<ImageProps["source"]>(
    () => (hasImageSource(source) ? source : placeholder),
  );
  const [resolvedSourceKey, setResolvedSourceKey] = useState<string | null>(
    () =>
      hasImageSource(source)
        ? getImageSourceKey(source)
        : getImageSourceKey(placeholder),
  );
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingFrameRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  const prevSourceKeyRef = useRef<string | null>(null);

  const hasSource = hasImageSource(source);
  const imageSource = hasSource ? source : placeholder;
  const sourceKey = getImageSourceKey(source);
  const placeholderKey = useMemo(
    () => getImageSourceKey(placeholder),
    [placeholder],
  );

  // 判断图片是否已经加载过
  const hasLoadedSource = sourceKey
    ? loadedImageSourceKeys.has(sourceKey)
    : false;

  // 判断是否需要显示 loading
  const shouldShowLoading = showLoading && hasSource && !hasLoadedSource;

  // 当前应该显示的图片源
  const currentResolvedSource =
    hasSource && hasLoadedSource ? source : resolvedSource;

  const currentResolvedSourceKey =
    hasSource && hasLoadedSource ? sourceKey : resolvedSourceKey;

  // 判断是否已经成功加载了非占位图
  const hasStableResolvedImage =
    (hasLoadedSource && !!sourceKey && sourceKey !== placeholderKey) ||
    (!!currentResolvedSourceKey && currentResolvedSourceKey !== placeholderKey);

  // 判断源是否发生了变化
  const sourceChanged = sourceKey !== prevSourceKeyRef.current;

  // 更新之前的源记录
  useEffect(() => {
    prevSourceKeyRef.current = sourceKey;
  }, [sourceKey]);

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  const clearLoadingFrame = useCallback(() => {
    if (loadingFrameRef.current !== null) {
      cancelAnimationFrame(loadingFrameRef.current);
      loadingFrameRef.current = null;
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();
    if (!mountedRef.current) return;
    setHasError(false);

    // 只有在新源且需要显示 loading 且未加载过的情况下才显示 loading
    if (!sourceChanged || !shouldShowLoading) return;

    loadingTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsLoading(true);
    }, LOADING_SKELETON_DELAY);
  }, [clearLoadingFrame, clearLoadingTimer, shouldShowLoading, sourceChanged]);

  const handleLoad = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();

    if (sourceKey) {
      loadedImageSourceKeys.add(sourceKey);
    }

    if (!mountedRef.current) return;

    setResolvedSource(imageSource);
    setResolvedSourceKey(sourceKey);

    loadingFrameRef.current = requestAnimationFrame(() => {
      loadingFrameRef.current = null;
      if (!mountedRef.current) return;
      setIsLoading(false);
    });

    setHasError(false);
  }, [clearLoadingFrame, clearLoadingTimer, imageSource, sourceKey]);

  const handleError = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();
    if (!mountedRef.current) return;
    setIsLoading(false);
    setHasError(!hasStableResolvedImage);
  }, [clearLoadingFrame, clearLoadingTimer, hasStableResolvedImage]);

  // 处理源变化
  useEffect(() => {
    if (sourceChanged) {
      if (hasSource && hasLoadedSource) {
        // 如果源已经加载过，直接使用新源
        setResolvedSource(source);
        setResolvedSourceKey(sourceKey);
        setIsLoading(false);
        setHasError(false);
      } else if (hasSource && !hasLoadedSource) {
        // 如果源未加载过，但之前有加载过的图片，保持显示当前图片
        // 不做任何状态更新，让 overlay image 处理加载
      }
    }
  }, [sourceChanged, hasSource, hasLoadedSource, source, sourceKey]);

  const shouldRenderLoader = isLoading && !hasLoadedSource && sourceChanged;
  const shouldRenderFallbackImage = hasError && !hasStableResolvedImage;

  // 决定显示哪个图片层
  const showOverlayImage = sourceChanged && hasSource;
  const showBaseImage = !showOverlayImage || hasLoadedSource;

  const imageStyle = useMemo(() => [StyleSheet.absoluteFill, style], [style]);

  const overlayImageStyle = useMemo(
    () => [StyleSheet.absoluteFill, style, styles.overlayImage],
    [style],
  );

  const fallbackImageStyle = useMemo(
    () => [StyleSheet.absoluteFill, style],
    [style],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearLoadingTimer();
      clearLoadingFrame();
    };
  }, [clearLoadingFrame, clearLoadingTimer]);

  const resolvedLoadingComponent = loadingComponent ?? <ImageSkeleton />;

  return (
    <View style={[style, styles.container]}>
      {/* 基础层：显示已加载的图片或占位图 */}
      <Image
        source={currentResolvedSource}
        placeholder={!shouldShowLoading ? placeholder : undefined}
        cachePolicy="memory-disk"
        transition={
          showBaseImage
            ? { duration: 200, effect: "cross-dissolve" }
            : undefined
        }
        style={[
          imageStyle,
          // 如果需要显示 overlay，隐藏基础层
          !showBaseImage && styles.hiddenImage,
        ]}
        {...rest}
      />

      {/* 覆盖层：用于加载新图片 */}
      {showOverlayImage && (
        <Image
          source={imageSource}
          placeholder={!shouldShowLoading ? placeholder : undefined}
          cachePolicy="memory-disk"
          transition={{ duration: 200, effect: "cross-dissolve" }}
          style={overlayImageStyle}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      )}

      {/* 加载状态或错误状态 */}
      {(shouldRenderFallbackImage || shouldRenderLoader) && (
        <View style={StyleSheet.absoluteFill}>
          {shouldRenderFallbackImage
            ? (errorComponent ?? (
                <Image
                  cachePolicy="memory-disk"
                  source={errorImage}
                  style={fallbackImageStyle}
                />
              ))
            : resolvedLoadingComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  overlayImage: {
    zIndex: 1,
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default AsyncImage;
