import imageError from "@/assets/images/placeholder/image_error.webp";
import imagePlaceholder from "@/assets/images/placeholder/image_placeholder.webp";
import { useTheme } from "@/hooks/useTheme";
import { Image, ImageProps } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

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

// 静态骨架：列表里每张图都跑一个无限循环动画会让主线程持续产生动画帧，
// 而骨架本身只需覆盖「加载中的空白」，用不透明纯色块即可。
function ImageSkeleton() {
  const { theme } = useTheme();
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.muted }]}
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
  transition,
  recyclingKey,
  onLoadStart,
  onLoad,
  onError,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const hasSource = hasImageSource(source);
  const imageSource = hasSource ? source : placeholder;
  const sourceKey = getImageSourceKey(imageSource) ?? undefined;
  // 会话内已加载过：跳过骨架、跳过淡入，直接显示（滚动回收复用时最常见）
  const hasLoadedSource = sourceKey
    ? loadedImageSourceKeys.has(sourceKey)
    : false;
  const shouldShowLoading = showLoading && hasSource && !hasLoadedSource;
  const showSkeleton = isLoading && shouldShowLoading && !hasError;

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    clearLoadingTimer();
    if (!mountedRef.current) return;
    setHasError(false);
    if (!shouldShowLoading) return;

    loadingTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsLoading(true);
    }, LOADING_SKELETON_DELAY);
  }, [clearLoadingTimer, shouldShowLoading]);

  const handleLoad = useCallback(() => {
    clearLoadingTimer();
    // 只记录真实图片的 key，占位图不算「已加载」，否则无图卡片会命中错误分支
    if (hasSource && sourceKey) {
      loadedImageSourceKeys.add(sourceKey);
      pruneLoadedKeys();
    }
    if (!mountedRef.current) return;
    setHasError(false);
    setIsLoading(false);
  }, [clearLoadingTimer, hasSource, sourceKey]);

  const handleError = useCallback(() => {
    clearLoadingTimer();
    if (!mountedRef.current) return;
    setIsLoading(false);
    setHasError(true);
  }, [clearLoadingTimer]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearLoadingTimer();
    };
  }, [clearLoadingTimer]);

  const resolvedTransition =
    transition ??
    (hasLoadedSource
      ? undefined
      : { duration: 200, effect: "cross-dissolve" as const });

  return (
    <View style={[style, styles.container]}>
      <Image
        {...rest}
        source={imageSource}
        placeholder={shouldShowLoading ? placeholder : undefined}
        cachePolicy="memory-disk"
        transition={resolvedTransition}
        recyclingKey={recyclingKey ?? (hasSource ? sourceKey : undefined)}
        style={[
          StyleSheet.absoluteFill,
          style,
          // 失败时保留原 source 不切换，否则 errorImage 的 onLoadStart 会把
          // hasError 重置回 false，形成「失败 → 重试 → 失败」的回调循环
          hasError ? styles.hidden : null,
        ]}
        onLoadStart={() => {
          handleLoadStart();
          onLoadStart?.();
        }}
        onLoad={(event) => {
          handleLoad();
          onLoad?.(event);
        }}
        onError={(event) => {
          handleError();
          onError?.(event);
        }}
      />

      {hasError ? (
        <View style={StyleSheet.absoluteFill}>
          {errorComponent ?? (
            <Image
              cachePolicy="memory-disk"
              source={errorImage}
              style={[StyleSheet.absoluteFill, style]}
            />
          )}
        </View>
      ) : null}

      {showSkeleton ? (
        <View style={StyleSheet.absoluteFill}>
          {loadingComponent ?? <ImageSkeleton />}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  hidden: {
    opacity: 0,
  },
});

export default AsyncImage;
