"use client";

import {
  Alert,
  Button,
  Card,
  Container,
  Heading,
  List,
  ListItem,
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
import {
  getApplication,
  updateApplicationStatus,
} from "@/lib/api/applications";
import type { Application } from "@/lib/types/application";

function StatusTag({ status }: { status: string }) {
  const variant =
    status === "accepted"
      ? "success"
      : status === "rejected"
        ? "error"
        : "default";
  return <Tag variant={variant}>{status}</Tag>;
}

function ApplicationSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="3.2rem" width="50%" />
      <Skeleton height="16rem" borderRadius="lg" />
      <Skeleton height="8rem" borderRadius="lg" />
    </Stack>
  );
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const router = useRouter();
  const { profile } = useAuth();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  useEffect(() => {
    getApplication(applicationId)
      .then(setApplication)
      .catch(() => setError("Failed to load application."))
      .finally(() => setIsLoading(false));
  }, [applicationId]);

  const isLandlord = profile?.role === "landlord" || profile?.role === "both";

  const handleStatusChange = useCallback(
    async (status: "accepted" | "rejected") => {
      setActionPending(true);
      try {
        const updated = await updateApplicationStatus(applicationId, status);
        setApplication(updated);
      } catch {
        setError(`Failed to ${status} application.`);
      } finally {
        setActionPending(false);
      }
    },
    [applicationId],
  );

  if (isLoading) {
    return (
      <Container size="lg">
        <ApplicationSkeleton />
      </Container>
    );
  }

  if (error || !application) {
    return (
      <Container size="lg">
        <Alert variant="error">{error ?? "Application not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="sm" direction="horizontal" align="center">
          <Heading level={1}>Application</Heading>
          <StatusTag status={application.status} />
        </Stack>

        <Card>
          <Stack gap="md">
            <Heading level={3}>Applicant Details</Heading>
            <Text color="secondary">
              Tenant ID: {application.tenantId.slice(0, 12)}...
            </Text>
            <Text color="secondary">
              Applied: {new Date(application.createdAt).toLocaleDateString()}
            </Text>
          </Stack>
        </Card>

        {application.credentialSummary && (
          <Card>
            <Stack gap="md">
              <Heading level={3}>Credential Verification</Heading>
              <List>
                {Object.entries(application.credentialSummary).map(
                  ([key, value]) => (
                    <ListItem key={key}>
                      <Text>
                        {key}: {String(value)}
                      </Text>
                    </ListItem>
                  ),
                )}
              </List>
            </Stack>
          </Card>
        )}

        {application.coverMessage && (
          <Card>
            <Stack gap="sm">
              <Heading level={3}>Cover Message</Heading>
              <Text>{application.coverMessage}</Text>
            </Stack>
          </Card>
        )}

        {application.rejectionReason && (
          <Alert variant="error">
            Rejection reason: {application.rejectionReason}
          </Alert>
        )}

        <Spacer size="md" />

        {isLandlord && application.status === "pending" && (
          <Stack gap="md" direction="horizontal">
            <Button
              variant="primary"
              isDisabled={actionPending}
              onClick={() => handleStatusChange("accepted")}
            >
              {actionPending ? <Spinner size="sm" /> : "Accept"}
            </Button>
            <Button
              variant="secondary"
              isDisabled={actionPending}
              onClick={() => handleStatusChange("rejected")}
            >
              Reject
            </Button>
          </Stack>
        )}

        <Button variant="secondary" onClick={() => router.back()}>
          Back
        </Button>
      </Stack>
    </Container>
  );
}
