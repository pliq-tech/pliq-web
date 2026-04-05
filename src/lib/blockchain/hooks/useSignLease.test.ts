import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockSignLease = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "tenant_signed",
  }),
);

mock.module("@/lib/api/leases", () => ({
  getLeases: mock(),
  getLease: mock(),
  signLease: mockSignLease,
  fundEscrow: mock(),
  checkIn: mock(),
  initiateMoveOut: mock(),
}));

describe("useSignLease", () => {
  beforeEach(() => {
    mockSignLease.mockClear();
  });

  test("module exports useSignLease function", async () => {
    const mod = await import("./useSignLease");
    expect(typeof mod.useSignLease).toBe("function");
  });

  test("signLease API mock accepts lease ID and signature", async () => {
    await mockSignLease("lease-1", "0xsignature");
    expect(mockSignLease).toHaveBeenCalledWith("lease-1", "0xsignature");
  });

  test("signLease API mock returns updated lease", async () => {
    const result = await mockSignLease();
    expect(result.status).toBe("tenant_signed");
  });
});
