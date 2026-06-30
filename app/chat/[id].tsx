import { api } from "@/api";
import type {
  BatchReadPrivateMessagesDto,
  MessageControllerGetPrivateConversation200ResponseDataDataInner,
} from "@/api/generated";
import EmojiPanel from "@/components/comment/CommentComposerModal/EmojiPanel";
import type {
  EmojiGroup,
  EmojiItem,
} from "@/components/comment/CommentComposerModal/composerTypes";
import {
  getCachedEmojiPayload,
  primeEmojiCache,
  readEmojiCache,
} from "@/components/comment/CommentComposerModal/emojiCache";
import {
  createEmojiImageItem,
  getRichPlainText,
  hasRichContent,
  serializeRichContentToHtml,
} from "@/components/comment/CommentComposerModal/richContent";
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
import { messageSocketClient } from "@/lib/message-socket";
import { formatDateYMD, formatTimeHM, toDate } from "@/lib/time";
import { useAuthStore } from "@/store/authStore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import type { TFunction } from "i18next";
import { Keyboard as KeyboardIcon, Send, Smile } from "lucide-react-native";
import React, {
  forwardRef,
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
  View,
  type LayoutChangeEvent,
  type ScrollViewProps,
} from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardController,
  KeyboardGestureArea,
  KeyboardStickyView,
  useKeyboardState,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";
import { useSharedValue, withTiming } from "react-native-reanimated";
import {
  RichTextInput,
  type RichTextContentItem,
  type RichTextInputRef,
} from "react-native-rich-text-fabric";
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

const RE_HTML_TAG = /<[^>]+>/;
const RE_HTML_BR = /<br\s*\/?>/gi;
const RE_HTML_TAGS = /<[^>]*>/g;
const RE_BUBBLE_EMOJI_IMG =
  /<img\b[^>]*class="[^"]*ql-emoji-embed__img[^"]*"[^>]*>/gi;
const RE_IMG_SRC = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

// Inline emoji and bubble text share a line-box. To keep adjacent text
// glyphs from being clipped by a taller inline image, the bubble's
// lineHeight must be ≥ the emoji size. Picking lineHeight slightly
// larger than the emoji gives a bit of breathing room.
const BUBBLE_EMOJI_SIZE = 28;
const BUBBLE_LINE_HEIGHT = 28;

type BubbleSegment =
  | { type: "text"; text: string }
  | { type: "emoji"; src: string };

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function looksLikeHtml(value: string): boolean {
  return RE_HTML_TAG.test(value);
}

function htmlToPlainText(html: string): string {
  return decodeBasicEntities(
    html.replace(RE_HTML_BR, "\n").replace(RE_HTML_TAGS, ""),
  ).trim();
}

// Parse the HTML produced by serializeRichContentToHtml into a flat list
// of text / emoji segments. Mirrors the format emitted by richContent.ts
// — we don't need a full HTML parser here because the composer only ever
// emits text + ql-emoji-embed image spans.
function parseBubbleHtml(html: string): BubbleSegment[] {
  const segments: BubbleSegment[] = [];
  let lastIndex = 0;
  RE_BUBBLE_EMOJI_IMG.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = RE_BUBBLE_EMOJI_IMG.exec(html))) {
    if (match.index > lastIndex) {
      const textChunk = html.slice(lastIndex, match.index);
      const plain = decodeBasicEntities(
        textChunk.replace(RE_HTML_BR, "\n").replace(RE_HTML_TAGS, ""),
      );
      if (plain) segments.push({ type: "text", text: plain });
    }
    const srcMatch = match[0].match(RE_IMG_SRC);
    const src = srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3] ?? "";
    if (src) segments.push({ type: "emoji", src });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    const tail = html.slice(lastIndex);
    const plain = decodeBasicEntities(
      tail.replace(RE_HTML_BR, "\n").replace(RE_HTML_TAGS, ""),
    );
    if (plain) segments.push({ type: "text", text: plain });
  }
  return segments;
}

// Baseline (collapsed) height of the bottom input row. extraContentPadding
// is reported relative to this baseline — see "Handling a growing
// multiline input" in the KeyboardChatScrollView guide.
const INPUT_MIN_HEIGHT = 40;
// Vertical padding around the input row inside the sticky bar.
const INPUT_BAR_V_PADDING = 16; // 8 top + 8 bottom, see inputRow style
const BASE_BOTTOM_HEIGHT = INPUT_MIN_HEIGHT + INPUT_BAR_V_PADDING;

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

// ---------------------------------------------------------------------------
// Virtualized list <-> KeyboardChatScrollView bridge.
//
// Per the official guide ("Using with virtualized lists"):
//  - always set automaticallyAdjustContentInsets={false} and
//    contentInsetAdjustmentBehavior="never" so iOS doesn't fight the
//    component's own inset management.
//  - forward `inverted` explicitly (chat lists are inverted).
//  - forward `extraContentPadding` so growth of the input/panel area is
//    reflected in the scrollable range.
// ---------------------------------------------------------------------------
type ChatScrollRef = React.ElementRef<typeof KeyboardChatScrollView>;

const VirtualizedListScrollView = forwardRef<
  ChatScrollRef,
  ScrollViewProps & KeyboardChatScrollViewProps
>(({ inverted, ...props }, ref) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      keyboardLiftBehavior="persistent"
      inverted={inverted}
      offset={bottom}
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
  const payload = message.payload as PrivateMessagePayload | undefined;
  const imageUrls = resolveMessageImageUrls(payload);
  const rawContent = message.content ?? "";
  const isHtmlContent = looksLikeHtml(rawContent);
  const hasText = isHtmlContent
    ? Boolean(htmlToPlainText(rawContent))
    : Boolean(rawContent.trim());

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
          {isHtmlContent
            ? parseBubbleHtml(rawContent).map((seg, idx) =>
                seg.type === "text" ? (
                  <ThemedText
                    key={`t-${idx}`}
                    size={15}
                    color={isOwn ? "#ffffff" : theme.text}
                  >
                    {seg.text}
                  </ThemedText>
                ) : (
                  <Image
                    key={`e-${idx}`}
                    source={{ uri: seg.src }}
                    style={styles.bubbleEmojiImage}
                    resizeMode="contain"
                  />
                ),
              )
            : rawContent}
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
  const [richContent, setRichContent] = useState<RichTextContentItem[]>([]);
  const [plainContent, setPlainContent] = useState("");
  const [sending, setSending] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [emojiGroups, setEmojiGroups] = useState<EmojiGroup[]>(
    () => getCachedEmojiPayload()?.groups ?? [],
  );
  const [selectedEmojiGroupIndex, setSelectedEmojiGroupIndex] = useState(0);
  const selectedEmojiItems = React.useMemo(() => {
    if (selectedEmojiGroupIndex === 0) {
      return emojiGroups.flatMap((group) => group.items);
    }
    return emojiGroups[selectedEmojiGroupIndex - 1]?.items ?? [];
  }, [emojiGroups, selectedEmojiGroupIndex]);

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

  const inputRef = useRef<RichTextInputRef>(null);
  const flatListRef = useRef<FlatList>(null);
  const mountedRef = useRef(true);

  const { bottom: safeBottom } = useSafeAreaInsets();

  // ---------------------------------------------------------------------
  // Keyboard / panel plumbing (per KeyboardChatScrollView guide).
  //
  // - `extraContentPadding` tells the chat scroll view how much extra
  //   space the bottom bar (input row + optional emoji/attachment panel)
  //   is taking up beyond its baseline height, so the scrollable range
  //   and keyboard-lift math stay correct no matter how tall the bar
  //   grows (multiline input, panel open, etc).
  // - `freeze` holds all keyboard-driven layout changes still while we
  //   swap between the system keyboard and the custom panel, so the
  //   chat content doesn't jump during the transition.
  // ---------------------------------------------------------------------
  const extraContentPadding = useSharedValue(0);
  const freeze = useSharedValue(false);

  const reportBottomBarHeight = useCallback(
    (height: number) => {
      extraContentPadding.value = withTiming(
        Math.max(height - BASE_BOTTOM_HEIGHT, 0),
        { duration: 200 },
      );
    },
    [extraContentPadding],
  );

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      reportBottomBarHeight(e.nativeEvent.layout.height);
    },
    [reportBottomBarHeight],
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

  // Load emoji groups (cached first, then refresh from API).
  useEffect(() => {
    let cancelled = false;
    void readEmojiCache().then((payload) => {
      if (cancelled || !payload) return;
      setEmojiGroups((current) =>
        current.length > 0 ? current : payload.groups,
      );
    });
    void primeEmojiCache().then(() => {
      if (cancelled) return;
      const refreshed = getCachedEmojiPayload();
      if (refreshed) setEmojiGroups(refreshed.groups);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEmojiInsert = useCallback((emoji: EmojiItem) => {
    inputRef.current?.insertImage(createEmojiImageItem(emoji));
  }, []);

  const handleContentChange = useCallback((next: RichTextContentItem[]) => {
    setRichContent(next);
    setPlainContent(getRichPlainText(next));
  }, []);

  const handleSend = useCallback(() => {
    if (!userId || sending) return;

    const currentContent = inputRef.current?.getContent() ?? richContent;
    const plain = getRichPlainText(currentContent);
    if (!hasRichContent(currentContent, plain)) return;

    const html = serializeRichContentToHtml(currentContent, {
      emojiGroups,
    }).trim();
    if (!html) return;

    setSending(true);
    inputRef.current?.clearContent();
    setRichContent([]);
    setPlainContent("");
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
      content: html,
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
        content: html,
      });
    } else {
      // Socket not connected - message won't be received, could show error
      console.warn("MessageSocket: not connected, message not sent");
    }

    setSending(false);
  }, [userId, sending, user, richContent, emojiGroups]);

  // ─────────────────────────────────────────────────────────────────
  // Panel <-> keyboard transitions, mirroring CommentComposerModal.
  //
  // Two refs encode the *intended* transition; the effect below resolves
  // them whenever the system keyboard's visibility settles:
  //   - pendingPanelOpenRef: "after the keyboard goes away, open panel"
  //   - shouldFocusKeyboardRef: "after the panel/keyboard settles, raise
  //     the keyboard"
  // We never flip showPanel in the same tick as a keyboard dismiss —
  // letting the effect drive it keeps the two sources of bottom-bar
  // height from fighting each other.
  // ─────────────────────────────────────────────────────────────────
  const keyboardIsVisible = useKeyboardState((s) => s.isVisible);
  const pendingPanelOpenRef = useRef(false);
  const shouldFocusKeyboardRef = useRef(false);

  const focusRichInput = useCallback(() => {
    KeyboardController.preload();
    inputRef.current?.focus();
    requestAnimationFrame(() => {
      KeyboardController.setFocusTo("current");
    });
  }, []);

  useEffect(() => {
    if (keyboardIsVisible) {
      // Keyboard has come up. Cancel any stale "open panel" intent and
      // make sure the panel is closed — they're mutually exclusive.
      shouldFocusKeyboardRef.current = false;
      pendingPanelOpenRef.current = false;
      if (showPanel) {
        setShowPanel(false);
        reportBottomBarHeight(BASE_BOTTOM_HEIGHT);
      }
      freeze.value = false;
      return;
    }

    // Keyboard is down. If a panel-open was deferred, resolve it now.
    if (pendingPanelOpenRef.current) {
      pendingPanelOpenRef.current = false;
      shouldFocusKeyboardRef.current = false;
      setShowPanel(true);
      return;
    }

    // Otherwise, if we were trying to raise the keyboard from the
    // panel, do it now.
    if (shouldFocusKeyboardRef.current) {
      shouldFocusKeyboardRef.current = false;
      focusRichInput();
    }
  }, [keyboardIsVisible, showPanel, reportBottomBarHeight, freeze, focusRichInput]);

  const handleEmojiPress = useCallback(() => {
    if (showPanel) {
      // Panel -> keyboard. Close the panel immediately so the icon and
      // bottom-bar state flip on press; the keyboard rises into the
      // space afterwards. Without this, the panel would linger until
      // `keyboardIsVisible` flips, which only happens once the keyboard
      // is fully animated in — a noticeable delay.
      freeze.value = true;
      setShowPanel(false);
      reportBottomBarHeight(BASE_BOTTOM_HEIGHT);
      shouldFocusKeyboardRef.current = true;
      if (!keyboardIsVisible) {
        focusRichInput();
      }
      return;
    }

    if (keyboardIsVisible) {
      // Keyboard -> panel. Defer opening the panel until the keyboard
      // has actually animated away, so the bottom bar height doesn't
      // come from two sources at once.
      freeze.value = true;
      pendingPanelOpenRef.current = true;
      void KeyboardController.dismiss({ keepFocus: true });
    } else {
      // No keyboard, no panel → just open the panel.
      setShowPanel(true);
    }
  }, [
    showPanel,
    keyboardIsVisible,
    freeze,
    focusRichInput,
    reportBottomBarHeight,
  ]);

  // The input's onFocus callback is just bookkeeping now — the
  // panel/keyboard handoff is handled by the effect above.
  const handleInputFocus = useCallback(() => {
    freeze.value = false;
  }, [freeze]);

  const handlePanelLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (showPanel) {
        reportBottomBarHeight(BASE_BOTTOM_HEIGHT + e.nativeEvent.layout.height);
        freeze.value = false;
      }
    },
    [showPanel, reportBottomBarHeight, freeze],
  );

  const handleListTouchStart = useCallback(() => {
    if (showPanel) {
      setShowPanel(false);
      reportBottomBarHeight(BASE_BOTTOM_HEIGHT);
    }
  }, [showPanel, reportBottomBarHeight]);

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

  // Route the FlatList's underlying ScrollView through
  // VirtualizedListScrollView so the chat list itself is driven by
  // KeyboardChatScrollView. `inverted` is forwarded explicitly (the list
  // is inverted, newest message at index 0 / bottom of screen), and
  // `extraContentPadding` carries the live bottom-bar height so the
  // scrollable range always matches what's actually obstructed.
  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => (
      <VirtualizedListScrollView
        {...props}
        inverted
        freeze={freeze}
        extraContentPadding={extraContentPadding}
      />
    ),
    [extraContentPadding, freeze],
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
              edges={["left", "right", "bottom"]}
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

                {/* Bottom bar: input row + optional feature panel, both
                  inside a single KeyboardStickyView so the whole thing
                  rides the keyboard's live animation (or sits at
                  safeBottom when neither keyboard nor panel is active).
                  `offset.opened` accounts for the bottom safe area so the
                  bar doesn't overshoot past the home indicator. */}
                <KeyboardStickyView offset={{ opened: safeBottom, closed: 0 }}>
                  <View
                    style={[
                      styles.inputBar,
                      {
                        backgroundColor: theme.card,
                        borderTopColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.inputRow} onLayout={onInputLayout}>
                      <Pressable
                        onPress={handleEmojiPress}
                        hitSlop={8}
                        style={styles.inputIconBtn}
                      >
                        {showPanel ? (
                          <KeyboardIcon size={24} color={colors.primary} />
                        ) : (
                          <Smile size={24} color={theme.secondary} />
                        )}
                      </Pressable>
                      <View
                        nativeID="chat-input"
                        style={[
                          styles.textInputWrapper,
                          { backgroundColor: theme.secondaryBackground },
                        ]}
                      >
                        <RichTextInput
                          ref={inputRef}
                          placeholder={t("chat.placeholder")}
                          placeholderTextColor={theme.mutedForeground}
                          placeholderStyle={{
                            fontSize: 15,
                            lineHeight: 22,
                            color: theme.mutedForeground,
                          }}
                          multiline
                          maxLength={2000}
                          inheritInsertedStyle={false}
                          cursorColor={colors.primary}
                          onContentChange={handleContentChange}
                          onFocus={handleInputFocus}
                          defaultTextStyle={{
                            fontSize: 15,
                            lineHeight: 22,
                            color: theme.text,
                          }}
                          defaultImageStyle={styles.richInputImage}
                          style={styles.textInput}
                        />
                      </View>
                      <Pressable
                        onPress={handleSend}
                        disabled={!plainContent.trim() || sending}
                        hitSlop={8}
                        style={[
                          styles.sendBtn,
                          plainContent.trim()
                            ? { backgroundColor: colors.primary }
                            : { backgroundColor: theme.muted },
                        ]}
                      >
                        <Send
                          size={18}
                          color={
                            plainContent.trim()
                              ? "#ffffff"
                              : theme.mutedForeground
                          }
                        />
                      </Pressable>
                    </View>

                    {/* Feature panel — rendered inline below the input row
                      (not absolutely positioned), so it naturally grows
                      the KeyboardStickyView's content and is picked up by
                      handlePanelLayout -> reportBottomBarHeight. */}
                    {showPanel && (
                      <View
                        style={[
                          styles.featurePanel,
                          {
                            paddingBottom: safeBottom || 12,
                            backgroundColor: theme.card,
                          },
                        ]}
                        onLayout={handlePanelLayout}
                      >
                        <View style={styles.emojiPanelHost}>
                          <EmojiPanel
                            groups={emojiGroups}
                            selectedGroupIndex={selectedEmojiGroupIndex}
                            selectedItems={selectedEmojiItems}
                            primaryColor={colors.primary}
                            secondaryColor={theme.secondary}
                            borderColor={theme.border}
                            cardColor={theme.card}
                            secondaryBackgroundColor={theme.secondaryBackground}
                            onSelectGroup={setSelectedEmojiGroupIndex}
                            onSelectEmoji={handleEmojiInsert}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </KeyboardStickyView>
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
    paddingBottom: BASE_BOTTOM_HEIGHT + 12,
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
    lineHeight: BUBBLE_LINE_HEIGHT,
  },
  bubbleEmojiImage: {
    width: BUBBLE_EMOJI_SIZE,
    height: BUBBLE_EMOJI_SIZE,
  },
  richInputImage: {
    width: 32,
    height: 32,
  },
  timeContainer: {
    marginHorizontal: 6,
    marginBottom: 2,
  },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  featurePanel: {
    paddingTop: 0,
  },
  emojiPanelHost: {
    height: 260,
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
  textInputWrapper: {
    flex: 1,
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
  },
  textInput: {
    width: "100%",
    minHeight: INPUT_MIN_HEIGHT - 16,
    maxHeight: 104,
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
