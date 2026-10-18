import type { DecorationCardItem } from "@/components/decoration/DecorationCard";
import DecorationPreview from "@/components/decoration/DecorationPreview";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { normalizeRarity, obtainMethodKey } from "@/lib/decoration";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

/**
 * 装饰品详情弹层。
 *
 * 按钮用项目 `<Button>` 而不是手写 `styles.action`（DESIGN_CONSTRAINTS 附录 A：
 * 按钮必须来自 Button）。装备中 → outline 卸下；已拥有 → primary 装备；
 * 未解锁 → 整块 secondary 禁用。
 *
 * 未解锁不给「去解锁」引导：解锁条件是累计点赞/评论数，没有可精准带用户过去的落点。
 */
export const DecorationDetailSheet = forwardRef<
  BottomSheetModal,
  {
    item: DecorationCardItem | null;
    avatarUri?: string | null;
    busy: boolean;
    onUnequip: (item: DecorationCardItem) => void;
    onEquip: (item: DecorationCardItem) => void;
  }
>(function DecorationDetailSheet({ item, avatarUri, busy, onUnequip, onEquip }, ref) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["48%"], []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
      />
    ),
    [],
  );

  const owned = item?.isOwned ?? item?.canDirectEquip ?? false;
  const using = item?.isUsing ?? false;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.iconMuted }}
      backgroundStyle={{ backgroundColor: theme.card }}
    >
      <BottomSheetView style={[styles.content, { paddingBottom: insets.bottom + 16 }]}>
        {item ? (
          <>
            <View style={styles.head}>
              <DecorationPreview
                type={item.type}
                imageUrl={item.imageUrl}
                bubbleColor={item.bubbleColor}
                avatarUri={avatarUri}
                size={88}
                dimmed={!owned}
              />
              <View style={styles.headInfo}>
                <ThemedText size={18} fontWeight="600" color={theme.foreground}>
                  {item.name}
                </ThemedText>
                <ThemedText size={13} color={theme.mutedForeground}>
                  {t(`decorationPage.rarity.${normalizeRarity(item.rarity)}`)}
                </ThemedText>
              </View>
            </View>

            {/* 信息行用 hairline 分隔，不给容器加描边 */}
            <View style={styles.rows}>
              <MetaRow
                label={t("decorationPage.obtainMethodLabel")}
                value={t(`decorationPage.obtain.${obtainMethodKey(item.obtainMethod)}`)}
              />
              {owned ? null : (
                <>
                  <MetaRow
                    label={t("decorationPage.requiredLikes")}
                    value={String(item.requiredLikes ?? 0)}
                  />
                  <MetaRow
                    label={t("decorationPage.requiredComments")}
                    value={String(item.requiredComments ?? 0)}
                    last
                  />
                </>
              )}
            </View>

            {owned ? (
              <View style={styles.action}>
                <Button
                  fullWidth
                  size="lg"
                  variant={using ? "outline" : "primary"}
                  label={using ? t("decorationPage.unequip") : t("decorationPage.equip")}
                  loading={busy}
                  onPress={() => {
                    if (using) onUnequip(item);
                    else onEquip(item);
                  }}
                />
              </View>
            ) : (
              <View style={styles.action}>
                <Button
                  fullWidth
                  size="lg"
                  variant="secondary"
                  label={t("decorationPage.locked")}
                  disabled
                />
              </View>
            )}
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

function MetaRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.metaRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <ThemedText size={15} color={theme.mutedForeground}>
        {label}
      </ThemedText>
      <ThemedText size={15} color={theme.foreground}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 20,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headInfo: {
    flex: 1,
    gap: 4,
  },
  rows: {
    gap: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  action: {
    marginTop: "auto",
  },
});