import type { Session, UserProfile, WorldIdProof } from "@/lib/types/auth";
import { api } from "./client";

export async function verifyWorldId(proof: WorldIdProof): Promise<Session> {
  return api.post("/api/v1/auth/verify-world-id", proof);
}

export async function getMe(): Promise<UserProfile> {
  return api.get("/api/v1/users/me");
}

export async function updateMe(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  return api.put("/api/v1/users/me", data);
}

export async function createProfile(data: {
  displayName: string;
  role: string;
  preferredLanguage?: string;
}): Promise<UserProfile> {
  const roleMap: Record<string, string> = { tenant: "Tenant", landlord: "Landlord", both: "Both" };
  return api.put("/api/v1/users/me", {
    display_name: data.displayName,
    role: roleMap[data.role] ?? data.role,
    preferred_language: data.preferredLanguage,
  });
}
