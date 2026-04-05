import { describe, expect, test } from "bun:test";
import { isValid, type ListingInput, validateListing } from "./validateListing";

function validInput(overrides: Partial<ListingInput> = {}): ListingInput {
  return {
    title: "Beautiful apartment in the city center",
    description:
      "A spacious two-bedroom apartment with modern amenities and a great view of the park.",
    photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
    rentAmount: 1200,
    depositAmount: 2400,
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 65,
    ...overrides,
  };
}

describe("validateListing", () => {
  test("returns no errors for valid input", () => {
    const errors = validateListing(validInput());
    expect(isValid(errors)).toBe(true);
  });

  describe("title", () => {
    test("requires title", () => {
      const errors = validateListing(validInput({ title: "" }));
      expect(errors.title).toBe("Title is required");
    });

    test("requires title with non-whitespace content", () => {
      const errors = validateListing(validInput({ title: "   " }));
      expect(errors.title).toBe("Title is required");
    });

    test("rejects title shorter than 5 characters", () => {
      const errors = validateListing(validInput({ title: "Hey" }));
      expect(errors.title).toBe("Title must be at least 5 characters");
    });

    test("rejects title longer than 100 characters", () => {
      const errors = validateListing(validInput({ title: "A".repeat(101) }));
      expect(errors.title).toBe("Title must be at most 100 characters");
    });

    test("accepts title at minimum boundary", () => {
      const errors = validateListing(validInput({ title: "ABCDE" }));
      expect(errors.title).toBeUndefined();
    });

    test("accepts title at maximum boundary", () => {
      const errors = validateListing(validInput({ title: "A".repeat(100) }));
      expect(errors.title).toBeUndefined();
    });
  });

  describe("description", () => {
    test("requires description", () => {
      const errors = validateListing(validInput({ description: "" }));
      expect(errors.description).toBe("Description is required");
    });

    test("rejects description shorter than 20 characters", () => {
      const errors = validateListing(
        validInput({ description: "Too short desc" }),
      );
      expect(errors.description).toBe(
        "Description must be at least 20 characters",
      );
    });

    test("rejects description longer than 2000 characters", () => {
      const errors = validateListing(
        validInput({ description: "A".repeat(2001) }),
      );
      expect(errors.description).toBe(
        "Description must be at most 2000 characters",
      );
    });

    test("accepts description at minimum boundary", () => {
      const errors = validateListing(
        validInput({ description: "A".repeat(20) }),
      );
      expect(errors.description).toBeUndefined();
    });
  });

  describe("photos", () => {
    test("requires at least 3 photos", () => {
      const errors = validateListing(
        validInput({ photos: ["a.jpg", "b.jpg"] }),
      );
      expect(errors.photos).toBe("At least 3 photos are required");
    });

    test("rejects more than 15 photos", () => {
      const photos = Array.from({ length: 16 }, (_, i) => `photo${i}.jpg`);
      const errors = validateListing(validInput({ photos }));
      expect(errors.photos).toBe("At most 15 photos are allowed");
    });

    test("accepts exactly 3 photos", () => {
      const errors = validateListing(
        validInput({ photos: ["a.jpg", "b.jpg", "c.jpg"] }),
      );
      expect(errors.photos).toBeUndefined();
    });

    test("accepts exactly 15 photos", () => {
      const photos = Array.from({ length: 15 }, (_, i) => `photo${i}.jpg`);
      const errors = validateListing(validInput({ photos }));
      expect(errors.photos).toBeUndefined();
    });
  });

  describe("rentAmount", () => {
    test("rejects zero rent", () => {
      const errors = validateListing(validInput({ rentAmount: 0 }));
      expect(errors.rentAmount).toBe("Rent amount must be a positive number");
    });

    test("rejects negative rent", () => {
      const errors = validateListing(validInput({ rentAmount: -100 }));
      expect(errors.rentAmount).toBe("Rent amount must be a positive number");
    });

    test("accepts positive rent", () => {
      const errors = validateListing(validInput({ rentAmount: 500 }));
      expect(errors.rentAmount).toBeUndefined();
    });
  });

  describe("depositAmount", () => {
    test("rejects zero deposit", () => {
      const errors = validateListing(validInput({ depositAmount: 0 }));
      expect(errors.depositAmount).toBe(
        "Deposit amount must be a positive number",
      );
    });

    test("rejects negative deposit", () => {
      const errors = validateListing(validInput({ depositAmount: -50 }));
      expect(errors.depositAmount).toBe(
        "Deposit amount must be a positive number",
      );
    });
  });

  describe("bedrooms", () => {
    test("rejects zero bedrooms", () => {
      const errors = validateListing(validInput({ bedrooms: 0 }));
      expect(errors.bedrooms).toBe("Bedrooms must be a positive number");
    });

    test("rejects fractional bedrooms", () => {
      const errors = validateListing(validInput({ bedrooms: 1.5 }));
      expect(errors.bedrooms).toBe("Bedrooms must be a whole number");
    });

    test("accepts valid bedrooms", () => {
      const errors = validateListing(validInput({ bedrooms: 3 }));
      expect(errors.bedrooms).toBeUndefined();
    });
  });

  describe("bathrooms", () => {
    test("rejects zero bathrooms", () => {
      const errors = validateListing(validInput({ bathrooms: 0 }));
      expect(errors.bathrooms).toBe("Bathrooms must be a positive number");
    });

    test("rejects fractional bathrooms", () => {
      const errors = validateListing(validInput({ bathrooms: 1.5 }));
      expect(errors.bathrooms).toBe("Bathrooms must be a whole number");
    });
  });

  describe("areaSqm", () => {
    test("rejects zero area", () => {
      const errors = validateListing(validInput({ areaSqm: 0 }));
      expect(errors.areaSqm).toBe("Area must be a positive number");
    });

    test("rejects fractional area", () => {
      const errors = validateListing(validInput({ areaSqm: 45.5 }));
      expect(errors.areaSqm).toBe("Area must be a whole number");
    });

    test("accepts valid area", () => {
      const errors = validateListing(validInput({ areaSqm: 80 }));
      expect(errors.areaSqm).toBeUndefined();
    });
  });

  describe("isValid", () => {
    test("returns true for empty errors object", () => {
      expect(isValid({})).toBe(true);
    });

    test("returns false when errors exist", () => {
      expect(isValid({ title: "Title is required" })).toBe(false);
    });
  });

  describe("multiple errors", () => {
    test("returns all errors at once", () => {
      const errors = validateListing({
        title: "",
        description: "",
        photos: [],
        rentAmount: 0,
        depositAmount: -1,
        bedrooms: 0,
        bathrooms: 0,
        areaSqm: 0,
      });
      expect(Object.keys(errors).length).toBe(8);
    });
  });
});
