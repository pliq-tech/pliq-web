export type VerificationLevel = "none" | "device" | "orb" | "passport";

export interface Session {
  token: string;
  userId: string;
  nullifierHash: string;
  verificationLevel: VerificationLevel;
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  nullifierHash: string;
  walletAddress: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: "tenant" | "landlord" | "both";
  verificationLevel: VerificationLevel;
  preferredLanguage: string;
  createdAt: string;
}

export interface WorldIdProof {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
}
