"use client";

import { useCallback, useEffect, useState } from "react";
import { getLeases } from "@/lib/api/leases";
import type { Lease } from "@/lib/types/lease";

interface UseLeasesReturn {
  leases: Lease[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLeases(): UseLeasesReturn {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLeases();
      setLeases(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load leases"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { leases, isLoading, error, refetch: fetch };
}
