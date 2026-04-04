export type ApplicationStatus = "pending" | "under_review" | "accepted" | "rejected" | "withdrawn";

export interface Application {
  id: string;
  listingId: string;
  tenantId: string;
  status: ApplicationStatus;
  coverMessage: string | null;
  zkProofHash: string | null;
  credentialSummary: Record<string, unknown> | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialProof {
  type: string;
  verified: boolean;
  range: string | null;
  issuedAt: string;
  expiresAt: string | null;
}

export interface ZkComposedProof {
  credentials: CredentialProof[];
  proofHash: string;
  composedAt: string;
}
