import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { ImageProps } from "expo-image";
import { Check } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type PickerOption = {
  value: string;
  label: string;
  /** 可选头像/图标，显示在选项左侧 */
  avatar?: ImageProps["source"];
};

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
  );
}

export interface OptionPickerSheetRef {
  present(): void;
  dismiss(): void;
}

interface OptionPickerSheetProps {
  title: string;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  /** 是否使用 ScrollView 包裹选项列表，默认 true。开启时使用固定 snapPoints 以提供滚动高度 */
  scrollable?: boolean;
  /** scrollable=true 时使用的 snapPoints，默认 ['50%'] */
  snapPoints?: string[];
}

const OptionPickerSheet = forwardRef<
  OptionPickerSheetRef,
  OptionPickerSheetProps
>(function OptionPickerSheet(
  { title, options, selectedValue, onSelect, scrollable = true, snapPoints = ['50%'] },
  ref,
) {
  const { theme, colors } = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

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

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      sheetRef.current?.dismiss();
    },
    [onSelect],
  );

  const renderOptions = useCallback(
    () =>
      options.map((item) => {
        const active = item.value === selectedValue;
        return (
          <Pressable
            key={item.value}
            style={({ pressed }) => [
              styles.option,
              { borderBottomColor: theme.border },
              pressed && { backgroundColor: theme.secondaryBackground },
            ]}
            onPress={() => handleSelect(item.value)}
          >
            {item.avatar != null && (
              <AsyncImage
                source={item.avatar}
                style={[
                  styles.optionAvatar,
                  { backgroundColor: theme.secondaryBackground },
                ]}
                transition={0}
                cachePolicy="memory-disk"
              />
            )}
            <ThemedText
              size={15}
              color={active ? colors.primary : theme.foreground}
              fontWeight={active ? "600" : "400"}
              style={styles.optionText}
            >
              {item.label}
            </ThemedText>
            {active ? (
              <Check size={18} color={colors.primary} strokeWidth={2.5} />
            ) : null}
          </Pressable>
        );
      }),
    [colors.primary, handleSelect, options, selectedValue, theme.border, theme.foreground, theme.secondaryBackground],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing={!scrollable}
      snapPoints={scrollable ? snapPoints : undefined}
      enablePanDownToClose
      handleComponent={SheetHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
    >
      <BottomSheetView style={styles.sheetContent}>
        <ThemedText fontWeight="600" size={15} style={styles.sheetTitle}>
          {title}
        </ThemedText>
        {scrollable ? (
          <BottomSheetScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {renderOptions()}
          </BottomSheetScrollView>
        ) : (
          <View style={styles.listContent}>{renderOptions()}</View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default OptionPickerSheet;

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
  sheetContent: {
    flex: 1,
    overflow: "hidden",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetTitle: { textAlign: "center", paddingVertical: 14 },
  scrollView: { flex: 1 },
  listContent: { paddingBottom: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  optionText: { flex: 1 },
});