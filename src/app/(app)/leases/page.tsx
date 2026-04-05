"use client";

import {
  Alert,
  Container,
  Divider,
  EmptyState,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LeaseCard } from "@/components/features/LeaseCard";
import { useLeases } from "@/hooks/api/useLeases";

const ACTIVE_STATUSES = new Set([
  "pending_signatures",
  "tenant_signed",
  "landlord_signed",
  "active",
  "move_in_complete",
]);

function LeasesSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} height="12rem" borderRadius="lg" />
      ))}
    </Stack>
  );
}

export default function LeasesPage() {
  const router = useRouter();
  const { leases, isLoading, error } = useLeases();

  const active = leases.filter((l) => ACTIVE_STATUSES.has(l.status));
  const past = leases.filter((l) => !ACTIVE_STATUSES.has(l.status));

  const handleClick = useCallback(
    (id: string) => {
      router.push(`/leases/${id}`);
    },
    [router],
  );

  if (isLoading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>My Leases</Heading>
          <LeasesSkeleton />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>My Leases</Heading>
          <Alert variant="error">{error.message}</Alert>
        </Stack>
      </Container>
    );
  }

  if (leases.length === 0) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>My Leases</Heading>
          <EmptyState
            title="No leases"
            description="You do not have any leases yet. Apply to a listing to get started."
          />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>My Leases</Heading>

        {active.length > 0 && (
          <Stack gap="md">
            <Text size="lg" weight="medium">
              Active
            </Text>
            {active.map((lease) => (
              <LeaseCard
                key={lease.id}
                lease={lease}
                propertyTitle={`Property ${lease.listingId.slice(0, 8)}`}
                onClick={() => handleClick(lease.id)}
              />
            ))}
          </Stack>
        )}

        {active.length > 0 && past.length > 0 && <Divider />}

        {past.length > 0 && (
          <Stack gap="md">
            <Text size="lg" weight="medium">
              Past
            </Text>
            {past.map((lease) => (
              <LeaseCard
                key={lease.id}
                lease={lease}
                propertyTitle={`Property ${lease.listingId.slice(0, 8)}`}
                onClick={() => handleClick(lease.id)}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
