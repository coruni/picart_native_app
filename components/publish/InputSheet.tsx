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
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type TextInput as RNTextInput,
} from "react-native";
import { useKeyboardState } from "react-native-keyboard-controller";
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

// 底部输入面板：插入链接 / 视频 / 内联帖子共用。
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
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const sheetRef = useRef<BottomSheetModal>(null);
    const inputRef = useRef<RNTextInput | null>(null);
    const focusTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const [value, setValue] = useState("");
    const [text, setText] = useState("");
    const insets = useSafeAreaInsets();

    // 键盘在点工具栏之前就已经被正文编辑器唤起了。
    const keyboardState = useKeyboardState((state) => ({
      height: state.height,
      isVisible: state.isVisible,
    }));
    // 取实时高度，面板跟着键盘一起升起（单向跟随，不是来回跳）
    const keyboardInset =
      keyboardState.isVisible && keyboardState.height > 0
        ? Math.round(keyboardState.height)
        : 0;

    const clearFocusTimers = useCallback(() => {
      focusTimersRef.current.forEach(clearTimeout);
      focusTimersRef.current = [];
    }, []);

    // sheet 展开后把焦点交给第一个输入框，键盘才会跟着弹出来。
    const requestKeyboardFocus = useCallback(() => {
      clearFocusTimers();
      focusTimersRef.current = [60, 180, 320].map((delay) =>
        setTimeout(() => inputRef.current?.focus(), delay),
      );
    }, [clearFocusTimers]);

    useEffect(() => clearFocusTimers, [clearFocusTimers]);

    // 面板按内容高度展开（和 share 面板一致），只有内容超高才滚动
    const { height: windowHeight } = useWindowDimensions();
    const maxSheetHeight = Math.min(Math.round(windowHeight * 0.9), 560);

    useImperativeHandle(
      ref,
      () => ({
        present: (initialValue = "") => {
          setValue(initialValue);
          sheetRef.current?.present();
          requestKeyboardFocus();
        },
        dismiss: () => sheetRef.current?.dismiss(),
      }),
      [requestKeyboardFocus],
    );

    const canSubmit = value.trim().length > 0;

    // 面板是否展开（含展开/收起动画过程）。
    const [isOpen, setIsOpen] = useState(false);

    // 面板展开期间接管 Android 物理返回键 / 返回手势：先收起面板，而不是让导航栈直接把发布页弹掉（用户编辑内容会被丢弃）。
    useEffect(() => {
      if (!isOpen) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        sheetRef.current?.dismiss();
        return true;
      });
      return () => sub.remove();
    }, [isOpen]);

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
        // 高度跟着内容走；键盘避让仍交给下面的 bottomInset
        enableDynamicSizing
        maxDynamicContentSize={maxSheetHeight}
        // 链接 / 视频 / 帖子三个 sheet 共用同一套挂载点，避免互相顶替
        stackBehavior="switch"
        // 避让交给 bottomInset：把 sheet 容器底部整块抬到键盘上沿。
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        bottomInset={keyboardInset}
        // sheet 真正展开到档位后再补一次聚焦，兜住 present() 当帧焦点被抢的情况
        onChange={(index) => {
          if (index >= 0) requestKeyboardFocus();
        }}
        onAnimate={(_from, toIndex) => {
          setIsOpen(toIndex >= 0);
        }}
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        onDismiss={() => {
          setIsOpen(false);
          clearFocusTimers();
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
            ref={(instance) => {
              inputRef.current = instance ?? null;
            }}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={theme.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            returnKeyType={textPlaceholder ? "next" : "done"}
            onSubmitEditing={textPlaceholder ? undefined : handleSubmit}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
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
              cursorColor={colors.primary}
              selectionColor={colors.primary}
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
    paddingTop: 16,
  },
});
