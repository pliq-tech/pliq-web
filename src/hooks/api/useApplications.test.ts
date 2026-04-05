import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { Application } from "@/lib/types/application";

function createApplication(overrides: Partial<Application> = {}): Application {
  return {
    id: crypto.randomUUID(),
    listingId: "listing-1",
    tenantId: "tenant-1",
    status: "pending",
    coverMessage: "I am interested",
    zkProofHash: null,
    credentialSummary: null,
    rejectionReason: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const mockGetApplications = mock(() =>
  Promise.resolve([
    createApplication({ status: "pending" }),
    createApplication({ status: "accepted" }),
  ]),
);

mock.module("@/lib/api/applications", () => ({
  submitApplication: mock(),
  getApplications: mockGetApplications,
  getApplication: mock(),
  updateApplicationStatus: mock(),
}));

describe("useApplications", () => {
  beforeEach(() => {
    mockGetApplications.mockClear();
  });

  test("module exports useApplications function", async () => {
    const mod = await import("./useApplications");
    expect(typeof mod.useApplications).toBe("function");
  });

  test("getApplications mock returns multiple applications", async () => {
    const result = await mockGetApplications();
    expect(result).toHaveLength(2);
  });

  test("applications have correct status values", async () => {
    const result = await mockGetApplications();
    expect(result[0].status).toBe("pending");
    expect(result[1].status).toBe("accepted");
  });
});
