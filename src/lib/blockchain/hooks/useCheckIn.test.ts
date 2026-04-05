import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockCheckIn = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "move_in_complete",
  }),
);

mock.module("@/lib/api/leases", () => ({
  getLeases: mock(),
  getLease: mock(),
  signLease: mock(),
  fundEscrow: mock(),
  checkIn: mockCheckIn,
  initiateMoveOut: mock(),
}));

describe("useCheckIn", () => {
  beforeEach(() => {
    mockCheckIn.mockClear();
  });

  test("module exports useCheckIn function", async () => {
    const mod = await import("./useCheckIn");
    expect(typeof mod.useCheckIn).toBe("function");
  });

  test("checkIn API mock accepts lease ID and report hash", async () => {
    await mockCheckIn("lease-1", "0xreporthash");
    expect(mockCheckIn).toHaveBeenCalledWith("lease-1", "0xreporthash");
  });

  test("checkIn API mock returns updated lease", async () => {
    const result = await mockCheckIn();
    expect(result.status).toBe("move_in_complete");
  });
});
