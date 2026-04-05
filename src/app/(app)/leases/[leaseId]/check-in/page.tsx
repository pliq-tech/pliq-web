"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Heading,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { getLease } from "@/lib/api/leases";
import { useCheckIn } from "@/lib/blockchain/hooks/useCheckIn";
import type { Lease } from "@/lib/types/lease";

export default function CheckInPage({
  params,
}: {
  params: Promise<{ leaseId: string }>;
}) {
  const { leaseId } = use(params);
  const router = useRouter();
  const { checkIn, isPending, isSuccess } = useCheckIn();

  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLease(leaseId)
      .then(setLease)
      .catch(() => setError("Failed to load lease."))
      .finally(() => setLoading(false));
  }, [leaseId]);

  const handleCheckIn = useCallback(async () => {
    setError(null);
    try {
      await checkIn(leaseId, "");
    } catch {
      setError("Failed to confirm move-in. Please try again.");
    }
  }, [checkIn, leaseId]);

  if (loading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Skeleton height="3.2rem" width="50%" />
          <Skeleton height="16rem" borderRadius="lg" />
        </Stack>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container size="lg">
        <Stack gap="lg" align="center">
          <Spacer size="xl" />
          <Alert variant="success">
            Move-in confirmed! Welcome to your new home.
          </Alert>
          <Button
            variant="primary"
            onClick={() => router.push(`/leases/${leaseId}`)}
          >
            Back to lease
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!lease) {
    return (
      <Container size="lg">
        <Alert variant="error">{error ?? "Lease not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Confirm Move-In</Heading>

        <Card>
          <Stack gap="md">
            <Heading level={3}>Property Details</Heading>
            <Text>Listing: {lease.listingId.slice(0, 12)}...</Text>
            <Text color="secondary">
              Start date: {new Date(lease.startDate).toLocaleDateString()}
            </Text>
            <Text color="secondary">
              Monthly rent: {lease.monthlyRent} {lease.currency.toUpperCase()}
            </Text>
          </Stack>
        </Card>

        <Checkbox
          label="I confirm that I have moved in and inspected the property condition."
          isChecked={confirmed}
          onChange={setConfirmed}
        />

        {error && <Alert variant="error">{error}</Alert>}

        <Spacer size="md" />

        <Button
          variant="primary"
          isDisabled={!confirmed || isPending}
          onClick={handleCheckIn}
        >
          {isPending ? <Spinner size="sm" /> : "Confirm Move-In"}
        </Button>
      </Stack>
    </Container>
  );
}
