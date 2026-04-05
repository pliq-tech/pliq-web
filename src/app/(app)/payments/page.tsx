"use client";

import {
  Alert,
  Button,
  Container,
  EmptyState,
  Heading,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PaymentCard } from "@/components/features/PaymentCard";
import { getPaymentsDue } from "@/lib/api/payments";
import { usePayRent } from "@/lib/blockchain/hooks/usePayRent";
import type { PaymentRecord } from "@/lib/types/lease";

function PaymentsSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 2 }, (_, i) => (
        <Skeleton key={i} height="14rem" borderRadius="lg" />
      ))}
    </Stack>
  );
}

export default function PaymentsPage() {
  const router = useRouter();
  const { payRent, isPending, isSuccess, txHash } = usePayRent();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    getPaymentsDue()
      .then(setPayments)
      .catch(() => setError("Failed to load payments."))
      .finally(() => setLoading(false));
  }, []);

  const handlePay = useCallback(
    async (payment: PaymentRecord) => {
      setPayingId(payment.id);
      setError(null);
      try {
        await payRent(payment.leaseId, payment.amount);
      } catch {
        setError("Payment failed. Please try again.");
        setPayingId(null);
      }
    },
    [payRent],
  );

  if (loading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Payments</Heading>
          <PaymentsSkeleton />
        </Stack>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container size="lg">
        <Stack gap="lg" align="center">
          <Spacer size="xl" />
          <Alert variant="success">Payment successful!</Alert>
          {txHash && (
            <Text size="sm" color="secondary">
              Transaction: {txHash}
            </Text>
          )}
          <Button variant="primary" onClick={() => window.location.reload()}>
            Done
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Payments</Heading>

        {error && <Alert variant="error">{error}</Alert>}

        {payments.length === 0 && (
          <EmptyState
            title="No payments due"
            description="You are all caught up. No rent payments are currently due."
          />
        )}

        {payments.map((payment) => {
          const isOverdue =
            payment.dueDate != null && new Date(payment.dueDate) < new Date();

          return (
            <PaymentCard
              key={payment.id}
              amount={payment.amount}
              currency={payment.currency}
              dueDate={payment.dueDate ?? "N/A"}
              leaseRef={payment.leaseId.slice(0, 8)}
              isOverdue={isOverdue}
              onPay={() => handlePay(payment)}
            />
          );
        })}

        {isPending && payingId && (
          <Stack gap="sm" align="center">
            <Spinner size="md" />
            <Text color="secondary">Processing payment...</Text>
          </Stack>
        )}

        <Spacer size="md" />

        <Button
          variant="secondary"
          onClick={() => router.push("/payments/history")}
        >
          View Payment History
        </Button>
      </Stack>
    </Container>
  );
}
