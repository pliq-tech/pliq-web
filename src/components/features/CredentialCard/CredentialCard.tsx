import { Badge, Button, Card, Tag, Text } from "@pliq/ui";
import type {
  CredentialCardProps,
  CredentialStatus,
} from "./CredentialCard.model";
import styles from "./CredentialCardStyles.module.css";

const STATUS_VARIANT: Record<
  CredentialStatus,
  "success" | "error" | "warning"
> = {
  active: "success",
  expired: "error",
  revoked: "warning",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isExpiringSoon(expiresAt: string): boolean {
  const expiry = new Date(expiresAt).getTime();
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return expiry > now && expiry - now <= thirtyDays;
}

export function CredentialCard({
  type,
  status,
  issuedAt,
  expiresAt,
  onAction,
}: CredentialCardProps) {
  const expiring = status === "active" && isExpiringSoon(expiresAt);

  return (
    <Card>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.typeRow}>
            <div className={styles.icon} aria-hidden="true" />
            <Text size="md" weight="semibold">
              {type}
            </Text>
          </div>
          <Tag variant={STATUS_VARIANT[status]}>{status}</Tag>
        </div>
        <div className={styles.dates}>
          <span>Issued: {formatDate(issuedAt)}</span>
          <span>Expires: {formatDate(expiresAt)}</span>
        </div>
        <div className={styles.footer}>
          {expiring && <Badge variant="warning">Expiring soon</Badge>}
          {onAction && (
            <Button variant="ghost" size="sm" onClick={onAction}>
              Manage
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
