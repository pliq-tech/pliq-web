import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { PaymentCard } from "./PaymentCard";

const BASE_PROPS = {
  amount: 1200,
  currency: "eurc",
  dueDate: "2026-05-01T00:00:00Z",
};

describe("PaymentCard", () => {
  test("renders formatted amount", () => {
    render(<PaymentCard {...BASE_PROPS} />);
    expect(screen.getByText("1,200 EURC")).toBeTruthy();
  });

  test("renders due date", () => {
    render(<PaymentCard {...BASE_PROPS} />);
    expect(screen.getByText("Due: May 1, 2026")).toBeTruthy();
  });

  test("renders lease reference when provided", () => {
    render(<PaymentCard {...BASE_PROPS} leaseRef="LSE-001" />);
    expect(screen.getByText("Lease: LSE-001")).toBeTruthy();
  });

  test("does not render lease reference when not provided", () => {
    render(<PaymentCard {...BASE_PROPS} />);
    expect(screen.queryByText(/Lease:/)).toBeNull();
  });

  test("shows overdue badge when isOverdue", () => {
    render(<PaymentCard {...BASE_PROPS} isOverdue />);
    expect(screen.getByText("Overdue")).toBeTruthy();
  });

  test("does not show overdue badge by default", () => {
    render(<PaymentCard {...BASE_PROPS} />);
    expect(screen.queryByText("Overdue")).toBeNull();
  });

  test("renders pay button when onPay provided", () => {
    const handlePay = mock(() => {});
    render(<PaymentCard {...BASE_PROPS} onPay={handlePay} />);
    expect(screen.getByText("Pay Now")).toBeTruthy();
  });

  test("calls onPay when pay button clicked", () => {
    const handlePay = mock(() => {});
    render(<PaymentCard {...BASE_PROPS} onPay={handlePay} />);
    fireEvent.click(screen.getByText("Pay Now"));
    expect(handlePay).toHaveBeenCalledTimes(1);
  });

  test("does not render pay button without onPay", () => {
    render(<PaymentCard {...BASE_PROPS} />);
    expect(screen.queryByText("Pay Now")).toBeNull();
  });
});
