import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ScoreChart } from "./ScoreChart";

const SAMPLE_DATA = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 85 },
  { month: "Mar", score: 90 },
];

describe("ScoreChart", () => {
  test("renders SVG chart with data", () => {
    render(<ScoreChart data={SAMPLE_DATA} />);
    expect(screen.getByLabelText("Score trend chart")).toBeTruthy();
  });

  test("renders bars for each data point", () => {
    const { container } = render(<ScoreChart data={SAMPLE_DATA} />);
    const bars = container.querySelectorAll("rect");
    expect(bars.length).toBe(3);
  });

  test("renders month labels", () => {
    render(<ScoreChart data={SAMPLE_DATA} />);
    expect(screen.getByText("Jan")).toBeTruthy();
    expect(screen.getByText("Feb")).toBeTruthy();
    expect(screen.getByText("Mar")).toBeTruthy();
  });

  test("renders score labels", () => {
    render(<ScoreChart data={SAMPLE_DATA} />);
    expect(screen.getByText("72")).toBeTruthy();
    expect(screen.getByText("85")).toBeTruthy();
    expect(screen.getByText("90")).toBeTruthy();
  });

  test("renders empty state when no data", () => {
    render(<ScoreChart data={[]} />);
    expect(screen.getByText("No data available")).toBeTruthy();
  });

  test("renders with custom height", () => {
    const { container } = render(
      <ScoreChart data={SAMPLE_DATA} height={200} />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toContain("200");
  });

  test("has accessible title in SVG", () => {
    render(<ScoreChart data={SAMPLE_DATA} />);
    expect(screen.getByText("Score trend over time")).toBeTruthy();
  });

  test("handles single data point", () => {
    const { container } = render(
      <ScoreChart data={[{ month: "Jan", score: 50 }]} />,
    );
    const bars = container.querySelectorAll("rect");
    expect(bars.length).toBe(1);
  });
});
