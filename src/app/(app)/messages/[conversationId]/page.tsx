"use client";

import {
  Alert,
  Button,
  Container,
  EmptyState,
  Heading,
  Skeleton,
  Stack,
  TextInput,
} from "@pliq/ui";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/features/MessageBubble";
import { useAuth } from "@/contexts/AuthContext";
import { getMessages, sendMessage as sendMessageApi } from "@/lib/api/messages";
import type { Message } from "@/lib/types/message";

function MessagesSkeleton() {
  return (
    <Stack gap="md">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton
          key={i}
          height="4.8rem"
          width={i % 2 === 0 ? "60%" : "50%"}
          borderRadius="lg"
        />
      ))}
    </Stack>
  );
}

function MessageList({
  messages,
  userId,
  bottomRef,
}: {
  messages: Message[];
  userId: string;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1.6rem 0" }}>
      <Stack gap="sm">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === userId}
          />
        ))}
        <div ref={bottomRef} />
      </Stack>
    </div>
  );
}

function MessageComposer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <Stack gap="sm" direction="horizontal" align="end">
      <fieldset
        aria-label="Message input"
        style={{ flex: 1, border: "none", padding: 0, margin: 0 }}
        onKeyDown={handleKeyDown}
      >
        <TextInput
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </fieldset>
      <Button
        variant="primary"
        isDisabled={disabled || !text.trim()}
        onClick={handleSend}
      >
        Send
      </Button>
    </Stack>
  );
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const { profile } = useAuth();
  const userId = profile?.id ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages(conversationId)
      .then(setMessages)
      .catch(() => setError("Failed to load messages."))
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      setSending(true);
      try {
        const msg = await sendMessageApi(conversationId, text);
        setMessages((prev) => [...prev, msg]);
      } catch {
        setError("Failed to send message.");
      } finally {
        setSending(false);
      }
    },
    [conversationId],
  );

  return (
    <Container size="lg">
      <Stack gap="md">
        <Heading level={2}>Conversation</Heading>

        {error && <Alert variant="error">{error}</Alert>}

        {loading && <MessagesSkeleton />}

        {!loading && messages.length === 0 && (
          <EmptyState
            title="No messages"
            description="Start the conversation by sending a message."
          />
        )}

        {!loading && messages.length > 0 && (
          <MessageList
            messages={messages}
            userId={userId}
            bottomRef={bottomRef}
          />
        )}

        <MessageComposer onSend={handleSend} disabled={sending} />
      </Stack>
    </Container>
  );
}
