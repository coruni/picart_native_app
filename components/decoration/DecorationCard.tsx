import HugeIcon from "@/components/ui/HugeIcon";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import LockIcon from "@hugeicons/core-free-icons/LockIcon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { normalizeRarity } from "@/lib/decoration";
import DecorationPreview from "./DecorationPreview";

export interface DecorationCardItem {
  id: number;
  name: string;
  type: string;
  imageUrl?: string | null;
  bubbleColor?: string | null;
  rarity?: string | null;
  obtainMethod?: string | null;
  /** 后端定义的展示顺序 */
  sort?: number | null;
  isOwned?: boolean;
  isUsing?: boolean;
  /** 后端给出的「可直接装备」标记；未解锁为 false */
  canDirectEquip?: boolean;
  requiredLikes?: number | null;
  requiredComments?: number | null;
}

/**
 * 网格中的一项。
 *
 * 状态优先级：装备中 > 已拥有 > 未解锁。
 * **无卡片底**——网格铺在 card 上，靠 hairline 分隔（DESIGN_CONSTRAINTS 附录 A：
 * 不要用间隙堆卡片）。分隔线由页面按行列位置传入开关，绘制在间隙内、不占布局。
 * 选中态只给主色勾标，不给整块加描边。
 * 未解锁项仍可点开看条件，但预览降到 0.32 不透明度。
 *
 * 列数由页面按分类决定（`DECORATION_COLUMNS`）：两列时预览在上、文案在下；
 * 单列时改为「预览在左、文案在右」的横向行，避免一行里只有一小块图、右侧大片留白。
 */
function DecorationCard({
  item,
  avatarUri,
  busy,
  columns = 2,
  showRowSeparator,
  showColumnSeparator,
  onPress,
}: {
  item: DecorationCardItem;
  avatarUri?: string | null;
  busy?: boolean;
  /** 所在网格的列数，决定竖向堆叠还是横向排布 */
  columns?: 1 | 2;
  /** 是否是该网格的首行（需要一条横向 hairline） */
  showRowSeparator?: boolean;
  /** 是否是右列（需要一条纵向 hairline） */
  showColumnSeparator?: boolean;
  onPress: (item: DecorationCardItem) => void;
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const owned = item.isOwned ?? item.canDirectEquip ?? false;
  const using = item.isUsing ?? false;
  const locked = !owned;

  const statusText = using
    ? t("decorationPage.inUse")
    : locked
      ? t("decorationPage.lockedHint", {
          likes: item.requiredLikes ?? 0,
          comments: item.requiredComments ?? 0,
        })
      : t(`decorationPage.rarity.${normalizeRarity(item.rarity)}`);

  const row = columns === 1;

  return (
    <Pressable
      onPress={() => onPress(item)}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel={item.name}
      style={({ pressed }) => [
        styles.cell,
        row ? styles.cellRow : styles.cellColumn,
        pressed && styles.pressed,
        busy && styles.busy,
      ]}
    >
      {/* hairline 分隔：横向画进 rowGap、纵向画进 columnGap，不占布局、不影响对齐 */}
      {showRowSeparator ? (
        <View
          pointerEvents="none"
          style={[
            styles.rowSeparator,
            { backgroundColor: theme.border },
            showColumnSeparator && styles.segmentBleedLeft,
          ]}
        />
      ) : null}
      {showColumnSeparator ? (
        <View
          pointerEvents="none"
          style={[styles.columnSeparator, { backgroundColor: theme.border }]}
        />
      ) : null}

      <View style={[styles.previewBox, row && styles.previewBoxRow]}>
        <DecorationPreview
          type={item.type}
          imageUrl={item.imageUrl}
          bubbleColor={item.bubbleColor}
          avatarUri={avatarUri}
          size={row ? 56 : 64}
          dimmed={locked}
        />

        {using ? (
          <View style={[styles.check, { backgroundColor: theme.primary }]}>
            <HugeIcon icon={Tick02Icon} size={12} color="#ffffff" />
          </View>
        ) : locked ? (
          <View style={styles.lock}>
            <HugeIcon icon={LockIcon} size={12} color={theme.iconMuted} />
          </View>
        ) : null}
      </View>

      <View style={row ? styles.infoRow : styles.infoColumn}>
        <ThemedText
          size={13}
          fontWeight={using ? "600" : "400"}
          color={locked ? theme.mutedForeground : theme.foreground}
          numberOfLines={1}
        >
          {item.name}
        </ThemedText>

        <ThemedText
          size={12}
          color={using ? theme.primary : theme.mutedForeground}
          numberOfLines={1}
        >
          {statusText}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    minWidth: 0,
  },
  /** 两列：16 gutter + 12 列间距，各占 (100% - 16 - 12) / 2，预览在上文案在下 */
  cellColumn: {
    gap: 4,
  },
  /** 单列：预览在左、文案在右，占满整行 */
  cellRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowSeparator: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  /** 右列的横向分隔线向左延伸半个columnGap，与左列的分隔线接成一条 */
  segmentBleedLeft: {
    left: -6,
  },
  columnSeparator: {
    position: "absolute",
    left: -6,
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.6,
  },
  busy: {
    opacity: 0.4,
  },
  previewBox: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  previewBoxRow: {
    width: 64,
    height: 64,
    marginBottom: 0,
  },
  infoColumn: {
    gap: 4,
  },
  infoRow: {
    flex: 1,
    gap: 4,
  },
  check: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  lock: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(DecorationCard);