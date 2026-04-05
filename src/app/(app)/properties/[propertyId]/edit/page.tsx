"use client";

import {
  Alert,
  Button,
  Container,
  Heading,
  Select,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  TextInput,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { getListing, updateListing } from "@/lib/api/listings";
import type { Listing } from "@/lib/types/listing";

const CURRENCY_OPTIONS = [
  { value: "usdc", label: "USDC" },
  { value: "eurc", label: "EURC" },
];

function EditSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} height="5.6rem" borderRadius="md" />
      ))}
    </Stack>
  );
}

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = use(params);
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [currency, setCurrency] = useState("usdc");
  const [amenities, setAmenities] = useState("");

  useEffect(() => {
    getListing(propertyId)
      .then((l) => {
        setListing(l);
        setTitle(l.title);
        setDescription(l.description);
        setAddress(l.address);
        setCity(l.city);
        setRentAmount(String(l.rentAmount));
        setDepositAmount(String(l.depositAmount));
        setCurrency(l.currency);
        setAmenities(l.amenities.join(", "));
      })
      .catch(() => setError("Failed to load listing."))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await updateListing(propertyId, {
        title,
        description,
        address,
        city,
        rentAmount: Number(rentAmount),
        depositAmount: Number(depositAmount),
        currency: currency as "usdc" | "eurc",
        amenities: amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      });
      setSuccess(true);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }, [
    propertyId,
    title,
    description,
    address,
    city,
    rentAmount,
    depositAmount,
    currency,
    amenities,
  ]);

  if (loading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Edit Listing</Heading>
          <EditSkeleton />
        </Stack>
      </Container>
    );
  }

  if (!listing && error) {
    return (
      <Container size="lg">
        <Alert variant="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Edit Listing</Heading>

        {success && (
          <Alert variant="success">Changes saved successfully.</Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}

        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextInput
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextInput
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Stack gap="md" direction="horizontal">
          <TextInput
            label="Monthly Rent"
            value={rentAmount}
            onChange={(e) => setRentAmount(e.target.value)}
          />
          <TextInput
            label="Deposit"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </Stack>
        <Select
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCY_OPTIONS}
        />
        <TextInput
          label="Amenities (comma-separated)"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />

        <Spacer size="md" />

        <Stack gap="md" direction="horizontal">
          <Button variant="primary" isDisabled={saving} onClick={handleSave}>
            {saving ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/properties/${propertyId}`)}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
