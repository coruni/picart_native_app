import imageError from "@/assets/images/placeholder/image_error.webp";
import imagePlaceholder from "@/assets/images/placeholder/image_placeholder.webp";
import { Image, ImageLoadEventData, ImageProps } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type AsyncImageProps = Omit<ImageProps, "placeholder"> & {
  /** 自定义占位图，默认使用内置 imagePlaceholder */
  placeholder?: ImageProps["placeholder"];
  /** 加载失败时显示的图片资源 */
  errorImage?: any;
  /** 是否在加载中展示占位（默认 true） */
  showLoading?: boolean;
  /** 完全自定义的 loading 覆盖层，设置后 placeholder 失效 */
  loadingComponent?: React.ReactNode;
  /** 完全自定义的 error 覆盖层 */
  errorComponent?: React.ReactNode;
};

/**
 * 基于 expo-image 的异步图片组件。
 *
 * 缓存命中时 expo-image 会跳过 onLoadStart 直接触发 onLoad，
 * 因此不能用 isLoading 初始值为 true 来判断是否展示占位，
 * 否则会在缓存命中时闪一帧占位图。
 *
 * 解法：
 * 1. 将占位图交给 expo-image 原生 `placeholder` prop 处理，
 *    它内部能感知缓存状态，有缓存时不会展示占位。
 * 2. JS 层只负责 error 状态的覆盖层。
 * 3. 需要自定义 loadingComponent 时，回退到 JS 层控制，
 *    此时通过 onLoadStart / onLoad 感知加载阶段。
 */
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

  // 仅在有自定义 loadingComponent 时才需要 JS 层追踪 loading 状态
  const [isLoading, setIsLoading] = useState(!!loadingComponent && showLoading);

  const handleLoadStart = () => {
    if (loadingComponent && showLoading) {
      setIsLoading(true);
    }
    setHasError(false);
  };

  const handleLoad = (e: ImageLoadEventData) => {
    if (loadingComponent && showLoading) {
      // 有缓存时（disk / memory）跳过 loading 状态，避免闪烁
      const cached =
        (e.cacheType as any) === "disk" ||
        (e.cacheType as any) === "memory-disk" ||
        (e.cacheType as any) === "memory";
      if (!cached) {
        // 无缓存：短暂延迟让图片先渲染完再移除 overlay，避免白帧
        requestAnimationFrame(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 有自定义 loadingComponent：走 JS 层覆盖逻辑
  if (loadingComponent) {
    return (
      <View style={style}>
        <Image
          cachePolicy={"memory-disk"}
          source={source}
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
                    cachePolicy={"memory-disk"}
                    source={errorImage}
                    style={[StyleSheet.absoluteFill, style]}
                  />
                ))
              : loadingComponent}
          </View>
        )}
      </View>
    );
  }

  // 默认路径：把占位图交给 expo-image 原生处理，缓存命中时零闪烁
  return (
    <View style={style}>
      <Image
        source={source}
        // expo-image 的 placeholder 在图片加载完成前显示，
        // 有缓存时内部直接跳过，不会展示占位 → 无闪烁
        placeholder={showLoading ? placeholder : undefined}
        cachePolicy={"memory-disk"}
        // 无缓存时用 cross-dissolve 平滑过渡
        transition={{ duration: 200, effect: "cross-dissolve" }}
        style={[StyleSheet.absoluteFill, hasError && { opacity: 0 }, style]}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
      {hasError && (
        <View style={StyleSheet.absoluteFill}>
          {errorComponent ?? (
            <Image
              cachePolicy={"memory-disk"}
              source={errorImage}
              style={[StyleSheet.absoluteFill, style]}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default AsyncImage;
