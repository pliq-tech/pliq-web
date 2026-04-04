export type ListingStatus = "draft" | "analyzing" | "active" | "rented" | "inactive" | "archived";

export interface Listing {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  rentAmount: number;
  depositAmount: number;
  currency: "usdc" | "eurc";
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  amenities: string[];
  photos: string[];
  status: ListingStatus;
  fraudScore: number | null;
  fraudFlags: Record<string, unknown> | null;
  requiredCredentials: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilter {
  city?: string;
  minRent?: number;
  maxRent?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minAreaSqm?: number;
  maxFraudScore?: number;
}

export interface LandlordCard {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  verificationLevel: string;
  listingCount: number;
  avgRating: number | null;
}
