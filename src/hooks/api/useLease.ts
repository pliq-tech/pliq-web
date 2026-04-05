"use client";

import { useCallback, useEffect, useState } from "react";
import { getLease } from "@/lib/api/leases";
import type { Lease } from "@/lib/types/lease";

interface UseLeaseReturn {
  lease: Lease | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLease(id: string): UseLeaseReturn {
  const [lease, setLease] = useState<Lease | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLease(id);
      setLease(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load lease"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { lease, isLoading, error, refetch: fetch };
}
