"use client";

import {
  Alert,
  Button,
  Heading,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
  TextInput,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createProfile } from "@/lib/api/users";
import {
  type ValidationErrors,
  validateProfile,
} from "@/lib/validation/validateProfile";

const ROLE_OPTIONS = [
  { value: "tenant", label: "Tenant" },
  { value: "landlord", label: "Landlord" },
  { value: "both", label: "Both" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { login, token } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const validationErrors = validateProfile({
      displayName,
      role,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const newProfile = await createProfile({
        displayName: displayName.trim(),
        role,
        preferredLanguage,
      });

      if (token) {
        login(token, newProfile);
      }

      const destination =
        newProfile.role === "landlord" ? "/dashboard" : "/credentials";
      router.push(destination);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create profile",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack gap="md">
      <Heading level={2}>Set Up Your Profile</Heading>

      <Text align="center" color="secondary">
        Tell us a bit about yourself to personalize your experience.
      </Text>

      <Spacer size="sm" />

      {submitError && <Alert variant="error">{submitError}</Alert>}

      <TextInput
        label="Display Name"
        placeholder="How should we call you?"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        errorMessage={errors.displayName}
        isRequired
      />

      <RadioGroup
        label="I am a..."
        name="role"
        options={ROLE_OPTIONS}
        value={role}
        onChange={setRole}
      />

      <Select
        label="Preferred Language"
        options={LANGUAGE_OPTIONS}
        value={preferredLanguage}
        onChange={setPreferredLanguage}
      />

      <Spacer size="md" />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSubmit}
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Creating profile..." : "Continue"}
      </Button>
    </Stack>
  );
}
