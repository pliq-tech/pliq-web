"use client";

import { useCallback, useEffect, useState } from "react";
import { getConversations } from "@/lib/api/messages";
import type { MessageThread } from "@/lib/types/message";

interface UseConversationsReturn {
  conversations: MessageThread[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getConversations();
      setConversations(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load conversations"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { conversations, isLoading, error, refetch: fetch };
}
