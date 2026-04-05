import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { Message } from "@/lib/types/message";
import { MessageBubble } from "./MessageBubble";

function createMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: "msg-1",
    roomId: "room-1",
    senderId: "u-1",
    content: "Hello there",
    createdAt: "2026-04-05T14:30:00Z",
    ...overrides,
  };
}

describe("MessageBubble", () => {
  test("renders message content", () => {
    render(<MessageBubble message={createMessage()} isOwn={false} />);
    expect(screen.getByText("Hello there")).toBeTruthy();
  });

  test("renders timestamp", () => {
    render(<MessageBubble message={createMessage()} isOwn={false} />);
    const timeEl = screen.getByText(/\d{2}:\d{2}/);
    expect(timeEl).toBeTruthy();
  });

  test("aligns right for own messages", () => {
    const { container } = render(
      <MessageBubble message={createMessage()} isOwn={true} />,
    );
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.getAttribute("data-alignment")).toBe("right");
  });

  test("aligns left for other messages", () => {
    const { container } = render(
      <MessageBubble message={createMessage()} isOwn={false} />,
    );
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.getAttribute("data-alignment")).toBe("left");
  });

  test("renders time element with datetime attribute", () => {
    render(<MessageBubble message={createMessage()} isOwn={false} />);
    const timeEl = document.querySelector("time");
    expect(timeEl?.getAttribute("datetime")).toBe("2026-04-05T14:30:00Z");
  });
});
