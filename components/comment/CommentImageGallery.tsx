import AsyncImage from "@/components/ui/AsyncImage";
import GestureImageViewer from "@/components/ui/GestureImageViewer";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import { Image as ImageIcon } from "lucide-react-native";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

type CommentGalleryImage = string | ImageData;

type CommentImageGalleryProps = {
  images: CommentGalleryImage[];
  contentWidth: number;
  articleId?: string;
  parentId?: number | string;
  replyToName?: string;
  isLiked?: boolean;
  likeCount?: number;
  displayMode?: "gallery" | "link";
  hasEdge?: boolean;
  onLike?: () => void;
  onSubmitted?: () => void;
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
  articleId,
  parentId,
  replyToName,
  isLiked,
  likeCount,
  displayMode = "gallery",
  hasEdge = false,
  onLike,
  onSubmitted,
}: CommentImageGalleryProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const singleAspectRatio = getImageAspectRatio(images[0]);
  const previewUrls = useMemo(
    () => images.map((image) => resolveImageUrl(image, "large")),
    [images],
  );
  const viewerImages = useMemo(
    () =>
      images.map((image, index) => ({
        imageData: typeof image === "string" ? undefined : image,
        previewUrl: previewUrls[index],
        viewerUrl: resolveImageUrl(image, "large"),
        originalUrl: resolveImageUrl(image, "original"),
        width: typeof image === "string" ? undefined : image.width,
        height: typeof image === "string" ? undefined : image.height,
        sizeBytes: typeof image === "string" ? undefined : image.size,
      })),
    [images, previewUrls],
  );

  if (!images.length) {
    return null;
  }

  return (
    <GestureImageViewer
      variant="comment"
      images={viewerImages}
      commentAction={{
        articleId,
        parentId,
        replyToName,
        isLiked,
        likeCount,
        onLike,
        onSubmitted,
      }}
    >
      {({ open }) =>
        displayMode === "link" ? (
          <Pressable style={styles.linkButton} onPress={() => open(0)}>
            <ImageIcon size={14} color={theme.primary} />
            <ThemedText size={13} color={theme.primary}>
              {t("commentList.viewImages")}
            </ThemedText>
          </Pressable>
        ) : images.length === 1 ? (
          <View style={{ paddingLeft: hasEdge ? 60 : 0, paddingRight: 14 }}>
            <Pressable
              onPress={() => open(0)}
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
            </Pressable>
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
              <Pressable
                key={`${imageUrl}-${index}`}
                onPress={() => open(index)}
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
              </Pressable>
            ))}
          </ScrollView>
        )
      }
    </GestureImageViewer>
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
    maxHeight: 240,
  },
  singleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
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
