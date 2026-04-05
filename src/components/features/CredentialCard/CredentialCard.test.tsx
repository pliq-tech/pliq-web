import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { CredentialCard } from "./CredentialCard";

const BASE_PROPS = {
  type: "Income Proof",
  status: "active" as const,
  issuedAt: "2026-01-15T00:00:00Z",
  expiresAt: "2027-01-15T00:00:00Z",
};

describe("CredentialCard", () => {
  test("renders credential type", () => {
    render(<CredentialCard {...BASE_PROPS} />);
    expect(screen.getByText("Income Proof")).toBeTruthy();
  });

  test("renders status tag", () => {
    render(<CredentialCard {...BASE_PROPS} />);
    expect(screen.getByText("active")).toBeTruthy();
  });

  test("renders issued date formatted", () => {
    render(<CredentialCard {...BASE_PROPS} />);
    expect(screen.getByText("Issued: Jan 15, 2026")).toBeTruthy();
  });

  test("renders expires date formatted", () => {
    render(<CredentialCard {...BASE_PROPS} />);
    expect(screen.getByText("Expires: Jan 15, 2027")).toBeTruthy();
  });

  test("renders expired status with error variant", () => {
    render(<CredentialCard {...BASE_PROPS} status="expired" />);
    expect(screen.getByText("expired")).toBeTruthy();
  });

  test("renders revoked status with warning variant", () => {
    render(<CredentialCard {...BASE_PROPS} status="revoked" />);
    expect(screen.getByText("revoked")).toBeTruthy();
  });

  test("shows expiring soon badge when within 30 days", () => {
    const soon = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    render(<CredentialCard {...BASE_PROPS} expiresAt={soon} />);
    expect(screen.getByText("Expiring soon")).toBeTruthy();
  });

  test("does not show expiring badge when far away", () => {
    render(<CredentialCard {...BASE_PROPS} />);
    expect(screen.queryByText("Expiring soon")).toBeNull();
  });

  test("calls onAction when manage button clicked", () => {
    const handleAction = mock(() => {});
    render(<CredentialCard {...BASE_PROPS} onAction={handleAction} />);
    fireEvent.click(screen.getByText("Manage"));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  test("does not render manage button without onAction", () => {
    render(<CredentialCard {...BASE_PROPS} />);
    expect(screen.queryByText("Manage")).toBeNull();
  });
});
