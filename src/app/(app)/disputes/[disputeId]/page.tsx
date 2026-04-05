"use client";

import {
  Alert,
  Button,
  Card,
  Container,
  Divider,
  Heading,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Tag,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api/client";

interface Dispute {
  id: string;
  leaseId: string;
  filedBy: string;
  respondent: string;
  reason: string;
  evidence: string[];
  status: "open" | "under_review" | "resolved" | "dismissed";
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
}

type TagVariant = "default" | "primary" | "success" | "warning" | "error";

function statusVariant(status: string): TagVariant {
  if (status === "resolved") return "success";
  if (status === "dismissed") return "default";
  if (status === "under_review") return "warning";
  return "error";
}

function DisputeSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="3.2rem" width="50%" />
      <Skeleton height="20rem" borderRadius="lg" />
    </Stack>
  );
}

export default function DisputeDetailPage({
  params,
}: {
  params: Promise<{ disputeId: string }>;
}) {
  const { disputeId } = use(params);
  const router = useRouter();
  const { profile } = useAuth();

  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  useEffect(() => {
    api
      .get<Dispute>(`/api/v1/disputes/${disputeId}`)
      .then(setDispute)
      .catch(() => setError("Failed to load dispute."))
      .finally(() => setLoading(false));
  }, [disputeId]);

  const handleResolve = useCallback(
    async (resolution: "resolved" | "dismissed") => {
      setActionPending(true);
      setError(null);
      try {
        const updated = await api.put<Dispute>(
          `/api/v1/disputes/${disputeId}/resolve`,
          { status: resolution },
        );
        setDispute(updated);
      } catch {
        setError("Failed to update dispute status.");
      } finally {
        setActionPending(false);
      }
    },
    [disputeId],
  );

  if (loading) {
    return (
      <Container size="lg">
        <DisputeSkeleton />
      </Container>
    );
  }

  if (error || !dispute) {
    return (
      <Container size="lg">
        <Alert variant="error">{error ?? "Dispute not found."}</Alert>
      </Container>
    );
  }

  const canResolve =
    (dispute.status === "open" || dispute.status === "under_review") &&
    profile?.role !== "tenant";

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="sm" direction="horizontal" align="center">
          <Heading level={1}>Dispute Details</Heading>
          <Tag variant={statusVariant(dispute.status)}>
            {dispute.status.replace(/_/g, " ")}
          </Tag>
        </Stack>

        <Card>
          <Stack gap="md">
            <Text weight="medium">Reason</Text>
            <Text>{dispute.reason}</Text>
            <Divider />
            <Text size="sm" color="secondary">
              Filed by: {dispute.filedBy.slice(0, 12)}...
            </Text>
            <Text size="sm" color="secondary">
              Respondent: {dispute.respondent.slice(0, 12)}...
            </Text>
            <Text size="sm" color="secondary">
              Lease: {dispute.leaseId.slice(0, 12)}...
            </Text>
            <Text size="sm" color="secondary">
              Filed: {new Date(dispute.createdAt).toLocaleDateString()}
            </Text>
          </Stack>
        </Card>

        {dispute.evidence.length > 0 && (
          <Card>
            <Stack gap="sm">
              <Text weight="medium">Evidence</Text>
              {dispute.evidence.map((item, idx) => (
                <Text key={idx} size="sm" color="secondary">
                  {item}
                </Text>
              ))}
            </Stack>
          </Card>
        )}

        {dispute.resolution && (
          <Alert variant="success">Resolution: {dispute.resolution}</Alert>
        )}

        {canResolve && (
          <>
            <Divider />
            <Stack gap="md" direction="horizontal">
              <Button
                variant="primary"
                isDisabled={actionPending}
                onClick={() => handleResolve("resolved")}
              >
                {actionPending ? <Spinner size="sm" /> : "Resolve"}
              </Button>
              <Button
                variant="secondary"
                isDisabled={actionPending}
                onClick={() => handleResolve("dismissed")}
              >
                Dismiss
              </Button>
            </Stack>
          </>
        )}

        <Spacer size="md" />

        <Button variant="secondary" onClick={() => router.push("/disputes")}>
          Back to disputes
        </Button>
      </Stack>
    </Container>
  );
}
