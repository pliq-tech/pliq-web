export interface PaymentCardProps {
  amount: number;
  currency: string;
  dueDate: string;
  leaseRef?: string;
  isOverdue?: boolean;
  onPay?: () => void;
}
