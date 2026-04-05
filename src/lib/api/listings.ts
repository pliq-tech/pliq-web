import type { Listing, ListingFilter } from "@/lib/types/listing";
import { api } from "./client";

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function searchListings(
  filters: ListingFilter = {},
  page = 1,
  perPage = 20,
): Promise<PaginatedResponse<Listing>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  if (filters.city) params.set("city", filters.city);
  if (filters.minRent) params.set("min_rent", String(filters.minRent));
  if (filters.maxRent) params.set("max_rent", String(filters.maxRent));
  if (filters.minBedrooms)
    params.set("min_bedrooms", String(filters.minBedrooms));

  return api.get(`/api/v1/listings?${params.toString()}`);
}

export async function getListing(id: string): Promise<Listing> {
  return api.get(`/api/v1/listings/${id}`);
}

export async function createListing(data: Partial<Listing>): Promise<Listing> {
  return api.post("/api/v1/listings", data);
}

export async function updateListing(
  id: string,
  data: Partial<Listing>,
): Promise<Listing> {
  return api.patch(`/api/v1/listings/${id}`, data);
}
