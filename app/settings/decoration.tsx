import { api } from "@/api";
import DecorationCard, {
  type DecorationCardItem,
} from "@/components/decoration/DecorationCard";
import { DecorationDetailSheet } from "@/components/decoration/DecorationDetailSheet";
import DecorationPreview from "@/components/decoration/DecorationPreview";
import VerticalTabs, {
  type VerticalTabItem,
} from "@/components/decoration/VerticalTabs";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import ThemedText from "@/components/ui/ThemedText";
import { toast } from "@/hooks/useToast";
import { useTheme } from "@/hooks/useTheme";
import {
  DECORATION_COLUMNS,
  DECORATION_TYPES,
  DECORATION_TYPE_IMAGES,
  normalizeDecorationType,
  normalizeRarity,
  type DecorationType,
} from "@/lib/decoration";
import { useAuthStore } from "@/store/authStore";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "expo-router";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LoadState = "loading" | "ready" | "error";

/**
 * 装扮页：左侧竖向分类栏 + 右侧网格。
 *
 * 列数按分类走 `DECORATION_COLUMNS`：头像框两列，评论气泡与成就徽章单列
 * （单列时卡片改为「预览在左、文案在右」的横向行）。
 *
 * 布局遵循项目规范（`docs/design/DESIGN_CONSTRAINTS.md`）：
 * - 侧栏与内容同走 card，只用一条 hairline 竖线分界（不额外造一层底色）
 * - 网格项无卡片底，靠间隙与 hairline 分隔（附录 A：不要用间隙堆卡片）
 * - 水平 gutter 16，垂直节奏为 4 的倍数，圆角只取 8/12/999
 *
 * 数据源用 `/decoration`（商品列表）而非 `/decoration/user/my`（仅已拥有）：
 * 前者一次请求就带 `isOwned` / `isUsing` / `canDirectEquip` 与气泡色。
 */
export default function DecorationSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const [state, setState] = useState<LoadState>("loading");
  const [items, setItems] = useState<DecorationCardItem[]>([]);
  const [activeType, setActiveType] = useState<DecorationType>("AVATAR_FRAME");
  const [selected, setSelected] = useState<DecorationCardItem | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const sheetRef = useRef<BottomSheetModal>(null);
  const avatarUri = user?.avatar;

  const tabs = useMemo<VerticalTabItem<DecorationType>[]>(
    () =>
      DECORATION_TYPES.map((type) => ({
        key: type,
        label: t(`decorationPage.tabs.${type}`),
        iconImage: DECORATION_TYPE_IMAGES[type].icon,
        iconActiveImage: DECORATION_TYPE_IMAGES[type].iconActive,
      })),
    [t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("decorationPage.title") });
  }, [navigation, t]);

  const load = useCallback(async () => {
    try {
      const response = await api.decorationControllerFindAll(
        undefined,
        undefined,
        undefined,
        1,
        100,
        "sort",
        "ASC",
      );
      const list = (response.data?.data?.data ?? []) as DecorationCardItem[];
      // 后端 sort 已定义展示顺序；同序时让「装备中」排最前
      const next = [...list].sort((a, b) => {
        const bySort = (a.sort ?? 0) - (b.sort ?? 0);
        if (bySort !== 0) return bySort;
        return Number(b.isUsing ?? false) - Number(a.isUsing ?? false);
      });
      setItems(next);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const visibleItems = useMemo(
    () => items.filter((item) => normalizeDecorationType(item.type) === activeType),
    [items, activeType],
  );

  const equipped = useMemo(
    () => visibleItems.find((item) => item.isUsing) ?? null,
    [visibleItems],
  );

  // 头像框两列，评论气泡与成就徽章单列
  const columns = DECORATION_COLUMNS[activeType];

  /** 装备 / 卸下成功后只改本地状态，不重新拉整表 */
  const patch = useCallback((type: DecorationType, decorationId: number | null) => {
    setItems((prev) =>
      prev.map((item) => {
        if (normalizeDecorationType(item.type) !== type) return item;
        if (decorationId === null) {
          return item.isUsing ? { ...item, isUsing: false } : item;
        }
        return { ...item, isUsing: item.id === decorationId };
      }),
    );
    setSelected((prev) =>
      prev && normalizeDecorationType(prev.type) === type
        ? { ...prev, isUsing: decorationId === prev.id }
        : prev,
    );
  }, []);

  const handleEquip = useCallback(
    async (item: DecorationCardItem) => {
      const type = normalizeDecorationType(item.type);
      if (!type || busyId !== null) return;
      setBusyId(item.id);
      try {
        await api.decorationControllerUseDecoration(String(item.id));
        patch(type, item.id);
        toast.show(t("decorationPage.equipSuccess"));
      } catch {
        toast.show(t("decorationPage.equipFailed"));
      } finally {
        setBusyId(null);
      }
    },
    [busyId, patch, t],
  );

  const handleUnequip = useCallback(
    async (item: DecorationCardItem) => {
      const type = normalizeDecorationType(item.type);
      if (!type || busyId !== null) return;
      setBusyId(item.id);
      try {
        await api.decorationControllerUnuseDecoration(String(item.id));
        patch(type, null);
        toast.show(t("decorationPage.unequipSuccess"));
      } catch {
        toast.show(t("decorationPage.unequipFailed"));
      } finally {
        setBusyId(null);
      }
    },
    [busyId, patch, t],
  );

  const handleCardPress = useCallback((item: DecorationCardItem) => {
    setSelected(item);
    sheetRef.current?.present();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <View style={styles.body}>
        <VerticalTabs items={tabs} value={activeType} onChange={setActiveType} />

        <View style={styles.content}>
          {/* 当前装备条，与下方网格之间用 hairline 分隔 */}
          <View style={[styles.equipped, { borderBottomColor: theme.border }]}>
            {equipped ? (
              <>
                <DecorationPreview
                  type={activeType}
                  imageUrl={equipped.imageUrl}
                  bubbleColor={equipped.bubbleColor}
                  avatarUri={avatarUri}
                  size={44}
                />
                <View style={styles.equippedInfo}>
                  <ThemedText size={12} color={theme.mutedForeground}>
                    {t("decorationPage.equippedLabel")}
                  </ThemedText>
                  <ThemedText
                    size={15}
                    fontWeight="600"
                    color={theme.foreground}
                    numberOfLines={1}
                  >
                    {equipped.name}
                  </ThemedText>
                  <ThemedText size={12} color={theme.mutedForeground}>
                    {t(`decorationPage.rarity.${normalizeRarity(equipped.rarity)}`)}
                  </ThemedText>
                </View>
                <Button
                  size="sm"
                  variant="ghost"
                  label={t("decorationPage.unequip")}
                  disabled={busyId !== null}
                  onPress={() => {
                    void handleUnequip(equipped);
                  }}
                />
              </>
            ) : (
              <ThemedText size={14} color={theme.mutedForeground}>
                {t("decorationPage.noneEquipped")}
              </ThemedText>
            )}
          </View>

          {state === "loading" ? (
            <Loading loading />
          ) : state === "error" ? (
            <View style={styles.stateBox}>
              <ThemedText size={14} color={theme.mutedForeground}>
                {t("decorationPage.loadFailed")}
              </ThemedText>
              <Button
                size="md"
                variant="ghost"
                label={t("decorationPage.retry")}
                onPress={() => {
                  setState("loading");
                  void load();
                }}
              />
            </View>
          ) : visibleItems.length === 0 ? (
            <View style={styles.stateBox}>
              <ThemedText size={14} color={theme.mutedForeground}>
                {t("decorationPage.empty")}
              </ThemedText>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={[
                styles.gridContent,
                { paddingBottom: Math.max(insets.bottom, 20) + 16 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.grid}>
                {visibleItems.map((item, index) => (
                  <DecorationCard
                    key={item.id}
                    item={item}
                    avatarUri={avatarUri}
                    busy={busyId === item.id}
                    columns={columns}
                    showRowSeparator={index >= columns}
                    showColumnSeparator={
                      columns > 1 && index % columns === columns - 1
                    }
                    onPress={handleCardPress}
                  />
                ))}
              </View>

              <ThemedText
                size={12}
                color={theme.mutedForeground}
                lineHeight={18}
                style={styles.footer}
              >
                {t("decorationPage.footer")}
              </ThemedText>
            </ScrollView>
          )}
        </View>
      </View>

      <DecorationDetailSheet
        ref={sheetRef}
        item={selected}
        avatarUri={avatarUri}
        busy={busyId !== null}
        onEquip={(item) => {
          void handleEquip(item);
        }}
        onUnequip={(item) => {
          void handleUnequip(item);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  equipped: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  equippedInfo: {
    flex: 1,
    gap: 2,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // 列间距 12，行间距 20
    columnGap: 12,
    rowGap: 20,
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  footer: {
    marginTop: 24,
  },
});