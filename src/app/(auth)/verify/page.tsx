"use client";

import { Alert, Button, Spacer, Spinner, Stack, Text } from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { verifyWorldId } from "@/lib/api/users";
import { getWorldIdConfig } from "@/lib/privacy/worldId";
import type { WorldIdProof } from "@/lib/types/auth";

type VerifyStatus = "verifying" | "success" | "error";

export default function VerifyPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const performVerification = useCallback(async () => {
    try {
      const worldIdConfig = getWorldIdConfig();

      // Stub proof for development -- real World ID SDK would provide this
      const stubProof: WorldIdProof = {
        merkle_root: `0x${"a".repeat(64)}`,
        nullifier_hash: `0x${crypto.randomUUID().replace(/-/g, "")}${"0".repeat(32)}`,
        proof: `0x${"b".repeat(512)}`,
        verification_level: worldIdConfig.verification_level ?? "orb",
      };

      const session = await verifyWorldId(stubProof);
      setStatus("success");

      login(session.token, {
        id: session.userId,
        nullifierHash: session.nullifierHash,
        walletAddress: null,
        displayName: null,
        avatarUrl: null,
        role: "tenant",
        verificationLevel: session.verificationLevel,
        preferredLanguage: "en",
        createdAt: new Date().toISOString(),
      });

      router.push("/profile-setup");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Verification failed",
      );
    }
  }, [login, router]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  if (status === "error") {
    return (
      <Stack gap="md" align="center">
        <Alert variant="error">{errorMessage}</Alert>

        <Spacer size="md" />

        <Button variant="primary" onClick={() => router.push("/welcome")}>
          Try Again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md" align="center">
      <Spinner size="lg" />

      <Spacer size="sm" />

      <Text align="center" weight="bold">
        Verifying your identity...
      </Text>

      <Text align="center" size="sm" color="secondary">
        Connecting to World ID for biometric verification. This may take a
        moment.
      </Text>
    </Stack>
  );
}
