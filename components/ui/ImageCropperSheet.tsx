import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImageIcon, X } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export interface ImageCropperSheetRef {
  present(): void;
  dismiss(): void;
}

interface BannerSize {
  width: number;
  height: number;
}

interface ImageCropperSheetProps {
  mode: "avatar" | "banner";
  /** Output size for avatar mode (square). Default: 400 */
  avatarSize?: number;
  /** Output size for banner mode. Default: { width: 1200, height: 400 } */
  bannerSize?: BannerSize;
  /**
   * Shape of the crop overlay shown to the user.
   * - 'circle'  — forces 1:1 aspect, iOS shows a circular overlay
   * - 'rect'    — uses the aspect ratio derived from mode/bannerSize (default)
   */
  shape?: "circle" | "rect";
  onCrop: (uri: string) => void | Promise<void>;
}

const DEFAULT_AVATAR_SIZE = 400;
const DEFAULT_BANNER_SIZE: BannerSize = { width: 1200, height: 400 };

const ImageCropperSheet = forwardRef<
  ImageCropperSheetRef,
  ImageCropperSheetProps
>(function ImageCropperSheet(
  {
    mode,
    avatarSize = DEFAULT_AVATAR_SIZE,
    bannerSize = DEFAULT_BANNER_SIZE,
    shape = mode === "avatar" ? "circle" : "rect",
    onCrop,
  },
  ref,
) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [processing, setProcessing] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const aspect: [number, number] =
    shape === "circle"
      ? [1, 1]
      : mode === "avatar"
        ? [1, 1]
        : [bannerSize.width, bannerSize.height];

  const targetWidth =
    shape === "circle"
      ? mode === "avatar"
        ? avatarSize
        : Math.min(bannerSize.width, bannerSize.height)
      : mode === "avatar"
        ? avatarSize
        : bannerSize.width;
  const targetHeight =
    shape === "circle"
      ? targetWidth
      : mode === "avatar"
        ? avatarSize
        : bannerSize.height;

  const handlePick = useCallback(
    async (source: "camera" | "library") => {
      sheetRef.current?.dismiss();

      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            t("imageCropper.permissionTitle"),
            t("imageCropper.cameraPermissionMsg"),
          );
          return;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            t("imageCropper.permissionTitle"),
            t("imageCropper.libraryPermissionMsg"),
          );
          return;
        }
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect,
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect,
              quality: 1,
            });

      if (result.canceled || !result.assets[0]) return;

      setProcessing(true);
      try {
        const { uri } = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: targetWidth, height: targetHeight } }],
          { compress: 0.88, format: SaveFormat.JPEG },
        );
        await onCrop(uri);
      } finally {
        setProcessing(false);
      }
    },
    [aspect, targetWidth, targetHeight, onCrop, t],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <>
      {processing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        handleComponent={null}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View
            style={[styles.sheetHandle, { backgroundColor: theme.border }]}
          />
          <ThemedText fontWeight="600" size={15} style={styles.sheetTitle}>
            {t("imageCropper.title")}
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.option,
              { borderBottomColor: theme.border },
              pressed && { backgroundColor: theme.secondaryBackground },
            ]}
            onPress={() => handlePick("camera")}
          >
            <Camera size={20} color={theme.foreground} />
            <ThemedText size={14} style={styles.optionText}>
              {t("imageCropper.takePhoto")}
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.option,
              pressed && { backgroundColor: theme.secondaryBackground },
            ]}
            onPress={() => handlePick("library")}
          >
            <ImageIcon size={20} color={theme.foreground} />
            <ThemedText size={14} style={styles.optionText}>
              {t("imageCropper.chooseFromLibrary")}
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.cancelBtn, { borderTopColor: theme.border }]}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <X size={18} color={theme.secondary} style={styles.cancelIcon} />
            <ThemedText size={15} color={theme.secondary}>
              {t("cancel")}
            </ThemedText>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});

export default ImageCropperSheet;

const styles = StyleSheet.create({
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sheetContent: { paddingBottom: 16, overflow: "hidden" },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetTitle: { textAlign: "center", paddingVertical: 14 },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  optionText: { flex: 1 },

  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  cancelIcon: { marginTop: 1 },
});
