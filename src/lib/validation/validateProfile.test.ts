import { describe, expect, test } from "bun:test";
import { validateProfile } from "./validateProfile";

describe("validateProfile", () => {
  test("returns empty errors for a valid profile", () => {
    const errors = validateProfile({
      displayName: "Alice",
      role: "tenant",
    });

    expect(errors).toEqual({});
  });

  test("returns error when displayName is empty", () => {
    const errors = validateProfile({
      displayName: "",
      role: "tenant",
    });

    expect(errors.displayName).toBe("Display name is required");
  });

  test("returns error when displayName is whitespace only", () => {
    const errors = validateProfile({
      displayName: "   ",
      role: "tenant",
    });

    expect(errors.displayName).toBe("Display name is required");
  });

  test("returns error when displayName exceeds 50 characters", () => {
    const longName = "a".repeat(51);
    const errors = validateProfile({
      displayName: longName,
      role: "tenant",
    });

    expect(errors.displayName).toBe(
      "Display name must be 50 characters or less",
    );
  });

  test("accepts displayName at exactly 50 characters", () => {
    const exactName = "a".repeat(50);
    const errors = validateProfile({
      displayName: exactName,
      role: "tenant",
    });

    expect(errors.displayName).toBeUndefined();
  });

  test("returns error when role is empty", () => {
    const errors = validateProfile({
      displayName: "Alice",
      role: "",
    });

    expect(errors.role).toBe("Please select a valid role");
  });

  test("returns error when role is invalid", () => {
    const errors = validateProfile({
      displayName: "Alice",
      role: "admin",
    });

    expect(errors.role).toBe("Please select a valid role");
  });

  test("accepts all valid roles", () => {
    for (const role of ["tenant", "landlord", "both"]) {
      const errors = validateProfile({
        displayName: "Alice",
        role,
      });

      expect(errors.role).toBeUndefined();
    }
  });

  test("returns error when avatar exceeds 2MB", () => {
    const largeFile = new File(["x".repeat(3 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });

    const errors = validateProfile({
      displayName: "Alice",
      role: "tenant",
      avatarFile: largeFile,
    });

    expect(errors.avatarFile).toBe("Avatar must be 2MB or less");
  });

  test("returns error when avatar type is not JPG or PNG", () => {
    const gifFile = new File(["data"], "avatar.gif", { type: "image/gif" });

    const errors = validateProfile({
      displayName: "Alice",
      role: "tenant",
      avatarFile: gifFile,
    });

    expect(errors.avatarFile).toBe("Avatar must be JPG or PNG");
  });

  test("accepts valid JPG avatar", () => {
    const jpgFile = new File(["data"], "avatar.jpg", { type: "image/jpeg" });

    const errors = validateProfile({
      displayName: "Alice",
      role: "tenant",
      avatarFile: jpgFile,
    });

    expect(errors.avatarFile).toBeUndefined();
  });

  test("accepts valid PNG avatar", () => {
    const pngFile = new File(["data"], "avatar.png", { type: "image/png" });

    const errors = validateProfile({
      displayName: "Alice",
      role: "tenant",
      avatarFile: pngFile,
    });

    expect(errors.avatarFile).toBeUndefined();
  });

  test("skips avatar validation when avatarFile is null", () => {
    const errors = validateProfile({
      displayName: "Alice",
      role: "tenant",
      avatarFile: null,
    });

    expect(errors.avatarFile).toBeUndefined();
  });

  test("returns multiple errors when multiple fields are invalid", () => {
    const errors = validateProfile({
      displayName: "",
      role: "invalid",
    });

    expect(errors.displayName).toBeDefined();
    expect(errors.role).toBeDefined();
  });
});
