import type { MessageControllerSearch200ResponseDataDataInner } from "@/api/generated";
import {
  NOTIFICATION_KIND_META,
  resolveNotificationKind,
} from "@/components/message/notificationKind";
import ThemedText from "@/components/ui/ThemedText";
import HugeIcon, { ICON_STROKE_WIDTH } from "@/components/ui/HugeIcon";
import { useTheme } from "@/hooks/useTheme";
import { formatRelativeTime } from "@/lib/time";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

export type MessageItemData =
  MessageControllerSearch200ResponseDataDataInner;

export type MessageCategory = "notification" | "system";

// 通知/系统消息的 content 可能带有简单 HTML(与私信富文本一致),
// 列表行只展示纯文本预览:去标签 + 解码常见实体。
const RE_HAS_TAG = /<[^>]+>/;
const RE_BR = /<br\s*\/?>/gi;
const RE_TAGS = /<[^>]*>/g;

function toPlainText(value: string | undefined | null): string {
  const raw = value ?? "";
  if (!raw) return "";
  if (!RE_HAS_TAG.test(raw)) return raw;
  return raw
    .replace(RE_BR, " ")
    .replace(RE_TAGS, "")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

interface MessageItemRowProps {
  item: MessageItemData;
  category: MessageCategory;
  onPress: (item: MessageItemData) => void;
}

function MessageItemRow({ item, category, onPress }: MessageItemRowProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const isUnread = !item.isRead;
  const content = toPlainText(item.content);
  // 按通知类型换图标：点赞 / 评论 / 回复 / @ / 关注 / 系统各有一个语义色，
  // 认不出来的落到铃铛。系统消息默认喇叭，互动通知默认铃铛。
  const kind = resolveNotificationKind(
    item,
    category === "system" ? "system" : "default",
  );
  const kindMeta = NOTIFICATION_KIND_META[kind];

  const handlePress = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  return (
    <Pressable style={styles.row} onPress={handlePress}>
      <View style={styles.iconCard}>
        {/* 已读只淡化圆形底板，图标保持完整语义色，避免评论/点赞图标发灰看不清 */}
        <View
          style={[
            styles.iconCardBackground,
            {
              backgroundColor: kindMeta.tint,
              opacity: isUnread ? 1 : 0.6,
            },
          ]}
        />
        <HugeIcon icon={kindMeta.Icon} size={20} color={kindMeta.accent} strokeWidth={ICON_STROKE_WIDTH} />
        {isUnread ? (
          <View
            style={[
              styles.unreadDot,
              {
                backgroundColor: theme.primary,
                borderColor: theme.card,
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.header}>
          <ThemedText size={15} fontWeight="600" style={styles.title} numberOfLines={1}>
            {item.title || t("messagePage.notificationTitle")}
          </ThemedText>
          {item.createdAt ? (
            <ThemedText variant="caption" style={styles.time}>
              {formatRelativeTime(item.createdAt, t)}
            </ThemedText>
          ) : null}
        </View>
        {content ? (
          <ThemedText
            size={13}
            color={theme.secondary}
            numberOfLines={2}
            style={styles.content}
          >
            {content}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconCard: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconCardBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 22,
  },
  unreadDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  time: {
    flexShrink: 0,
  },
  content: {
    lineHeight: 18,
  },
});

export default memo(MessageItemRow);
