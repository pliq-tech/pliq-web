"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { initiateMoveOut } from "@/lib/api/leases";
import { contractAddresses, RENTAL_AGREEMENT_ABI } from "@/lib/contracts";

interface UseMoveOutReturn {
  moveOut: (leaseId: string) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useMoveOut(): UseMoveOutReturn {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  async function moveOut(leaseId: string): Promise<string> {
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: contractAddresses.escrow,
        abi: RENTAL_AGREEMENT_ABI,
        functionName: "initiateMoveOut",
        args: [leaseId as `0x${string}`],
      });
      setTxHash(hash);
      await initiateMoveOut(leaseId);
      return hash;
    } catch (err) {
      const wrapped = err instanceof Error ? err : new Error("Move-out failed");
      setError(wrapped);
      throw wrapped;
    }
  }

  return {
    moveOut,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash,
  };
}
