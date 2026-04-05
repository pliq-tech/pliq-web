"use client";

import type { TabItem } from "@pliq/ui";
import {
  Alert,
  Container,
  EmptyState,
  Heading,
  Skeleton,
  Stack,
  Tabs,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ApplicationCard } from "@/components/features/ApplicationCard";
import { useApplications } from "@/hooks/api/useApplications";
import type { ApplicationStatus } from "@/lib/types/application";

const TAB_KEYS = ["all", "pending", "accepted", "rejected"] as const;

function ApplicationsSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} height="12rem" borderRadius="lg" />
      ))}
    </Stack>
  );
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = TAB_KEYS[activeIndex];
  const statusFilter =
    activeTab === "all" ? undefined : (activeTab as ApplicationStatus);
  const { applications, isLoading, error } = useApplications(statusFilter);

  const handleClick = useCallback(
    (id: string) => {
      router.push(`/applications/${id}`);
    },
    [router],
  );

  const tabContent = (
    <>
      {error && <Alert variant="error">{error.message}</Alert>}

      {isLoading && <ApplicationsSkeleton />}

      {!isLoading && !error && applications.length === 0 && (
        <EmptyState
          title="No applications"
          description="You have not submitted any applications yet. Browse listings to get started."
        />
      )}

      {!isLoading && applications.length > 0 && (
        <Stack gap="md">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              propertyTitle={`Listing ${app.listingId.slice(0, 8)}`}
              onClick={() => handleClick(app.id)}
            />
          ))}
        </Stack>
      )}
    </>
  );

  const tabItems: TabItem[] = useMemo(
    () => [
      { label: "All", content: tabContent },
      { label: "Pending", content: tabContent },
      { label: "Accepted", content: tabContent },
      { label: "Rejected", content: tabContent },
    ],
    [tabContent],
  );

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>My Applications</Heading>

        <Tabs
          items={tabItems}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
      </Stack>
    </Container>
  );
}
