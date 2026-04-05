"use client";

import {
  Alert,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Heading,
  Skeleton,
  Spacer,
  Stack,
  Stat,
  Tag,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLease } from "@/lib/api/leases";
import type { Lease } from "@/lib/types/lease";

type TagVariant = "default" | "primary" | "success" | "warning" | "error";

function statusVariant(status: string): TagVariant {
  if (status === "active" || status === "move_in_complete") return "success";
  if (status === "disputed" || status === "terminated") return "error";
  if (status.includes("signed") || status.includes("pending")) return "warning";
  return "default";
}

function LeaseDetailSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="3.2rem" width="50%" />
      <Skeleton height="16rem" borderRadius="lg" />
      <Skeleton height="8rem" borderRadius="lg" />
    </Stack>
  );
}

function LeaseActions({
  lease,
  userId,
  router,
}: {
  lease: Lease;
  userId: string | undefined;
  router: ReturnType<typeof useRouter>;
}) {
  const base = `/leases/${lease.id}`;
  const isTenant = userId === lease.tenantId;
  const isLandlord = userId === lease.landlordId;
  const needsTenantSign =
    lease.status === "pending_signatures" && isTenant && !lease.tenantSignedAt;
  const needsLandlordSign =
    (lease.status === "pending_signatures" ||
      lease.status === "tenant_signed") &&
    isLandlord &&
    !lease.landlordSignedAt;

  return (
    <Stack gap="md" direction="horizontal" wrap>
      {(needsTenantSign || needsLandlordSign) && (
        <Button variant="primary" onClick={() => router.push(`${base}/sign`)}>
          Sign Lease
        </Button>
      )}
      {lease.status === "landlord_signed" && isTenant && (
        <Button variant="primary" onClick={() => router.push(`${base}/escrow`)}>
          Fund Escrow
        </Button>
      )}
      {lease.status === "active" && isTenant && (
        <Button
          variant="primary"
          onClick={() => router.push(`${base}/check-in`)}
        >
          Confirm Move-In
        </Button>
      )}
      {lease.status === "move_in_complete" && isTenant && (
        <>
          <Button variant="primary" onClick={() => router.push("/payments")}>
            Pay Rent
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`${base}/move-out`)}
          >
            Move Out
          </Button>
        </>
      )}
    </Stack>
  );
}

export default function LeaseDetailPage({
  params,
}: {
  params: Promise<{ leaseId: string }>;
}) {
  const { leaseId } = use(params);
  const router = useRouter();
  const { profile } = useAuth();

  const [lease, setLease] = useState<Lease | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLease(leaseId)
      .then(setLease)
      .catch(() => setError("Failed to load lease."))
      .finally(() => setIsLoading(false));
  }, [leaseId]);

  if (isLoading) {
    return (
      <Container size="lg">
        <LeaseDetailSkeleton />
      </Container>
    );
  }

  if (error || !lease) {
    return (
      <Container size="lg">
        <Alert variant="error">{error ?? "Lease not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="sm" direction="horizontal" align="center">
          <Heading level={1}>Lease Details</Heading>
          <Tag variant={statusVariant(lease.status)}>
            {lease.status.replace(/_/g, " ")}
          </Tag>
        </Stack>

        <Card>
          <Stack gap="md">
            <Heading level={3}>Property</Heading>
            <Text>Listing: {lease.listingId.slice(0, 12)}...</Text>
            <Text color="secondary">
              {new Date(lease.startDate).toLocaleDateString()} -{" "}
              {new Date(lease.endDate).toLocaleDateString()}
            </Text>
          </Stack>
        </Card>

        <Grid columns={3} gap="md">
          <Stat
            label="Monthly Rent"
            value={`${lease.monthlyRent} ${lease.currency.toUpperCase()}`}
          />
          <Stat
            label="Deposit"
            value={`${lease.depositAmount} ${lease.currency.toUpperCase()}`}
          />
          <Stat
            label="Duration"
            value={`${Math.round((new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000))} months`}
          />
        </Grid>

        {lease.contractAddress && (
          <Card>
            <Stack gap="sm">
              <Heading level={3}>On-chain Contract</Heading>
              <Text size="sm" color="secondary">
                {lease.contractAddress}
              </Text>
            </Stack>
          </Card>
        )}

        <Divider />

        <LeaseActions lease={lease} userId={profile?.id} router={router} />

        <Spacer size="md" />

        <Button variant="secondary" onClick={() => router.push("/leases")}>
          Back to leases
        </Button>
      </Stack>
    </Container>
  );
}
