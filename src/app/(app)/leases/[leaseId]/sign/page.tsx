"use client";

import {
  Alert,
  Button,
  Card,
  Container,
  Heading,
  ProgressBar,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useRef, useState } from "react";
import { useSignLease } from "@/lib/blockchain/hooks/useSignLease";

const LEASE_DOCUMENT = `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is entered into between the Landlord and the Tenant, identified by their respective on-chain wallet addresses and verified World ID credentials.

1. PROPERTY
The Landlord agrees to rent the property as described in the associated listing to the Tenant for the duration specified in this lease.

2. TERM
The lease term begins on the start date and ends on the end date as recorded on-chain. Early termination requires mutual consent or follows the dispute resolution process.

3. RENT
The Tenant agrees to pay the monthly rent amount in the specified cryptocurrency (USDC or EURC) to the smart contract escrow on or before each due date.

4. SECURITY DEPOSIT
The Tenant shall fund the escrow contract with the deposit amount upon signing. The deposit is held in the smart contract and released per the terms of the agreement upon lease completion.

5. MOVE-IN / MOVE-OUT
Both parties acknowledge the move-in condition as recorded at check-in. The move-out process requires the Tenant to initiate through the smart contract, triggering the deposit release mechanism.

6. PRIVACY
All personal information is protected through zero-knowledge proofs. Neither party's real-world identity is disclosed. Credential verifications are performed through the Unlink protocol.

7. DISPUTE RESOLUTION
Disputes are handled through the on-chain dispute resolution mechanism. Both parties may submit evidence, and resolution follows the protocol's governance process.

8. GOVERNING PROTOCOL
This agreement is governed by the Pliq smart contract protocol deployed on the blockchain. Both parties acknowledge the immutability and transparency of on-chain records.

By signing this agreement, both parties confirm they have read, understood, and agree to all terms and conditions outlined above.`;

export default function SignLeasePage({
  params,
}: {
  params: Promise<{ leaseId: string }>;
}) {
  const { leaseId } = use(params);
  const router = useRouter();
  const { signLease, isPending, isSuccess, txHash } = useSignLease();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasReadAll, setHasReadAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const clamped = Math.min(Math.max(progress, 0), 1);
    setScrollProgress(clamped);
    if (clamped >= 0.95) setHasReadAll(true);
  }, []);

  const handleSign = useCallback(async () => {
    setError(null);
    try {
      await signLease(leaseId);
    } catch {
      setError("Failed to sign lease. Please try again.");
    }
  }, [signLease, leaseId]);

  if (isSuccess) {
    return (
      <Container size="lg">
        <Stack gap="lg" align="center">
          <Spacer size="xl" />
          <Alert variant="success">Lease signed successfully!</Alert>
          {txHash && (
            <Text size="sm" color="secondary">
              Transaction: {txHash}
            </Text>
          )}
          <Button
            variant="primary"
            onClick={() => router.push(`/leases/${leaseId}`)}
          >
            Back to lease
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Sign Lease Agreement</Heading>
        <Text color="secondary">
          Please read the entire agreement before signing.
        </Text>

        <ProgressBar value={Math.round(scrollProgress * 100)} max={100} />

        <Card>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              maxHeight: "40rem",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              padding: "1.6rem",
            }}
          >
            <Text>{LEASE_DOCUMENT}</Text>
          </div>
        </Card>

        {error && <Alert variant="error">{error}</Alert>}

        <Spacer size="md" />

        <Button
          variant="primary"
          isDisabled={!hasReadAll || isPending}
          onClick={handleSign}
        >
          {isPending ? <Spinner size="sm" /> : "Sign Lease"}
        </Button>

        {!hasReadAll && (
          <Text size="sm" color="secondary">
            Scroll to the bottom to enable signing.
          </Text>
        )}
      </Stack>
    </Container>
  );
}
