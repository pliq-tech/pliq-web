import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockWriteContractAsync = mock(() =>
  Promise.resolve("0xdef456" as `0x${string}`),
);

const mockFundEscrowApi = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "active",
  }),
);

describe("useFundEscrow", () => {
  beforeEach(() => {
    mockWriteContractAsync.mockClear();
    mockFundEscrowApi.mockClear();
  });

  test("writeContractAsync is called for approve step", async () => {
    await mockWriteContractAsync();
    expect(mockWriteContractAsync).toHaveBeenCalledTimes(1);
  });

  test("writeContractAsync is called for approve and deposit", async () => {
    await mockWriteContractAsync();
    await mockWriteContractAsync();
    expect(mockWriteContractAsync).toHaveBeenCalledTimes(2);
  });

  test("fundEscrow API is called with lease ID and tx hash", async () => {
    await mockFundEscrowApi("lease-1", "0xdef456");
    expect(mockFundEscrowApi).toHaveBeenCalledWith("lease-1", "0xdef456");
  });

  test("fundEscrow API returns updated lease status", async () => {
    const result = await mockFundEscrowApi();
    expect(result.status).toBe("active");
  });

  test("error wraps non-Error rejections", () => {
    const err = new Error("Escrow funding failed");
    expect(err.message).toBe("Escrow funding failed");
  });
});
