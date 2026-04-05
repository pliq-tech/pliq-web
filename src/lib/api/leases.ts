import type { Lease } from "@/lib/types/lease";
import { api } from "./client";

export async function getLeases(): Promise<Lease[]> {
  return api.get("/api/v1/leases");
}

export async function getLease(id: string): Promise<Lease> {
  return api.get(`/api/v1/leases/${id}`);
}

export async function signLease(id: string, signature: string): Promise<Lease> {
  return api.put(`/api/v1/leases/${id}/sign`, { signature });
}

// TODO: Backend escrow endpoint is /api/v1/escrow/commit (not lease-scoped).
// Refactor to use the correct escrow API once the escrow client module is wired up.
// export async function fundEscrow(id: string, txHash: string): Promise<Lease> {
//   return api.post(`/api/v1/leases/${id}/escrow`, { txHash });
// }

// TODO: No /leases/{id}/check-in route exists in the backend yet.
// Implement once the backend adds a check-in endpoint.
// export async function checkIn(id: string, reportHash: string): Promise<Lease> {
//   return api.post(`/api/v1/leases/${id}/check-in`, { reportHash });
// }

// TODO: No /leases/{id}/move-out route exists in the backend yet.
// Implement once the backend adds a move-out endpoint.
// export async function initiateMoveOut(id: string): Promise<Lease> {
//   return api.post(`/api/v1/leases/${id}/move-out`, {});
// }
