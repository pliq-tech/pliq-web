import type { Notification } from "@/lib/types/notification";

export interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}
