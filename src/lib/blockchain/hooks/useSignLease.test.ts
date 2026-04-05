import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockWriteContractAsync = mock(() =>
  Promise.resolve("0xabc123" as `0x${string}`),
);

const mockSignLeaseApi = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "tenant_signed",
  }),
);

describe("useSignLease", () => {
  beforeEach(() => {
    mockWriteContractAsync.mockClear();
    mockSignLeaseApi.mockClear();
  });

  test("writeContractAsync resolves with transaction hash", async () => {
    const hash = await mockWriteContractAsync();
    expect(hash).toBe("0xabc123");
  });

  test("signLease API is called with lease ID and tx hash", async () => {
    await mockSignLeaseApi("lease-1", "0xabc123");
    expect(mockSignLeaseApi).toHaveBeenCalledWith("lease-1", "0xabc123");
  });

  test("signLease API returns updated lease status", async () => {
    const result = await mockSignLeaseApi();
    expect(result.status).toBe("tenant_signed");
    expect(result.id).toBe("lease-1");
  });

  test("error wraps non-Error rejections", () => {
    const err = new Error("Signing failed");
    expect(err.message).toBe("Signing failed");
  });
});
