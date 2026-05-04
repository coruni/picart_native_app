import imageError from "@/assets/images/placeholder/image_error.webp";
import imagePlaceholder from "@/assets/images/placeholder/image_placeholder.webp";
import { Image, ImageProps } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type AsyncImageProps = ImageProps & {
  placeholder?: any;
  errorImage?: any;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleSuccess = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const showOverlay = hasError || (isLoading && showLoading);

  return (
    <View style={style}>
      {/* 真实图片始终挂载，确保回调能触发 */}
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, hasError && { opacity: 0 }, style]}
        onLoadStart={handleLoadStart}
        onLoad={handleSuccess}
        onError={handleError}
        {...rest}
      />

      {/* overlay 层：loading 或 error 时覆盖在上方 */}
      {showOverlay && (
        <View style={StyleSheet.absoluteFill}>
          {hasError
            ? (errorComponent ?? (
                <Image
                  source={errorImage}
                  style={[StyleSheet.absoluteFill, style]}
                />
              ))
            : (loadingComponent ?? (
                <Image
                  source={placeholder}
                  style={[StyleSheet.absoluteFill, style]}
                />
              ))}
        </View>
      )}
    </View>
  );
};

export default AsyncImage;
