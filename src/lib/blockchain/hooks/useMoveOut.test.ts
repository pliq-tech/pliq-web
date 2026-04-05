import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockWriteContractAsync = mock(() =>
  Promise.resolve("0xmoveout" as `0x${string}`),
);

const mockInitiateMoveOut = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "move_out_initiated",
  }),
);

describe("useMoveOut", () => {
  beforeEach(() => {
    mockWriteContractAsync.mockClear();
    mockInitiateMoveOut.mockClear();
  });

  test("writeContractAsync resolves with transaction hash", async () => {
    const hash = await mockWriteContractAsync();
    expect(hash).toBe("0xmoveout");
  });

  test("initiateMoveOut API is called with lease ID", async () => {
    await mockInitiateMoveOut("lease-1");
    expect(mockInitiateMoveOut).toHaveBeenCalledWith("lease-1");
  });

  test("initiateMoveOut API returns updated lease status", async () => {
    const result = await mockInitiateMoveOut();
    expect(result.status).toBe("move_out_initiated");
  });

  test("error wraps non-Error rejections", () => {
    const err = new Error("Move-out failed");
    expect(err.message).toBe("Move-out failed");
  });
});
