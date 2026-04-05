"use client";

import { Button, Container, EmptyState, Heading, Stack } from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { NotificationItem } from "@/components/features/NotificationItem";
import { useNotifications } from "@/contexts/NotificationContext";
import type { Notification } from "@/lib/types/notification";

function getNotificationRoute(notification: Notification): string | null {
  const data = notification.data as Record<string, string> | null;
  switch (notification.type) {
    case "application_received":
    case "application_accepted":
    case "application_rejected":
      return data?.applicationId
        ? `/applications/${data.applicationId}`
        : "/applications";
    case "lease_signed":
      return data?.leaseId ? `/leases/${data.leaseId}` : "/leases";
    case "payment_due":
    case "payment_confirmed":
      return "/payments";
    case "escrow_funded":
      return data?.leaseId ? `/leases/${data.leaseId}/escrow` : "/leases";
    case "dispute_filed":
    case "dispute_resolved":
      return data?.disputeId ? `/disputes/${data.disputeId}` : "/disputes";
    case "por_updated":
      return "/reputation";
    case "message_received":
      return data?.roomId ? `/messages/${data.roomId}` : "/messages";
    default:
      return null;
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const handleClick = useCallback(
    (notification: Notification) => {
      markAsRead(notification.id);
      const route = getNotificationRoute(notification);
      if (route) router.push(route);
    },
    [markAsRead, router],
  );

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="md" direction="horizontal" align="center" justify="between">
          <Heading level={1}>Notifications</Heading>
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Stack>

        {notifications.length === 0 && (
          <EmptyState
            title="No notifications"
            description="You will be notified about application updates, payments, and messages."
          />
        )}

        <Stack gap="sm">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleClick(notification)}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
