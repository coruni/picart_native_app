import { api } from "@/api";
import type { TagControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import Button from "@/components/ui/Button";
import HugeIcon, { TOPIC_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import HashtagIcon from "@hugeicons/core-free-icons/HashtagIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type PublishTopic = TagControllerFindAll200ResponseDataDataInner;

export interface TopicPickerSheetRef {
  present(): void;
  dismiss(): void;
}

interface TopicPickerSheetProps {
  selectedTopics: PublishTopic[];
  onConfirm: (topics: PublishTopic[]) => void;
}

function SheetHandle() {
  const { theme } = useTheme();
  return (
    <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
  );
}

const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 50;
/** 面板最高占屏幕高度的比例，超出后列表内部滚动 */
const MAX_SHEET_HEIGHT_RATIO = 0.5;

const TopicPickerSheet = forwardRef<
  TopicPickerSheetRef,
  TopicPickerSheetProps
>(function TopicPickerSheet({ selectedTopics, onConfirm }, ref) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const maxSheetHeight = Math.round(windowHeight * MAX_SHEET_HEIGHT_RATIO);
  const sheetRef = useRef<BottomSheetModal>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublishTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftTopics, setDraftTopics] = useState<PublishTopic[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      present: () => {
        setDraftTopics(selectedTopics);
        setQuery("");
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }),
    [selectedTopics],
  );

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(
      () => {
        setLoading(true);
        api
          .tagControllerFindAll(
            1,
            PAGE_SIZE,
            query.trim() || undefined,
            "hot",
            "DESC",
          )
          .then((res) => {
            if (!cancelled) setResults(res.data?.data?.data ?? []);
          })
          .catch(() => {
            if (!cancelled) setResults([]);
          })
          .finally(() => {
            if (!cancelled) setLoading(false);
          });
      },
      query.trim() ? SEARCH_DEBOUNCE_MS : 0,
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

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

  // 用 ItemSeparator 代替每行的 borderBottom：最后一行不会多出一条悬空的分隔线
  const renderSeparator = useCallback(
    () => (
      <View style={[styles.separator, { backgroundColor: theme.border }]} />
    ),
    [theme.border],
  );

  const toggleTopic = useCallback((topic: PublishTopic) => {
    setDraftTopics((prev) =>
      prev.some((item) => item.id === topic.id)
        ? prev.filter((item) => item.id !== topic.id)
        : [...prev, topic],
    );
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(draftTopics);
    sheetRef.current?.dismiss();
  }, [draftTopics, onConfirm]);

  const handleRemove = useCallback((topic: PublishTopic) => {
    setDraftTopics((prev) => prev.filter((item) => item.id !== topic.id));
  }, []);

  const listHeader = (
    <View>
      <View style={styles.titleRow}>
        <ThemedText fontWeight="600" size={16}>
          {t("publish.topicSheetTitle")}
        </ThemedText>
        <Pressable
          hitSlop={10}
          onPress={() => sheetRef.current?.dismiss()}
          style={styles.closeButton}
        >
          <HugeIcon icon={Cancel01Icon} size={18} color={theme.mutedForeground} />
        </Pressable>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.muted }]}>
        <HugeIcon
          icon={Search01Icon}
          size={16}
          color={theme.mutedForeground}
        />
        <BottomSheetTextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("publish.topicSearchPlaceholder")}
          placeholderTextColor={theme.mutedForeground}
          style={[styles.searchInput, { color: theme.foreground }]}
          returnKeyType="search"
        />
      </View>

      {draftTopics.length > 0 && (
        <View style={styles.selectedRow}>
          {draftTopics.map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() => handleRemove(topic)}
              style={[
                styles.selectedChip,
                { backgroundColor: theme.primary + "1A" },
              ]}
            >
              <ThemedText
                size={12}
                color={theme.primary}
                numberOfLines={1}
                style={styles.selectedChipText}
              >
                #{topic.name}
              </ThemedText>
              <HugeIcon icon={Cancel01Icon} size={12} color={theme.primary} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  const listFooter = (
    <View
      style={[
        styles.footer,
        {
          borderTopColor: theme.border,
          backgroundColor: theme.card,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      <Button fullWidth label={t("publish.done")} onPress={handleConfirm} />
    </View>
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      // 固定到最大高度，列表用 flex 铺满；动态高度量不出列表高度会塌掉
      snapPoints={[maxSheetHeight]}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleComponent={SheetHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
    >
      <BottomSheetFlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ListEmptyComponent={
          <View style={styles.stateWrap}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <ThemedText size={13} color={theme.secondary}>
                {t("noContent")}
              </ThemedText>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const active = draftTopics.some((topic) => topic.id === item.id);

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => toggleTopic(item)}
              style={styles.row}
            >
              <View style={[styles.topicIcon, { backgroundColor: theme.muted }]}>
                <HugeIcon
                  icon={HashtagIcon}
                  size={16}
                  color={theme.primary}
                  strokeWidth={TOPIC_STROKE_WIDTH}
                />
              </View>
              <View style={styles.rowBody}>
                <ThemedText
                  size={15}
                  color={active ? theme.primary : theme.foreground}
                  fontWeight={active ? "600" : "400"}
                  numberOfLines={1}
                >
                  {item.name}
                </ThemedText>
                <ThemedText size={12} color={theme.secondary}>
                  {t("publish.topicArticleCount", {
                    count: item.articleCount ?? 0,
                  })}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.check,
                  active
                    ? { backgroundColor: theme.primary }
                    : { borderColor: theme.border, borderWidth: 1 },
                ]}
              >
                {active ? (
                  <HugeIcon icon={Tick02Icon} size={14} color="#ffffff" />
                ) : null}
              </View>
            </Pressable>
          );
        }}
      />
    </BottomSheetModal>
  );
});

export default TopicPickerSheet;

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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
  },
  selectedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 10,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "100%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  selectedChipText: {
    flexShrink: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  /** 列表铺满 sheet 剩余高度 */
  list: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  topicIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  stateWrap: {
    paddingVertical: 36,
    alignItems: "center",
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
