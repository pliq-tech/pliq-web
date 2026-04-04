export type NotificationType =
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "lease_signed"
  | "payment_due"
  | "payment_confirmed"
  | "escrow_funded"
  | "dispute_filed"
  | "dispute_resolved"
  | "por_updated"
  | "message_received";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  data: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
}
