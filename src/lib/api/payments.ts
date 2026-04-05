import type { PaymentRecord } from "@/lib/types/lease";
import { api } from "./client";

export async function getPaymentsDue(): Promise<PaymentRecord[]> {
  return api.get("/api/v1/payments?status=pending");
}

export async function getPaymentHistory(
  leaseId?: string,
): Promise<PaymentRecord[]> {
  const path = leaseId
    ? `/api/v1/leases/${leaseId}/payments`
    : "/api/v1/payments/history";
  return api.get(path);
}

export async function recordPayment(
  leaseId: string,
  txHash: string,
): Promise<PaymentRecord> {
  return api.post(`/api/v1/leases/${leaseId}/payments`, { txHash });
}
