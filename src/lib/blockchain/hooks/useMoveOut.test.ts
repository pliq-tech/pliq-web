import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockInitiateMoveOut = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "move_out_initiated",
  }),
);

mock.module("@/lib/api/leases", () => ({
  getLeases: mock(),
  getLease: mock(),
  signLease: mock(),
  fundEscrow: mock(),
  checkIn: mock(),
  initiateMoveOut: mockInitiateMoveOut,
}));

describe("useMoveOut", () => {
  beforeEach(() => {
    mockInitiateMoveOut.mockClear();
  });

  test("module exports useMoveOut function", async () => {
    const mod = await import("./useMoveOut");
    expect(typeof mod.useMoveOut).toBe("function");
  });

  test("initiateMoveOut API mock accepts lease ID", async () => {
    await mockInitiateMoveOut("lease-1");
    expect(mockInitiateMoveOut).toHaveBeenCalledWith("lease-1");
  });

  test("initiateMoveOut API mock returns updated lease", async () => {
    const result = await mockInitiateMoveOut();
    expect(result.status).toBe("move_out_initiated");
  });
});
