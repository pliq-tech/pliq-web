import { describe, expect, mock, test } from "bun:test";

mock.module("wagmi", () => ({
  WagmiProvider: mock(({ children }: { children: unknown }) => children),
  createConfig: mock(() => ({})),
  http: mock(() => "transport"),
}));

mock.module("wagmi/chains", () => ({
  worldChain: { id: 480, name: "World Chain" },
  baseSepolia: { id: 84532, name: "Base Sepolia" },
}));

mock.module("@tanstack/react-query", () => ({
  QueryClient: mock(() => ({})),
  QueryClientProvider: mock(({ children }: { children: unknown }) => children),
}));

describe("WagmiProvider", () => {
  test("module exports WagmiProvider component", async () => {
    const mod = await import("./WagmiProvider");
    expect(typeof mod.WagmiProvider).toBe("function");
  });

  test("barrel exports WagmiProvider", async () => {
    const mod = await import("./index");
    expect(typeof mod.WagmiProvider).toBe("function");
  });
});

describe("wagmiConfig", () => {
  test("exports a valid wagmi config object", async () => {
    const mod = await import("./wagmiConfig");
    expect(mod.wagmiConfig).toBeDefined();
    expect(typeof mod.wagmiConfig).toBe("object");
  });
});
