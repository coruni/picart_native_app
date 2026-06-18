import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useKeyboardState } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/**
 * 纯测试页：最小化的 BottomSheetModal + BottomSheetTextInput，
 * 用来验证键盘弹出时输入框是否被遮挡。
 * 路由: /settings/sheet-test
 */
export default function SheetTestScreen() {
  const { theme, colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);

  const [value, setValue] = useState("");

  // keyboard-controller 直接给出键盘高度；gorhom 的 keyboardBehavior 在
  // edge-to-edge + keyboard-controller 组合下常拿不到高度，故手动撑。
  const keyboard = useKeyboardState((s) => ({
    height: s.height,
    isVisible: s.isVisible,
  }));
  const keyboardSpace =
    keyboard.isVisible && keyboard.height > 0
      ? Math.max(0, keyboard.height - insets.bottom)
      : 0;

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Sheet Test" });
  }, [navigation]);

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["bottom", "left", "right"]}
    >
      <View style={styles.center}>
        <Pressable
          style={[styles.openBtn, { backgroundColor: colors.primary }]}
          onPress={() => sheetRef.current?.present()}
        >
          <ThemedText size={15} fontWeight="600" color="#fff">
            打开 Bottom Sheet
          </ThemedText>
        </Pressable>
      </View>

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        handleComponent={null}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView
          style={[
            styles.sheetContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
        >
          <View
            style={[styles.sheetHandle, { backgroundColor: theme.border }]}
          />
          <ThemedText size={17} fontWeight="600" style={styles.sheetTitle}>
            键盘避让测试
          </ThemedText>
          <ThemedText
            size={13}
            color={theme.secondary}
            style={styles.sheetDesc}
          >
            点击输入框，键盘弹出时这个输入框应当浮在键盘上方，不被遮挡。
          </ThemedText>

          <BottomSheetTextInput
            value={value}
            onChangeText={setValue}
            placeholder="在这里输入..."
            placeholderTextColor={theme.secondary}
            style={[
              styles.input,
              { color: theme.foreground, borderColor: theme.border },
            ]}
          />

          <Pressable
            style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <ThemedText size={15} fontWeight="600" color="#fff">
              关闭
            </ThemedText>
          </Pressable>

          {/* 撑高：键盘高度的占位，配合 enableDynamicSizing 把 sheet 顶上去 */}
          {/* <View style={{ height: keyboardSpace }} /> */}
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  openBtn: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
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
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  sheetTitle: { marginBottom: 6 },
  sheetDesc: { marginBottom: 20, lineHeight: 18 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  confirmBtn: {
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
