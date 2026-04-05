"use client";

import { useCallback, useEffect, useState } from "react";
import { getPaymentHistory, getPaymentsDue } from "@/lib/api/payments";
import type { PaymentRecord } from "@/lib/types/lease";

interface UsePaymentsReturn {
  paymentsDue: PaymentRecord[];
  history: PaymentRecord[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePayments(): UsePaymentsReturn {
  const [paymentsDue, setPaymentsDue] = useState<PaymentRecord[]>([]);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [due, hist] = await Promise.all([
        getPaymentsDue(),
        getPaymentHistory(),
      ]);
      setPaymentsDue(due);
      setHistory(hist);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load payments"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { paymentsDue, history, isLoading, error, refetch: fetch };
}
