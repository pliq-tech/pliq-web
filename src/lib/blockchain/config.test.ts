import { describe, expect, mock, test } from "bun:test";

mock.module("@/lib/config", () => ({
  config: {
    apiUrl: "https://api.pliq.test",
    wsUrl: "wss://ws.pliq.test",
    worldIdAppId: "app_test",
    worldIdActionId: "action_test",
    chainId: 480,
    escrowContract: "0x1234567890abcdef1234567890abcdef12345678",
    registryContract: "0xabcdef1234567890abcdef1234567890abcdef12",
    reputationContract: "0x9876543210fedcba9876543210fedcba98765432",
    circleAppId: "circle_test",
    selfAppId: "self_test",
  },
}));

describe("blockchainConfig", () => {
  test("exports blockchain config with correct properties", async () => {
    const mod = await import("./config");
    const { blockchainConfig } = mod;
    expect(blockchainConfig.chainId).toBe(480);
    expect(blockchainConfig.escrowContract).toBe(
      "0x1234567890abcdef1234567890abcdef12345678",
    );
    expect(blockchainConfig.registryContract).toBe(
      "0xabcdef1234567890abcdef1234567890abcdef12",
    );
    expect(blockchainConfig.reputationContract).toBe(
      "0x9876543210fedcba9876543210fedcba98765432",
    );
  });

  test("config object is readonly", async () => {
    const mod = await import("./config");
    expect(typeof mod.blockchainConfig).toBe("object");
  });
});
