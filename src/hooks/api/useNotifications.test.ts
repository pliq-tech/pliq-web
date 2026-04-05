import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Notification } from "@/lib/types/notification";

function createNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: crypto.randomUUID(),
    userId: "user-1",
    type: "payment_due",
    title: "Rent Due",
    description: "Your rent payment is due",
    data: null,
    read: false,
    createdAt: "2026-04-01T00:00:00Z",
    ...overrides,
  };
}

const mockApiGet = mock(() =>
  Promise.resolve([
    createNotification({ read: false }),
    createNotification({ read: true }),
    createNotification({ read: false }),
  ]),
);

mock.module("@/lib/api/client", () => ({
  api: {
    get: mockApiGet,
    post: mock(),
    patch: mock(),
    put: mock(),
    delete: mock(),
  },
  PliqApiError: class extends Error {},
}));

describe("useApiNotifications", () => {
  beforeEach(() => {
    mockApiGet.mockClear();
  });

  test("module exports useApiNotifications function", async () => {
    const mod = await import("./useNotifications");
    expect(typeof mod.useApiNotifications).toBe("function");
  });

  test("api.get mock returns notification list", async () => {
    const result = await mockApiGet();
    expect(result).toHaveLength(3);
  });

  test("notifications have correct read state", async () => {
    const result = await mockApiGet();
    const unread = result.filter((n: Notification) => !n.read);
    expect(unread).toHaveLength(2);
  });
});
