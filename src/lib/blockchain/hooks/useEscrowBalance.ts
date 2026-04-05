"use client";

import { useCallback, useEffect, useState } from "react";
import type { EscrowBreakdown } from "@/lib/types/lease";

interface UseEscrowBalanceReturn {
  escrow: EscrowBreakdown | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useEscrowBalance(
  leaseId: string | null,
): UseEscrowBalanceReturn {
  const [escrow, setEscrow] = useState<EscrowBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!leaseId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Stub: would use viem readContract to get on-chain escrow balance
      setEscrow({
        depositAmount: 2400,
        funded: true,
        escrowBalance: 2400,
        deductions: 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to read escrow balance"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [leaseId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { escrow, isLoading, error, refetch: fetch };
}
