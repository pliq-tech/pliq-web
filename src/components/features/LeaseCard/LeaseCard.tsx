import { Card, Tag, Text } from "@pliq/ui";
import type { LeaseStatus } from "@/lib/types/lease";
import type { LeaseCardProps } from "./LeaseCard.model";
import styles from "./LeaseCardStyles.module.css";

const STATUS_VARIANT: Record<
  LeaseStatus,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  draft: "default",
  pending_signatures: "warning",
  tenant_signed: "primary",
  landlord_signed: "primary",
  active: "success",
  move_in_complete: "success",
  move_out_initiated: "warning",
  move_out_complete: "default",
  terminated: "error",
  disputed: "error",
  completed: "default",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatusLabel(status: LeaseStatus): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function LeaseCard({ lease, propertyTitle, onClick }: LeaseCardProps) {
  const { status, monthlyRent, currency, startDate, endDate } = lease;

  return (
    <Card isClickable={!!onClick} onClick={onClick}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.propertyTitle}>{propertyTitle}</h3>
          <Tag variant={STATUS_VARIANT[status]}>
            {formatStatusLabel(status)}
          </Tag>
        </div>
        <div className={styles.details}>
          <div className={styles.row}>
            <Text size="sm" color="secondary">
              Rent
            </Text>
            <span className={styles.rent}>
              {monthlyRent.toLocaleString()} {currency.toUpperCase()}/mo
            </span>
          </div>
          <div className={styles.row}>
            <Text size="sm" color="secondary">
              Period
            </Text>
            <Text size="sm">
              {formatDate(startDate)} - {formatDate(endDate)}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
