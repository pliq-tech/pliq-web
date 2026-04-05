"use client";

import {
  Alert,
  Button,
  Container,
  EmptyState,
  Grid,
  Heading,
  Skeleton,
  Spacer,
  Stack,
  Stat,
} from "@pliq/ui";
import { useCallback, useEffect, useState } from "react";
import { CredentialCard } from "@/components/features/CredentialCard";
import { ScoreChart } from "@/components/features/ScoreChart";
import { api } from "@/lib/api/client";
import { getCredentials } from "@/lib/api/credentials";
import type { Credential } from "@/lib/privacy/unlink";
import { generateShareableProof } from "@/lib/privacy/unlink";
import type { PorBreakdown, PorScore, PorTrend } from "@/lib/types/por";

interface ReputationMeResponse {
  score: PorScore;
  breakdown: PorBreakdown;
  trends: PorTrend[];
}

function ReputationSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height="10rem" borderRadius="lg" />
      <Grid columns={4} gap="md">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} height="8rem" />
        ))}
      </Grid>
      <Skeleton height="20rem" borderRadius="lg" />
    </Stack>
  );
}

function BreakdownStats({ breakdown }: { breakdown: PorBreakdown }) {
  return (
    <Grid columns={4} gap="md">
      <Stat label="Punctuality" value={`${breakdown.punctuality}%`} />
      <Stat label="Completion" value={`${breakdown.completion}%`} />
      <Stat label="Tenure" value={`${breakdown.tenure}%`} />
      <Stat label="Dispute-Free" value={`${breakdown.disputeFree}%`} />
    </Grid>
  );
}

export default function ReputationPage() {
  const [score, setScore] = useState<PorScore | null>(null);
  const [breakdown, setBreakdown] = useState<PorBreakdown | null>(null);
  const [trends, setTrends] = useState<PorTrend[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ReputationMeResponse>("/api/v1/reputation/me"),
      getCredentials(),
    ])
      .then(([rep, c]) => {
        setScore(rep.score);
        setBreakdown(rep.breakdown);
        setTrends(rep.trends);
        setCredentials(c);
      })
      .catch(() => setError("Failed to load reputation data."))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = useCallback(async () => {
    if (!score) return;
    try {
      const link = await generateShareableProof(score.score, [0, 100]);
      setShareLink(link);
    } catch {
      setError("Failed to generate share link.");
    }
  }, [score]);

  if (loading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Proof of Rent</Heading>
          <ReputationSkeleton />
        </Stack>
      </Container>
    );
  }

  if (error && !score) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Proof of Rent</Heading>
          <Alert variant="error">{error}</Alert>
        </Stack>
      </Container>
    );
  }

  if (!score) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Heading level={1}>Proof of Rent</Heading>
          <EmptyState
            title="No reputation yet"
            description="Complete your first rental to build your on-chain reputation."
          />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Proof of Rent</Heading>

        <Stat label="PoR Score" value={String(score.score)} />

        {breakdown && <BreakdownStats breakdown={breakdown} />}

        {trends.length > 0 && (
          <ScoreChart
            data={trends.map((t) => ({ month: t.month, score: t.score }))}
            height={240}
          />
        )}

        {credentials.length > 0 && (
          <Stack gap="md">
            <Heading level={2}>Credentials</Heading>
            <Grid columns={2} gap="md">
              {credentials.map((cred) => (
                <CredentialCard
                  key={cred.id}
                  type={cred.type}
                  status="active"
                  issuedAt={cred.issuedAt}
                  expiresAt={cred.expiresAt}
                  onAction={() => {}}
                />
              ))}
            </Grid>
          </Stack>
        )}

        <Spacer size="md" />

        <Button variant="primary" onClick={handleShare}>
          Share Reputation
        </Button>

        {shareLink && <Alert variant="success">Share link: {shareLink}</Alert>}
      </Stack>
    </Container>
  );
}
