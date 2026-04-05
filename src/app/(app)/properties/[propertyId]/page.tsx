"use client";

import {
  Alert,
  Button,
  Card,
  Container,
  EmptyState,
  Grid,
  Heading,
  Skeleton,
  Stack,
  Stat,
  Tabs,
  Tag,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ApplicationCard } from "@/components/features/ApplicationCard";
import { LeaseCard } from "@/components/features/LeaseCard";
import { getApplications } from "@/lib/api/applications";
import { getLeases } from "@/lib/api/leases";
import { getListing } from "@/lib/api/listings";
import type { Application } from "@/lib/types/application";
import type { Lease } from "@/lib/types/lease";
import type { Listing } from "@/lib/types/listing";

// Tab keys mapped by index for reference
const _TAB_KEYS = ["details", "applications", "lease", "financials"] as const;

function PropertyDetailSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="3.2rem" width="50%" />
      <Skeleton height="20rem" borderRadius="lg" />
    </Stack>
  );
}

function DetailsTab({ listing }: { listing: Listing }) {
  return (
    <Stack gap="md">
      <Card>
        <Stack gap="sm">
          <Text weight="bold">{listing.title}</Text>
          <Text color="secondary">
            {listing.address}, {listing.city}, {listing.country}
          </Text>
          <Text>{listing.description}</Text>
        </Stack>
      </Card>
      <Grid columns={3} gap="md">
        <Stat label="Bedrooms" value={String(listing.bedrooms)} />
        <Stat label="Bathrooms" value={String(listing.bathrooms)} />
        <Stat label="Area" value={`${listing.areaSqm} m2`} />
      </Grid>
      <Grid columns={2} gap="md">
        <Stat
          label="Rent"
          value={`${listing.rentAmount} ${listing.currency.toUpperCase()}`}
        />
        <Stat
          label="Deposit"
          value={`${listing.depositAmount} ${listing.currency.toUpperCase()}`}
        />
      </Grid>
      <Stack gap="xs" direction="horizontal" wrap>
        <Tag variant={listing.status === "active" ? "success" : "default"}>
          {listing.status}
        </Tag>
      </Stack>
    </Stack>
  );
}

function ApplicationsTab({
  applications,
  router,
}: {
  applications: Application[];
  router: ReturnType<typeof useRouter>;
}) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications"
        description="No one has applied for this property yet."
      />
    );
  }
  return (
    <Stack gap="md">
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          propertyTitle="This property"
          onClick={() => router.push(`/applications/${app.id}`)}
        />
      ))}
    </Stack>
  );
}

function LeaseTab({
  leases,
  router,
}: {
  leases: Lease[];
  router: ReturnType<typeof useRouter>;
}) {
  if (leases.length === 0) {
    return (
      <EmptyState
        title="No lease"
        description="No active or past leases for this property."
      />
    );
  }
  return (
    <Stack gap="md">
      {leases.map((lease) => (
        <LeaseCard
          key={lease.id}
          lease={lease}
          propertyTitle="This property"
          onClick={() => router.push(`/leases/${lease.id}`)}
        />
      ))}
    </Stack>
  );
}

function FinancialsTab({ listing }: { listing: Listing }) {
  return (
    <Stack gap="md">
      <Grid columns={2} gap="md">
        <Stat
          label="Monthly Income"
          value={`${listing.rentAmount} ${listing.currency.toUpperCase()}`}
        />
        <Stat
          label="Annual Income"
          value={`${listing.rentAmount * 12} ${listing.currency.toUpperCase()}`}
        />
      </Grid>
      <Text color="secondary">
        Detailed financial reports will be available in a future release.
      </Text>
    </Stack>
  );
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = use(params);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [listing, setListing] = useState<Listing | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getListing(propertyId), getApplications(), getLeases()])
      .then(([l, apps, lss]) => {
        setListing(l);
        setApplications(apps.filter((a) => a.listingId === propertyId));
        setLeases(lss.filter((ls) => ls.listingId === propertyId));
      })
      .catch(() => setError("Failed to load property data."))
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) {
    return (
      <Container size="lg">
        <PropertyDetailSkeleton />
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container size="lg">
        <Alert variant="error">{error ?? "Property not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="md" direction="horizontal" align="center" justify="between">
          <Heading level={1}>{listing.title}</Heading>
          <Button
            variant="secondary"
            onClick={() => router.push(`/properties/${propertyId}/edit`)}
          >
            Edit
          </Button>
        </Stack>

        <Tabs
          items={[
            { label: "Details", content: <DetailsTab listing={listing} /> },
            {
              label: "Applications",
              content: (
                <ApplicationsTab applications={applications} router={router} />
              ),
            },
            {
              label: "Lease",
              content: <LeaseTab leases={leases} router={router} />,
            },
            {
              label: "Financials",
              content: <FinancialsTab listing={listing} />,
            },
          ]}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
      </Stack>
    </Container>
  );
}
