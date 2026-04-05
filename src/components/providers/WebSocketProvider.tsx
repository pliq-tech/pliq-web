"use client";

import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { wsClient } from "@/lib/api/websocket";
import type { Notification } from "@/lib/types/notification";

interface WebSocketContextValue {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  isConnected: false,
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    wsClient.connect(token);

    const handleNotification = (data: unknown) => {
      addNotification(data as Notification);
    };

    wsClient.subscribe("notification:new", handleNotification);

    return () => {
      wsClient.unsubscribe("notification:new", handleNotification);
      wsClient.disconnect();
    };
  }, [isAuthenticated, token, addNotification]);

  return (
    <WebSocketContext.Provider value={{ isConnected: isAuthenticated }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket(): WebSocketContextValue {
  return useContext(WebSocketContext);
}
