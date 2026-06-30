import { Image } from "expo-image";
import { useCallback, useId, useMemo, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureViewer, useGestureViewerEvent, useGestureViewerState } from "react-native-gesture-image-viewer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import ThemedText from "./ThemedText";

export type ChatImageViewerItem = {
  previewUrl: string;
  viewerUrl: string;
  originalUrl?: string;
};

type ChatImageViewerProps = {
  images: ChatImageViewerItem[];
  children: (helpers: { open: (index?: number) => void }) => React.ReactNode;
};

function ChatImageChrome({
  images,
  visible,
  onClose,
}: {
  images: ChatImageViewerItem[];
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { currentIndex, totalCount } = useGestureViewerState("chat-image-viewer");
  const [chromeOpacity] = useState(() => new Animated.Value(1));
  const [topTranslateY] = useState(() => new Animated.Value(0));

  const animateChrome = useCallback((hidden: boolean) => {
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
    ]).start();
  }, [chromeOpacity, topTranslateY]);

  useGestureViewerEvent("chat-image-viewer", "zoomChange", ({ scale }) => {
    animateChrome(scale > 1.001);
  });

  return (
    <Animated.View
      pointerEvents={visible ? "box-none" : "none"}
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

      {totalCount > 0 ? (
        <View style={styles.counterWrap}>
          <ThemedText color="#FFFFFF" fontWeight="700" size={16}>
            {`${currentIndex + 1}/${totalCount}`}
          </ThemedText>
        </View>
      ) : (
        <View />
      )}

      <View style={styles.iconButton} />
    </Animated.View>
  );
}

export default function ChatImageViewer({ images, children }: ChatImageViewerProps) {
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);

  const viewerTopInset = Math.max(insets.top + 56, 84);
  const viewerBottomInset = Math.max(insets.bottom + 112, 136);
  const viewerHeight = Math.max(260, viewportHeight - viewerTopInset - viewerBottomInset);

  const open = useCallback(
    (index = 0) => {
      if (!images.length) {
        return;
      }
      setSelectedIndex(index);
      setChromeVisible(true);
      setVisible(true);
    },
    [images.length],
  );

  const close = useCallback(() => {
    setVisible(false);
    setChromeVisible(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    close();
  }, [close]);

  const renderItem = useCallback(
    (item: ChatImageViewerItem) => (
      <Image
        source={{ uri: item.viewerUrl }}
        contentFit="contain"
        style={styles.viewerImage}
      />
    ),
    [],
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
          onRequestClose={handleRequestClose}
        >
          <View style={styles.modalRoot}>
            <GestureViewer
              id="chat-image-viewer"
              data={images}
              initialIndex={selectedIndex}
              onDismiss={close}
              width={viewportWidth}
              height={viewerHeight}
              onSingleTap={() => setChromeVisible((current) => !current)}
              renderItem={renderItem}
              ListComponent={ScrollView}
              backdropStyle={styles.backdrop}
              containerStyle={[styles.viewerContainer, { marginTop: viewerTopInset }]}
              dismiss={{ enabled: true }}
              enableHorizontalSwipe={images.length > 1}
              enableDoubleTapZoom
              enablePinchZoom
              maxZoomScale={3}
            />

            <ChatImageChrome
              images={images}
              visible={chromeVisible}
              onClose={close}
            />
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: "#000000",
  },
  viewerContainer: {
    alignSelf: "center",
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
});
