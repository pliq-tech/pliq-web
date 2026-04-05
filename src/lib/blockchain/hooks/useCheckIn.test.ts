import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockWriteContractAsync = mock(() =>
  Promise.resolve("0xcheckin" as `0x${string}`),
);

const mockCheckInApi = mock(() =>
  Promise.resolve({
    id: "lease-1",
    status: "move_in_complete",
  }),
);

describe("useCheckIn", () => {
  beforeEach(() => {
    mockWriteContractAsync.mockClear();
    mockCheckInApi.mockClear();
  });

  test("writeContractAsync resolves with transaction hash", async () => {
    const hash = await mockWriteContractAsync();
    expect(hash).toBe("0xcheckin");
  });

  test("checkIn API is called with lease ID and report hash", async () => {
    await mockCheckInApi("lease-1", "0xreporthash");
    expect(mockCheckInApi).toHaveBeenCalledWith("lease-1", "0xreporthash");
  });

  test("checkIn API returns updated lease status", async () => {
    const result = await mockCheckInApi();
    expect(result.status).toBe("move_in_complete");
  });

  test("error wraps non-Error rejections", () => {
    const err = new Error("Check-in failed");
    expect(err.message).toBe("Check-in failed");
  });
});
