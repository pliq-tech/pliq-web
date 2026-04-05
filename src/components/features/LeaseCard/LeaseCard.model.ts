import type { Lease } from "@/lib/types/lease";

export interface LeaseCardProps {
  lease: Lease;
  propertyTitle: string;
  onClick?: () => void;
}
