import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView
} from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type PickerOption = {
  /** 选项值，作为 key 与回传值 */
  value: string;
  label: string;
};

export interface OptionPickerSheetRef {
  present(): void;
  dismiss(): void;
}

interface OptionPickerSheetProps {
  title: string;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

/**
 * 通用单选 BottomSheet：标题 + 选项列表（选中项打勾）。
 * 供搜索页的排序、分类筛选复用。
 */
const OptionPickerSheet = forwardRef<
  OptionPickerSheetRef,
  OptionPickerSheetProps
>(function OptionPickerSheet({ title, options, selectedValue, onSelect }, ref) {
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

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      enablePanDownToClose
      handleComponent={null}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
    >
      <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
      <ThemedText fontWeight="600" size={15} style={styles.sheetTitle}>
        {title}
      </ThemedText>
      <BottomSheetScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {options.map((item) => {
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
        })}
      </BottomSheetScrollView>
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
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetTitle: { textAlign: "center", paddingVertical: 14 },
  listContent: { paddingBottom: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { flex: 1 },
});
