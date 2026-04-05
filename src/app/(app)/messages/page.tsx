"use client";

import {
  Alert,
  Avatar,
  Badge,
  Card,
  Container,
  EmptyState,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getConversations } from "@/lib/api/messages";
import type { MessageThread } from "@/lib/types/message";

function formatTimestamp(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function ConversationsSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} height="8rem" borderRadius="lg" />
      ))}
    </Stack>
  );
}

function ConversationRow({
  thread,
  onClick,
}: {
  thread: MessageThread;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick}>
      <Stack gap="sm" direction="horizontal" align="center">
        <Avatar
          fallback={thread.otherUserName}
          src={thread.otherUserAvatar ?? undefined}
          size="md"
        />
        <Stack gap="xs">
          <Stack
            gap="sm"
            direction="horizontal"
            align="center"
            justify="between"
          >
            <Text weight="medium">{thread.otherUserName}</Text>
            <Text size="xs" color="secondary">
              {formatTimestamp(thread.lastMessageAt)}
            </Text>
          </Stack>
          <Text size="sm" color="secondary">
            {thread.lastMessage
              ? thread.lastMessage.length > 60
                ? `${thread.lastMessage.slice(0, 60)}...`
                : thread.lastMessage
              : "No messages yet"}
          </Text>
        </Stack>
        {thread.unreadCount > 0 && <Badge>{thread.unreadCount}</Badge>}
      </Stack>
    </Card>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => setError("Failed to load conversations."))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = useCallback(
    (roomId: string) => {
      router.push(`/messages/${roomId}`);
    },
    [router],
  );

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Messages</Heading>

        {error && <Alert variant="error">{error}</Alert>}

        {loading && <ConversationsSkeleton />}

        {!loading && !error && conversations.length === 0 && (
          <EmptyState
            title="No conversations"
            description="Your messages with landlords and tenants will appear here."
          />
        )}

        {!loading &&
          conversations.map((thread) => (
            <ConversationRow
              key={thread.roomId}
              thread={thread}
              onClick={() => handleClick(thread.roomId)}
            />
          ))}
      </Stack>
    </Container>
  );
}
