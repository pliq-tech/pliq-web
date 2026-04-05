import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Application } from "@/lib/types/application";
import { ApplicationCard } from "./ApplicationCard";

function createApplication(overrides: Partial<Application> = {}): Application {
  return {
    id: "app-1",
    listingId: "lst-1",
    tenantId: "u-1",
    status: "pending",
    coverMessage: null,
    zkProofHash: null,
    credentialSummary: null,
    rejectionReason: null,
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z",
    ...overrides,
  };
}

describe("ApplicationCard", () => {
  test("renders property title", () => {
    render(
      <ApplicationCard
        application={createApplication()}
        propertyTitle="Nice Flat"
      />,
    );
    expect(screen.getByText("Nice Flat")).toBeTruthy();
  });

  test("renders pending status tag", () => {
    render(
      <ApplicationCard
        application={createApplication()}
        propertyTitle="Nice Flat"
      />,
    );
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  test("renders accepted status tag", () => {
    render(
      <ApplicationCard
        application={createApplication({ status: "accepted" })}
        propertyTitle="Nice Flat"
      />,
    );
    expect(screen.getByText("Accepted")).toBeTruthy();
  });

  test("renders submission date formatted", () => {
    render(
      <ApplicationCard
        application={createApplication()}
        propertyTitle="Nice Flat"
      />,
    );
    expect(screen.getByText("Submitted Mar 20, 2026")).toBeTruthy();
  });

  test("renders credential count when summary exists", () => {
    const app = createApplication({
      credentialSummary: { income: true, identity: true },
    });
    render(<ApplicationCard application={app} propertyTitle="Nice Flat" />);
    expect(screen.getByText("2 credentials")).toBeTruthy();
  });

  test("does not render credential count when no summary", () => {
    render(
      <ApplicationCard
        application={createApplication()}
        propertyTitle="Nice Flat"
      />,
    );
    expect(screen.queryByText(/credential/)).toBeNull();
  });

  test("calls onClick when clicked", () => {
    const handleClick = mock(() => {});
    render(
      <ApplicationCard
        application={createApplication()}
        propertyTitle="Nice Flat"
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByText("Nice Flat"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
