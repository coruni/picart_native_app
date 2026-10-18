import { api } from "@/api";
import type { TagControllerFindAll200ResponseDataDataInner } from "@/api/generated";
import Button from "@/components/ui/Button";
import HugeIcon, { TOPIC_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { toast } from "@/hooks/useToast";
import { useTheme } from "@/hooks/useTheme";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
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
} from "react-native";

export type PublishTopic = TagControllerFindAll200ResponseDataDataInner;

export interface TopicPickerSheetRef {
  present(): void;
  dismiss(): void;
}

interface TopicPickerSheetProps {
  selectedTopics: PublishTopic[];
  maxSelected?: number;
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

const TopicPickerSheet = forwardRef<
  TopicPickerSheetRef,
  TopicPickerSheetProps
>(function TopicPickerSheet(
  { selectedTopics, maxSelected = 5, onConfirm },
  ref,
) {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
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

  const toggleTopic = useCallback(
    (topic: PublishTopic) => {
      if (draftTopics.some((item) => item.id === topic.id)) {
        setDraftTopics((prev) =>
          prev.filter((item) => item.id !== topic.id),
        );
        return;
      }

      if (draftTopics.length >= maxSelected) {
        toast.show(t("publish.topicLimit", { count: maxSelected }));
        return;
      }

      setDraftTopics((prev) => [...prev, topic]);
    },
    [draftTopics, maxSelected, t],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(draftTopics);
    sheetRef.current?.dismiss();
  }, [draftTopics, onConfirm]);

  const handleRemove = useCallback((topic: PublishTopic) => {
    setDraftTopics((prev) => prev.filter((item) => item.id !== topic.id));
  }, []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["75%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleComponent={SheetHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
    >
      <BottomSheetView style={styles.content}>
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

        <View
          style={[styles.searchBox, { backgroundColor: theme.muted }]}
        >
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
                <HugeIcon
                  icon={Cancel01Icon}
                  size={12}
                  color={theme.primary}
                />
              </Pressable>
            ))}
          </View>
        )}

        {loading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <BottomSheetFlatList
            data={results}
            style={styles.list}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.stateWrap}>
                <ThemedText size={13} color={theme.secondary}>
                  {t("noContent")}
                </ThemedText>
              </View>
            }
            renderItem={({ item }) => {
              const active = draftTopics.some((topic) => topic.id === item.id);

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => toggleTopic(item)}
                  style={[
                    styles.row,
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <View
                    style={[
                      styles.topicIcon,
                      { backgroundColor: theme.muted },
                    ]}
                  >
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
        )}

        <View
          style={[
            styles.footer,
            { borderTopColor: theme.border, backgroundColor: theme.card },
          ]}
        >
          <Button
            fullWidth
            label={`${t("publish.done")} (${draftTopics.length}/${maxSelected})`}
            onPress={handleConfirm}
          />
        </View>
      </BottomSheetView>
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
