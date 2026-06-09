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
  const hasSource = hasImageSource(source);
  const imageSource = hasSource ? source : placeholder;
  const sourceKey = getImageSourceKey(source);
  const hasLoadedSource = sourceKey
    ? loadedImageSourceKeys.has(sourceKey)
    : false;
  const shouldShowLoading = showLoading && hasSource;
  const placeholderKey = useMemo(
    () => getImageSourceKey(placeholder),
    [placeholder],
  );
  const currentResolvedSource =
    hasSource && hasLoadedSource ? source : hasSource ? resolvedSource : placeholder;
  const currentResolvedSourceKey =
    hasSource && hasLoadedSource ? sourceKey : hasSource ? resolvedSourceKey : placeholderKey;
  const nextSourceKey = hasSource ? sourceKey : placeholderKey;
  const needsSourceSwap = nextSourceKey !== currentResolvedSourceKey;

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

    if (!needsSourceSwap || !shouldShowLoading || hasLoadedSource) return;
    loadingTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsLoading(true);
    }, LOADING_SKELETON_DELAY);
  }, [
    clearLoadingFrame,
    clearLoadingTimer,
    hasLoadedSource,
    needsSourceSwap,
    shouldShowLoading,
  ]);

  const handleLoad = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();
    if (nextSourceKey) {
      loadedImageSourceKeys.add(nextSourceKey);
    }
    if (!mountedRef.current) return;
    setResolvedSource(imageSource);
    setResolvedSourceKey(nextSourceKey);
    loadingFrameRef.current = requestAnimationFrame(() => {
      loadingFrameRef.current = null;
      if (!mountedRef.current) return;
      setIsLoading(false);
    });
    setHasError(false);
  }, [clearLoadingFrame, clearLoadingTimer, imageSource, nextSourceKey]);

  const handleError = useCallback(() => {
    clearLoadingTimer();
    clearLoadingFrame();
    if (!mountedRef.current) return;
    setIsLoading(false);
    setHasError(
      !currentResolvedSourceKey || currentResolvedSourceKey === placeholderKey,
    );
  }, [
    clearLoadingFrame,
    clearLoadingTimer,
    currentResolvedSourceKey,
    placeholderKey,
  ]);

  const shouldRenderLoader = isLoading && needsSourceSwap && !hasLoadedSource;
  const shouldRenderFallbackImage =
    hasError && !needsSourceSwap && (!hasSource || !currentResolvedSourceKey);
  const activeSource = needsSourceSwap ? imageSource : currentResolvedSource;

  const imageStyle = useMemo(
    () => [StyleSheet.absoluteFill, style],
    [style],
  );

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
      <Image
        source={currentResolvedSource}
        placeholder={!shouldShowLoading ? placeholder : undefined}
        cachePolicy="memory-disk"
        transition={{ duration: 200, effect: "cross-dissolve" }}
        style={imageStyle}
        {...rest}
      />
      {needsSourceSwap && (
        <Image
          source={activeSource}
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
});

export default AsyncImage;
