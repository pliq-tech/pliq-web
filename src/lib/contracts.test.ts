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
    rpcUrl: "https://rpc.world.org",
    circleAppId: "circle_test",
    selfAppId: "self_test",
  },
}));

mock.module("viem", () => ({
  createPublicClient: mock(() => ({ type: "publicClient" })),
  http: mock(() => "http-transport"),
}));

mock.module("viem/chains", () => ({
  worldChain: { id: 480, name: "World Chain" },
}));

describe("contracts", () => {
  test("exports PLIQ_REGISTRY_ABI with required functions", async () => {
    const mod = await import("./contracts");
    const names = mod.PLIQ_REGISTRY_ABI.map((item) => item.name);
    expect(names).toContain("getUser");
    expect(names).toContain("isVerified");
    expect(names).toContain("registerUser");
    expect(names).toContain("submitApplication");
  });

  test("exports RENTAL_AGREEMENT_ABI with required functions", async () => {
    const mod = await import("./contracts");
    const names = mod.RENTAL_AGREEMENT_ABI.map((item) => item.name);
    expect(names).toContain("signAgreement");
    expect(names).toContain("depositEscrow");
    expect(names).toContain("executePayment");
    expect(names).toContain("getAgreement");
    expect(names).toContain("getEscrowBalance");
    expect(names).toContain("checkIn");
    expect(names).toContain("initiateMoveOut");
  });

  test("exports REPUTATION_ACCUMULATOR_ABI with required functions", async () => {
    const mod = await import("./contracts");
    const names = mod.REPUTATION_ACCUMULATOR_ABI.map((item) => item.name);
    expect(names).toContain("getScore");
    expect(names).toContain("getMerkleRoot");
    expect(names).toContain("verifyProof");
  });

  test("exports ERC20_ABI with standard functions", async () => {
    const mod = await import("./contracts");
    const names = mod.ERC20_ABI.map((item) => item.name);
    expect(names).toContain("balanceOf");
    expect(names).toContain("allowance");
    expect(names).toContain("approve");
  });

  test("contractAddresses maps config values", async () => {
    const mod = await import("./contracts");
    expect(mod.contractAddresses.pliqRegistry).toBe(
      "0x0000000000000000000000000000000000000002",
    );
    expect(mod.contractAddresses.escrow).toBe(
      "0x0000000000000000000000000000000000000001",
    );
    expect(mod.contractAddresses.reputation).toBe(
      "0x0000000000000000000000000000000000000003",
    );
    expect(mod.contractAddresses.usdc).toBe(
      "0x0000000000000000000000000000000000000004",
    );
  });

  test("publicClient is created", async () => {
    const mod = await import("./contracts");
    expect(mod.publicClient).toBeDefined();
  });
});
