"use client";

import { useState } from "react";
import { fundEscrow as fundEscrowApi } from "@/lib/api/leases";

function randomTxHash(): string {
  return `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("")}`;
}

interface UseFundEscrowReturn {
  fundEscrow: (leaseId: string, amount: number) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useFundEscrow(): UseFundEscrowReturn {
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function fundEscrow(leaseId: string, _amount: number): Promise<string> {
    setIsPending(true);
    setError(null);
    setIsSuccess(false);
    try {
      // Stub: would use wagmi writeContract to transfer USDC
      const hash = randomTxHash();
      setIsConfirming(true);
      await fundEscrowApi(leaseId, hash);
      setTxHash(hash);
      setIsSuccess(true);
      return hash;
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error("Escrow funding failed");
      setError(wrapped);
      throw wrapped;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }

  return { fundEscrow, isPending, isConfirming, isSuccess, error, txHash };
}
