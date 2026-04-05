import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Notification } from "@/lib/types/notification";
import { NotificationItem } from "./NotificationItem";

function createNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: "notif-1",
    userId: "u-1",
    type: "payment_due",
    title: "Payment Due",
    description: "Your rent payment is due tomorrow",
    data: null,
    read: false,
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    ...overrides,
  };
}

describe("NotificationItem", () => {
  test("renders title", () => {
    render(<NotificationItem notification={createNotification()} />);
    expect(screen.getByText("Payment Due")).toBeTruthy();
  });

  test("renders description", () => {
    render(<NotificationItem notification={createNotification()} />);
    expect(screen.getByText("Your rent payment is due tomorrow")).toBeTruthy();
  });

  test("renders relative time for recent notifications", () => {
    render(<NotificationItem notification={createNotification()} />);
    expect(screen.getByText("5 min ago")).toBeTruthy();
  });

  test("renders hour format for older notifications", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60_000).toISOString();
    render(
      <NotificationItem
        notification={createNotification({ createdAt: twoHoursAgo })}
      />,
    );
    expect(screen.getByText("2 hr ago")).toBeTruthy();
  });

  test("shows unread aria-label when not read", () => {
    render(<NotificationItem notification={createNotification()} />);
    expect(screen.getByRole("button", { name: /Unread/ })).toBeTruthy();
  });

  test("does not show unread aria-label when read", () => {
    render(
      <NotificationItem notification={createNotification({ read: true })} />,
    );
    expect(screen.queryByRole("button", { name: /Unread/ })).toBeNull();
  });

  test("calls onClick when clicked", () => {
    const handleClick = mock(() => {});
    render(
      <NotificationItem
        notification={createNotification()}
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByText("Payment Due"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("has proper aria-label for unread", () => {
    render(<NotificationItem notification={createNotification()} />);
    expect(
      screen.getByRole("button", { name: "Unread: Payment Due" }),
    ).toBeTruthy();
  });
});
