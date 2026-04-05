"use client";

import {
  Badge,
  Button,
  Card,
  Grid,
  Heading,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@pliq/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DocumentType } from "@/lib/privacy/self";
import { scanDocument } from "@/lib/privacy/self";
import {
  type Credential,
  type CredentialType,
  generateCredential,
} from "@/lib/privacy/unlink";
import styles from "./credentialsStyles.module.css";

interface CredentialTypeInfo {
  type: CredentialType;
  label: string;
  description: string;
  documentType: DocumentType;
}

const CREDENTIAL_TYPES: CredentialTypeInfo[] = [
  {
    type: "income",
    label: "Income",
    description: "Verify your income range without revealing exact amounts",
    documentType: "payslip",
  },
  {
    type: "employment",
    label: "Employment",
    description: "Prove active employment without sharing employer details",
    documentType: "payslip",
  },
  {
    type: "credit_score",
    label: "Credit Score",
    description: "Share your creditworthiness as a range, not a number",
    documentType: "bank_statement",
  },
  {
    type: "rental_history",
    label: "Rental History",
    description: "Demonstrate good rental track record privately",
    documentType: "bank_statement",
  },
  {
    type: "identity_age",
    label: "Identity Age",
    description: "Prove you meet age requirements without revealing birthdate",
    documentType: "passport",
  },
];

export default function CredentialsPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<
    Map<CredentialType, Credential>
  >(new Map());
  const [processingType, setProcessingType] = useState<CredentialType | null>(
    null,
  );
  const [error, setError] = useState("");

  const generatedCount = credentials.size;
  const canContinue = generatedCount >= 1;

  async function handleGenerateCredential(info: CredentialTypeInfo) {
    if (credentials.has(info.type) || processingType) return;

    setProcessingType(info.type);
    setError("");

    try {
      const documentData = await scanDocument(info.documentType);
      const credential = await generateCredential(info.type, documentData);

      setCredentials((prev) => {
        const next = new Map(prev);
        next.set(info.type, credential);
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate credential",
      );
    } finally {
      setProcessingType(null);
    }
  }

  function handleContinue() {
    router.push("/dashboard");
  }

  return (
    <Stack gap="md">
      <Heading level={2}>Generate Your Credentials</Heading>

      <Text align="center" color="secondary">
        Create zero-knowledge credentials from your documents. Only verified
        claims are stored -- your raw data never leaves your device.
      </Text>

      <Spacer size="sm" />

      {error && (
        <Text color="error" size="sm" align="center">
          {error}
        </Text>
      )}

      <Grid columns={1} gap="md">
        {CREDENTIAL_TYPES.map((info) => (
          <CredentialCard
            key={info.type}
            info={info}
            isGenerated={credentials.has(info.type)}
            isProcessing={processingType === info.type}
            isDisabled={processingType !== null && processingType !== info.type}
            onGenerate={() => handleGenerateCredential(info)}
          />
        ))}
      </Grid>

      <Spacer size="md" />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleContinue}
        isDisabled={!canContinue}
      >
        Continue to Dashboard ({generatedCount}/5 credentials)
      </Button>

      <Link href="/dashboard" className={styles.skipLink}>
        <Text size="sm" color="secondary" align="center">
          Skip for now
        </Text>
      </Link>
    </Stack>
  );
}

function CredentialCard({
  info,
  isGenerated,
  isProcessing,
  isDisabled,
  onGenerate,
}: {
  info: CredentialTypeInfo;
  isGenerated: boolean;
  isProcessing: boolean;
  isDisabled: boolean;
  onGenerate: () => void;
}) {
  return (
    <Card
      onClick={isGenerated || isDisabled ? undefined : onGenerate}
      className={`${styles.credentialCard} ${isGenerated ? styles.generated : ""} ${isDisabled ? styles.disabled : ""}`}
    >
      <div className={styles.cardContent}>
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <Text weight="bold">{info.label}</Text>
            {isGenerated && <Badge variant="success">Generated</Badge>}
          </div>
          <Text size="sm" color="secondary">
            {info.description}
          </Text>
        </div>

        {isProcessing && (
          <div className={styles.cardSpinner}>
            <Spinner size="sm" />
          </div>
        )}
      </div>
    </Card>
  );
}
