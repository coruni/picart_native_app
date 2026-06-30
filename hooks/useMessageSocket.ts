import { messageSocketClient } from "@/lib/message-socket";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef } from "react";

export function useMessageSocket() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const prevTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isLoggedIn || !token) {
      if (prevTokenRef.current) {
        messageSocketClient.disconnect();
        prevTokenRef.current = null;
      }
      return;
    }

    if (prevTokenRef.current === token) {
      const socket = messageSocketClient.instance;
      if (socket && !socket.connected) {
        socket.connect();
      }
      return;
    }

    const socket = messageSocketClient.connect(token);
    prevTokenRef.current = token;

    const handleConnected = () => {
      socket.emit("getUnreadCount");
    };

    socket.on("connected", handleConnected);

    return () => {
      socket.off("connected", handleConnected);
      messageSocketClient.disconnect();
      prevTokenRef.current = null;
    };
  }, [hasHydrated, isLoggedIn, token]);
}
