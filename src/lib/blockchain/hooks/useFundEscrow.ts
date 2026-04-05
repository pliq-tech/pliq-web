"use client";

import { useState } from "react";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
// TODO: Backend escrow endpoint is /api/v1/escrow/commit (not lease-scoped).
// Refactor to use the correct escrow API once the escrow client module is wired up.
// import { fundEscrow as fundEscrowApi } from "@/lib/api/leases";
import {
  contractAddresses,
  ERC20_ABI,
  RENTAL_AGREEMENT_ABI,
} from "@/lib/contracts";

const USDC_DECIMALS = 6;

interface UseFundEscrowReturn {
  fundEscrow: (leaseId: string, amount: number) => Promise<string>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useFundEscrow(): UseFundEscrowReturn {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  async function fundEscrow(leaseId: string, amount: number): Promise<string> {
    setError(null);
    try {
      const usdcAmount = parseUnits(String(amount), USDC_DECIMALS);

      setIsApproving(true);
      await writeContractAsync({
        address: contractAddresses.usdc,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contractAddresses.escrow, usdcAmount],
      });
      setIsApproving(false);

      const hash = await writeContractAsync({
        address: contractAddresses.escrow,
        abi: RENTAL_AGREEMENT_ABI,
        functionName: "depositEscrow",
        args: [leaseId as `0x${string}`, usdcAmount],
      });

      setTxHash(hash);
      // TODO: Call /api/v1/escrow/commit instead once the escrow client is wired up
      // await fundEscrowApi(leaseId, hash);
      return hash;
    } catch (err) {
      setIsApproving(false);
      const wrapped =
        err instanceof Error ? err : new Error("Escrow funding failed");
      setError(wrapped);
      throw wrapped;
    }
  }

  return {
    fundEscrow,
    isPending: isWritePending || isApproving,
    isConfirming,
    isSuccess,
    error,
    txHash,
  };
}
