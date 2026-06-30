import { api } from "@/api";
import type {
  BatchReadPrivateMessagesDto,
  MessageControllerGetPrivateConversation200ResponseDataDataInner,
} from "@/api/generated";
import AsyncImage from "@/components/ui/AsyncImage";
import { MenuView } from "@expo/ui/community/menu";

import ChatImageViewer, {
  ChatImageViewerItem,
} from "@/components/ui/ChatImageViewer";
import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  loadCachedMessagesSync,
  markCachedMessageRecalled,
  upsertCachedMessages,
} from "@/lib/chat-cache";
import {
  getCachedKeyboardHeight,
  loadPersistedKeyboardHeight,
  persistKeyboardHeight,
} from "@/lib/keyboard-height";
import { messageSocketClient } from "@/lib/message-socket";
import { formatDateYMD, formatTimeHM, toDate } from "@/lib/time";
import { useAuthStore } from "@/store/authStore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import type { TFunction } from "i18next";
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
  type LayoutChangeEvent,
  type ScrollViewProps,
} from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardGestureArea,
  KeyboardStickyView,
  useKeyboardHandler,
  useKeyboardState,
  useReanimatedKeyboardAnimation,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type ChatMessage =
  MessageControllerGetPrivateConversation200ResponseDataDataInner;

type PrivateMessagePayload = {
  urls?: string[];
  imageUrl?: string;
  url?: string;
};

const INPUT_MIN_HEIGHT = 40;

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

function getMessagePayloadUrls(payload?: PrivateMessagePayload): string[] {
  if (Array.isArray(payload?.urls)) {
    return payload.urls.filter(
      (url): url is string => typeof url === "string" && Boolean(url.trim()),
    );
  }

  if (typeof payload?.url === "string" && payload.url.trim()) {
    return [payload.url];
  }

  if (typeof payload?.imageUrl === "string" && payload.imageUrl.trim()) {
    return [payload.imageUrl];
  }

  return [];
}

function matchesPendingMessage(
  pending: ChatMessage,
  incoming: ChatMessage,
): boolean {
  if ((pending.id ?? 0) >= 0) {
    return false;
  }

  if (
    Number(pending.senderId || 0) !== Number(incoming.senderId || 0) ||
    pending.messageKind !== incoming.messageKind ||
    (pending.content || "") !== (incoming.content || "")
  ) {
    return false;
  }

  const pendingUrls = getMessagePayloadUrls(
    (pending.payload as PrivateMessagePayload) || undefined,
  );
  const incomingUrls = getMessagePayloadUrls(
    (incoming.payload as PrivateMessagePayload) || undefined,
  );

  if (pendingUrls.length !== incomingUrls.length) {
    return false;
  }

  return pendingUrls.every((url, index) => url === incomingUrls[index]);
}

// FIX: dismiss-after-send is a single toggle, easy to later wire to a
// real user setting instead of being hardcoded inline in handleSend.
const DISMISS_KEYBOARD_ON_SEND = true;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMessageTime(
  dateStr: string,
  t: TFunction,
  locale?: string,
): string {
  const date = toDate(dateStr);
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return t("justNow");
  }

  if (diffMins < 60) {
    return t("minutesAgo", { count: diffMins });
  }

  if (isSameDay(date, now)) {
    return formatTimeHM(date, locale);
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return t("chat.yesterday");
  }

  if (date.getFullYear() === now.getFullYear()) {
    return t("chat.monthDay", {
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  }

  return formatDateYMD(date).replace(/-/g, "/");
}

// Day label for group divider
function getDayLabel(dateStr: string, t: TFunction): string {
  const date = toDate(dateStr);
  if (!date) return "";

  const now = new Date();

  if (isSameDay(date, now)) {
    return t("chat.today");
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return t("chat.yesterday");
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays < 7) {
    const weekdayKeys = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return t(`chat.${weekdayKeys[date.getDay()]}`);
  }

  return t("chat.monthDay", {
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

// Grouped message item - either a day divider or a message
type GroupedMessageItem =
  | { type: "divider"; label: string; key: string }
  | { type: "message"; data: ChatMessage };

function groupMessagesByDay(
  messages: ChatMessage[],
  t: TFunction,
): GroupedMessageItem[] {
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
        label: getDayLabel(msg.createdAt ?? "", t),
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
  ScrollViewProps & KeyboardChatScrollViewProps
>(({ inverted, freeze, extraContentPadding, offset, ...props }, ref) => {
  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      inverted={inverted}
      freeze={freeze}
      extraContentPadding={extraContentPadding}
      offset={offset}
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
  const { t } = useTranslation();
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
      title: t("chat.recall"),
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
          {isOwn ? t("chat.recalledBySelf") : t("chat.recalledByOther")}
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
  const {
    id,
    nickname: nicknameParam,
    username: usernameParam,
    avatar: avatarParam,
  } = useLocalSearchParams<{
    id: string;
    nickname?: string;
    username?: string;
    avatar?: string;
  }>();
  const navigation = useNavigation();
  const { theme, colors } = useTheme();
  const user = useAuthStore((state) => state.profile ?? state.user);
  const { t } = useTranslation();

  // Seed messages from SQLite synchronously so the chat is non-empty on first
  // paint. Network fetch still runs after mount and replaces with fresh data.
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const viewerId = Number(useAuthStore.getState().user?.id ?? 0);
    const counterpartId = Number(id);
    if (!viewerId || !counterpartId) return [];
    return loadCachedMessagesSync(viewerId, counterpartId);
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  // Seed counterpart from nav params so the header title and the other-side
  // avatar are stable from first render, instead of flashing in once messages
  // arrive. fetchMessages's `!counterpart` guard then skips overwriting this,
  // keeping the avatar reference identity-stable across re-renders so that
  // MessageBubble doesn't re-render on every new incoming message.
  const [counterpart, setCounterpart] = useState<{
    id: number;
    nickname: string;
    avatar: string;
  } | null>(() => {
    const numericId = Number(id);
    if (!numericId) return null;
    const displayName = nicknameParam || usernameParam || "";
    if (!displayName && !avatarParam) return null;
    return {
      id: numericId,
      nickname: displayName,
      avatar: avatarParam || "",
    };
  });

  // Image viewer state
  const [viewerImages, setViewerImages] = useState<ChatImageViewerItem[]>([]);

  // Message toolbar state - removed, now using native context menu

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const mountedRef = useRef(true);

  const { bottom: safeBottom } = useSafeAreaInsets();

  // Pad the chat list bottom when the multiline TextInput grows above its base
  // height — without this, newly sent messages slide under the input bar as it
  // expands. Animated on the UI thread so it co-animates with the keyboard.
  const extraContentPadding = useSharedValue(0);

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      extraContentPadding.value = withTiming(
        Math.max(e.nativeEvent.layout.height - INPUT_MIN_HEIGHT, 0),
        { duration: 200 },
      );
    },
    [extraContentPadding],
  );

  // Track the real system keyboard height so the feature panel can match it
  // exactly — a hard-coded panel height was the source of the visual jump
  // when toggling keyboard <-> panel. The cached/persisted value lives in
  // lib/keyboard-height so the panel renders at the correct size on first
  // open (before the keyboard has ever appeared) and is shared with the
  // comment composer.
  const liveKeyboardHeight = useKeyboardState((s) => s.height) ?? 0;
  const [knownKeyboardHeight, setKnownKeyboardHeight] = useState(
    getCachedKeyboardHeight,
  );
  useEffect(() => {
    let cancelled = false;
    void loadPersistedKeyboardHeight().then((value) => {
      if (!cancelled) setKnownKeyboardHeight(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (liveKeyboardHeight > 0 && liveKeyboardHeight !== knownKeyboardHeight) {
      setKnownKeyboardHeight(liveKeyboardHeight);
      void persistKeyboardHeight(liveKeyboardHeight);
    }
  }, [liveKeyboardHeight, knownKeyboardHeight]);

  // FIX: drive the panel's height from the reanimated keyboard height instead
  // of toggling it between 0 and panelHeight in React state. Without this, the
  // keyboard → panel transition jumps:
  //   1. setShowPanel(true) instantly raises the input bar's natural layout
  //      position by panelHeight (panel takes that bottom space immediately).
  //   2. KeyboardStickyView is still translated up by |kbHeight|, since the
  //      keyboard is only just beginning its native dismiss animation.
  //   3. Net visible position ≈ baseY - 2*kbHeight for one frame, then
  //      falls back to baseY - kbHeight as the keyboard finishes — that's
  //      the "TextInput 从上方落下来".
  // Driving panel_height = max(0, panelTarget - |kbHeight|) makes the panel
  // emerge as the keyboard descends, keeping the input bar's visual y constant.
  const { height: kbAnim } = useReanimatedKeyboardAnimation();
  const panelTargetSV = useSharedValue(0);
  const showPanelSV = useSharedValue(false);
  useEffect(() => {
    panelTargetSV.value = showPanel ? knownKeyboardHeight : 0;
    showPanelSV.value = showPanel;
  }, [showPanel, knownKeyboardHeight, panelTargetSV, showPanelSV]);

  const panelAnimatedStyle = useAnimatedStyle(() => {
    const absKb = Math.abs(kbAnim.value);
    return {
      height: Math.max(0, panelTargetSV.value - absKb),
    };
  });

  // Defer closing the panel until the keyboard has fully risen. With the
  // panel-height formula above, this keeps max(panel, |kb|) constant for
  // the panel → keyboard direction as well.
  useKeyboardHandler(
    {
      onEnd: (e) => {
        "worklet";
        if (e.height > 0 && showPanelSV.value) {
          runOnJS(setShowPanel)(false);
        }
      },
    },
    [],
  );

  const isFetchingRef = useRef(false);
  const hasInitiallyLoadedRef = useRef(false);

  const userId = typeof id === "string" && id && id !== "undefined" ? id : "";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: counterpart?.nickname || t("chat.title"),
    });
  }, [navigation, counterpart?.nickname, t]);

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

          const viewerId = Number(user?.id ?? 0);
          const counterpartIdNum = Number(userId);
          if (viewerId && counterpartIdNum && data.length > 0) {
            void upsertCachedMessages(viewerId, counterpartIdNum, data);
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
                nickname: cp.nickname || cp.username || t("chat.user"),
                avatar: cp.avatar || "",
              });
            }
          }

          if (isRefresh) {
            const unreadIds = data
              .filter(
                (item) =>
                  item.receiverId != null &&
                  user?.id != null &&
                  Number(item.receiverId) === Number(user.id) &&
                  !item.isRead,
              )
              .map((item) => String(item.id));

            if (unreadIds.length > 0) {
              const socket = messageSocketClient.instance;
              if (socket?.connected) {
                socket.emit("readPrivateMessages", {
                  messageIds: unreadIds,
                });
              } else {
                try {
                  await api.messageControllerMarkPrivateMessagesRead({
                    messageIds: unreadIds,
                  } as BatchReadPrivateMessagesDto);
                } catch (markErr: any) {
                  console.warn("markPrivateMessagesRead failed:", {
                    status: markErr?.response?.status,
                    body: markErr?.response?.data,
                  });
                }
              }
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
        const existsById = prev.some(
          (m) => m.id != null && m.id === newMessage.id,
        );
        if (existsById) {
          return prev.map((m) =>
            m.id != null && m.id === newMessage.id
              ? { ...m, ...newMessage }
              : m,
          );
        }

        // Check if this is our own pending message (by content + sender + payload)
        // Pending messages have negative IDs, server messages have positive IDs
        const pendingCandidates = prev
          .map((m, index) => ({ message: m, index }))
          .filter(
            ({ message }) =>
              message.id != null &&
              message.id < 0 &&
              Number(message.senderId || 0) === Number(user?.id || 0) &&
              matchesPendingMessage(message, newMessage),
          )
          .sort((a, b) => {
            const aTime = new Date(a.message.createdAt ?? "").getTime();
            const bTime = new Date(b.message.createdAt ?? "").getTime();
            return bTime - aTime;
          });
        const pendingIndex = pendingCandidates[0]?.index ?? -1;

        if (pendingIndex >= 0) {
          // Replace pending message with confirmed server message
          const updated = [...prev];
          updated[pendingIndex] = newMessage;
          return updated;
        }

        // Add new message
        return [newMessage, ...prev];
      });

      if (viewerId && counterpartId) {
        void upsertCachedMessages(viewerId, counterpartId, [newMessage]);
      }
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

      const viewerId = Number(user?.id || 0);
      if (viewerId && payload.id) {
        void markCachedMessageRecalled(
          viewerId,
          payload.id,
          payload.recalledAt,
          payload.recallReason,
        );
      }
    };

    const handleConnected = () => {
      if (hasInitiallyLoadedRef.current && !isFetchingRef.current) {
        void fetchMessages(true);
      }
    };

    messageSocketClient.on("privateMessage", handlePrivateMessage);
    messageSocketClient.on(
      "privateMessageRecalled",
      handlePrivateMessageRecalled,
    );
    messageSocketClient.on("connected", handleConnected);

    return () => {
      mountedRef.current = false;
      messageSocketClient.off("privateMessage", handlePrivateMessage);
      messageSocketClient.off(
        "privateMessageRecalled",
        handlePrivateMessageRecalled,
      );
      messageSocketClient.off("connected", handleConnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id, fetchMessages]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !userId || sending) return;
    setSending(true);
    setInputText("");
    setShowPanel(false);

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
      receiver: undefined as unknown as ChatMessage["receiver"],
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
  }, [inputText, userId, sending, user]);

  // Panel ↔ keyboard transitions: the panel's height tracks the keyboard via
  // the formula in panelAnimatedStyle. The keyboard's native animation IS
  // the transition; React-state changes here only set the "target" the
  // formula resolves to.
  const handleEmojiPress = useCallback(() => {
    if (showPanel) {
      // Closing panel → keyboard: focus the input. The keyboard's onEnd
      // worklet sets showPanel=false once it's fully up — keeping the panel
      // visible behind/under the rising keyboard so the input bar doesn't
      // drop down mid-transition.
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setShowPanel(true);
    }
  }, [showPanel]);

  const handleListTouchStart = useCallback(() => {
    if (showPanel) {
      setShowPanel(false);
    }
    Keyboard.dismiss();
  }, [showPanel]);

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

  const handleRecallMessage = useCallback(
    (messageId: number) => {
      // Use websocket to recall message (fire and forget, like web version)
      const socket = messageSocketClient.instance;
      if (socket?.connected) {
        socket.emit("recallPrivateMessage", {
          messageId,
          reason: t("chat.recallReason"),
        });
      }

      // Update local state to mark message as recalled (optimistic update)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRecalled: true } : msg,
        ),
      );

      const viewerId = Number(user?.id || 0);
      if (viewerId && messageId > 0) {
        void markCachedMessageRecalled(viewerId, messageId);
      }
    },
    [t, user?.id],
  );

  const imageViewerOpenRef = useRef<(index?: number) => void | null>(null);

  // Route the FlatList's underlying ScrollView through KeyboardChatScrollView
  // so the chat list itself avoids the keyboard (content shifts up by the
  // keyboard height instead of disappearing behind it). `inverted` MUST be
  // forwarded — the FlatList is inverted, and KeyboardChatScrollView needs
  // to know so it computes the content offset in the correct direction.
  //
  // NOTE: do NOT pass `freeze` here. The panel's height already tracks the
  // keyboard via panelAnimatedStyle (panel = max(0, target - |kbHeight|)),
  // which holds `panelLayoutHeight + kbPadding` constant during the swap.
  // Freezing the list pads it at the full kb height while the panel ALSO
  // grows to full height — content gets pushed up by 2× the panel height.
  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => (
      <VirtualizedListScrollView
        {...props}
        inverted
        extraContentPadding={extraContentPadding}
        offset={safeBottom}
      />
    ),
    [extraContentPadding, safeBottom],
  );

  // Grouped messages for display
  const groupedMessages = React.useMemo(
    () => groupMessagesByDay(messages, t),
    [messages, t],
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
                    renderScrollComponent={renderScrollComponent}
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
                            {t("chat.loading")}
                          </ThemedText>
                        </View>
                      ) : null
                    }
                    ListEmptyComponent={
                      loading ? (
                        <View style={styles.emptyContainer}>
                          <ThemedText size={14} color={theme.mutedForeground}>
                            {t("chat.loading")}
                          </ThemedText>
                        </View>
                      ) : (
                        <View style={styles.emptyContainer}>
                          <ThemedText size={14} color={theme.mutedForeground}>
                            {t("chat.empty")}
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
                      placeholder={t("chat.placeholder")}
                      placeholderTextColor={theme.mutedForeground}
                      value={inputText}
                      onChangeText={setInputText}
                      multiline
                      maxLength={2000}
                      onSubmitEditing={handleSend}
                      submitBehavior="newline"
                      onLayout={onInputLayout}
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

                {/* Feature panel — outside KeyboardStickyView, pinned to the
                  bottom of the screen. Height is driven from the reanimated
                  keyboard height via panelAnimatedStyle: it equals
                  max(0, panelTarget - |kbHeight|). That way the panel emerges
                  exactly as the keyboard descends (and vice-versa), so the
                  bottom-area total stays constant and the input bar's
                  position doesn't jump during the swap. */}
                <Animated.View
                  style={[
                    styles.featurePanel,
                    {
                      backgroundColor: theme.card,
                      overflow: "hidden",
                    },
                    panelAnimatedStyle,
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
                        {t("chat.image")}
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
                        {t("chat.file")}
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
