"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { PorBreakdown, PorScore, PorTrend } from "@/lib/types/por";

interface ReputationResponse {
  score: PorScore;
  breakdown: PorBreakdown;
  trends: PorTrend[];
}

interface UseReputationReturn {
  score: PorScore | null;
  breakdown: PorBreakdown | null;
  trends: PorTrend[];
  isLoading: boolean;
  error: Error | null;
}

export function useReputation(): UseReputationReturn {
  const [score, setScore] = useState<PorScore | null>(null);
  const [breakdown, setBreakdown] = useState<PorBreakdown | null>(null);
  const [trends, setTrends] = useState<PorTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.get<ReputationResponse>("/api/v1/reputation/me");
      setScore(result.score);
      setBreakdown(result.breakdown);
      setTrends(result.trends);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load reputation"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { score, breakdown, trends, isLoading, error };
}
