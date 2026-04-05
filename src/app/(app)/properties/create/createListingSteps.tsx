"use client";

import { Card, Checkbox, Select, Stack, Text, TextInput } from "@pliq/ui";
import { useCallback } from "react";

export interface CreateListingFormData {
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  bedrooms: string;
  bathrooms: string;
  areaSqm: string;
  rentAmount: string;
  depositAmount: string;
  currency: string;
  amenities: string;
  requiredCredentials: string[];
}

export const INITIAL_FORM: CreateListingFormData = {
  title: "",
  description: "",
  address: "",
  city: "",
  country: "",
  bedrooms: "1",
  bathrooms: "1",
  areaSqm: "",
  rentAmount: "",
  depositAmount: "",
  currency: "usdc",
  amenities: "",
  requiredCredentials: [],
};

export const STEPS = ["Details", "Photos", "Pricing", "Requirements", "Review"];

const CURRENCY_OPTIONS = [
  { value: "usdc", label: "USDC" },
  { value: "eurc", label: "EURC" },
];

const CREDENTIAL_OPTIONS = [
  "income",
  "employment",
  "credit_score",
  "rental_history",
  "identity_age",
];

type UpdateFn = (patch: Partial<CreateListingFormData>) => void;

export function StepDetails({
  form,
  update,
}: {
  form: CreateListingFormData;
  update: UpdateFn;
}) {
  return (
    <Stack gap="md">
      <TextInput
        label="Title"
        value={form.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Cozy apartment in city center"
      />
      <TextInput
        label="Description"
        value={form.description}
        onChange={(e) => update({ description: e.target.value })}
        placeholder="Describe your property..."
      />
      <TextInput
        label="Address"
        value={form.address}
        onChange={(e) => update({ address: e.target.value })}
        placeholder="123 Main St"
      />
      <Stack gap="md" direction="horizontal">
        <TextInput
          label="City"
          value={form.city}
          onChange={(e) => update({ city: e.target.value })}
          placeholder="Cannes"
        />
        <TextInput
          label="Country"
          value={form.country}
          onChange={(e) => update({ country: e.target.value })}
          placeholder="France"
        />
      </Stack>
      <Stack gap="md" direction="horizontal">
        <TextInput
          label="Bedrooms"
          value={form.bedrooms}
          onChange={(e) => update({ bedrooms: e.target.value })}
          placeholder="2"
        />
        <TextInput
          label="Bathrooms"
          value={form.bathrooms}
          onChange={(e) => update({ bathrooms: e.target.value })}
          placeholder="1"
        />
        <TextInput
          label="Area (sqm)"
          value={form.areaSqm}
          onChange={(e) => update({ areaSqm: e.target.value })}
          placeholder="65"
        />
      </Stack>
    </Stack>
  );
}

export function StepPhotos() {
  return (
    <Stack gap="md">
      <Text color="secondary">
        Photo upload will be available in a future release. Your listing will be
        created without photos for now.
      </Text>
    </Stack>
  );
}

export function StepPricing({
  form,
  update,
}: {
  form: CreateListingFormData;
  update: UpdateFn;
}) {
  return (
    <Stack gap="md">
      <TextInput
        label="Monthly Rent"
        value={form.rentAmount}
        onChange={(e) => update({ rentAmount: e.target.value })}
        placeholder="1200"
      />
      <TextInput
        label="Deposit Amount"
        value={form.depositAmount}
        onChange={(e) => update({ depositAmount: e.target.value })}
        placeholder="2400"
      />
      <Select
        label="Currency"
        value={form.currency}
        onChange={(v) => update({ currency: v })}
        options={CURRENCY_OPTIONS}
      />
      <TextInput
        label="Amenities (comma-separated)"
        value={form.amenities}
        onChange={(e) => update({ amenities: e.target.value })}
        placeholder="WiFi, Parking, Laundry"
      />
    </Stack>
  );
}

export function StepRequirements({
  form,
  update,
}: {
  form: CreateListingFormData;
  update: UpdateFn;
}) {
  const toggle = useCallback(
    (cred: string) => {
      const current = form.requiredCredentials;
      const next = current.includes(cred)
        ? current.filter((c) => c !== cred)
        : [...current, cred];
      update({ requiredCredentials: next });
    },
    [form.requiredCredentials, update],
  );

  return (
    <Stack gap="md">
      <Text>Select required tenant credentials:</Text>
      {CREDENTIAL_OPTIONS.map((cred) => (
        <Checkbox
          key={cred}
          label={cred.replace(/_/g, " ")}
          isChecked={form.requiredCredentials.includes(cred)}
          onChange={() => toggle(cred)}
        />
      ))}
    </Stack>
  );
}

export function StepReview({ form }: { form: CreateListingFormData }) {
  return (
    <Card>
      <Stack gap="sm">
        <Text weight="bold">{form.title || "(No title)"}</Text>
        <Text color="secondary">
          {form.address}, {form.city}, {form.country}
        </Text>
        <Text>
          {form.bedrooms} bed, {form.bathrooms} bath, {form.areaSqm} sqm
        </Text>
        <Text weight="medium">
          {form.rentAmount} {form.currency.toUpperCase()} / month
        </Text>
        <Text color="secondary">
          Deposit: {form.depositAmount} {form.currency.toUpperCase()}
        </Text>
        {form.amenities && <Text size="sm">Amenities: {form.amenities}</Text>}
        {form.requiredCredentials.length > 0 && (
          <Text size="sm">Required: {form.requiredCredentials.join(", ")}</Text>
        )}
      </Stack>
    </Card>
  );
}

export function validateStep(
  step: number,
  form: CreateListingFormData,
): string | null {
  if (step === 0) {
    if (!form.title) return "Title is required.";
    if (!form.address) return "Address is required.";
    if (!form.city) return "City is required.";
  }
  if (step === 2) {
    if (!form.rentAmount || Number(form.rentAmount) <= 0)
      return "Valid rent amount is required.";
    if (!form.depositAmount || Number(form.depositAmount) <= 0)
      return "Valid deposit amount is required.";
  }
  return null;
}
