"use client";

import { useCallback, useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { contractAddresses, RENTAL_AGREEMENT_ABI } from "@/lib/contracts";
import type { EscrowBreakdown } from "@/lib/types/lease";

const USDC_DECIMALS = 6;

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

  const {
    data: balanceRaw,
    isLoading,
    error: readError,
    refetch: refetchContract,
  } = useReadContract({
    address: contractAddresses.escrow,
    abi: RENTAL_AGREEMENT_ABI,
    functionName: "getEscrowBalance",
    args: leaseId ? [leaseId as `0x${string}`] : undefined,
    query: {
      enabled: !!leaseId,
    },
  });

  useEffect(() => {
    if (balanceRaw !== undefined) {
      const balance = Number(formatUnits(balanceRaw as bigint, USDC_DECIMALS));
      setEscrow({
        depositAmount: balance,
        funded: balance > 0,
        escrowBalance: balance,
        deductions: 0,
      });
    }
  }, [balanceRaw]);

  const error = readError
    ? readError instanceof Error
      ? readError
      : new Error("Failed to read escrow balance")
    : null;

  const refetch = useCallback(() => {
    refetchContract();
  }, [refetchContract]);

  return { escrow, isLoading, error, refetch };
}
