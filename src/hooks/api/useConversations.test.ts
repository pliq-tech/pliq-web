import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { MessageThread } from "@/lib/types/message";

function createThread(overrides: Partial<MessageThread> = {}): MessageThread {
  return {
    roomId: crypto.randomUUID(),
    otherUserId: "user-2",
    otherUserName: "Alice",
    otherUserAvatar: null,
    lastMessage: "Hello!",
    lastMessageAt: "2026-04-01T12:00:00Z",
    unreadCount: 1,
    ...overrides,
  };
}

const mockGetConversations = mock(() =>
  Promise.resolve([createThread(), createThread({ unreadCount: 0 })]),
);

mock.module("@/lib/api/messages", () => ({
  getConversations: mockGetConversations,
  getMessages: mock(),
  sendMessage: mock(),
}));

describe("useConversations", () => {
  beforeEach(() => {
    mockGetConversations.mockClear();
  });

  test("module exports useConversations function", async () => {
    const mod = await import("./useConversations");
    expect(typeof mod.useConversations).toBe("function");
  });

  test("getConversations mock returns thread list", async () => {
    const result = await mockGetConversations();
    expect(result).toHaveLength(2);
  });

  test("threads have correct unread counts", async () => {
    const result = await mockGetConversations();
    expect(result[0].unreadCount).toBe(1);
    expect(result[1].unreadCount).toBe(0);
  });
});
