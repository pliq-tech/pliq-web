import { api } from "./client";
import type { Application } from "@/lib/types/application";

export async function submitApplication(listingId: string, data: {
  coverMessage?: string;
  zkProofHash?: string;
  credentialSummary?: Record<string, unknown>;
}): Promise<Application> {
  return api.post(`/api/v1/listings/${listingId}/applications`, data);
}

export async function getApplications(): Promise<Application[]> {
  return api.get("/api/v1/applications");
}

export async function getApplication(id: string): Promise<Application> {
  return api.get(`/api/v1/applications/${id}`);
}

export async function updateApplicationStatus(id: string, status: string, reason?: string): Promise<Application> {
  return api.put(`/api/v1/applications/${id}/status`, { status, rejectionReason: reason });
}
