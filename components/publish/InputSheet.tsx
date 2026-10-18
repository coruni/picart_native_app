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
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface InputSheetRef {
  present(initialValue?: string): void;
  dismiss(): void;
}

interface InputSheetProps {
  title: string;
  placeholder: string;
  /** 第二个输入框（链接的显示文本），不传就只有地址一个输入框 */
  textPlaceholder?: string;
  /** 键盘类型，链接类统一用 url */
  keyboardType?: "url" | "default";
  onSubmit: (value: string, text: string) => void;
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
    {
      title,
      placeholder,
      textPlaceholder,
      keyboardType = "url",
      onSubmit,
      onDismiss,
    },
    ref,
  ) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const sheetRef = useRef<BottomSheetModal>(null);
    const [value, setValue] = useState("");
    const [text, setText] = useState("");
    const insets = useSafeAreaInsets();
    // 和 TopicPickerSheet 保持一致：固定像素档位 + 内容 flex 撑满，
    // 键盘交给库自己顶起，不再手动算 bottomInset
    const { height: windowHeight } = useWindowDimensions();
    const snapPoints = useMemo(
      () => [Math.round(windowHeight * 0.3)],
      [windowHeight],
    );

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

    const handleSubmit = useCallback(() => {
      const next = value.trim();
      if (!next) return;
      onSubmit(next, text.trim());
      sheetRef.current?.dismiss();
    }, [onSubmit, text, value]);

    return (
      <BottomSheetModal
        ref={sheetRef}
        name={title}
        // 固定像素档位 + 内容 flex 撑满，和 TopicPickerSheet 同一套写法
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        // 链接 / 视频 / 帖子三个 sheet 共用同一套挂载点，避免互相顶替
        stackBehavior="switch"
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        onDismiss={() => {
          setValue("");
          setText("");
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
            returnKeyType={textPlaceholder ? "next" : "done"}
            onSubmitEditing={textPlaceholder ? undefined : handleSubmit}
            style={[
              styles.input,
              { backgroundColor: theme.muted, color: theme.foreground },
            ]}
          />

          {/* 链接的显示文本：留空就用地址本身当文字 */}
          {textPlaceholder ? (
            <BottomSheetTextInput
              value={text}
              onChangeText={setText}
              placeholder={textPlaceholder}
              placeholderTextColor={theme.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={[
                styles.input,
                styles.secondInput,
                { backgroundColor: theme.muted, color: theme.foreground },
              ]}
            />
          ) : null}

          <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
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
  secondInput: {
    marginTop: 10,
  },
  footer: {
    // 输入框下面留白，按钮靠 auto 外边距钉在面板底部
    marginTop: "auto",
    paddingTop: 16,
  },
});
