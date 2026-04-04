export type LeaseStatus =
  | "draft"
  | "pending_signatures"
  | "tenant_signed"
  | "landlord_signed"
  | "active"
  | "move_in_complete"
  | "move_out_initiated"
  | "move_out_complete"
  | "terminated"
  | "disputed"
  | "completed";

export interface Lease {
  id: string;
  applicationId: string;
  listingId: string;
  tenantId: string;
  landlordId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  currency: "usdc" | "eurc";
  status: LeaseStatus;
  contractAddress: string | null;
  tenantSignedAt: string | null;
  landlordSignedAt: string | null;
  escrowCommitmentId: string | null;
  createdAt: string;
}

export interface EscrowBreakdown {
  depositAmount: number;
  funded: boolean;
  escrowBalance: number;
  deductions: number;
}

export interface PaymentRecord {
  id: string;
  leaseId: string;
  amount: number;
  currency: string;
  status: string;
  txHash: string | null;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}
