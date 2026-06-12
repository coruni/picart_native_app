import { ArticleData } from "@/app/article/[id]";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { getImageUrl } from "@/lib/image";
import type { ImageData } from "@/types/api";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ellipsis, X } from "lucide-react-native";
import {
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  GestureViewer,
  useGestureViewerEvent,
  useGestureViewerState,
} from "react-native-gesture-image-viewer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ShareModal from "../article/ShareModal";
import CommentComposerModal from "../comment/CommentComposerModal";

export type GestureImageViewerItem = {
  imageData?: ImageData;
  previewUrl: string;
  viewerUrl: string;
  originalUrl?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
};

type GestureImageViewerProps = {
  article?: ArticleData | undefined;
  images: GestureImageViewerItem[];
  onCommentSubmitted?: () => void;
  children: (helpers: { open: (index?: number) => void }) => ReactNode;
};

type ViewerChromeProps = {
  id: string;
  images: GestureImageViewerItem[];
  originalLoadedMap: Record<number, boolean>;
  onClose: () => void;
  onOpenOriginal: (image?: GestureImageViewerItem, index?: number) => void;
};

function formatFileSize(bytes?: number) {
  if (!bytes || bytes <= 0) {
    return null;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }

  const megabytes = bytes / (1024 * 1024);
  const value = megabytes >= 10 ? megabytes.toFixed(0) : megabytes.toFixed(1);
  return `${value.replace(/\.0$/, "")}MB`;
}

function ViewerChrome({
  id,
  images,
  originalLoadedMap,
  onClose,
  onOpenOriginal,
}: ViewerChromeProps) {
  const { t } = useTranslation();
  const { currentIndex, totalCount } = useGestureViewerState(id);
  const insets = useSafeAreaInsets();
  const [chromeOpacity] = useState(() => new Animated.Value(1));
  const [topTranslateY] = useState(() => new Animated.Value(0));
  const [bottomTranslateY] = useState(() => new Animated.Value(0));

  const activeImage = images[currentIndex] ?? images[0];
  const isOriginalLoaded = Boolean(originalLoadedMap[currentIndex]);
  const originalSize = formatFileSize(activeImage?.sizeBytes);
  const shouldShowOriginalButton = Boolean(originalSize) && !isOriginalLoaded;
  const originalLabel = originalSize
    ? t("imageViewer.viewOriginalWithSize", { size: originalSize })
    : "";

  const animateChrome = useCallback(
    (hidden: boolean) => {
      Animated.parallel([
        Animated.timing(chromeOpacity, {
          toValue: hidden ? 0 : 1,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(topTranslateY, {
          toValue: hidden ? -14 : 0,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(bottomTranslateY, {
          toValue: hidden ? 18 : 0,
          duration: hidden ? 160 : 220,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [bottomTranslateY, chromeOpacity, topTranslateY],
  );

  useGestureViewerEvent(id, "zoomChange", ({ scale }) => {
    animateChrome(scale > 1.01);
  });

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 12,
            opacity: chromeOpacity,
            transform: [{ translateY: topTranslateY }],
          },
        ]}
      >
        <Pressable hitSlop={10} onPress={onClose} style={styles.iconButton}>
          <X color="#FFFFFF" size={24} strokeWidth={2.25} />
        </Pressable>

        {totalCount > 0 && (
          <View style={styles.counterWrap}>
            <ThemedText color="#FFFFFF" fontWeight="700" size={16}>
              {`${currentIndex + 1}/${totalCount}`}
            </ThemedText>
          </View>
        )}

        <Pressable
          hitSlop={10}
          onPress={() => onOpenOriginal(activeImage, currentIndex)}
          style={styles.iconButton}
        >
          <Ellipsis color="#FFFFFF" size={24} strokeWidth={2.5} />
        </Pressable>
      </Animated.View>

      {shouldShowOriginalButton ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.bottomBar,
            {
              paddingBottom: Math.max(insets.bottom, 18),
              opacity: chromeOpacity,
              transform: [{ translateY: bottomTranslateY }],
            },
          ]}
        >
          <Pressable
            hitSlop={10}
            onPress={() => onOpenOriginal(activeImage, currentIndex)}
            style={styles.originalButton}
          >
            <ThemedText color="#FFFFFF" size={12}>
              {originalLabel}
            </ThemedText>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

function GestureImageViewer({
  images,
  children,
  article,
  onCommentSubmitted,
}: GestureImageViewerProps) {
  const rawId = useId();
  const viewerId = useMemo(
    () => `gesture-image-viewer-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawId],
  );
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [originalLoadedMap, setOriginalLoadedMap] = useState<
    Record<number, boolean>
  >({});
  const [showShare, setShowShare] = useState(false);
  const [showCommentComposer, setShowCommentComposer] = useState(false);
  const shareRef = useRef<BottomSheetModal>(null);
  const commentComposerRef = useRef<BottomSheetModal>(null);

  const open = useCallback(
    (index = 0) => {
      if (!images.length) {
        return;
      }

      setSelectedIndex(index);
      setChromeVisible(true);
      setOriginalLoadedMap({});
      setVisible(true);
    },
    [images.length],
  );

  const close = useCallback(() => {
    setVisible(false);
    setChromeVisible(true);
    setOriginalLoadedMap({});
  }, []);

  const handleOpenOriginal = useCallback(
    (image?: GestureImageViewerItem, index?: number) => {
      if (typeof index !== "number") {
        return;
      }

      const targetUrl = image?.imageData
        ? getImageUrl(image.imageData, "original") || image.originalUrl
        : image?.originalUrl;

      if (!targetUrl) {
        return;
      }

      setOriginalLoadedMap((current) => {
        if (current[index]) {
          return current;
        }

        return {
          ...current,
          [index]: true,
        };
      });
    },
    [],
  );

  const renderItem = useCallback(
    (item: GestureImageViewerItem, index: number) => {
      const isOriginalLoaded = Boolean(originalLoadedMap[index]);
      const sourceUrl = isOriginalLoaded
        ? item.imageData
          ? getImageUrl(item.imageData, "original") ||
            item.originalUrl ||
            item.viewerUrl
          : item.originalUrl || item.viewerUrl
        : item.viewerUrl;

      return (
        <AsyncImage
          source={{ uri: sourceUrl }}
          contentFit="contain"
          style={styles.viewerImage}
        />
      );
    },
    [originalLoadedMap],
  );

  return (
    <>
      {children({ open })}
      {visible ? (
        <Modal
          transparent
          visible
          animationType="fade"
          statusBarTranslucent
          presentationStyle="overFullScreen"
          onRequestClose={close}
        >
          <View style={styles.modalRoot}>
            <GestureViewer
              id={viewerId}
              data={images}
              initialIndex={selectedIndex}
              onDismiss={close}
              onSingleTap={() => setChromeVisible((current) => !current)}
              renderItem={renderItem}
              ListComponent={ScrollView}
              backdropStyle={styles.backdrop}
              containerStyle={styles.viewerContainer}
              dismiss={{
                enabled: true,
              }}
              enableHorizontalSwipe={images.length > 1}
              enableDoubleTapZoom
              enablePinchZoom
              maxZoomScale={3}
            />

            {chromeVisible ? (
              <ViewerChrome
                id={viewerId}
                images={images}
                originalLoadedMap={originalLoadedMap}
                onClose={close}
                onOpenOriginal={handleOpenOriginal}
              />
            ) : null}

            <View pointerEvents="none" style={styles.bottomFadeWrap}>
              <View
                style={[
                  styles.bottomFade,
                  {
                    opacity: 0.08,
                  },
                ]}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      <ShareModal
        ref={shareRef}
        data={showShare ? article : undefined}
        onClose={() => setShowShare(false)}
      />
      <CommentComposerModal
        ref={commentComposerRef}
        articleId={showCommentComposer ? String(article?.id) : undefined}
        onClose={() => setShowCommentComposer(false)}
        onSubmitted={onCommentSubmitted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: "#000000",
  },
  viewerContainer: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "#000000",
  },
  viewerImage: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  counterWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  originalButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(15,15,15,0.72)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bottomFadeWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    justifyContent: "flex-end",
  },
  bottomFade: {
    height: 140,
  },
});

export default memo(GestureImageViewer);
