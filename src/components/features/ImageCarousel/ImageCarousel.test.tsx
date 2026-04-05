import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";

mock.module("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _f, sizes: _s, ...rest } = props;
    // biome-ignore lint/performance/noImgElement: mock for next/image in tests
    // biome-ignore lint/a11y/useAltText: alt is spread from props
    return <img {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

import { ImageCarousel } from "./ImageCarousel";

const IMAGES = [
  "https://example.com/1.jpg",
  "https://example.com/2.jpg",
  "https://example.com/3.jpg",
];

describe("ImageCarousel", () => {
  test("renders first image", () => {
    render(<ImageCarousel images={IMAGES} alt="Property" />);
    const img = screen.getByAltText("Property 1 of 3");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe(IMAGES[0]);
  });

  test("renders nothing when images array is empty", () => {
    const { container } = render(<ImageCarousel images={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders dot indicators for multiple images", () => {
    render(<ImageCarousel images={IMAGES} />);
    const dots = screen.getAllByRole("tab");
    expect(dots.length).toBe(3);
  });

  test("does not render nav buttons for single image", () => {
    render(<ImageCarousel images={["https://example.com/1.jpg"]} />);
    expect(screen.queryByLabelText("Previous image")).toBeNull();
    expect(screen.queryByLabelText("Next image")).toBeNull();
  });

  test("navigates to next image on next button click", () => {
    render(<ImageCarousel images={IMAGES} alt="Photo" />);
    fireEvent.click(screen.getByLabelText("Next image"));
    expect(screen.getByAltText("Photo 2 of 3")).toBeTruthy();
  });

  test("navigates to previous image after going forward", () => {
    render(<ImageCarousel images={IMAGES} alt="Photo" />);
    fireEvent.click(screen.getByLabelText("Next image"));
    fireEvent.click(screen.getByLabelText("Previous image"));
    expect(screen.getByAltText("Photo 1 of 3")).toBeTruthy();
  });

  test("navigates to specific image via dot click", () => {
    render(<ImageCarousel images={IMAGES} alt="Photo" />);
    const dots = screen.getAllByRole("tab");
    fireEvent.click(dots[2]);
    expect(screen.getByAltText("Photo 3 of 3")).toBeTruthy();
  });

  test("hides prev button on first image", () => {
    render(<ImageCarousel images={IMAGES} />);
    expect(screen.queryByLabelText("Previous image")).toBeNull();
    expect(screen.getByLabelText("Next image")).toBeTruthy();
  });

  test("hides next button on last image", () => {
    render(<ImageCarousel images={IMAGES} />);
    const dots = screen.getAllByRole("tab");
    fireEvent.click(dots[2]);
    expect(screen.getByLabelText("Previous image")).toBeTruthy();
    expect(screen.queryByLabelText("Next image")).toBeNull();
  });

  test("has carousel aria-roledescription", () => {
    render(<ImageCarousel images={IMAGES} />);
    const el = screen.getByLabelText("Image carousel");
    expect(el.getAttribute("aria-roledescription")).toBe("carousel");
  });
});
