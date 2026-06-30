import { api } from "@/api";
import type { MessageControllerGetPrivateConversation200ResponseDataDataInner } from "@/api/generated";
import AsyncImage from "@/components/ui/AsyncImage";
import { MenuView } from "@expo/ui/community/menu";

import ChatImageViewer, {
  ChatImageViewerItem,
} from "@/components/ui/ChatImageViewer";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { messageSocketClient } from "@/lib/message-socket";
import { useAuthStore } from "@/store/authStore";
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
  FlatList,
  Image,
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
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatMessage =
  MessageControllerGetPrivateConversation200ResponseDataDataInner;

type PrivateMessagePayload = {
  urls?: string[];
  imageUrl?: string;
  url?: string;
};

const INPUT_MIN_HEIGHT = 40;
const PANEL_HEIGHT = 260;

function resolveMessageImageUrls(payload?: PrivateMessagePayload): string[] {
  if (Array.isArray(payload?.urls)) {
    return payload.urls.filter(
      (url): url is string => typeof url === "string" && Boolean(url.trim()),
    );
  }

  if (payload) {
    if (typeof payload.imageUrl === "string" && payload.imageUrl.trim()) {
      return [payload.imageUrl];
    }
    if (typeof payload.url === "string" && payload.url.trim()) {
      return [payload.url];
    }
  }

  return [];
}

// FIX: dismiss-after-send is a single toggle, easy to later wire to a
// real user setting instead of being hardcoded inline in handleSend.
const DISMISS_KEYBOARD_ON_SEND = true;

// NOTE on why we reverted away from KeyboardExtender:
// KeyboardExtender's `enabled` prop only attaches/detaches custom content
// to an ALREADY-OPEN keyboard frame — per the official docs, "If it's true,
// the component attaches to the keyboard. If it's false, it detaches."
// It assumes the keyboard itself is the thing being shown/hidden; it does
// not know how to present content when no keyboard is up at all (e.g. the
// user already dismissed the keyboard, then taps the emoji button to open
// the panel on its own). In that situation KeyboardExtender keeps rendering
// because it's mounted independently of `showPanel`'s intended on/off
// semantics, which is the "stays visible all the time" bug reported.
// KeyboardStickyView + an explicitly driven Reanimated height value is the
// correct tool here, since the panel needs to be open/closed independent
// of whether a system keyboard is present at all.

// FIX: use Reanimated (native-driven) instead of the old RN `Animated`
// (JS-driven, useNativeDriver:false) for the panel height. The previous
// jank/jump came from running the panel's height animation on the JS
// thread while the keyboard's own show/hide animation is native-driven —
// the two run at different effective frame rates under any JS thread load,
// so they visibly diverge mid-transition. Reanimated's shared values run
// on the UI thread same as the native keyboard animation, so the two stay
// in lockstep instead of fighting each other.
const PANEL_TIMING = {
  duration: 250,
  easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
};

function formatMessageTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Within 1 minute: just now
  if (diffMins < 1) {
    return "刚刚";
  }
  // Within 1 hour: X minutes ago
  if (diffMins < 60) {
    return `${diffMins}分钟前`;
  }
  // Within today: HH:mm
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // Yesterday
  if (diffDays < 2) {
    return `昨天`;
  }
  // Within this year: MM/DD
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
  // Other year: YYYY/MM/DD
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

// Day label for group divider
function getDayLabel(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const dateStrKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  if (dateStrKey === todayStr) {
    return "今天";
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  if (dateStrKey === yesterdayStr) {
    return "昨天";
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays < 7 && date.getDay() > 0) {
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekdays[date.getDay()];
  }

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// Grouped message item - either a day divider or a message
type GroupedMessageItem =
  | { type: "divider"; label: string; key: string }
  | { type: "message"; data: ChatMessage };

function groupMessagesByDay(messages: ChatMessage[]): GroupedMessageItem[] {
  // Messages from API are newest-first, reverse for chronological grouping
  const reversed = [...messages].reverse();

  const result: GroupedMessageItem[] = [];
  let lastDayKey = "";

  for (const msg of reversed) {
    const date = new Date(msg.createdAt ?? "");
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (dayKey !== lastDayKey) {
      lastDayKey = dayKey;
      result.push({
        type: "divider",
        label: getDayLabel(msg.createdAt ?? ""),
        key: `divider-${dayKey}`,
      });
    }
    result.push({ type: "message", data: msg });
  }

  // Reverse back so newest is at index 0 (bottom when inverted)
  return result.reverse();
}

// Day divider component
function DayDivider({ label }: { label: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.dayDividerContainer}>
      <View
        style={[styles.dayDividerLine, { backgroundColor: theme.border }]}
      />
      <View
        style={[
          styles.dayDividerBadge,
          { backgroundColor: theme.secondaryBackground },
        ]}
      >
        <ThemedText size={12} color={theme.mutedForeground}>
          {label}
        </ThemedText>
      </View>
      <View
        style={[styles.dayDividerLine, { backgroundColor: theme.border }]}
      />
    </View>
  );
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

// Image item component with aspect ratio support
function MessageImageItem({
  url,
  index,
  isSingle,
  messageId,
  onImagePress,
}: {
  url: string;
  index: number;
  isSingle: boolean;
  messageId: number;
  onImagePress?: (urls: string[], index: number) => void;
}) {
  const [aspectRatio, setAspectRatio] = React.useState<number | null>(null);

  const handleLoad = React.useCallback(() => {
    Image.getSize(
      url,
      (width, height) => {
        setAspectRatio(width / height);
      },
      () => {
        // fallback to 1:1 if size detection fails
        setAspectRatio(1);
      },
    );
  }, [url]);

  React.useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  const containerStyle = isSingle
    ? styles.imageItemSingle
    : styles.imageItemMultiple;

  const imageStyle = React.useMemo(() => {
    if (!aspectRatio || !isSingle) {
      return isSingle ? styles.messageImageSingle : styles.messageImageMultiple;
    }
    // For single images, use aspect ratio with max constraints
    const maxWidth = 240;
    const maxHeight = 320;
    let displayWidth = maxWidth;
    let displayHeight = displayWidth / aspectRatio;

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * aspectRatio;
    }

    return {
      width: displayWidth,
      height: displayHeight,
      borderRadius: 12,
    };
  }, [aspectRatio, isSingle]);

  return (
    <Pressable
      key={`${messageId}-${url}-${index}`}
      onPress={() => onImagePress?.([url], 0)}
      style={containerStyle}
    >
      <AsyncImage
        source={{ uri: url }}
        style={imageStyle}
        showLoading={false}
      />
    </Pressable>
  );
}

function MessageBubble({
  message,
  isOwn,
  avatarUrl,
  theme,
  colors,
  onImagePress,
  onRecall,
}: {
  message: ChatMessage;
  isOwn: boolean;
  avatarUrl?: string;
  theme: ReturnType<typeof useTheme>["theme"];
  colors: ReturnType<typeof useTheme>["colors"];
  onImagePress?: (urls: string[], index: number) => void;
  onRecall?: (messageId: number) => void;
}) {
  const isRecalled = message.isRecalled;
  const imageUrls = resolveMessageImageUrls(
    message.payload as PrivateMessagePayload | undefined,
  );
  const hasText = Boolean(message.content?.trim());

  // Build menu actions
  const menuActions: {
    id: string;
    title: string;
    attributes?: { destructive: boolean };
  }[] = [];
  if (isOwn && !isRecalled) {
    menuActions.push({
      id: "recall",
      title: "撤回",
      attributes: { destructive: true },
    });
  }

  const handleMenuAction = (event: { nativeEvent: { event: string } }) => {
    if (event.nativeEvent.event === "recall" && message.id) {
      onRecall?.(message.id);
    }
  };

  if (isRecalled) {
    return (
      <View style={[styles.messageRow, styles.messageRowRecalled]}>
        <ThemedText size={12} color={theme.mutedForeground} variant="muted">
          {isOwn ? "你撤回了一条消息" : "对方撤回了一条消息"}
        </ThemedText>
      </View>
    );
  }

  const bubbleContent = (
    <>
      {imageUrls.length > 0 && (
        <View
          style={[
            styles.imageGrid,
            imageUrls.length === 1
              ? styles.imageGridSingle
              : styles.imageGridMultiple,
          ]}
        >
          {imageUrls.map((url, index) => (
            <MessageImageItem
              key={`${message.id}-${url}-${index}`}
              url={url}
              index={index}
              isSingle={imageUrls.length === 1}
              messageId={message.id!}
              onImagePress={onImagePress}
            />
          ))}
        </View>
      )}
      {hasText && (
        <ThemedText
          size={15}
          color={isOwn ? "#ffffff" : theme.text}
          style={styles.bubbleText}
        >
          {message.content}
        </ThemedText>
      )}
    </>
  );

  return (
    <View
      style={[
        styles.messageRow,
        isOwn ? styles.messageRowOwn : styles.messageRowOther,
      ]}
    >
      {isOwn ? null : (
        <View style={[styles.avatarContainer, styles.avatarContainerLeft]}>
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
      {menuActions.length > 0 ? (
        <MenuView
          actions={menuActions}
          onPressAction={handleMenuAction}
          shouldOpenOnLongPress
        >
          <View
            style={[
              styles.bubble,
              isOwn
                ? { backgroundColor: colors.primary }
                : { backgroundColor: theme.card },
            ]}
          >
            {bubbleContent}
          </View>
        </MenuView>
      ) : (
        <View
          style={[
            styles.bubble,
            isOwn
              ? { backgroundColor: colors.primary }
              : { backgroundColor: theme.card },
          ]}
        >
          {bubbleContent}
        </View>
      )}
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { theme, colors } = useTheme();
  const user = useAuthStore((state) => state.profile ?? state.user);
  const { t } = useTranslation();

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

  // Image viewer state
  const [viewerImages, setViewerImages] = useState<ChatImageViewerItem[]>([]);

  // Message toolbar state - removed, now using native context menu

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const mountedRef = useRef(true);

  // FIX: Reanimated shared value (UI-thread driven) replaces the old
  // RN Animated.Value (JS-thread driven) for panel height.
  const panelHeight = useSharedValue(0);
  const panelAnimatedStyle = useAnimatedStyle(() => ({
    height: panelHeight.value,
  }));

  const isFetchingRef = useRef(false);
  const hasInitiallyLoadedRef = useRef(false);

  const userId = typeof id === "string" && id && id !== "undefined" ? id : "";

  useLayoutEffect(() => {
    navigation.setOptions({ title: counterpart?.nickname ?? "聊天" });
  }, [navigation, counterpart?.nickname]);

  const fetchMessages = useCallback(
    async (isRefresh = false, cursor?: string | null) => {
      if (!userId) return;
      if (isFetchingRef.current) return;
      const safeCursor =
        typeof cursor === "string" && cursor.trim() ? cursor : undefined;
      isFetchingRef.current = true;

      if (isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const res = await api.messageControllerGetPrivateConversation(
          userId,
          safeCursor,
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
              await Promise.allSettled(
                unreadIds.map((mid) => api.messageControllerMarkAsRead(mid)),
              );
            }
            hasInitiallyLoadedRef.current = true;
          }
        }
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        console.error("Failed to fetch messages:", {
          status,
          body,
          userId,
          cursor: safeCursor,
        });
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

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!userId) return;
    hasInitiallyLoadedRef.current = false;
    void fetchMessages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Socket event listeners - only register once on mount
  useEffect(() => {
    mountedRef.current = true;

    // Handler for incoming private messages
    const handlePrivateMessage = (payload: {
      id?: number;
      senderId?: number | null;
      receiverId?: number | null;
      content?: string;
      messageKind?: string;
      payload?: Record<string, unknown> | null;
      createdAt?: string;
      isRead?: boolean;
      isRecalled?: boolean;
      recalledAt?: string;
      recallReason?: string;
      sender?: {
        id?: number;
        username?: string;
        nickname?: string;
        avatar?: string;
      };
      receiver?: {
        id?: number;
        username?: string;
        nickname?: string;
        avatar?: string;
      };
    }) => {
      if (!payload.id) return;

      const senderId = Number(payload.senderId || 0);
      const receiverId = Number(payload.receiverId || 0);
      const counterpartId = Number(id || 0);
      const viewerId = Number(user?.id || 0);

      // Only handle messages for this conversation
      const matched =
        (senderId === counterpartId && receiverId === viewerId) ||
        (senderId === viewerId && receiverId === counterpartId);

      if (!matched) return;

      const newMessage: ChatMessage = {
        id: payload.id,
        senderId: payload.senderId ?? 0,
        receiverId: payload.receiverId ?? 0,
        content: payload.content,
        messageKind: payload.messageKind,
        payload: payload.payload as PrivateMessagePayload | undefined,
        createdAt: payload.createdAt,
        isRead: payload.isRead,
        isRecalled: payload.isRecalled,
        recalledAt: payload.recalledAt,
        recallReason: payload.recallReason,
        sender: payload.sender as ChatMessage["sender"],
        receiver: payload.receiver as ChatMessage["receiver"],
      };

      setMessages((prev) => {
        // Check if message already exists by ID
        const existsById = prev.some((m) => m.id === newMessage.id);
        if (existsById) {
          return prev.map((m) =>
            m.id === newMessage.id ? { ...m, ...newMessage } : m,
          );
        }

        // Check if this is our own pending message (by content + sender)
        // Pending messages have negative IDs, server messages have positive IDs
        const viewerIdMsg = Number(user?.id || 0);
        const pendingIndex = prev.findIndex(
          (m) =>
            m.id < 0 &&
            m.senderId === viewerIdMsg &&
            m.content === newMessage.content &&
            m.receiverId === newMessage.receiverId,
        );

        if (pendingIndex >= 0) {
          // Replace pending message with confirmed server message
          const updated = [...prev];
          updated[pendingIndex] = newMessage;
          return updated;
        }

        // Add new message
        return [newMessage, ...prev];
      });
    };

    // Handler for message recall via websocket
    const handlePrivateMessageRecalled = (payload: {
      id?: number;
      recalledAt?: string;
      recallReason?: string;
      isRecalled?: boolean;
    }) => {
      if (!payload.id) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === payload.id
            ? {
                ...msg,
                isRecalled: true,
                recalledAt: payload.recalledAt ?? msg.recalledAt,
                recallReason: payload.recallReason ?? msg.recallReason,
              }
            : msg,
        ),
      );
    };

    messageSocketClient.on("privateMessage", handlePrivateMessage);
    messageSocketClient.on(
      "privateMessageRecalled",
      handlePrivateMessageRecalled,
    );

    return () => {
      mountedRef.current = false;
      messageSocketClient.off("privateMessage", handlePrivateMessage);
      messageSocketClient.off(
        "privateMessageRecalled",
        handlePrivateMessageRecalled,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !userId || sending) return;
    setSending(true);
    setInputText("");
    setShowPanel(false);
    panelHeight.value = withTiming(0, PANEL_TIMING);

    if (DISMISS_KEYBOARD_ON_SEND) {
      Keyboard.dismiss();
    }

    // Create optimistic message
    const nowIso = new Date().toISOString();
    const pendingId = -Date.now();
    const optimisticMsg: ChatMessage = {
      id: pendingId,
      senderId: user?.id ?? 0,
      receiverId: Number(userId),
      content: text,
      messageKind: "text",
      isRead: true,
      createdAt: nowIso,
      sender: {
        id: user?.id ?? 0,
        username: user?.username ?? "",
        nickname: user?.nickname ?? "",
        avatar: user?.avatar ?? "",
      } as ChatMessage["sender"],
      receiver: undefined,
    };

    // Add optimistic message immediately
    setMessages((prev) => [optimisticMsg, ...prev]);

    // Send via WebSocket (only if connected)
    const socket = messageSocketClient.instance;
    if (socket?.connected) {
      socket.emit("sendMessage", {
        toUserId: Number(userId),
        type: "private",
        messageKind: "text",
        content: text,
      });
    } else {
      // Socket not connected - message won't be received, could show error
      console.warn("MessageSocket: not connected, message not sent");
    }

    setSending(false);
  }, [inputText, userId, sending, user, panelHeight]);

  // FIX: panel toggle — both directions are explicit and symmetric.
  // Opening: dismiss the keyboard, THEN grow the panel (sequenced so the
  // keyboard's own closing animation finishes its handoff before the panel
  // claims that space — this is the actual point of divergence that caused
  // jank, since both transitions touch the same screen region).
  // Closing: shrink the panel, THEN focus the input to raise the keyboard.
  const handleEmojiPress = useCallback(() => {
    if (showPanel) {
      panelHeight.value = withTiming(0, PANEL_TIMING, (finished) => {
        if (finished) {
          // worklet callback — hop back to JS thread for React state/refs
        }
      });
      setShowPanel(false);
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setShowPanel(true);
      panelHeight.value = withTiming(PANEL_HEIGHT, PANEL_TIMING);
    }
  }, [showPanel, panelHeight]);

  const handleInputFocus = useCallback(() => {
    if (showPanel) {
      setShowPanel(false);
      panelHeight.value = withTiming(0, PANEL_TIMING);
    }
  }, [showPanel, panelHeight]);

  const handleListTouchStart = useCallback(() => {
    if (showPanel) {
      setShowPanel(false);
      panelHeight.value = withTiming(0, PANEL_TIMING);
    }
    Keyboard.dismiss();
  }, [showPanel, panelHeight]);

  const handleImagePress = useCallback((urls: string[], index: number) => {
    const items: ChatImageViewerItem[] = urls.map((url) => ({
      previewUrl: url,
      viewerUrl: url,
      originalUrl: url,
    }));
    setViewerImages(items);
    // Delay slightly to ensure ChatImageViewer re-renders with new images
    setTimeout(() => {
      imageViewerOpenRef.current?.(index);
    }, 0);
  }, []);

  const handleRecallMessage = useCallback((messageId: number) => {
    // Use websocket to recall message (fire and forget, like web version)
    const socket = messageSocketClient.instance;
    if (socket?.connected) {
      socket.emit("recallPrivateMessage", {
        messageId,
        reason: "发错了",
      });
    }

    // Update local state to mark message as recalled (optimistic update)
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isRecalled: true } : msg,
      ),
    );
  }, []);

  const imageViewerOpenRef = useRef<(index?: number) => void | null>(null);

  // Grouped messages for display
  const groupedMessages = React.useMemo(
    () => groupMessagesByDay(messages),
    [messages],
  );

  const renderItem = useCallback(
    ({ item }: { item: GroupedMessageItem }) => {
      if (item.type === "divider") {
        return <DayDivider label={item.label} />;
      }
      const msg = item.data;
      const isOwn = msg.senderId === user?.id;
      const avatarUrl = isOwn ? user?.avatar : counterpart?.avatar;
      return (
        <MessageBubble
          message={msg}
          isOwn={isOwn}
          avatarUrl={avatarUrl}
          theme={theme}
          colors={colors}
          onImagePress={handleImagePress}
          onRecall={handleRecallMessage}
        />
      );
    },
    [user, counterpart, theme, colors, handleImagePress, handleRecallMessage],
  );

  const keyExtractor = useCallback(
    (item: GroupedMessageItem) =>
      item.type === "divider"
        ? item.key
        : String(item.data.id ?? Math.random()),
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
    <>
      <ChatImageViewer images={viewerImages}>
        {({ open }) => {
          // Store open function in ref for external access
          imageViewerOpenRef.current = open;
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
                    data={groupedMessages}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    // renderScrollComponent={renderScrollComponent}
                    inverted={true}
                    contentContainerStyle={styles.listContent}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.3}
                    keyboardDismissMode="on-drag"
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

                {/* Input bar — sticks to top edge of keyboard when keyboard is open,
                  stays at the bottom safe area otherwise. */}
                <KeyboardStickyView
                  offset={{ opened: 12, closed: 0 }}
                  style={[
                    styles.inputBar,
                    {
                      backgroundColor: theme.card,
                      borderTopColor: theme.border,
                    },
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
                        color={
                          inputText.trim() ? "#ffffff" : theme.mutedForeground
                        }
                      />
                    </Pressable>
                  </View>
                </KeyboardStickyView>

                {/* Feature panel — outside KeyboardStickyView so it stays pinned to
                  the bottom of the screen and is not lifted along with the
                  keyboard. Height is driven by a Reanimated shared value so its
                  animation runs on the UI thread, same as the keyboard's own
                  native show/hide animation, instead of racing it on the JS
                  thread (which was the source of the visible jump/jitter). */}
                <Animated.View
                  style={[
                    styles.featurePanel,
                    { backgroundColor: theme.card },
                    panelAnimatedStyle,
                    { overflow: "hidden" },
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
        }}
      </ChatImageViewer>
    </>
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
  // Day divider styles
  dayDividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dayDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dayDividerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  messageRowOwn: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  messageRowRecalled: {
    justifyContent: "center",
  },
  messageRowPressed: {
    opacity: 0.7,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatarContainerLeft: {
    marginRight: 8,
  },
  avatarContainerRight: {
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bubbleContentWrapper: {
    alignItems: "flex-end",
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
  // Image grid styles
  imageGrid: {
    marginBottom: 4,
  },
  imageGridSingle: {},
  imageGridMultiple: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  imageItem: {
    overflow: "hidden",
    borderRadius: 12,
  },
  imageItemSingle: {
    // container for single image - dimensions set dynamically via aspect ratio
  },
  imageItemMultiple: {
    width: 110,
    height: 110,
  },
  messageImageSingle: {
    width: 240,
    height: 320,
    borderRadius: 12,
  },
  messageImageMultiple: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
});
