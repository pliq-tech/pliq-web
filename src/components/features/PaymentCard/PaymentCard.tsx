import { Badge, Button, Card, Stat, Text } from "@pliq/ui";
import type { PaymentCardProps } from "./PaymentCard.model";
import styles from "./PaymentCardStyles.module.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PaymentCard({
  amount,
  currency,
  dueDate,
  leaseRef,
  isOverdue,
  onPay,
}: PaymentCardProps) {
  const formattedAmount = `${amount.toLocaleString()} ${currency.toUpperCase()}`;

  return (
    <Card>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Stat label="Amount Due" value={formattedAmount} />
          {isOverdue && <Badge variant="error">Overdue</Badge>}
        </div>
        <div className={styles.meta}>
          <Text size="sm" color="secondary">
            Due: {formatDate(dueDate)}
          </Text>
          {leaseRef && (
            <Text size="sm" color="secondary">
              Lease: {leaseRef}
            </Text>
          )}
        </div>
        {onPay && (
          <div className={styles.actions}>
            <Button
              variant={isOverdue ? "danger" : "primary"}
              size="sm"
              onClick={onPay}
            >
              Pay Now
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
