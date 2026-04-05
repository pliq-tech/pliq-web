import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Lease } from "@/lib/types/lease";

function createLease(overrides: Partial<Lease> = {}): Lease {
  return {
    id: crypto.randomUUID(),
    applicationId: "app-1",
    listingId: "listing-1",
    tenantId: "tenant-1",
    landlordId: "landlord-1",
    startDate: "2026-04-01",
    endDate: "2027-04-01",
    monthlyRent: 1200,
    depositAmount: 2400,
    currency: "eurc",
    status: "active",
    contractAddress: null,
    tenantSignedAt: null,
    landlordSignedAt: null,
    escrowCommitmentId: null,
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const mockGetLeases = mock(() =>
  Promise.resolve([createLease(), createLease({ status: "completed" })]),
);

mock.module("@/lib/api/leases", () => ({
  getLeases: mockGetLeases,
  getLease: mock(),
  signLease: mock(),
  fundEscrow: mock(),
  checkIn: mock(),
  initiateMoveOut: mock(),
}));

describe("useLeases", () => {
  beforeEach(() => {
    mockGetLeases.mockClear();
  });

  test("module exports useLeases function", async () => {
    const mod = await import("./useLeases");
    expect(typeof mod.useLeases).toBe("function");
  });

  test("getLeases mock returns lease array", async () => {
    const result = await mockGetLeases();
    expect(result).toHaveLength(2);
    expect(result[0].status).toBe("active");
    expect(result[1].status).toBe("completed");
  });
});
