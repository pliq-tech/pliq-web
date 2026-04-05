"use client";

import {
  Alert,
  Container,
  EmptyState,
  Grid,
  Heading,
  RadioGroup,
  SearchInput,
  Select,
  Skeleton,
  Slider,
  Spacer,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { PropertyCard } from "@/components/features/PropertyCard";
import { useListings } from "@/hooks/api/useListings";
import type { ListingFilter } from "@/lib/types/listing";

const PROPERTY_TYPES = [
  { value: "all", label: "All" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

function buildFiltersFromParams(params: URLSearchParams): ListingFilter {
  return {
    city: params.get("city") ?? undefined,
    minRent: params.get("minRent") ? Number(params.get("minRent")) : undefined,
    maxRent: params.get("maxRent") ? Number(params.get("maxRent")) : undefined,
    minBedrooms: params.get("bedrooms")
      ? Number(params.get("bedrooms"))
      : undefined,
  };
}

function SearchFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: ListingFilter) => void;
}) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("all");

  const applyFilters = useCallback(
    (overrides: Partial<{ price: [number, number]; beds: string }>) => {
      const price = overrides.price ?? priceRange;
      const beds = overrides.beds ?? bedrooms;
      onFilterChange({
        minRent: price[0] > 0 ? price[0] : undefined,
        maxRent: price[1] < 5000 ? price[1] : undefined,
        minBedrooms: beds ? Number(beds) : undefined,
      });
    },
    [priceRange, bedrooms, onFilterChange],
  );

  return (
    <Stack gap="md">
      <Stack gap="sm">
        <Text size="sm" weight="medium">
          Price range (per month)
        </Text>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange[1]}
          onChange={(val) => {
            const next: [number, number] = [priceRange[0], val];
            setPriceRange(next);
            applyFilters({ price: next });
          }}
        />
        <Text size="xs" color="secondary">
          Up to {priceRange[1]} / month
        </Text>
      </Stack>
      <Select
        label="Bedrooms"
        value={bedrooms}
        onChange={(val) => {
          setBedrooms(val);
          applyFilters({ beds: val });
        }}
        options={BEDROOM_OPTIONS}
      />
      <RadioGroup
        label="Property type"
        name="propertyType"
        value={propertyType}
        onChange={setPropertyType}
        options={PROPERTY_TYPES}
      />
    </Stack>
  );
}

function ListingSkeleton() {
  return (
    <Grid columns={3} gap="md">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} height="24rem" borderRadius="lg" />
      ))}
    </Grid>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = buildFiltersFromParams(searchParams);
  const { listings, isLoading, error, setFilters } =
    useListings(initialFilters);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setFilters({ city: value || undefined });
    },
    [setFilters],
  );

  const handleFilterChange = useCallback(
    (filters: ListingFilter) => {
      setFilters({ ...filters, city: query || undefined });
    },
    [setFilters, query],
  );

  const handlePropertyClick = useCallback(
    (id: string) => {
      router.push(`/search/${id}`);
    },
    [router],
  );

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Find your next home</Heading>
        <SearchInput
          placeholder="Search by city or neighborhood..."
          value={query}
          onChange={handleSearch}
        />
        <SearchFilters onFilterChange={handleFilterChange} />
        <Spacer size="sm" />

        {error && <Alert variant="error">{error.message}</Alert>}

        {isLoading && <ListingSkeleton />}

        {!isLoading && !error && listings.length === 0 && (
          <EmptyState
            title="No listings found"
            description="Try adjusting your filters or search a different area."
          />
        )}

        {!isLoading && listings.length > 0 && (
          <Grid columns={3} gap="md">
            {listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onClick={() => handlePropertyClick(listing.id)}
              />
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
