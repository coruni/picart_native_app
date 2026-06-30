import { api, isAuthRedirectedError } from "@/api";
import type {
    MessageControllerGetPrivateConversations200ResponseDataDataInner,
    MessageControllerGetUnreadCount200ResponseData,
} from "@/api/generated";
import Avatar from "@/components/ui/Avatar";
import { NotificationsIcon, SystemIcon } from "@/components/ui/MessageIcons";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useFocusEffect, useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

type PrivateConversation =
  MessageControllerGetPrivateConversations200ResponseDataDataInner;

type MessageItem = {
  id: string;
  type: "notification" | "system" | "private";
  title: string;
  content: string;
  avatarUrl?: string;
  counterpartId?: number;
  isRead: boolean;
  unreadCount?: number;
  createdAt?: string;
};

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "";
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return new Date(then).toLocaleDateString("zh-CN");
}

export default function MessagesScreen() {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();

  const [activeTab, setActiveTab] = useState<"notification" | "system">(
    "notification",
  );
  const [conversations, setConversations] = useState<PrivateConversation[]>([]);
  const [unreadCount, setUnreadCount] =
    useState<MessageControllerGetUnreadCount200ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  const notificationUnread = unreadCount?.notification ?? 0;
  const systemUnread = unreadCount?.broadcast ?? 0;
  const privateUnread = unreadCount?.personal ?? 0;

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.messageControllerGetUnreadCount();
      if (mountedRef.current) {
        setUnreadCount(res.data?.data ?? null);
      }
    } catch (e) {
      if (isAuthRedirectedError(e)) return;
    }
  }, []);

  const fetchConversations = useCallback(
    async (isRefresh = false) => {
      if (!isLoggedIn) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      try {
        const res = await api.messageControllerGetPrivateConversations(
          undefined,
          50,
        );
        if (mountedRef.current) {
          setConversations(res.data?.data?.data ?? []);
        }
      } catch (e) {
        if (isAuthRedirectedError(e)) return;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isLoggedIn],
  );

  useFocusEffect(
    useCallback(() => {
      mountedRef.current = true;
      void fetchUnreadCount();
      void fetchConversations();
      return () => {
        mountedRef.current = false;
      };
    }, [fetchUnreadCount, fetchConversations]),
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setConversations([]);
      setUnreadCount(null);
    }
  }, [isLoggedIn]);

  const messageItems: MessageItem[] = conversations.map((c) => ({
    id: String(c.conversationId),
    type: "private",
    title: c.counterpart?.nickname || c.counterpart?.username || "私信",
    content: c.latestMessage?.content || "",
    avatarUrl: c.counterpart?.avatar,
    counterpartId: c.counterpart?.id,
    isRead: (c.unreadCount ?? 0) <= 0,
    unreadCount: c.unreadCount,
    createdAt: c.lastMessageAt,
  }));

  const handleTabPress = (tab: "notification" | "system") => {
    setActiveTab(tab);
  };

  const renderItem = useCallback(
    ({ item }: { item: MessageItem }) => (
      <Pressable
        style={[styles.messageRow]}
        onPress={() => {
          if (item.type === "private" && item.counterpartId) {
            router.push(`/chat/${item.counterpartId}`);
          }
        }}
      >
        <View style={styles.avatarWrap}>
          <Avatar size={40} uri={item.avatarUrl || ""} />
        </View>
        <View style={styles.messageBody}>
          <View style={styles.messageHeader}>
            <ThemedText size={15} fontWeight="600" style={styles.messageTitle}>
              {item.title}
            </ThemedText>
            {item.createdAt ? (
              <ThemedText variant="caption">
                {formatRelativeTime(item.createdAt)}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.messageFooter}>
            <ThemedText
              size={13}
              color={theme.secondary}
              numberOfLines={1}
              style={styles.messageContent}
            >
              {item.content || t("messagePage.noContent")}
            </ThemedText>
            {!item.isRead && (item.unreadCount ?? 0) > 0 ? (
              <View
                style={[
                  styles.unreadBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <ThemedText size={11} color="white" fontWeight="600">
                  {item.unreadCount}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    ),
    [theme, colors, t, router],
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.card }]}
        edges={["top", "left", "right"]}
      >
        <View style={styles.header}>
          <ThemedText size={20} fontWeight="700">
            {t("message")}
          </ThemedText>
        </View>
        <View style={styles.emptyContainer}>
          <ThemedText size={15} color={theme.secondary}>
            {t("auth.loginRequired")}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.card }]}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerCenter}>
          <ThemedText size={20} fontWeight="700">
            {t("message")}
          </ThemedText>
        </View>
        <View style={styles.headerSide}>
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/settings/notification")}
          >
            <Settings size={22} color={theme.secondary} />
          </Pressable>
        </View>
      </View>

      {/* Top icons: 通知 & 系统 */}
      <View style={styles.topIconsRow}>
        <View style={styles.topIconCardContainer}>
          <Pressable
            style={[styles.topIconCard, { backgroundColor: theme.card }]}
            onPress={() => handleTabPress("notification")}
          >
            <NotificationsIcon active />
          </Pressable>
          <ThemedText size={13} style={styles.topIconLabel} variant="caption">
            {t("messagePage.notifications")}
          </ThemedText>
        </View>

        <View style={styles.topIconCardContainer}>
          <Pressable
            style={[styles.topIconCard, { backgroundColor: theme.card }]}
            onPress={() => handleTabPress("system")}
          >
            <SystemIcon active />
          </Pressable>
          <ThemedText size={13} style={styles.topIconLabel} variant="caption">
            {t("messagePage.system")}
          </ThemedText>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Private message list */}
      {/* <View style={styles.listHeader}>
                <ThemedText size={14} fontWeight="600" color={theme.secondary}>
                    {t("message.privateMessages")}
                </ThemedText>
                {privateUnread > 0 && (
                    <View
                        style={[
                            styles.listUnreadBadge,
                            { backgroundColor: colors.primary },
                        ]}
                    >
                        <ThemedText size={11} color="white" fontWeight="600">
                            {privateUnread > 99 ? "99+" : privateUnread}
                        </ThemedText>
                    </View>
                )}
            </View> */}

      {loading && conversations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : messageItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText size={14} color={theme.muted}>
            {t("message.noMessages")}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={messageItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={() => {
            void fetchUnreadCount();
            void fetchConversations(true);
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerCenter: {
    alignItems: "center",
  },
  topIconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 48,
    paddingBottom: 12,
  },
  topIconCardContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  topIconCard: {
    borderRadius: 28,
    width: 56,
    height: 56,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  topIconBadge: {
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "white",
  },
  topIconLabel: {
    marginTop: 4,
  },
  topUnreadBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  listUnreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  messageBody: {
    flex: 1,
    minWidth: 0,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageTitle: {
    flex: 1,
    minWidth: 0,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    flexShrink: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
});
