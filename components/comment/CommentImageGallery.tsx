import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import { Image as ImageIcon, X } from "lucide-react-native";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import PagerView from "react-native-pager-view";

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

function ImageViewerModal({
  visible,
  images,
  currentIndex,
  previewHeight,
  onClose,
  onPageChange,
}: {
  visible: boolean;
  images: string[];
  currentIndex: number;
  previewHeight: number;
  onClose: () => void;
  onPageChange: (index: number) => void;
}) {
  if (!images.length) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.viewerOverlay}>
        <Pressable hitSlop={12} style={styles.viewerCloseBtn} onPress={onClose}>
          <X size={20} color="white" />
        </Pressable>

        <PagerView
          key={`${images.length}-${currentIndex}`}
          style={[styles.viewerPager, { height: previewHeight }]}
          initialPage={currentIndex}
          onPageSelected={(event) => onPageChange(event.nativeEvent.position)}
        >
          {images.map((imageUrl, index) => (
            <View key={`${imageUrl}-${index}`} style={styles.viewerPage}>
              <AsyncImage
                source={imageUrl}
                contentFit="contain"
                style={styles.viewerImage}
              />
            </View>
          ))}
        </PagerView>

        <View style={styles.viewerFooter}>
          <View style={styles.viewerCounter}>
            <ThemedText color="white" size={12}>
              {currentIndex + 1}/{images.length}
            </ThemedText>
          </View>
          {images.length > 1 && (
            <View style={styles.viewerDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.viewerDot,
                    index === currentIndex && styles.viewerDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function CommentImageGallery({
  images,
  contentWidth,
  displayMode = "gallery",
  hasEdge = false,
}: CommentImageGalleryProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const previewHeight = Math.min(height * 0.72, width * 1.15);
  const singleAspectRatio = getImageAspectRatio(images[0]);

  const previewUrls = useMemo(
    () => images.map((image) => resolveImageUrl(image, "small")),
    [images],
  );

  const originalUrls = useMemo(
    () => images.map((image) => resolveImageUrl(image, "original")),
    [images],
  );

  const handleOpenViewer = useCallback((index: number) => {
    setCurrentIndex(index);
    setViewerVisible(true);
  }, []);

  if (!images.length) {
    return null;
  }

  return (
    <>
      {displayMode === "link" ? (
        <Pressable
          style={styles.linkButton}
          onPress={() => handleOpenViewer(0)}
        >
          <ImageIcon size={14} color={theme.primary} />
          <ThemedText size={13} color={theme.primary}>
            {t("commentList.viewImages")}
          </ThemedText>
        </Pressable>
      ) : images.length === 1 ? (
        <View style={{ paddingLeft: hasEdge ? 60 : 0, paddingRight: 14 }}>
          <Pressable
            style={[
              styles.singleImageWrapper,
              {
                width: Math.min(contentWidth, 240),
                aspectRatio: singleAspectRatio,
                borderColor: theme.border,
              },
            ]}
            onPress={() => handleOpenViewer(0)}
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
              style={[
                styles.multiImageCard,
                { borderColor: theme.border },
                hasEdge && index === 0 ? { marginLeft: 60 } : null,
              ]}
              onPress={() => handleOpenViewer(index)}
            >
              <AsyncImage
                source={imageUrl}
                contentFit="contain"
                style={styles.multiImage}
              />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ImageViewerModal
        visible={viewerVisible}
        images={originalUrls}
        currentIndex={currentIndex}
        previewHeight={previewHeight}
        onClose={() => setViewerVisible(false)}
        onPageChange={setCurrentIndex}
      />
    </>
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
  viewerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
  },
  viewerCloseBtn: {
    position: "absolute",
    top: 56,
    right: 16,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  viewerPager: {
    width: "100%",
  },
  viewerPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  viewerImage: {
    width: "100%",
    height: "100%",
  },
  viewerFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 10,
  },
  viewerCounter: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  viewerDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewerDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  viewerDotActive: {
    width: 18,
    backgroundColor: "white",
  },
});

export default memo(CommentImageGallery);
