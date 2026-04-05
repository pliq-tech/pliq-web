"use client";

import {
  Alert,
  Avatar,
  Button,
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
import { use } from "react";
import { ImageCarousel } from "@/components/features/ImageCarousel";
import { useListing } from "@/hooks/api/useListing";

function ListingDetailSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="32rem" borderRadius="lg" />
      <Skeleton height="3.2rem" width="60%" />
      <Skeleton height="2rem" width="40%" />
      <Grid columns={3} gap="md">
        <Skeleton height="8rem" />
        <Skeleton height="8rem" />
        <Skeleton height="8rem" />
      </Grid>
      <Skeleton height="12rem" />
    </Stack>
  );
}

function ListingStats({
  bedrooms,
  bathrooms,
  areaSqm,
}: {
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
}) {
  return (
    <Grid columns={3} gap="md">
      <Stat label="Bedrooms" value={String(bedrooms)} />
      <Stat label="Bathrooms" value={String(bathrooms)} />
      <Stat label="Area" value={`${areaSqm} m2`} />
    </Grid>
  );
}

function AmenityList({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) return null;
  return (
    <Stack gap="sm">
      <Heading level={3}>Amenities</Heading>
      <Stack gap="xs" direction="horizontal" wrap>
        {amenities.map((amenity) => (
          <Tag key={amenity}>{amenity}</Tag>
        ))}
      </Stack>
    </Stack>
  );
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);
  const router = useRouter();
  const { listing, isLoading, error } = useListing(listingId);

  if (isLoading) {
    return (
      <Container size="lg">
        <ListingDetailSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Alert variant="error">{error.message}</Alert>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container size="lg">
        <Alert variant="error">Listing not found.</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        {listing.photos.length > 0 && (
          <ImageCarousel images={listing.photos} alt={listing.title} />
        )}

        <Stack gap="sm">
          <Heading level={1}>{listing.title}</Heading>
          <Text size="lg" color="secondary">
            {listing.address}, {listing.city}
          </Text>
          <Text size="lg" weight="bold">
            {listing.rentAmount} {listing.currency.toUpperCase()} / month
          </Text>
        </Stack>

        <ListingStats
          bedrooms={listing.bedrooms}
          bathrooms={listing.bathrooms}
          areaSqm={listing.areaSqm}
        />

        <Divider />

        <Stack gap="sm">
          <Heading level={3}>Description</Heading>
          <Text>{listing.description}</Text>
        </Stack>

        <AmenityList amenities={listing.amenities} />

        <Divider />

        <Stack gap="sm" direction="horizontal" align="center">
          <Avatar fallback="Landlord" size="md" />
          <Text weight="medium">Property Manager</Text>
        </Stack>

        <Spacer size="md" />

        <Stack gap="md" direction="horizontal">
          <Button
            variant="secondary"
            onClick={() => router.push(`/search/${listingId}/schedule`)}
          >
            Schedule Visit
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/search/${listingId}/apply`)}
          >
            Apply Now
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
