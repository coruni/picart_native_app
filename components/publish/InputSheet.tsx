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
    const { theme, colors } = useTheme();
    const { t } = useTranslation();
    const sheetRef = useRef<BottomSheetModal>(null);
    const inputRef = useRef<RNTextInput | null>(null);
    const focusTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const [value, setValue] = useState("");
    const [text, setText] = useState("");
    const insets = useSafeAreaInsets();

    /**
     * 键盘在点工具栏之前就已经被正文编辑器唤起了。gorhom 的键盘避让只监听
     * keyboardDidShow/DidHide，sheet 挂载得晚，收不到那次 SHOWN —— 于是它
     * 认为键盘高度为 0，整个面板直接弹在键盘底下。Android 更糟：
     * adjustResize + interactive 组合下库会主动放弃位移，只等 window 缩小，
     * 而 KeyboardProvider 接管 insets 后并不保证 window 真的会缩小。
     *
     * 改用 keyboard-controller 的全局状态：Provider 从 app 根节点就一直在
     * 记录键盘高度，不受 sheet 挂载时机影响。把这段高度作为 bottomInset
     * 交给 BottomSheetModal，容器底部整体抬到键盘上沿。
     */
    const keyboardState = useKeyboardState((state) => ({
      height: state.height,
      isVisible: state.isVisible,
    }));
    // 取实时高度，面板跟着键盘一起升起（单向跟随，不是来回跳）；
    // 键盘在 sheet 打开之后才弹起的场景也能同样覆盖。
    const keyboardInset =
      keyboardState.isVisible && keyboardState.height > 0
        ? Math.round(keyboardState.height)
        : 0;

    const clearFocusTimers = useCallback(() => {
      focusTimersRef.current.forEach(clearTimeout);
      focusTimersRef.current = [];
    }, []);

    /**
     * sheet 展开后把焦点交给第一个输入框，键盘才会跟着弹出来。
     * 弹出动画、键盘从正文编辑器切换过来这几帧里焦点容易被抢回去，
     * 所以短间隔重试几次；对已聚焦的输入框再 focus() 是 no-op，
     * 不会让键盘反复弹。
     */
    const requestKeyboardFocus = useCallback(() => {
      clearFocusTimers();
      focusTimersRef.current = [60, 180, 320].map((delay) =>
        setTimeout(() => inputRef.current?.focus(), delay),
      );
    }, [clearFocusTimers]);

    useEffect(() => clearFocusTimers, [clearFocusTimers]);

    // 和 TopicPickerSheet 保持一致：固定像素档位 + 内容 flex 撑满；
    // 键盘避让走上面的 keyboardInset，不再靠改档位高度。
    const { height: windowHeight } = useWindowDimensions();
    // 键盘弹出时 Android 会压缩 window.height，按它算档位会把面板压到
    // 放不下输入框；给个下限，避让交给 bottomInset，别再靠改高度。
    const snapPoints = useMemo(
      () => [Math.max(Math.round(windowHeight * 0.3), 240)],
      [windowHeight],
    );

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
        // 避让交给 bottomInset：把 sheet 容器底部整块抬到键盘上沿。
        // 不再让库自己按键盘事件二次位移（interactive 在 iOS 会和我们叠加），
        // extend 在单档位下等价于「位置不变」，正好让 gorhom 别插手。
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        bottomInset={keyboardInset}
        // sheet 真正展开到档位后再补一次聚焦，兜住 present() 当帧焦点被抢的情况
        onChange={(index) => {
          if (index >= 0) requestKeyboardFocus();
        }}
        handleComponent={SheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        onDismiss={() => {
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
