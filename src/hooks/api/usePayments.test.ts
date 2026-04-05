import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { PaymentRecord } from "@/lib/types/lease";

function createPayment(overrides: Partial<PaymentRecord> = {}): PaymentRecord {
  return {
    id: crypto.randomUUID(),
    leaseId: "lease-1",
    amount: 1200,
    currency: "eurc",
    status: "pending",
    txHash: null,
    dueDate: "2026-04-01",
    paidAt: null,
    createdAt: "2026-03-01T00:00:00Z",
    ...overrides,
  };
}

const mockGetPaymentsDue = mock(() =>
  Promise.resolve([createPayment({ status: "pending" })]),
);

const mockGetPaymentHistory = mock(() =>
  Promise.resolve([
    createPayment({ status: "confirmed", paidAt: "2026-03-01T12:00:00Z" }),
  ]),
);

mock.module("@/lib/api/payments", () => ({
  getPaymentsDue: mockGetPaymentsDue,
  getPaymentHistory: mockGetPaymentHistory,
  recordPayment: mock(),
}));

describe("usePayments", () => {
  beforeEach(() => {
    mockGetPaymentsDue.mockClear();
    mockGetPaymentHistory.mockClear();
  });

  test("module exports usePayments function", async () => {
    const mod = await import("./usePayments");
    expect(typeof mod.usePayments).toBe("function");
  });

  test("getPaymentsDue mock returns pending payments", async () => {
    const result = await mockGetPaymentsDue();
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });

  test("getPaymentHistory mock returns confirmed payments", async () => {
    const result = await mockGetPaymentHistory();
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("confirmed");
  });
});
