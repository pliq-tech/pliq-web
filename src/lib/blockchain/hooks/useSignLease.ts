"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { signLease as signLeaseApi } from "@/lib/api/leases";
import { contractAddresses, RENTAL_AGREEMENT_ABI } from "@/lib/contracts";

interface UseSignLeaseReturn {
  signLease: (leaseId: string) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useSignLease(): UseSignLeaseReturn {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  async function signLease(leaseId: string): Promise<string> {
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: contractAddresses.escrow,
        abi: RENTAL_AGREEMENT_ABI,
        functionName: "signAgreement",
        args: [leaseId as `0x${string}`],
      });
      setTxHash(hash);
      await signLeaseApi(leaseId, hash);
      return hash;
    } catch (err) {
      const wrapped = err instanceof Error ? err : new Error("Signing failed");
      setError(wrapped);
      throw wrapped;
    }
  }

  return {
    signLease,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash,
  };
}
