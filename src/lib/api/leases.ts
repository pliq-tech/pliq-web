import { api } from "./client";
import type { Lease } from "@/lib/types/lease";

export async function getLeases(): Promise<Lease[]> {
  return api.get("/api/v1/leases");
}

export async function getLease(id: string): Promise<Lease> {
  return api.get(`/api/v1/leases/${id}`);
}

export async function signLease(id: string, signature: string): Promise<Lease> {
  return api.put(`/api/v1/leases/${id}/sign`, { signature });
}

export async function fundEscrow(id: string, txHash: string): Promise<Lease> {
  return api.post(`/api/v1/leases/${id}/escrow`, { txHash });
}

export async function checkIn(id: string, reportHash: string): Promise<Lease> {
  return api.post(`/api/v1/leases/${id}/check-in`, { reportHash });
}

export async function initiateMoveOut(id: string): Promise<Lease> {
  return api.post(`/api/v1/leases/${id}/move-out`, {});
}
