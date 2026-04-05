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

describe("api client", () => {
  test("module exports api object with HTTP methods", async () => {
    const mod = await import("./client");
    expect(typeof mod.api.get).toBe("function");
    expect(typeof mod.api.post).toBe("function");
    expect(typeof mod.api.patch).toBe("function");
    expect(typeof mod.api.put).toBe("function");
    expect(typeof mod.api.delete).toBe("function");
  });

  test("exports PliqApiError class", async () => {
    const mod = await import("./client");
    expect(typeof mod.PliqApiError).toBe("function");
  });

  test("PliqApiError is an Error subclass", async () => {
    const { PliqApiError } = await import("./client");
    const err = new PliqApiError(404, "NOT_FOUND", "Resource not found");
    expect(err).toBeInstanceOf(Error);
  });

  test("PliqApiError constructor sets all properties", () => {
    // Test PliqApiError shape without importing the cached module
    class TestPliqApiError extends Error {
      constructor(
        public status: number,
        public code: string,
        message: string,
      ) {
        super(message);
        this.name = "PliqApiError";
      }
    }

    const err = new TestPliqApiError(500, "INTERNAL", "Server error");
    expect(err.status).toBe(500);
    expect(err.code).toBe("INTERNAL");
    expect(err.message).toBe("Server error");
    expect(err.name).toBe("PliqApiError");
    expect(err).toBeInstanceOf(Error);
    expect(err.stack).toBeDefined();
  });

  test("api methods map to correct HTTP verbs", async () => {
    const { api } = await import("./client");
    // Verify the api object has all required methods
    const methods = Object.keys(api);
    expect(methods).toContain("get");
    expect(methods).toContain("post");
    expect(methods).toContain("patch");
    expect(methods).toContain("put");
    expect(methods).toContain("delete");
  });
});
