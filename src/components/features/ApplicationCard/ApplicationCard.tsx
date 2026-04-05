import { Card, Tag, Text } from "@pliq/ui";
import type { ApplicationStatus } from "@/lib/types/application";
import type { ApplicationCardProps } from "./ApplicationCard.model";
import styles from "./ApplicationCardStyles.module.css";

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  pending: "default",
  under_review: "primary",
  accepted: "success",
  rejected: "error",
  withdrawn: "warning",
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCredentialCount(summary: Record<string, unknown> | null): number {
  if (!summary) return 0;
  return Object.keys(summary).length;
}

export function ApplicationCard({
  application,
  propertyTitle,
  onClick,
}: ApplicationCardProps) {
  const { status, createdAt, credentialSummary } = application;
  const credentialCount = getCredentialCount(credentialSummary);

  return (
    <Card isClickable={!!onClick} onClick={onClick}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.propertyTitle}>{propertyTitle}</h3>
          <Tag variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Tag>
        </div>
        <div className={styles.meta}>
          <Text size="sm" color="secondary">
            Submitted {formatDate(createdAt)}
          </Text>
          {credentialCount > 0 && (
            <Text size="sm" color="secondary">
              {credentialCount} credential{credentialCount !== 1 ? "s" : ""}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
}
