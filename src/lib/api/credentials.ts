import type { Credential } from "@/lib/privacy/unlink";
import { api } from "./client";

export function getCredentials(): Promise<Credential[]> {
  return api.get<Credential[]>("/api/v1/credentials");
}

export function createCredential(data: {
  type: string;
  zkProofHash: string;
  expiresAt: string;
}): Promise<Credential> {
  return api.post<Credential>("/api/v1/credentials", data);
}

export function revokeCredential(id: string): Promise<void> {
  return api.delete(`/api/v1/credentials/${id}`);
}
