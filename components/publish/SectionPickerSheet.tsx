import MenuPng from "@/assets/images/placeholder/menu.png";
import AsyncImage from "@/components/ui/AsyncImage";
import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useSheetBackHandler } from "@/hooks/useSheetBackHandler";
import { useTheme } from "@/hooks/useTheme";
import type { ParentCategory } from "@/store/categoryStore";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
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
} from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export interface SectionPickerSheetRef {
  present(): void;
  dismiss(): void;
}

interface SectionPickerSheetProps {
  /** 主板块（圈子），children 为子版块 */
  parents: ParentCategory[];
  selectedValue?: string | null;
  onSelect: (value: string) => void;
}

type SectionChild = ParentCategory["children"][number];

const HANDLE_HEIGHT = 28;
const SHEET_HEIGHT_RATIO = 0.6;

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={[styles.handleContainer, { backgroundColor: theme.card }]}>
      <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
    </View>
  );
}

const SectionPickerSheet = forwardRef<
  SectionPickerSheetRef,
  SectionPickerSheetProps
>(function SectionPickerSheet(
  { parents, selectedValue, onSelect },
  ref,
) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();
  const sheetRef = useRef<BottomSheetModal>(null);
  const sheetBack = useSheetBackHandler(sheetRef);
  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  // 固定默认高度（60% 屏高），切换主板块时面板高度保持恒定，左右两列各自在固定视口内滚动
  const sheetHeight = useMemo(
    () => Math.max(320, Math.round(windowHeight * SHEET_HEIGHT_RATIO)),
    [windowHeight],
  );
  const sheetContentHeight = Math.max(240, sheetHeight - HANDLE_HEIGHT);
  const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);

  useImperativeHandle(
    ref,
    () => ({
      present: () => {
        // 打开时定位到当前已选版区所属的主板块
        const owner = parents.find(
          (parent) =>
            String(parent.id) === selectedValue ||
            parent.children?.some(
              (child) => String(child.id) === selectedValue,
            ),
        );
        setActiveParentId(owner?.id ?? parents[0]?.id ?? null);
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }),
    [parents, selectedValue],
  );

  const handleBackdropPress = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="none"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />
      </BottomSheetBackdrop>
    ),
    [handleBackdropPress],
  );

  const activeParent =
    parents.find((parent) => parent.id === activeParentId) ?? parents[0];

  // 没有子版块的主板块，把自身作为唯一选项
  const sections: SectionChild[] = activeParent
    ? activeParent.children?.length
      ? activeParent.children
      : [activeParent]
    : [];

  const handleSelect = useCallback(
    (id: number) => {
      onSelect(String(id));
      sheetRef.current?.dismiss();
    },
    [onSelect],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      onAnimate={sheetBack.onAnimate}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      // 两个滚动区自己滚，纵向手势不交给面板，顶部把手负责下拉关闭
      enableContentPanningGesture={false}
      enableHandlePanningGesture
      enablePanDownToClose
      handleComponent={SheetHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
    >
      <BottomSheetView
        style={[
          styles.content,
          { height: sheetContentHeight, backgroundColor: theme.card },
        ]}
      >
        <View style={styles.titleRow}>
          <ThemedText fontWeight="600" size={18}>
            {t("publish.publishTo")}
          </ThemedText>
          <Pressable
            hitSlop={10}
            onPress={() => sheetRef.current?.dismiss()}
            style={styles.closeButton}
          >
            <HugeIcon
              icon={Cancel01Icon}
              size={20}
              color={theme.mutedForeground}
            />
          </Pressable>
        </View>

        <View style={styles.bodyRow}>
          <ScrollView
            style={styles.rail}
            contentContainerStyle={styles.railContent}
            showsVerticalScrollIndicator={false}
          >
            {parents.map((parent) => {
              const active = parent.id === activeParent?.id;

              return (
                <Pressable
                  key={parent.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setActiveParentId(parent.id)}
                  style={styles.railItem}
                >
                  <View
                    style={[
                      styles.railAvatarWrap,
                      { borderColor: active ? colors.primary : "transparent" },
                    ]}
                  >
                    <AsyncImage
                      source={
                        parent.avatar ? { uri: parent.avatar } : MenuPng
                      }
                      style={styles.railAvatar}
                      contentFit="cover"
                      showLoading={false}
                    />
                  </View>
                  {active ? (
                    <View
                      style={[
                        styles.railCaret,
                        { borderLeftColor: colors.primary },
                      ]}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            key={activeParent?.id ?? "empty"}
            style={styles.panel}
            contentContainerStyle={styles.panelContent}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText size={13} color={theme.mutedForeground}>
              {activeParent?.name}
            </ThemedText>

            {sections.map((section) => {
              const active = String(section.id) === selectedValue;
              const avatarUri = section.avatar || activeParent?.avatar;

              return (
                <Pressable
                  key={section.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => handleSelect(section.id)}
                  style={[
                    styles.sectionItem,
                    {
                      backgroundColor: active ? colors.primary : theme.muted,
                    },
                  ]}
                >
                  <AsyncImage
                    source={avatarUri ? { uri: avatarUri } : MenuPng}
                    style={styles.sectionAvatar}
                    contentFit="cover"
                    showLoading={false}
                  />
                  <View style={styles.sectionText}>
                    <ThemedText
                      size={16}
                      fontWeight="600"
                      color={active ? "#ffffff" : theme.foreground}
                      numberOfLines={2}
                    >
                      {section.name}
                    </ThemedText>
                    {section.description ? (
                      <ThemedText
                        size={12}
                        color={
                          active ? "rgba(255,255,255,0.78)" : theme.secondary
                        }
                        numberOfLines={2}
                      >
                        {section.description}
                      </ThemedText>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default SectionPickerSheet;

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
  handleContainer: {
    height: HANDLE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  titleRow: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  bodyRow: {
    flex: 1,
    flexShrink: 1,
    minHeight: 0,
    flexDirection: "row",
    gap: 12,
    paddingBottom: 12,
    overflow: "hidden",
  },
  rail: {
    width: 56,
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  railContent: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  railItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  railAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
  },
  railAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  railCaret: {
    position: "absolute",
    right: -8,
    top: 22,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 7,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  panel: {
    flex: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  panelContent: {
    flexGrow: 1,
    gap: 10,
    paddingBottom: 12,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
  },
  sectionAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  sectionText: {
    flex: 1,
    gap: 4,
  },
});
