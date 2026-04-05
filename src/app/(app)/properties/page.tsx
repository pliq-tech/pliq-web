"use client";

import {
  Alert,
  Button,
  Container,
  EmptyState,
  Grid,
  Heading,
  Skeleton,
  Stack,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PropertyCard } from "@/components/features/PropertyCard";
import { useAuth } from "@/contexts/AuthContext";
import { searchListings } from "@/lib/api/listings";
import type { Listing } from "@/lib/types/listing";

function PropertiesSkeleton() {
  return (
    <Grid columns={3} gap="md">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} height="24rem" borderRadius="lg" />
      ))}
    </Grid>
  );
}

export default function PropertiesPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    searchListings({}, 1, 50)
      .then((res) => {
        const mine = res.items.filter((l) => l.landlordId === profile?.id);
        setListings(mine);
      })
      .catch(() => setError("Failed to load your properties."))
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const handleClick = useCallback(
    (id: string) => {
      router.push(`/properties/${id}`);
    },
    [router],
  );

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="md" direction="horizontal" align="center" justify="between">
          <Heading level={1}>My Properties</Heading>
          <Button
            variant="primary"
            onClick={() => router.push("/properties/create")}
          >
            Create Listing
          </Button>
        </Stack>

        {error && <Alert variant="error">{error}</Alert>}

        {loading && <PropertiesSkeleton />}

        {!loading && !error && listings.length === 0 && (
          <EmptyState
            title="No properties"
            description="You have not listed any properties yet. Create your first listing."
          />
        )}

        {!loading && listings.length > 0 && (
          <Grid columns={3} gap="md">
            {listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onClick={() => handleClick(listing.id)}
              />
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
