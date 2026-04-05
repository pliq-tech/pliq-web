"use client";

import {
  Alert,
  Button,
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
import { useEscrowBalance } from "@/lib/blockchain/hooks/useEscrowBalance";
import { useFundEscrow } from "@/lib/blockchain/hooks/useFundEscrow";
import type { Lease } from "@/lib/types/lease";

function EscrowSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="3.2rem" width="50%" />
      <Grid columns={2} gap="md">
        <Skeleton height="10rem" />
        <Skeleton height="10rem" />
      </Grid>
    </Stack>
  );
}

export default function EscrowPage({
  params,
}: {
  params: Promise<{ leaseId: string }>;
}) {
  const { leaseId } = use(params);
  const router = useRouter();
  const { fundEscrow, isPending, isSuccess, txHash } = useFundEscrow();
  const { escrow, isLoading: balanceLoading } = useEscrowBalance(leaseId);
  const escrowBalance = escrow?.escrowBalance ?? null;

  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLease(leaseId)
      .then(setLease)
      .catch(() => setError("Failed to load lease details."))
      .finally(() => setLoading(false));
  }, [leaseId]);

  const handleFund = useCallback(async () => {
    if (!lease) return;
    setError(null);
    try {
      await fundEscrow(leaseId, lease.depositAmount);
    } catch {
      setError("Failed to fund escrow. Please try again.");
    }
  }, [fundEscrow, leaseId, lease]);

  if (loading || balanceLoading) {
    return (
      <Container size="lg">
        <EscrowSkeleton />
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container size="lg">
        <Stack gap="lg" align="center">
          <Spacer size="xl" />
          <Alert variant="success">Escrow funded successfully!</Alert>
          {txHash && (
            <Text size="sm" color="secondary">
              Transaction: {txHash}
            </Text>
          )}
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
        <Heading level={1}>Fund Escrow</Heading>
        <Text color="secondary">
          Deposit the security amount into the smart contract escrow.
        </Text>

        <Grid columns={2} gap="md">
          <Stat
            label="Required Deposit"
            value={`${lease.depositAmount} ${lease.currency.toUpperCase()}`}
          />
          <Stat
            label="Wallet Balance"
            value={escrowBalance != null ? `${escrowBalance}` : "--"}
          />
        </Grid>

        {error && <Alert variant="error">{error}</Alert>}

        {escrowBalance != null && escrowBalance < lease.depositAmount && (
          <Alert variant="warning">
            Insufficient balance. You need at least {lease.depositAmount}{" "}
            {lease.currency.toUpperCase()} to fund the escrow.
          </Alert>
        )}

        <Spacer size="md" />

        <Button
          variant="primary"
          isDisabled={
            isPending ||
            (escrowBalance != null && escrowBalance < lease.depositAmount)
          }
          onClick={handleFund}
        >
          {isPending ? <Spinner size="sm" /> : "Fund Escrow"}
        </Button>
      </Stack>
    </Container>
  );
}
