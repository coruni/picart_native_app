import imageError from "@/assets/images/placeholder/image_error.webp";
import imagePlaceholder from "@/assets/images/placeholder/image_placeholder.webp";
import { useTheme } from "@/hooks/useTheme";
import { Image, ImageProps } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

type AsyncImageProps = Omit<ImageProps, "placeholder"> & {
  placeholder?: ImageProps["placeholder"];
  errorImage?: any;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
};

const LOADING_SKELETON_DELAY = 90;

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
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSource = hasImageSource(source);
  const imageSource = hasSource ? source : placeholder;
  const shouldShowLoading = showLoading && hasSource;

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    clearLoadingTimer();
    setHasError(false);

    if (!shouldShowLoading) return;
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(true);
    }, LOADING_SKELETON_DELAY);
  }, [clearLoadingTimer, shouldShowLoading]);

  const handleLoad = useCallback(() => {
    clearLoadingTimer();
    requestAnimationFrame(() => setIsLoading(false));
    setHasError(false);
  }, [clearLoadingTimer]);

  const handleError = useCallback(() => {
    clearLoadingTimer();
    setIsLoading(false);
    setHasError(true);
  }, [clearLoadingTimer]);

  useEffect(() => clearLoadingTimer, [clearLoadingTimer]);

  useEffect(() => {
    if (hasSource) return;
    clearLoadingTimer();
    setIsLoading(false);
    setHasError(false);
  }, [clearLoadingTimer, hasSource]);

  const resolvedLoadingComponent = loadingComponent ?? <ImageSkeleton />;

  return (
    <View style={[style, styles.container]}>
      <Image
        source={imageSource}
        placeholder={!shouldShowLoading ? placeholder : undefined}
        cachePolicy="memory-disk"
        transition={{ duration: 200, effect: "cross-dissolve" }}
        style={[StyleSheet.absoluteFill, hasError && { opacity: 0 }, style]}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
      {(hasError || isLoading) && (
        <View style={StyleSheet.absoluteFill}>
          {hasError
            ? (errorComponent ?? (
                <Image
                  cachePolicy="memory-disk"
                  source={errorImage}
                  style={[StyleSheet.absoluteFill, style]}
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
});

export default AsyncImage;
