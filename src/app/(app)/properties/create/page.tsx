"use client";

import {
  Alert,
  Button,
  Container,
  Heading,
  ProgressBar,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createListing } from "@/lib/api/listings";
import {
  type CreateListingFormData,
  INITIAL_FORM,
  STEPS,
  StepDetails,
  StepPhotos,
  StepPricing,
  StepRequirements,
  StepReview,
  validateStep,
} from "./createListingSteps";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreateListingFormData>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = useCallback((patch: Partial<CreateListingFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleNext = useCallback(() => {
    const err = validateStep(step, form);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, form]);

  const handleBack = useCallback(() => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      await createListing({
        title: form.title,
        description: form.description,
        address: form.address,
        city: form.city,
        country: form.country,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqm: Number(form.areaSqm),
        rentAmount: Number(form.rentAmount),
        depositAmount: Number(form.depositAmount),
        currency: form.currency as "usdc" | "eurc",
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        requiredCredentials:
          form.requiredCredentials.length > 0 ? form.requiredCredentials : null,
      });
      router.push("/properties");
    } catch {
      setError("Failed to create listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form, router]);

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Create Listing</Heading>
        <ProgressBar value={((step + 1) / STEPS.length) * 100} max={100} />
        <Text weight="medium">
          Step {step + 1}: {STEPS[step]}
        </Text>

        {error && <Alert variant="error">{error}</Alert>}

        {step === 0 && <StepDetails form={form} update={update} />}
        {step === 1 && <StepPhotos />}
        {step === 2 && <StepPricing form={form} update={update} />}
        {step === 3 && <StepRequirements form={form} update={update} />}
        {step === 4 && <StepReview form={form} />}

        <Spacer size="md" />

        <Stack gap="md" direction="horizontal">
          {step > 0 && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < STEPS.length - 1 && (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {step === STEPS.length - 1 && (
            <Button
              variant="primary"
              isDisabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? <Spinner size="sm" /> : "Create Listing"}
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
