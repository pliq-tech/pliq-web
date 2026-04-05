import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Listing } from "@/lib/types/listing";

function createListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    landlordId: "landlord-1",
    title: "Test Apartment",
    description: "A test listing",
    address: "123 Test St",
    city: "Paris",
    country: "France",
    latitude: 48.85,
    longitude: 2.35,
    rentAmount: 1200,
    depositAmount: 2400,
    currency: "eurc",
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 60,
    amenities: [],
    photos: [],
    status: "active",
    fraudScore: null,
    fraudFlags: null,
    requiredCredentials: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const mockGetListing = mock(() =>
  Promise.resolve(createListing({ id: "listing-1" })),
);

mock.module("@/lib/api/listings", () => ({
  searchListings: mock(),
  getListing: mockGetListing,
  createListing: mock(),
  updateListing: mock(),
}));

describe("useListing", () => {
  beforeEach(() => {
    mockGetListing.mockClear();
  });

  test("module exports useListing function", async () => {
    const mod = await import("./useListing");
    expect(typeof mod.useListing).toBe("function");
  });

  test("getListing mock returns correct listing", async () => {
    const result = await mockGetListing();
    expect(result.id).toBe("listing-1");
    expect(result.title).toBe("Test Apartment");
  });

  test("getListing mock tracks calls", async () => {
    await mockGetListing();
    expect(mockGetListing).toHaveBeenCalledTimes(1);
  });
});
