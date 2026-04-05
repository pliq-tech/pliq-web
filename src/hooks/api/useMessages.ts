"use client";

import { useCallback, useEffect, useState } from "react";
import { getMessages, sendMessage as sendMessageApi } from "@/lib/api/messages";
import type { Message } from "@/lib/types/message";

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  sendMessage: (content: string) => Promise<Message>;
}

export function useMessages(threadId: string): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMessages(threadId);
      setMessages(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load messages"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const sendMessage = useCallback(
    async (content: string): Promise<Message> => {
      const newMessage = await sendMessageApi(threadId, content);
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    [threadId],
  );

  return { messages, isLoading, error, refetch: fetch, sendMessage };
}
