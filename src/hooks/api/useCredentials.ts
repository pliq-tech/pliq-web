"use client";

import { useCallback, useEffect, useState } from "react";
import { getCredentials } from "@/lib/api/credentials";
import type { Credential } from "@/lib/privacy/unlink";

interface UseCredentialsReturn {
  credentials: Credential[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCredentials(): UseCredentialsReturn {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCredentials();
      setCredentials(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load credentials"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { credentials, isLoading, error, refetch: fetch };
}
