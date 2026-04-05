"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { Notification } from "@/lib/types/notification";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refetch: () => void;
}

export function useApiNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.get<Notification[]>("/api/v1/notifications");
      setNotifications(result);
    } catch {
      // Notifications are non-critical; fail silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { notifications, unreadCount, isLoading, refetch: fetch };
}
