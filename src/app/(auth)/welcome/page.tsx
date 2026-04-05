"use client";

import { Button, Heading, Spacer, Stack, Text } from "@pliq/ui";
import { useRouter } from "next/navigation";
import styles from "./welcomeStyles.module.css";

export default function WelcomePage() {
  const router = useRouter();

  function handleVerify() {
    router.push("/verify");
  }

  return (
    <Stack gap="md" align="center">
      <Heading level={1}>Welcome to Pliq</Heading>

      <Spacer size="sm" />

      <Text align="center" color="secondary">
        Pliq uses zero-knowledge proofs and World ID to let you rent properties
        without exposing your personal data. Your credentials stay private --
        only verified claims are shared.
      </Text>

      <Spacer size="md" />

      <div className={styles.features}>
        <div className={styles.feature}>
          <Text weight="bold">Privacy-First</Text>
          <Text size="sm" color="secondary">
            ZK proofs verify your eligibility without revealing documents
          </Text>
        </div>
        <div className={styles.feature}>
          <Text weight="bold">World ID Verified</Text>
          <Text size="sm" color="secondary">
            Prove you are a unique human with biometric verification
          </Text>
        </div>
        <div className={styles.feature}>
          <Text weight="bold">On-Chain Trust</Text>
          <Text size="sm" color="secondary">
            Build portable reputation across the rental ecosystem
          </Text>
        </div>
      </div>

      <Spacer size="lg" />

      <Button variant="primary" size="lg" fullWidth onClick={handleVerify}>
        Verify with World ID
      </Button>
    </Stack>
  );
}
