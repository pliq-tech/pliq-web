"use client";

import { useCallback, useEffect, useState } from "react";
import { getListing } from "@/lib/api/listings";
import type { Listing } from "@/lib/types/listing";

interface UseListingReturn {
  listing: Listing | null;
  isLoading: boolean;
  error: Error | null;
}

export function useListing(id: string): UseListingReturn {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getListing(id);
      setListing(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load listing"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { listing, isLoading, error };
}
