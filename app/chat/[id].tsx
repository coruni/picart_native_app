import { api, isAuthRedirectedError } from "@/api";
import type {
  MessageControllerGetPrivateConversation200ResponseDataDataInner,
  SendPrivateMessageDto,
  SendPrivateMessageDtoMessageKindEnum,
} from "@/api/generated";
import AsyncImage from "@/components/ui/AsyncImage";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  Image as ImageIcon,
  Paperclip,
  Send,
  Smile,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ScrollViewProps,
} from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type ChatMessage =
  MessageControllerGetPrivateConversation200ResponseDataDataInner;

const INPUT_MIN_HEIGHT = 40;
const PANEL_HEIGHT = 260;
const PANEL_ANIMATION_DURATION = 250;

function formatMessageTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) {
    return `昨天 ${date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  return `${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

const VirtualizedListScrollView = React.forwardRef<
  React.ElementRef<typeof KeyboardChatScrollView>,
  ScrollViewProps
>((props, ref) => {
  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      {...props}
    />
  );
});
VirtualizedListScrollView.displayName = "VirtualizedListScrollView";

function MessageBubble({
  message,
  isOwn,
  avatarUrl,
  theme,
  colors,
}: {
  message: ChatMessage;
  isOwn: boolean;
  avatarUrl?: string;
  theme: ReturnType<typeof useTheme>["theme"];
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const isRecalled = message.isRecalled;

  if (isRecalled) {
    return (
      <View style={styles.messageRow}>
        <ThemedText size={12} color={theme.mutedForeground} variant="muted">
          对方撤回了一条消息
        </ThemedText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.messageRow,
        isOwn ? styles.messageRowOwn : styles.messageRowOther,
      ]}
    >
      {!isOwn && (
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <AsyncImage
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              showLoading={false}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.secondaryBackground },
              ]}
            />
          )}
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isOwn
            ? { backgroundColor: colors.primary }
            : { backgroundColor: theme.card },
        ]}
      >
        <ThemedText
          size={15}
          color={isOwn ? "#ffffff" : theme.text}
          style={styles.bubbleText}
        >
          {message.content}
        </ThemedText>
      </View>
      <View style={styles.timeContainer}>
        <ThemedText size={11} color={theme.mutedForeground}>
          {formatMessageTime(message.createdAt ?? "")}
        </ThemedText>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { theme, colors } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [counterpart, setCounterpart] = useState<{
    id: number;
    nickname: string;
    avatar: string;
  } | null>(null);

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const mountedRef = useRef(true);
  const panelAnimHeight = useRef(new Animated.Value(0)).current;

  // 防止 fetchMessages 在请求进行中被重复触发（尤其是 loadMore 的滚动抖动）
  const isFetchingRef = useRef(false);
  // 标记是否已完成首次加载（仅首次加载后才允许触发 loadMore，避免初始 onScroll/onContentSizeChange 误触发）
  const hasInitiallyLoadedRef = useRef(false);

  const userId = String(id);

  useLayoutEffect(() => {
    navigation.setOptions({ title: counterpart?.nickname ?? "聊天" });
  }, [navigation, counterpart?.nickname]);

  const fetchMessages = useCallback(
    async (isRefresh = false, cursor?: string | null) => {
      if (!userId) return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const res = await api.messageControllerGetPrivateConversation(
          userId,
          cursor ?? undefined,
          50,
        );
        if (mountedRef.current) {
          const data = res.data?.data?.data ?? [];
          const meta = res.data?.data?.meta;
          const hasMoreData = meta?.hasMore ?? false;
          const nextCursorData = (meta?.nextCursor as string | null) ?? null;

          if (isRefresh) {
            setMessages(data);
          } else {
            setMessages((prev) => [...prev, ...data]);
          }

          setHasMore(hasMoreData);
          setNextCursor(nextCursorData);

          if (data.length > 0 && !counterpart) {
            const first = data[0];
            const isOwnMsg = first.senderId === user?.id;
            const cp = isOwnMsg ? first.receiver : first.sender;
            if (cp) {
              setCounterpart({
                id: cp.id,
                nickname: cp.nickname || cp.username || "用户",
                avatar: cp.avatar || "",
              });
            }
          }

          if (isRefresh) {
            const unreadIds = data
              .filter((m) => !m.isRead && m.senderId !== user?.id)
              .map((m) => String(m.id));
            if (unreadIds.length > 0) {
              await api.messageControllerMarkPrivateMessagesRead({
                messageIds: unreadIds,
              });
            }
            hasInitiallyLoadedRef.current = true;
          }
        }
      } catch (e) {
        if (isAuthRedirectedError(e)) return;
      } finally {
        isFetchingRef.current = false;
        if (mountedRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [userId, user?.id, counterpart],
  );

  useEffect(() => {
    mountedRef.current = true;
    hasInitiallyLoadedRef.current = false;
    void fetchMessages(true);
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !userId || sending) return;
    setSending(true);
    setInputText("");
    setShowPanel(false);
    try {
      const dto: SendPrivateMessageDto = {
        content: text,
        messageKind: "text" as SendPrivateMessageDtoMessageKindEnum,
      };
      await api.messageControllerSendPrivateMessage(userId, dto);
      const optimisticMsg: ChatMessage = {
        id: Date.now(),
        senderId: user?.id ?? 0,
        receiverId: Number(userId),
        content: text,
        messageKind: "text",
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: user?.id ?? 0,
          username: user?.username ?? "",
          nickname: user?.nickname ?? "",
          avatar: user?.avatar ?? "",
        } as ChatMessage["sender"],
        receiver: undefined,
      };
      setMessages((prev) => [optimisticMsg, ...prev]);
    } catch (e) {
      if (isAuthRedirectedError(e)) return;
      setInputText(text);
    } finally {
      setSending(false);
    }
  }, [inputText, userId, sending, user]);

  // FIX: extracted a pure "close panel" animation helper, reused by both
  // the input-focus handler and the list-touch handler below, instead of
  // duplicating the Animated.timing(...).start() logic in multiple places.
  const closePanel = useCallback(() => {
    if (!showPanel) return;
    Animated.timing(panelAnimHeight, {
      toValue: 0,
      duration: PANEL_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start(() => {
      if (mountedRef.current) setShowPanel(false);
    });
  }, [showPanel, panelAnimHeight]);

  // FIX: emoji button now toggles between "panel" and "keyboard" rather
  // than panel-vs-nothing. Previously, opening the panel called
  // Keyboard.dismiss() (correct, hides keyboard so panel is visible),
  // but closing the panel ALSO called Keyboard.dismiss() — so the second
  // tap closed the panel and left both panel and keyboard hidden, instead
  // of bringing the keyboard back up. Now closing re-focuses the
  // TextInput, which raises the keyboard, giving a proper toggle.
  const handleEmojiPress = useCallback(() => {
    if (showPanel) {
      // Switch from panel -> keyboard
      Animated.timing(panelAnimHeight, {
        toValue: 0,
        duration: PANEL_ANIMATION_DURATION,
        useNativeDriver: false,
      }).start(() => {
        if (mountedRef.current) {
          setShowPanel(false);
          inputRef.current?.focus();
        }
      });
    } else {
      // Switch from keyboard -> panel
      Keyboard.dismiss();
      setShowPanel(true);
      requestAnimationFrame(() => {
        Animated.timing(panelAnimHeight, {
          toValue: PANEL_HEIGHT,
          duration: PANEL_ANIMATION_DURATION,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [showPanel, panelAnimHeight]);

  // FIX: when the TextInput gains focus (e.g. user taps it directly, or
  // focus happens programmatically), make sure any open panel is closed
  // with the same animated close so it doesn't just vanish abruptly.
  const handleInputFocus = useCallback(() => {
    closePanel();
  }, [closePanel]);

  // FIX: new handler — when the user touches/scrolls the message list,
  // both the keyboard and the feature panel should dismiss. Previously
  // there was no interaction between scrolling the list and the input
  // area state at all, so the keyboard (and panel, if open) would stay
  // up and overlap the list while the user tried to scroll through history.
  const handleListTouchStart = useCallback(() => {
    Keyboard.dismiss();
    closePanel();
  }, [closePanel]);

  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => <VirtualizedListScrollView {...props} />,
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isOwn = item.senderId === user?.id;
      const avatarUrl = isOwn ? user?.avatar : counterpart?.avatar;
      return (
        <MessageBubble
          message={item}
          isOwn={isOwn}
          avatarUrl={avatarUrl}
          theme={theme}
          colors={colors}
        />
      );
    },
    [user, counterpart, theme, colors],
  );

  const keyExtractor = useCallback(
    (item: ChatMessage) => String(item.id ?? Math.random()),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasInitiallyLoadedRef.current) return;
    if (isFetchingRef.current || !hasMore || !nextCursor) return;
    void fetchMessages(false, nextCursor);
  }, [hasMore, nextCursor, fetchMessages]);

  const handleEndReached = useCallback(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["left", "right"]}
    >
      <KeyboardGestureArea
        interpolator="ios"
        style={styles.container}
        textInputNativeID="chat-input"
      >
        {/* Chat area */}
        <View style={styles.chatArea}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderScrollComponent={renderScrollComponent}
            inverted={true}
            contentContainerStyle={styles.listContent}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            keyboardDismissMode="on-drag"
            // FIX: onScrollBeginDrag fires as soon as the user starts
            // dragging the list — this is where we dismiss keyboard + panel,
            // rather than waiting for scroll to "settle" (onMomentumScrollEnd),
            // so the input area gets out of the way immediately.
            onScrollBeginDrag={handleListTouchStart}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loadMoreContainer}>
                  <ThemedText size={12} color={theme.mutedForeground}>
                    加载中...
                  </ThemedText>
                </View>
              ) : null
            }
            ListEmptyComponent={
              loading ? (
                <View style={styles.emptyContainer}>
                  <ThemedText size={14} color={theme.mutedForeground}>
                    加载中...
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <ThemedText size={14} color={theme.mutedForeground}>
                    暂无消息，开始聊天吧
                  </ThemedText>
                </View>
              )
            }
          />
        </View>

        <KeyboardStickyView
          offset={{ opened: insets.bottom-12, closed: 0 }}
          style={[
            styles.inputBar,
            { backgroundColor: theme.card, borderTopColor: theme.border },
          ]}
        >
          <View style={styles.inputRow}>
            <Pressable
              onPress={handleEmojiPress}
              hitSlop={8}
              style={styles.inputIconBtn}
            >
              <Smile
                size={24}
                color={showPanel ? colors.primary : theme.secondary}
              />
            </Pressable>
            <TextInput
              ref={inputRef}
              nativeID="chat-input"
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.secondaryBackground,
                  color: theme.text,
                },
              ]}
              placeholder={t("message.placeholder") || "输入消息..."}
              placeholderTextColor={theme.mutedForeground}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              // FIX: replaced the raw `setShowPanel(false)` with the animated
              // closePanel() helper so focusing the input (by tap, or by the
              // panel->keyboard toggle above) always collapses the panel
              // smoothly instead of just snapping it away.
              onFocus={handleInputFocus}
              onSubmitEditing={handleSend}
              submitBehavior="blurAndSubmit"
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || sending}
              hitSlop={8}
              style={[
                styles.sendBtn,
                inputText.trim()
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: theme.muted },
              ]}
            >
              <Send
                size={18}
                color={inputText.trim() ? "#ffffff" : theme.mutedForeground}
              />
            </Pressable>
          </View>
        </KeyboardStickyView>

        {/* Feature panel — outside KeyboardStickyView so it stays at the
            bottom of the screen and is NOT pushed up with the keyboard. */}
        <Animated.View
          style={[
            styles.featurePanel,
            { backgroundColor: theme.card },
            {
              height: panelAnimHeight,
              overflow: "hidden",
            },
          ]}
        >
          <View style={styles.panelGrid}>
            <Pressable style={styles.panelItem}>
              <View
                style={[
                  styles.panelIconWrap,
                  { backgroundColor: `${colors.primary}14` },
                ]}
              >
                <ImageIcon size={24} color={colors.primary} />
              </View>
              <ThemedText
                size={12}
                color={theme.secondary}
                style={styles.panelLabel}
              >
                图片
              </ThemedText>
            </Pressable>
            <Pressable style={styles.panelItem}>
              <View
                style={[
                  styles.panelIconWrap,
                  { backgroundColor: `${colors.primary}14` },
                ]}
              >
                <Paperclip size={24} color={colors.primary} />
              </View>
              <ThemedText
                size={12}
                color={theme.secondary}
                style={styles.panelLabel}
              >
                文件
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardGestureArea>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexGrow: 1,
  },
  loadMoreContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    maxWidth: "80%",
  },
  messageRowOwn: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  messageRowOther: {
    alignSelf: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "100%",
  },
  bubbleText: {
    flexShrink: 1,
  },
  timeContainer: {
    marginHorizontal: 6,
    alignSelf: "flex-end",
    marginBottom: 2,
  },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  featurePanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  panelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  panelItem: {
    width: 64,
    alignItems: "center",
    gap: 6,
  },
  panelIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  panelLabel: {
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  inputIconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textInput: {
    flex: 1,
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});