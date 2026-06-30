import { io, type Socket } from "socket.io-client";

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

function resolveMessageSocketUrl(): string {
  // Use localhost for emulator, adjust for production
  const baseUrl = "https://localhost:3000";
  try {
    const url = new URL(baseUrl);
    url.pathname = "/ws-message";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return `${baseUrl}/ws-message`;
  }
}

class MessageSocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualDisconnect = false;

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

    return this.socket;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("disconnect", (reason) => {
      if (this.isManualDisconnect) {
        return;
      }

      if (reason === "io client disconnect" || reason === "io server disconnect") {
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

    this.socket?.disconnect();
    this.socket = null;
    this.token = null;
    this.reconnectAttempts = 0;
  }

  emit(eventName: string, payload?: Record<string, unknown>) {
    const socket = this.socket;
    if (!socket || !socket.connected) {
      console.warn(`MessageSocket: Cannot emit ${eventName}, not connected`);
      return;
    }

    socket.emit(eventName, payload);
  }

  on(eventName: string, handler: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.on(eventName, handler);
    }
  }

  off(eventName: string, handler?: (...args: unknown[]) => void) {
    if (this.socket) {
      if (handler) {
        this.socket.off(eventName, handler);
      } else {
        this.socket.off(eventName);
      }
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
