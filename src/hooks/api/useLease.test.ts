import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Lease } from "@/lib/types/lease";

function createLease(overrides: Partial<Lease> = {}): Lease {
  return {
    id: "lease-1",
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

const mockGetLease = mock(() =>
  Promise.resolve(createLease({ id: "lease-1" })),
);

mock.module("@/lib/api/leases", () => ({
  getLeases: mock(),
  getLease: mockGetLease,
  signLease: mock(),
  fundEscrow: mock(),
  checkIn: mock(),
  initiateMoveOut: mock(),
}));

describe("useLease", () => {
  beforeEach(() => {
    mockGetLease.mockClear();
  });

  test("module exports useLease function", async () => {
    const mod = await import("./useLease");
    expect(typeof mod.useLease).toBe("function");
  });

  test("getLease mock returns correct lease", async () => {
    const result = await mockGetLease();
    expect(result.id).toBe("lease-1");
    expect(result.monthlyRent).toBe(1200);
  });
});
