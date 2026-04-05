"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { searchListings } from "@/lib/api/listings";
import type { Listing, ListingFilter } from "@/lib/types/listing";

interface UseListingsReturn {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  setFilters: (filters: ListingFilter) => void;
}

const DEBOUNCE_MS = 300;
const PER_PAGE = 20;

export function useListings(
  initialFilters: ListingFilter = {},
): UseListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<ListingFilter>(initialFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchListings = useCallback(
    async (currentPage: number, append: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchListings(filters, currentPage, PER_PAGE);
        setListings((prev) =>
          append ? [...prev, ...result.items] : result.items,
        );
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load listings"),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      fetchListings(1, false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchListings]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchListings(nextPage, true);
    }
  }, [page, totalPages, isLoading, fetchListings]);

  const refetch = useCallback(() => {
    setPage(1);
    fetchListings(1, false);
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    error,
    hasMore: page < totalPages,
    loadMore,
    refetch,
    setFilters,
  };
}
