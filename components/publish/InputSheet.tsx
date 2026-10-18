import Button from "@/components/ui/Button";
import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

export interface InputSheetRef {
  present(initialValue?: string): void;
  dismiss(): void;
}

interface InputSheetProps {
  title: string;
  placeholder: string;
  /** 键盘类型，链接类统一用 url */
  keyboardType?: "url" | "default";
  onSubmit: (value: string) => void;
  /** 面板关闭后回调（提交或手动关闭都会触发），用于把焦点交还编辑器 */
  onDismiss?: () => void;
}

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
  );
}

/**
 * 底部输入面板：插入链接 / 视频 / 内联帖子共用。
 * 用 BottomSheetTextInput 才能正确跟随键盘（普通 TextInput 在 sheet 里会被挡住）。
 */
const InputSheet = forwardRef<InputSheetRef, InputSheetProps>(
  function InputSheet(
    { title, placeholder, keyboardType = "url", onSubmit, onDismiss },
    ref,
  ) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const sheetRef = useRef<BottomSheetModal>(null);
    const [value, setValue] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        present: (initialValue = "") => {
          setValue(initialValue);
          sheetRef.current?.present();
        },
        dismiss: () => sheetRef.current?.dismiss(),
      }),
      [],
    );

    const canSubmit = value.trim().length > 0;

    const renderBackdrop = useCallback(
      (props: ComponentProps<typeof BottomSheetBackdrop>) => (
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

    const snapPoints = useMemo(() => ["32%"], []);

    const handleSubmit = useCallback(() => {
      const next = value.trim();
      if (!next) return;
      onSubmit(next);
      sheetRef.current?.dismiss();
    }, [onSubmit, value]);

    return (
      <BottomSheetModal
        ref={sheetRef}
        name={title}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        // 链接 / 视频 / 帖子三个 sheet 共用同一套挂载点，避免互相顶替
        stackBehavior="switch"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        onDismiss={() => {
          setValue("");
          onDismiss?.();
        }}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.titleRow}>
            <ThemedText fontWeight="600" size={16}>
              {title}
            </ThemedText>
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("cancel")}
              onPress={() => sheetRef.current?.dismiss()}
              style={styles.closeButton}
            >
              <HugeIcon
                icon={Cancel01Icon}
                size={18}
                color={theme.mutedForeground}
              />
            </Pressable>
          </View>

          <BottomSheetTextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={theme.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            style={[
              styles.input,
              { backgroundColor: theme.muted, color: theme.foreground },
            ]}
          />

          <View style={styles.footer}>
            <Button
              fullWidth
              label={t("confirm")}
              disabled={!canSubmit}
              onPress={handleSubmit}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default InputSheet;

const styles = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
  },
});
