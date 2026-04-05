import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Listing } from "@/lib/types/listing";

mock.module("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _f, sizes: _s, ...rest } = props;
    // biome-ignore lint/performance/noImgElement: mock for next/image in tests
    // biome-ignore lint/a11y/useAltText: alt is spread from props
    return <img {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

import { PropertyCard } from "./PropertyCard";

function createListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "lst-1",
    landlordId: "u-1",
    title: "Modern Studio",
    description: "A nice studio",
    address: "123 Main St",
    city: "Cannes",
    country: "FR",
    latitude: null,
    longitude: null,
    rentAmount: 1200,
    depositAmount: 2400,
    currency: "eurc",
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 55,
    amenities: [],
    photos: ["https://example.com/photo.jpg"],
    status: "active",
    fraudScore: null,
    fraudFlags: null,
    requiredCredentials: null,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    ...overrides,
  };
}

describe("PropertyCard", () => {
  test("renders title and city", () => {
    render(<PropertyCard listing={createListing()} />);
    expect(screen.getByText("Modern Studio")).toBeTruthy();
    expect(screen.getByText("Cannes")).toBeTruthy();
  });

  test("renders formatted rent amount", () => {
    render(<PropertyCard listing={createListing()} />);
    expect(screen.getByText("1,200 EURC/mo")).toBeTruthy();
  });

  test("renders bed and bath count", () => {
    render(<PropertyCard listing={createListing()} />);
    expect(screen.getByText("2 bed")).toBeTruthy();
    expect(screen.getByText("1 bath")).toBeTruthy();
  });

  test("renders photo when available", () => {
    render(<PropertyCard listing={createListing()} />);
    const img = screen.getByAltText("Modern Studio");
    expect(img).toBeTruthy();
  });

  test("renders placeholder when no photos", () => {
    render(<PropertyCard listing={createListing({ photos: [] })} />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  test("calls onClick when clicked", () => {
    const handleClick = mock(() => {});
    render(<PropertyCard listing={createListing()} onClick={handleClick} />);
    fireEvent.click(screen.getByText("Modern Studio"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
