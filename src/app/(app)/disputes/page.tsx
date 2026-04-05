"use client";

import {
  Alert,
  Card,
  Container,
  EmptyState,
  Heading,
  Skeleton,
  Stack,
  Tag,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";

interface Dispute {
  id: string;
  leaseId: string;
  filedBy: string;
  reason: string;
  status: "open" | "under_review" | "resolved" | "dismissed";
  createdAt: string;
}

type TagVariant = "default" | "primary" | "success" | "warning" | "error";

function statusVariant(status: string): TagVariant {
  if (status === "resolved") return "success";
  if (status === "dismissed") return "default";
  if (status === "under_review") return "warning";
  return "error";
}

function DisputesSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} height="10rem" borderRadius="lg" />
      ))}
    </Stack>
  );
}

function DisputeCard({
  dispute,
  onClick,
}: {
  dispute: Dispute;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick}>
      <Stack gap="sm">
        <Stack gap="sm" direction="horizontal" align="center" justify="between">
          <Text weight="medium">Dispute #{dispute.id.slice(0, 8)}</Text>
          <Tag variant={statusVariant(dispute.status)}>
            {dispute.status.replace(/_/g, " ")}
          </Tag>
        </Stack>
        <Text size="sm" color="secondary">
          Lease: {dispute.leaseId.slice(0, 12)}...
        </Text>
        <Text size="sm">
          {dispute.reason.length > 100
            ? `${dispute.reason.slice(0, 100)}...`
            : dispute.reason}
        </Text>
        <Text size="xs" color="secondary">
          Filed: {new Date(dispute.createdAt).toLocaleDateString()}
        </Text>
      </Stack>
    </Card>
  );
}

export default function DisputesPage() {
  const router = useRouter();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Dispute[]>("/api/v1/disputes")
      .then(setDisputes)
      .catch(() => setError("Failed to load disputes."))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      router.push(`/disputes/${id}`);
    },
    [router],
  );

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Disputes</Heading>

        {error && <Alert variant="error">{error}</Alert>}

        {loading && <DisputesSkeleton />}

        {!loading && !error && disputes.length === 0 && (
          <EmptyState
            title="No disputes"
            description="You have no active or past disputes."
          />
        )}

        {!loading &&
          disputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onClick={() => handleClick(dispute.id)}
            />
          ))}
      </Stack>
    </Container>
  );
}
