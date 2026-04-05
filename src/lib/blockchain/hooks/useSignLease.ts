"use client";

import { useState } from "react";
import { signLease as signLeaseApi } from "@/lib/api/leases";

function randomTxHash(): string {
  return `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("")}`;
}

interface UseSignLeaseReturn {
  signLease: (leaseId: string) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useSignLease(): UseSignLeaseReturn {
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function signLease(leaseId: string): Promise<string> {
    setIsPending(true);
    setError(null);
    setIsSuccess(false);
    try {
      // Stub: would use wagmi writeContract
      const hash = randomTxHash();
      setIsConfirming(true);
      await signLeaseApi(leaseId, hash);
      setTxHash(hash);
      setIsSuccess(true);
      return hash;
    } catch (err) {
      const wrapped = err instanceof Error ? err : new Error("Signing failed");
      setError(wrapped);
      throw wrapped;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }

  return { signLease, isPending, isConfirming, isSuccess, error, txHash };
}
