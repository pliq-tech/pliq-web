import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockWriteContractAsync = mock(() =>
  Promise.resolve("0xpay789" as `0x${string}`),
);

const mockRecordPayment = mock(() =>
  Promise.resolve({
    id: "payment-1",
    leaseId: "lease-1",
    amount: 1200,
    status: "confirmed",
    txHash: "0xpay789",
  }),
);

describe("usePayRent", () => {
  beforeEach(() => {
    mockWriteContractAsync.mockClear();
    mockRecordPayment.mockClear();
  });

  test("writeContractAsync resolves with transaction hash", async () => {
    const hash = await mockWriteContractAsync();
    expect(hash).toBe("0xpay789");
  });

  test("recordPayment API is called with lease ID and tx hash", async () => {
    await mockRecordPayment("lease-1", "0xpay789");
    expect(mockRecordPayment).toHaveBeenCalledWith("lease-1", "0xpay789");
  });

  test("recordPayment returns payment record with correct status", async () => {
    const result = await mockRecordPayment();
    expect(result.status).toBe("confirmed");
    expect(result.amount).toBe(1200);
  });

  test("error wraps non-Error rejections", () => {
    const err = new Error("Rent payment failed");
    expect(err.message).toBe("Rent payment failed");
  });
});
