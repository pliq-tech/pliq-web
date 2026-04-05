import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { TimeSlotCard } from "./TimeSlotCard";

const BASE_PROPS = {
  date: "2026-04-10",
  startTime: "10:00",
  endTime: "11:00",
  isAvailable: true,
};

describe("TimeSlotCard", () => {
  test("renders time range", () => {
    render(<TimeSlotCard {...BASE_PROPS} />);
    expect(screen.getByText("10:00 - 11:00")).toBeTruthy();
  });

  test("renders formatted date", () => {
    render(<TimeSlotCard {...BASE_PROPS} />);
    const dateText = screen.getByText(/Apr 10/);
    expect(dateText).toBeTruthy();
  });

  test("shows available indicator", () => {
    render(<TimeSlotCard {...BASE_PROPS} />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-disabled")).toBe("false");
  });

  test("shows unavailable indicator", () => {
    render(<TimeSlotCard {...BASE_PROPS} isAvailable={false} />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-disabled")).toBe("true");
  });

  test("calls onSelect when available and clicked", () => {
    const handleSelect = mock(() => {});
    render(<TimeSlotCard {...BASE_PROPS} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  test("does not call onSelect when unavailable", () => {
    const handleSelect = mock(() => {});
    render(
      <TimeSlotCard
        {...BASE_PROPS}
        isAvailable={false}
        onSelect={handleSelect}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleSelect).toHaveBeenCalledTimes(0);
  });

  test("has aria-pressed true when isSelected", () => {
    render(<TimeSlotCard {...BASE_PROPS} isSelected />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  test("sets aria-disabled when unavailable", () => {
    render(<TimeSlotCard {...BASE_PROPS} isAvailable={false} />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-disabled")).toBe("true");
  });

  test("sets aria-pressed when selected", () => {
    render(<TimeSlotCard {...BASE_PROPS} isSelected />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });
});
