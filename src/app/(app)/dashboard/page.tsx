"use client";

import {
  Alert,
  Container,
  Grid,
  Heading,
  Skeleton,
  Stack,
  Stat,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LeaseCard } from "@/components/features/LeaseCard";
import { PaymentCard } from "@/components/features/PaymentCard";
import { PropertyCard } from "@/components/features/PropertyCard";
import { RoleSwitcher } from "@/components/features/RoleSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api/client";
import { getLeases } from "@/lib/api/leases";
import { searchListings } from "@/lib/api/listings";
import { getPaymentsDue } from "@/lib/api/payments";
import type { Lease, PaymentRecord } from "@/lib/types/lease";
import type { Listing } from "@/lib/types/listing";
import type { PorScore } from "@/lib/types/por";

type ActiveRole = "tenant" | "landlord";

function DashboardSkeleton() {
  return (
    <Stack gap="lg">
      <Grid columns={3} gap="md">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} height="10rem" borderRadius="lg" />
        ))}
      </Grid>
      <Skeleton height="16rem" borderRadius="lg" />
    </Stack>
  );
}

function TenantDashboard({
  score,
  payment,
  lease,
  router,
}: {
  score: PorScore | null;
  payment: PaymentRecord | null;
  lease: Lease | null;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <Stack gap="lg">
      <Grid columns={3} gap="md">
        <Stat label="PoR Score" value={score ? String(score.score) : "--"} />
        <Stat
          label="Payments Made"
          value={score ? String(score.paymentCount) : "0"}
        />
        <Stat
          label="Active Leases"
          value={score ? String(score.leaseCount) : "0"}
        />
      </Grid>

      {payment && (
        <Stack gap="sm">
          <Text size="lg" weight="medium">
            Next Payment
          </Text>
          <PaymentCard
            amount={payment.amount}
            currency={payment.currency}
            dueDate={payment.dueDate ?? "N/A"}
            leaseRef={payment.leaseId.slice(0, 8)}
            isOverdue={
              payment.dueDate != null && new Date(payment.dueDate) < new Date()
            }
            onPay={() => router.push("/payments")}
          />
        </Stack>
      )}

      {lease && (
        <Stack gap="sm">
          <Text size="lg" weight="medium">
            Active Lease
          </Text>
          <LeaseCard
            lease={lease}
            propertyTitle={`Property ${lease.listingId.slice(0, 8)}`}
            onClick={() => router.push(`/leases/${lease.id}`)}
          />
        </Stack>
      )}
    </Stack>
  );
}

function LandlordDashboard({
  listings,
  leases,
  router,
}: {
  listings: Listing[];
  leases: Lease[];
  router: ReturnType<typeof useRouter>;
}) {
  const activeListings = listings.filter((l) => l.status === "active");
  const totalIncome = leases
    .filter((l) => l.status === "active" || l.status === "move_in_complete")
    .reduce((sum, l) => sum + l.monthlyRent, 0);

  return (
    <Stack gap="lg">
      <Grid columns={3} gap="md">
        <Stat label="Monthly Income" value={`${totalIncome}`} />
        <Stat label="Active Listings" value={String(activeListings.length)} />
        <Stat label="Total Properties" value={String(listings.length)} />
      </Grid>

      {listings.length > 0 && (
        <Stack gap="sm">
          <Text size="lg" weight="medium">
            Your Properties
          </Text>
          <Grid columns={3} gap="md">
            {listings.slice(0, 6).map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onClick={() => router.push(`/properties/${listing.id}`)}
              />
            ))}
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [activeRole, setActiveRole] = useState<ActiveRole>(
    profile?.role === "landlord" ? "landlord" : "tenant",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<PorScore | null>(null);
  const [nextPayment, setNextPayment] = useState<PaymentRecord | null>(null);
  const [activeLease, setActiveLease] = useState<Lease | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myLeases, setMyLeases] = useState<Lease[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [payments, leases, listings, porScore] = await Promise.all([
          getPaymentsDue().catch(() => [] as PaymentRecord[]),
          getLeases().catch(() => [] as Lease[]),
          searchListings({}, 1, 50)
            .then((r) => r.items)
            .catch(() => [] as Listing[]),
          api.get<PorScore>("/api/v1/por/score").catch(() => null),
        ]);
        setScore(porScore);
        setNextPayment(payments[0] ?? null);
        const active = leases.find(
          (l) => l.status === "active" || l.status === "move_in_complete",
        );
        setActiveLease(active ?? null);
        setMyListings(listings.filter((l) => l.landlordId === profile?.id));
        setMyLeases(leases);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profile?.id]);

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="md" direction="horizontal" align="center" justify="between">
          <Heading level={1}>Dashboard</Heading>
          {profile?.role === "both" && (
            <RoleSwitcher
              currentRole={activeRole}
              onSwitch={(role) => setActiveRole(role as ActiveRole)}
            />
          )}
        </Stack>

        {error && <Alert variant="error">{error}</Alert>}

        {loading && <DashboardSkeleton />}

        {!loading && activeRole === "tenant" && (
          <TenantDashboard
            score={score}
            payment={nextPayment}
            lease={activeLease}
            router={router}
          />
        )}

        {!loading && activeRole === "landlord" && (
          <LandlordDashboard
            listings={myListings}
            leases={myLeases}
            router={router}
          />
        )}
      </Stack>
    </Container>
  );
}
