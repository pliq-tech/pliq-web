import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockFundEscrow = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "active",
  }),
);

mock.module("@/lib/api/leases", () => ({
  getLeases: mock(),
  getLease: mock(),
  signLease: mock(),
  fundEscrow: mockFundEscrow,
  checkIn: mock(),
  initiateMoveOut: mock(),
}));

describe("useFundEscrow", () => {
  beforeEach(() => {
    mockFundEscrow.mockClear();
  });

  test("module exports useFundEscrow function", async () => {
    const mod = await import("./useFundEscrow");
    expect(typeof mod.useFundEscrow).toBe("function");
  });

  test("fundEscrow API mock accepts lease ID and txHash", async () => {
    await mockFundEscrow("lease-1", "0xtxhash");
    expect(mockFundEscrow).toHaveBeenCalledWith("lease-1", "0xtxhash");
  });

  test("fundEscrow API mock returns updated lease", async () => {
    const result = await mockFundEscrow();
    expect(result.status).toBe("active");
  });
});
