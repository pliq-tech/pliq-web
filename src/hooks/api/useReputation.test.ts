import { beforeEach, describe, expect, mock, test } from "bun:test";

const mockApiGet = mock(() =>
  Promise.resolve({
    score: {
      userId: "user-1",
      score: 85,
      paymentCount: 12,
      onTimeCount: 11,
      lateCount: 1,
      totalPaid: 14400,
      leaseCount: 2,
      completedLeaseCount: 1,
      disputeCount: 0,
      merkleRoot: null,
      lastPaymentAt: "2026-03-01T00:00:00Z",
    },
    breakdown: {
      punctuality: 92,
      completion: 80,
      tenure: 75,
      disputeFree: 100,
    },
    trends: [
      { month: "2026-01", score: 80 },
      { month: "2026-02", score: 83 },
      { month: "2026-03", score: 85 },
    ],
  }),
);

mock.module("@/lib/api/client", () => ({
  api: {
    get: mockApiGet,
    post: mock(),
    patch: mock(),
    put: mock(),
    delete: mock(),
  },
  PliqApiError: class extends Error {},
}));

describe("useReputation", () => {
  beforeEach(() => {
    mockApiGet.mockClear();
  });

  test("module exports useReputation function", async () => {
    const mod = await import("./useReputation");
    expect(typeof mod.useReputation).toBe("function");
  });

  test("api.get mock returns reputation data", async () => {
    const result = await mockApiGet();
    expect(result.score.score).toBe(85);
    expect(result.breakdown.punctuality).toBe(92);
    expect(result.trends).toHaveLength(3);
  });
});
