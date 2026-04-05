"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Heading,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Stat,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { getLease } from "@/lib/api/leases";
import { useMoveOut } from "@/lib/blockchain/hooks/useMoveOut";
import type { Lease } from "@/lib/types/lease";

const MOVE_OUT_CHECKLIST = [
  "All personal belongings removed",
  "Property cleaned and in good condition",
  "All keys returned to landlord",
  "Utility accounts transferred or closed",
  "No outstanding maintenance issues",
];

export default function MoveOutPage({
  params,
}: {
  params: Promise<{ leaseId: string }>;
}) {
  const { leaseId } = use(params);
  const router = useRouter();
  const { moveOut, isPending, isSuccess } = useMoveOut();

  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLease(leaseId)
      .then(setLease)
      .catch(() => setError("Failed to load lease."))
      .finally(() => setLoading(false));
  }, [leaseId]);

  const allChecked = MOVE_OUT_CHECKLIST.every((_, i) => checklist[i]);

  const handleToggle = useCallback((index: number) => {
    setChecklist((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const handleMoveOut = useCallback(async () => {
    setError(null);
    try {
      await moveOut(leaseId);
    } catch {
      setError("Failed to initiate move-out. Please try again.");
    }
  }, [moveOut, leaseId]);

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
            Move-out initiated! Your deposit will be processed.
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
        <Heading level={1}>Move Out</Heading>

        <Card>
          <Stack gap="sm">
            <Heading level={3}>Lease Summary</Heading>
            <Text>Listing: {lease.listingId.slice(0, 12)}...</Text>
            <Text color="secondary">
              End date: {new Date(lease.endDate).toLocaleDateString()}
            </Text>
          </Stack>
        </Card>

        <Grid columns={2} gap="md">
          <Stat
            label="Deposit Amount"
            value={`${lease.depositAmount} ${lease.currency.toUpperCase()}`}
          />
          <Stat
            label="Monthly Rent"
            value={`${lease.monthlyRent} ${lease.currency.toUpperCase()}`}
          />
        </Grid>

        <Stack gap="sm">
          <Heading level={3}>Move-out Checklist</Heading>
          {MOVE_OUT_CHECKLIST.map((item, index) => (
            <Checkbox
              key={item}
              label={item}
              isChecked={!!checklist[index]}
              onChange={() => handleToggle(index)}
            />
          ))}
        </Stack>

        {error && <Alert variant="error">{error}</Alert>}

        <Spacer size="md" />

        <Button
          variant="primary"
          isDisabled={!allChecked || isPending}
          onClick={handleMoveOut}
        >
          {isPending ? <Spinner size="sm" /> : "Initiate Move-Out"}
        </Button>
      </Stack>
    </Container>
  );
}
