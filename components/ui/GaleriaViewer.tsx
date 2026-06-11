import { Galeria } from "@nandorojo/galeria";
import { ReactElement, ReactNode, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

interface GaleriaViewerProps {
  /**
   * 图片数据数组（任何类型，通过 getImageUrl 转换）
   */
  images: any[];
  /**
   * 获取图片 URL 的函数，用于处理不同分辨率
   */
  getImageUrl: (image: any, size: "small" | "large" | "original") => string;
  /**
   * 渲染内容的子组件或函数
   * 如果是函数，会接收 images 数组
   */
  children: ReactNode | ((images: any[]) => ReactNode);
}

interface GaleriaImageProps {
  index: number;
  children: ReactElement;
  style?: StyleProp<ViewStyle>;
}

/**
 * Galeria 图片查看器包装组件
 * 用于简化 Galeria 的使用，处理 URL 解析和公共逻辑
 *
 * @example
 * ```tsx
 * <GaleriaViewer
 *   images={images}
 *   getImageUrl={(img, size) => {
 *     if (typeof img === 'string') return img;
 *     return getImageUrl(img, size);
 *   }}
 * >
 *   {(images) => (
 *     <View>
 *       {images.map((img, idx) => (
 *         <GaleriaViewer.Image key={idx} index={idx}>
 *           <Image source={{uri: ...}} />
 *         </GaleriaViewer.Image>
 *       ))}
 *     </View>
 *   )}
 * </GaleriaViewer>
 * ```
 */
function GaleriaViewerComponent({
  images,
  getImageUrl,
  children,
}: GaleriaViewerProps) {
  // 为 Galeria 生成完整分辨率的图片 URL
  const imageUrls = useMemo(
    () => images.map((img) => getImageUrl(img, "original")),
    [images, getImageUrl],
  );

  const content = typeof children === "function" ? children(images) : children;

  return <Galeria urls={imageUrls}>{content}</Galeria>;
}

/**
 * Galeria.Image 的包装组件
 * 在可点击元素上使用，自动与 GaleriaViewer 集成
 */
function GaleriaImage({ index, children, style }: GaleriaImageProps) {
  return (
    <Galeria.Image index={index} style={style as ViewStyle}>
      {children}
    </Galeria.Image>
  );
}

// 手动管理类型和静态属性
const GaleriaViewer =
  GaleriaViewerComponent as typeof GaleriaViewerComponent & {
    Image: typeof GaleriaImage;
  };

GaleriaViewer.Image = GaleriaImage;

export default GaleriaViewer;
export { GaleriaViewer, GaleriaViewerComponent };
export type { GaleriaImageProps, GaleriaViewerProps };

