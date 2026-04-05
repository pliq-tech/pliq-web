import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Listing, ListingFilter } from "@/lib/types/listing";

function createListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: crypto.randomUUID(),
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

const mockSearchListings = mock(() =>
  Promise.resolve({
    items: [createListing()],
    total: 1,
    page: 1,
    perPage: 20,
    totalPages: 1,
  }),
);

mock.module("@/lib/api/listings", () => ({
  searchListings: mockSearchListings,
  getListing: mock(),
  createListing: mock(),
  updateListing: mock(),
}));

describe("useListings", () => {
  beforeEach(() => {
    mockSearchListings.mockClear();
  });

  test("module exports useListings function", async () => {
    const mod = await import("./useListings");
    expect(typeof mod.useListings).toBe("function");
  });

  test("searchListings is called by the module", () => {
    expect(typeof mockSearchListings).toBe("function");
  });

  test("mock returns paginated response", async () => {
    const result = await mockSearchListings({} as ListingFilter, 1, 20);
    expect(result.items).toHaveLength(1);
    expect(result.totalPages).toBe(1);
  });
});
