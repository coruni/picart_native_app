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
  errorImage?: ImageProps["source"];
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
};

const LOADING_SKELETON_DELAY = 120;
const MAX_CACHED_IMAGE_KEYS = 500;
const loadedImageSourceKeys = new Set<string>();

function pruneLoadedKeys() {
  if (loadedImageSourceKeys.size > MAX_CACHED_IMAGE_KEYS) {
    const keysToDelete = Array.from(loadedImageSourceKeys).slice(
      0,
      loadedImageSourceKeys.size - MAX_CACHED_IMAGE_KEYS,
    );
    keysToDelete.forEach((key) => loadedImageSourceKeys.delete(key));
  }
}

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
  const [loadedSource, setLoadedSource] = useState<ImageProps["source"] | null>(
    null,
  );
  const [loadedSourceKey, setLoadedSourceKey] = useState<string | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingFrameRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  const hasSource = hasImageSource(source);
  const imageSource = hasSource ? source : placeholder;
  const sourceKey = getImageSourceKey(source);
  const placeholderKey = useMemo(
    () => getImageSourceKey(placeholder),
    [placeholder],
  );
  const hasLoadedSource = sourceKey
    ? loadedImageSourceKeys.has(sourceKey)
    : false;
  const currentBaseSource =
    !hasSource
      ? placeholder
      : hasLoadedSource
        ? source
        : loadedSourceKey === sourceKey
          ? loadedSource
          : null;
  const currentBaseKey =
    !hasSource
      ? placeholderKey
      : hasLoadedSource
        ? sourceKey
        : loadedSourceKey === sourceKey
          ? loadedSourceKey
          : null;
  const hasStableLoadedImage =
    !!currentBaseKey &&
    currentBaseKey !== placeholderKey &&
    loadedImageSourceKeys.has(currentBaseKey);
  const sourceNeedsLoad =
    hasSource && !!sourceKey && sourceKey !== loadedSourceKey && !hasLoadedSource;
  const shouldShowLoading = showLoading && sourceNeedsLoad;
  const shouldRenderLoader = isLoading && shouldShowLoading && !hasError;
  const shouldRenderFallbackImage =
    hasSource && hasError && !hasStableLoadedImage;
  const showOverlayImage = sourceNeedsLoad && !shouldRenderFallbackImage;
  const showBaseImage =
    !showOverlayImage || hasLoadedSource || hasStableLoadedImage;

  const imageStyle = useMemo(() => [StyleSheet.absoluteFill, style], [style]);
  const overlayImageStyle = useMemo(
    () => [StyleSheet.absoluteFill, style, styles.overlayImage],
    [style],
  );
  const fallbackImageStyle = useMemo(
    () => [StyleSheet.absoluteFill, style],
    [style],
  );

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

    if (!shouldShowLoading) return;

    loadingTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsLoading(true);
    }, LOADING_SKELETON_DELAY);
  }, [clearLoadingFrame, clearLoadingTimer, shouldShowLoading]);

  const handleLoad = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();

    if (sourceKey) {
      loadedImageSourceKeys.add(sourceKey);
      pruneLoadedKeys();
    }

    if (!mountedRef.current) return;

    setLoadedSource(imageSource);
    setLoadedSourceKey(sourceKey);
    setHasError(false);

    loadingFrameRef.current = requestAnimationFrame(() => {
      loadingFrameRef.current = null;
      if (!mountedRef.current) return;
      setIsLoading(false);
    });
  }, [clearLoadingFrame, clearLoadingTimer, imageSource, sourceKey]);

  const handleError = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();
    if (!mountedRef.current) return;
    setIsLoading(false);
    setHasError(!hasStableLoadedImage);
  }, [clearLoadingFrame, clearLoadingTimer, hasStableLoadedImage]);

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
      {currentBaseSource && (
        <Image
          source={currentBaseSource}
          placeholder={!shouldShowLoading ? placeholder : undefined}
          cachePolicy="memory-disk"
          transition={
            showBaseImage
              ? { duration: 200, effect: "cross-dissolve" }
              : undefined
          }
          style={[imageStyle, !showBaseImage && styles.hiddenImage]}
          {...rest}
        />
      )}

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
