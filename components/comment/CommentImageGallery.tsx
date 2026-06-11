import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import { Image as ImageIcon } from "lucide-react-native";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import GaleriaViewer from "../ui/GaleriaViewer";

type CommentGalleryImage = string | ImageData;

type CommentImageGalleryProps = {
  images: CommentGalleryImage[];
  contentWidth: number;
  displayMode?: "gallery" | "link";
  hasEdge?: boolean;
};

function resolveImageUrl(
  image: CommentGalleryImage,
  size: "small" | "large" | "original",
) {
  if (typeof image === "string") {
    return image;
  }

  return getImageUrl(image, size) || image.url;
}

function getImageAspectRatio(image?: CommentGalleryImage) {
  if (!image || typeof image === "string") {
    return 1;
  }

  if (!image.width || !image.height) {
    return 1;
  }

  return Math.min(1.6, Math.max(0.6, image.width / image.height));
}

function CommentImageGallery({
  images,
  contentWidth,
  displayMode = "gallery",
  hasEdge = false,
}: CommentImageGalleryProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!images.length) {
    return null;
  }

  const singleAspectRatio = getImageAspectRatio(images[0]);

  const previewUrls = useMemo(
    () => images.map((image) => resolveImageUrl(image, "small")),
    [images],
  );

  return (
    <GaleriaViewer images={images} getImageUrl={resolveImageUrl}>
      {displayMode === "link" ? (
        <GaleriaViewer.Image index={0} style={styles.linkButton}>
          <>
            <ImageIcon size={14} color={theme.primary} />
            <ThemedText size={13} color={theme.primary}>
              {t("commentList.viewImages")}
            </ThemedText>
          </>
        </GaleriaViewer.Image>
      ) : images.length === 1 ? (
        <View style={{ paddingLeft: hasEdge ? 60 : 0, paddingRight: 14 }}>
          <GaleriaViewer.Image
            index={0}
            style={[
              styles.singleImageWrapper,
              {
                width: Math.min(contentWidth, 240),
                aspectRatio: singleAspectRatio,
                borderColor: theme.border,
              },
            ]}
          >
            <AsyncImage
              source={previewUrls[0]}
              contentFit="cover"
              style={styles.singleImage}
            />
          </GaleriaViewer.Image>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12,
            paddingRight: 14,
          }}
          decelerationRate="fast"
        >
          {previewUrls.map((imageUrl, index) => (
            <GaleriaViewer.Image
              key={`${imageUrl}-${index}`}
              index={index}
              style={[
                styles.multiImageCard,
                { borderColor: theme.border },
                hasEdge && index === 0 ? { marginLeft: 60 } : null,
              ]}
            >
              <AsyncImage
                source={imageUrl}
                contentFit="contain"
                style={styles.multiImage}
              />
            </GaleriaViewer.Image>
          ))}
        </ScrollView>
      )}
    </GaleriaViewer>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  singleImageWrapper: {
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },

  multiImageCard: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  multiImage: {
    width: "100%",
    height: "100%",
  },
});

export default memo(CommentImageGallery);
