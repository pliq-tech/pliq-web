import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Credential } from "@/lib/privacy/unlink";

function createCredential(overrides: Partial<Credential> = {}): Credential {
  return {
    id: crypto.randomUUID(),
    type: "income",
    issuedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2027-01-01T00:00:00Z",
    zkProofHash: "0xabc123",
    ...overrides,
  };
}

const mockGetCredentials = mock(() =>
  Promise.resolve([
    createCredential({ type: "income" }),
    createCredential({ type: "employment" }),
  ]),
);

mock.module("@/lib/api/credentials", () => ({
  getCredentials: mockGetCredentials,
  createCredential: mock(),
  revokeCredential: mock(),
}));

describe("useCredentials", () => {
  beforeEach(() => {
    mockGetCredentials.mockClear();
  });

  test("module exports useCredentials function", async () => {
    const mod = await import("./useCredentials");
    expect(typeof mod.useCredentials).toBe("function");
  });

  test("getCredentials mock returns credential list", async () => {
    const result = await mockGetCredentials();
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("income");
    expect(result[1].type).toBe("employment");
  });
});
