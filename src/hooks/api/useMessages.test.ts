import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Message } from "@/lib/types/message";

function createMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: crypto.randomUUID(),
    roomId: "room-1",
    senderId: "user-1",
    content: "Hello!",
    createdAt: "2026-04-01T12:00:00Z",
    ...overrides,
  };
}

const mockGetMessages = mock(() =>
  Promise.resolve([
    createMessage({ content: "Hey there" }),
    createMessage({ senderId: "user-2", content: "Hi!" }),
  ]),
);

const mockSendMessage = mock(() =>
  Promise.resolve(createMessage({ content: "New message" })),
);

mock.module("@/lib/api/messages", () => ({
  getConversations: mock(),
  getMessages: mockGetMessages,
  sendMessage: mockSendMessage,
}));

describe("useMessages", () => {
  beforeEach(() => {
    mockGetMessages.mockClear();
    mockSendMessage.mockClear();
  });

  test("module exports useMessages function", async () => {
    const mod = await import("./useMessages");
    expect(typeof mod.useMessages).toBe("function");
  });

  test("getMessages mock returns message list", async () => {
    const result = await mockGetMessages();
    expect(result).toHaveLength(2);
  });

  test("sendMessage mock returns new message", async () => {
    const result = await mockSendMessage();
    expect(result.content).toBe("New message");
  });
});
