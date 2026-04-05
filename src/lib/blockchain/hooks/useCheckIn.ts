"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
// TODO: Re-enable once backend adds /leases/{id}/check-in endpoint
// import { checkIn as checkInApi } from "@/lib/api/leases";
import { contractAddresses, RENTAL_AGREEMENT_ABI } from "@/lib/contracts";

interface UseCheckInReturn {
  checkIn: (leaseId: string, reportHash: string) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useCheckIn(): UseCheckInReturn {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  async function checkIn(leaseId: string, reportHash: string): Promise<string> {
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: contractAddresses.escrow,
        abi: RENTAL_AGREEMENT_ABI,
        functionName: "checkIn",
        args: [leaseId as `0x${string}`, reportHash as `0x${string}`],
      });
      setTxHash(hash);
      // TODO: Notify backend once /leases/{id}/check-in endpoint exists
      // await checkInApi(leaseId, reportHash);
      return hash;
    } catch (err) {
      const wrapped = err instanceof Error ? err : new Error("Check-in failed");
      setError(wrapped);
      throw wrapped;
    }
  }

  return {
    checkIn,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash,
  };
}
