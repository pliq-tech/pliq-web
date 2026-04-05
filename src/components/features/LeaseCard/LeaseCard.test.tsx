import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Lease } from "@/lib/types/lease";
import { LeaseCard } from "./LeaseCard";

function createLease(overrides: Partial<Lease> = {}): Lease {
  return {
    id: "lse-1",
    applicationId: "app-1",
    listingId: "lst-1",
    tenantId: "u-1",
    landlordId: "u-2",
    startDate: "2026-05-01T00:00:00Z",
    endDate: "2027-04-30T00:00:00Z",
    monthlyRent: 1200,
    depositAmount: 2400,
    currency: "eurc",
    status: "active",
    contractAddress: null,
    tenantSignedAt: null,
    landlordSignedAt: null,
    escrowCommitmentId: null,
    createdAt: "2026-04-01T00:00:00Z",
    ...overrides,
  };
}

describe("LeaseCard", () => {
  test("renders property title", () => {
    render(<LeaseCard lease={createLease()} propertyTitle="Beach House" />);
    expect(screen.getByText("Beach House")).toBeTruthy();
  });

  test("renders active status tag", () => {
    render(<LeaseCard lease={createLease()} propertyTitle="Beach House" />);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  test("renders pending signatures status", () => {
    render(
      <LeaseCard
        lease={createLease({ status: "pending_signatures" })}
        propertyTitle="Beach House"
      />,
    );
    expect(screen.getByText("Pending Signatures")).toBeTruthy();
  });

  test("renders rent amount", () => {
    render(<LeaseCard lease={createLease()} propertyTitle="Beach House" />);
    expect(screen.getByText("1,200 EURC/mo")).toBeTruthy();
  });

  test("renders lease period dates", () => {
    render(<LeaseCard lease={createLease()} propertyTitle="Beach House" />);
    expect(screen.getByText(/May 1, 2026/)).toBeTruthy();
    expect(screen.getByText(/Apr 30, 2027/)).toBeTruthy();
  });

  test("calls onClick when clicked", () => {
    const handleClick = mock(() => {});
    render(
      <LeaseCard
        lease={createLease()}
        propertyTitle="Beach House"
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByText("Beach House"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
