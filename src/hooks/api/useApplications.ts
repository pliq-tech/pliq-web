"use client";

import { useCallback, useEffect, useState } from "react";
import { getApplications } from "@/lib/api/applications";
import type { Application, ApplicationStatus } from "@/lib/types/application";

interface UseApplicationsReturn {
  applications: Application[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApplications(
  statusFilter?: ApplicationStatus,
): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getApplications();
      const filtered = statusFilter
        ? result.filter((app) => app.status === statusFilter)
        : result;
      setApplications(filtered);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load applications"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { applications, isLoading, error, refetch: fetch };
}
