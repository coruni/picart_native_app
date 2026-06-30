import { API_BASE_PATH } from "@/api/client";
import { AppState, type AppStateStatus } from "react-native";
import { io, type Socket } from "socket.io-client";

const SOCKET_REQUEST_TIMEOUT = 10000;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export interface MessageSocketUser {
  id?: number;
  username?: string;
  nickname?: string;
  avatar?: string;
}

export interface MessageSocketListItem {
  id: number;
  senderId?: number | null;
  receiverId?: number | null;
  sender?: MessageSocketUser | null;
  receiver?: MessageSocketUser | null;
  counterpartId?: number;
  content?: string;
  messageKind?: string;
  payload?: Record<string, unknown> | null;
  type?: string;
  isRead?: boolean;
  isBroadcast?: boolean;
  title?: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  recalledAt?: string;
  recallReason?: string;
  isRecalled?: boolean;
  targetId?: number;
  targetType?: string;
  notificationType?: string;
}

export interface MessageSocketConnectedPayload {
  message: string;
  user: MessageSocketUser;
}

export interface MessageSocketErrorPayload {
  message: string;
  code?: string;
}

export interface MessageSocketUnreadPayload {
  total?: number;
  personal?: number;
  notification?: number;
  broadcast?: number;
}

export interface MessageSocketPrivateConversationPayload {
  conversationId?: number;
  counterpart?: MessageSocketUser | null;
  latestMessage?: MessageSocketListItem | null;
  unreadCount?: number;
  lastMessageAt?: string | null;
}

export interface MessageSocketPrivateConversationsResponse {
  data: MessageSocketPrivateConversationPayload[];
  meta?: {
    limit?: number;
    hasMore?: boolean;
    nextCursor?: string | null;
  };
}

export interface MessageSocketPrivateHistoryResponse {
  data: MessageSocketListItem[];
  meta?: {
    limit?: number;
    hasMore?: boolean;
    nextCursor?: string | null;
  };
}

function resolveMessageSocketUrl(): string {
  const baseUrl = API_BASE_PATH || "https://localhost:3000";
  try {
    const url = new URL(baseUrl);
    const apiIndex = url.pathname.toLowerCase().indexOf("/api");
    url.pathname = apiIndex >= 0 ? url.pathname.slice(0, apiIndex) || "/" : "/";
    url.pathname = `${url.pathname.replace(/\/$/, "")}/ws-message`;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return `${baseUrl}/ws-message`;
  }
}

type SocketEventHandler = (...args: unknown[]) => void;

type PendingSocketListener = {
  eventName: string;
  handler: SocketEventHandler;
};

class MessageSocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualDisconnect = false;
  private appStateSubscription: { remove: () => void } | null = null;
  private pendingListeners: PendingSocketListener[] = [];

  connect(token: string): Socket {
    if (this.socket && this.token === token) {
      if (!this.socket.connected) {
        this.socket.connect();
      }
      return this.socket;
    }

    this.disconnect();

    this.token = token;
    this.isManualDisconnect = false;
    this.reconnectAttempts = 0;

    this.socket = io(resolveMessageSocketUrl(), {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionDelayMax: 10000,
    });

    this.setupEventHandlers();
    this.setupAppStateHandler();
    this.flushPendingListeners();

    return this.socket;
  }

  private flushPendingListeners() {
    if (!this.socket) return;

    for (const { eventName, handler } of this.pendingListeners) {
      this.socket.on(eventName, handler);
    }
    this.pendingListeners = [];
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("disconnect", (reason) => {
      if (this.isManualDisconnect) {
        return;
      }

      if (
        reason === "io client disconnect" ||
        reason === "io server disconnect"
      ) {
        this.scheduleReconnect();
      }
    });

    this.socket.on("connect", () => {
      this.reconnectAttempts = 0;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on("connect_error", () => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.warn("MessageSocket: Max reconnection attempts reached");
      }
    });
  }

  private setupAppStateHandler() {
    this.appStateSubscription?.remove();

    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState !== "active") {
          return;
        }

        const socket = this.socket;
        if (
          socket &&
          !socket.connected &&
          this.token &&
          !this.isManualDisconnect
        ) {
          console.log("MessageSocket: App active, reconnecting...");
          socket.connect();
        }
      },
    );
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || this.isManualDisconnect) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.socket && !this.socket.connected && this.token) {
        this.socket.connect();
      }
    }, RECONNECT_DELAY);
  }

  disconnect() {
    this.isManualDisconnect = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.appStateSubscription?.remove();
    this.appStateSubscription = null;

    this.socket?.disconnect();
    this.socket = null;
    this.token = null;
    this.reconnectAttempts = 0;
    this.pendingListeners = [];
  }

  request<TResponse>(
    eventName: string,
    responseEvent: string,
    payload?: Record<string, unknown>,
    timeoutMs = SOCKET_REQUEST_TIMEOUT,
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const socket = this.socket;

      if (!socket) {
        reject(new Error("Message websocket is not connected"));
        return;
      }

      let settled = false;
      const timer = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        socket.off(responseEvent, handleResponse);
        reject(new Error(`Message websocket request timed out: ${eventName}`));
      }, timeoutMs);

      const handleResponse = (response: TResponse) => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timer);
        socket.off(responseEvent, handleResponse);
        resolve(response);
      };

      socket.on(responseEvent, handleResponse);
      socket.emit(eventName, payload);
    });
  }

  emit(eventName: string, payload?: Record<string, unknown>) {
    const socket = this.socket;
    if (!socket || !socket.connected) {
      console.warn(`MessageSocket: Cannot emit ${eventName}, not connected`);
      return;
    }

    socket.emit(eventName, payload);
  }

  on<T = unknown>(eventName: string, handler: (payload: T) => void) {
    const wrappedHandler = handler as SocketEventHandler;
    if (this.socket) {
      this.socket.on(eventName, wrappedHandler);
    } else {
      this.pendingListeners.push({ eventName, handler: wrappedHandler });
    }
  }

  off<T = unknown>(eventName: string, handler?: (payload: T) => void) {
    const wrappedHandler = handler as SocketEventHandler | undefined;

    if (this.socket) {
      if (wrappedHandler) {
        this.socket.off(eventName, wrappedHandler);
      } else {
        this.socket.off(eventName);
      }
    }

    if (wrappedHandler) {
      this.pendingListeners = this.pendingListeners.filter(
        (listener) =>
          listener.eventName !== eventName ||
          listener.handler !== wrappedHandler,
      );
    } else {
      this.pendingListeners = this.pendingListeners.filter(
        (listener) => listener.eventName !== eventName,
      );
    }
  }

  get instance(): Socket | null {
    return this.socket;
  }

  get isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }
}

export const messageSocketClient = new MessageSocketClient();
