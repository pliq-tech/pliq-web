"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { recordPayment } from "@/lib/api/payments";
import { contractAddresses, RENTAL_AGREEMENT_ABI } from "@/lib/contracts";

interface UsePayRentReturn {
  payRent: (leaseId: string, amount: number) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function usePayRent(): UsePayRentReturn {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  async function payRent(leaseId: string, _amount: number): Promise<string> {
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: contractAddresses.escrow,
        abi: RENTAL_AGREEMENT_ABI,
        functionName: "executePayment",
        args: [leaseId as `0x${string}`],
      });
      setTxHash(hash);
      await recordPayment(leaseId, hash);
      return hash;
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error("Rent payment failed");
      setError(wrapped);
      throw wrapped;
    }
  }

  return {
    payRent,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash,
  };
}
