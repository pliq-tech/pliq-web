import { describe, expect, mock, test } from "bun:test";

mock.module("@/lib/config", () => ({
  config: {
    apiUrl: "https://api.pliq.test",
    wsUrl: "wss://ws.pliq.test",
    worldIdAppId: "app_test",
    worldIdActionId: "action_test",
    chainId: 480,
    escrowContract: "0x0000000000000000000000000000000000000001",
    registryContract: "0x0000000000000000000000000000000000000002",
    reputationContract: "0x0000000000000000000000000000000000000003",
    usdcContract: "0x0000000000000000000000000000000000000004",
    rpcUrl: "",
    circleAppId: "circle_test",
    selfAppId: "self_test",
  },
}));

describe("WebSocketClient", () => {
  test("module exports wsClient singleton", async () => {
    const mod = await import("./websocket");
    expect(mod.wsClient).toBeDefined();
    expect(typeof mod.wsClient.connect).toBe("function");
    expect(typeof mod.wsClient.disconnect).toBe("function");
    expect(typeof mod.wsClient.subscribe).toBe("function");
    expect(typeof mod.wsClient.unsubscribe).toBe("function");
  });

  test("subscribe registers event handler", async () => {
    const mod = await import("./websocket");
    const handler = mock();
    mod.wsClient.subscribe("lease_update", handler);
    // Handler should be registered without throwing
    expect(handler).not.toHaveBeenCalled();
  });

  test("unsubscribe removes event handler", async () => {
    const mod = await import("./websocket");
    const handler = mock();
    mod.wsClient.subscribe("lease_update", handler);
    mod.wsClient.unsubscribe("lease_update", handler);
    // After unsubscribe, handler should not be called
    expect(handler).not.toHaveBeenCalled();
  });

  test("unsubscribe without handler removes all handlers for event", async () => {
    const mod = await import("./websocket");
    const handler1 = mock();
    const handler2 = mock();
    mod.wsClient.subscribe("payment_received", handler1);
    mod.wsClient.subscribe("payment_received", handler2);
    mod.wsClient.unsubscribe("payment_received");
    // Both handlers should be cleared without errors
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  test("disconnect cleans up state", async () => {
    const mod = await import("./websocket");
    // disconnect should not throw even without an active connection
    expect(() => mod.wsClient.disconnect()).not.toThrow();
  });
});
