import type { Listing } from "@/lib/types/listing";

export interface PropertyCardProps {
  listing: Listing;
  onClick?: () => void;
}
