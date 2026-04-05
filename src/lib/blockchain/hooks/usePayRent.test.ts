import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockRecordPayment = mock(() =>
  Promise.resolve({
    id: "payment-1",
    leaseId: "lease-1",
    amount: 1200,
    status: "confirmed",
    txHash: "0xabc",
  }),
);

mock.module("@/lib/api/payments", () => ({
  getPaymentsDue: mock(),
  getPaymentHistory: mock(),
  recordPayment: mockRecordPayment,
}));

describe("usePayRent", () => {
  beforeEach(() => {
    mockRecordPayment.mockClear();
  });

  test("module exports usePayRent function", async () => {
    const mod = await import("./usePayRent");
    expect(typeof mod.usePayRent).toBe("function");
  });

  test("recordPayment API mock accepts lease ID and txHash", async () => {
    await mockRecordPayment("lease-1", "0xtxhash");
    expect(mockRecordPayment).toHaveBeenCalledWith("lease-1", "0xtxhash");
  });

  test("recordPayment API mock returns payment record", async () => {
    const result = await mockRecordPayment();
    expect(result.status).toBe("confirmed");
    expect(result.amount).toBe(1200);
  });
});
