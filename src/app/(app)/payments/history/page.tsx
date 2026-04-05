"use client";

import {
  Alert,
  Container,
  EmptyState,
  Heading,
  Skeleton,
  Stack,
  Table,
} from "@pliq/ui";
import { useEffect, useState } from "react";
import { getPaymentHistory } from "@/lib/api/payments";
import type { PaymentRecord } from "@/lib/types/lease";

type TagVariant = "default" | "primary" | "success" | "warning" | "error";

function _statusVariant(status: string): TagVariant {
  if (status === "confirmed" || status === "paid") return "success";
  if (status === "failed") return "error";
  if (status === "pending") return "warning";
  return "default";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString();
}

function truncateHash(hash: string | null): string {
  if (!hash) return "--";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function HistorySkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} height="4.8rem" borderRadius="md" />
      ))}
    </Stack>
  );
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPaymentHistory()
      .then(setPayments)
      .catch(() => setError("Failed to load payment history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Payment History</Heading>
          <HistorySkeleton />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Payment History</Heading>
          <Alert variant="error">{error}</Alert>
        </Stack>
      </Container>
    );
  }

  if (payments.length === 0) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Payment History</Heading>
          <EmptyState
            title="No payment history"
            description="Your past payments will appear here."
          />
        </Stack>
      </Container>
    );
  }

  const columns = [
    { key: "date", header: "Date" },
    { key: "amount", header: "Amount" },
    { key: "status", header: "Status" },
    { key: "txHash", header: "Tx Hash" },
    { key: "lease", header: "Lease" },
  ];

  const data = payments.map((p) => ({
    id: p.id,
    date: formatDate(p.paidAt ?? p.createdAt),
    amount: `${p.amount} ${p.currency.toUpperCase()}`,
    status: p.status,
    txHash: truncateHash(p.txHash),
    lease: p.leaseId.slice(0, 8),
  }));

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Payment History</Heading>
        <Table columns={columns} data={data} />
      </Stack>
    </Container>
  );
}
