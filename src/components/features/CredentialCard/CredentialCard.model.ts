export type CredentialStatus = "active" | "expired" | "revoked";

export interface CredentialCardProps {
  type: string;
  status: CredentialStatus;
  issuedAt: string;
  expiresAt: string;
  onAction?: () => void;
}
