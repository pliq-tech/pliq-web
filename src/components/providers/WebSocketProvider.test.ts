import { describe, expect, mock, test } from "bun:test";

mock.module("@/lib/api/websocket", () => ({
  wsClient: {
    connect: mock(),
    disconnect: mock(),
    subscribe: mock(),
    unsubscribe: mock(),
  },
}));

mock.module("@/contexts/AuthContext", () => ({
  useAuth: mock(() => ({
    isAuthenticated: false,
    isLoading: false,
    profile: null,
    nullifierHash: null,
    token: null,
    login: mock(),
    logout: mock(),
  })),
  AuthProvider: mock(),
}));

mock.module("@/contexts/NotificationContext", () => ({
  useNotifications: mock(() => ({
    notifications: [],
    unreadCount: 0,
    addNotification: mock(),
    markAsRead: mock(),
    markAllAsRead: mock(),
  })),
  NotificationProvider: mock(),
}));

describe("WebSocketProvider", () => {
  test("module exports WebSocketProvider component", async () => {
    const mod = await import("./WebSocketProvider");
    expect(typeof mod.WebSocketProvider).toBe("function");
  });

  test("module exports useWebSocket hook", async () => {
    const mod = await import("./WebSocketProvider");
    expect(typeof mod.useWebSocket).toBe("function");
  });
});
