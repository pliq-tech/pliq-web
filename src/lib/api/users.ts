import { api } from "./client";
import type { Session, UserProfile, WorldIdProof } from "@/lib/types/auth";

export async function verifyWorldId(proof: WorldIdProof): Promise<Session> {
  return api.post("/api/v1/auth/verify-world-id", proof);
}

export async function getMe(): Promise<UserProfile> {
  return api.get("/api/v1/users/me");
}

export async function updateMe(data: Partial<UserProfile>): Promise<UserProfile> {
  return api.put("/api/v1/users/me", data);
}

export async function createProfile(data: {
  displayName: string;
  role: string;
  preferredLanguage?: string;
}): Promise<UserProfile> {
  return api.post("/api/v1/users/register", data);
}
