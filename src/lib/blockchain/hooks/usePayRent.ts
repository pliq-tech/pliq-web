"use client";

import { useState } from "react";
import { recordPayment } from "@/lib/api/payments";

function randomTxHash(): string {
  return `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("")}`;
}

interface UsePayRentReturn {
  payRent: (leaseId: string, amount: number) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function usePayRent(): UsePayRentReturn {
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function payRent(leaseId: string, _amount: number): Promise<string> {
    setIsPending(true);
    setError(null);
    setIsSuccess(false);
    try {
      // Stub: would use wagmi writeContract to send USDC
      const hash = randomTxHash();
      setIsConfirming(true);
      await recordPayment(leaseId, hash);
      setTxHash(hash);
      setIsSuccess(true);
      return hash;
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error("Rent payment failed");
      setError(wrapped);
      throw wrapped;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }

  return { payRent, isPending, isConfirming, isSuccess, error, txHash };
}
