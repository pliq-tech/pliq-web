"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Heading,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useListing } from "@/hooks/api/useListing";
import { submitApplication } from "@/lib/api/applications";
import { getCredentials } from "@/lib/api/credentials";
import type { Credential, CredentialType } from "@/lib/privacy/unlink";
import { createProofBundle } from "@/lib/privacy/unlink";

function PropertySummary({
  title,
  address,
  rent,
  currency,
}: {
  title: string;
  address: string;
  rent: number;
  currency: string;
}) {
  return (
    <Card>
      <Stack gap="sm">
        <Heading level={3}>{title}</Heading>
        <Text color="secondary">{address}</Text>
        <Text weight="bold">
          {rent} {currency.toUpperCase()} / month
        </Text>
      </Stack>
    </Card>
  );
}

function CredentialChecklist({
  required,
  available,
}: {
  required: string[];
  available: Credential[];
}) {
  const availableTypes = useMemo(
    () => new Set(available.map((c) => c.type)),
    [available],
  );

  return (
    <Stack gap="sm">
      <Heading level={3}>Required credentials</Heading>
      {required.map((req) => (
        <Checkbox
          key={req}
          label={req.replace(/_/g, " ")}
          isChecked={availableTypes.has(req as CredentialType)}
          isDisabled
        />
      ))}
    </Stack>
  );
}

export default function ApplyPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);
  const router = useRouter();
  const { listing, isLoading: listingLoading } = useListing(listingId);

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credsLoading, setCredsLoading] = useState(true);
  const [coverMessage, setCoverMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCredentials()
      .then(setCredentials)
      .catch(() => setCredentials([]))
      .finally(() => setCredsLoading(false));
  }, []);

  const requiredCreds = listing?.requiredCredentials ?? [];
  const availableTypes = new Set<string>(credentials.map((c) => c.type));
  const allMet = requiredCreds.every((r) => availableTypes.has(r));
  const missingCreds = requiredCreds.filter((r) => !availableTypes.has(r));

  const handleSubmit = useCallback(async () => {
    if (!listing) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const bundle = await createProofBundle(credentials, requiredCreds);
      await submitApplication(listing.id, {
        coverMessage: coverMessage || undefined,
        zkProofHash: bundle.proofHash,
        credentialSummary: { credentials: bundle.credentials.length },
      });
      router.push("/applications");
    } catch {
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [listing, credentials, requiredCreds, coverMessage, router]);

  if (listingLoading || credsLoading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Skeleton height="12rem" borderRadius="lg" />
          <Skeleton height="8rem" />
          <Skeleton height="4rem" />
        </Stack>
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
        <Heading level={1}>Apply for Rental</Heading>

        <PropertySummary
          title={listing.title}
          address={`${listing.address}, ${listing.city}`}
          rent={listing.rentAmount}
          currency={listing.currency}
        />

        {requiredCreds.length > 0 && (
          <CredentialChecklist
            required={requiredCreds}
            available={credentials}
          />
        )}

        {missingCreds.length > 0 && (
          <Alert variant="warning">
            Missing credentials: {missingCreds.join(", ")}. Please issue them
            before applying.
          </Alert>
        )}

        <TextInput
          label="Cover message (optional)"
          value={coverMessage}
          onChange={(e) => setCoverMessage(e.target.value)}
          placeholder="Tell the landlord about yourself..."
        />

        {error && <Alert variant="error">{error}</Alert>}

        <Spacer size="md" />

        <Button
          variant="primary"
          isDisabled={!allMet || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? <Spinner size="sm" /> : "Submit Application"}
        </Button>
      </Stack>
    </Container>
  );
}
