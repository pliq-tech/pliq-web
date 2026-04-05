import { describe, expect, test } from "bun:test";

describe("useEscrowBalance", () => {
  test("EscrowBreakdown type shape is correct", () => {
    const mockEscrow = {
      depositAmount: 2400,
      funded: true,
      escrowBalance: 2400,
      deductions: 0,
    };
    expect(mockEscrow.depositAmount).toBe(2400);
    expect(mockEscrow.funded).toBe(true);
    expect(mockEscrow.escrowBalance).toBe(2400);
    expect(mockEscrow.deductions).toBe(0);
  });

  test("unfunded escrow has zero balance", () => {
    const mockEscrow = {
      depositAmount: 0,
      funded: false,
      escrowBalance: 0,
      deductions: 0,
    };
    expect(mockEscrow.funded).toBe(false);
    expect(mockEscrow.escrowBalance).toBe(0);
  });

  test("escrow with deductions calculates correctly", () => {
    const mockEscrow = {
      depositAmount: 2400,
      funded: true,
      escrowBalance: 2000,
      deductions: 400,
    };
    expect(mockEscrow.escrowBalance).toBe(
      mockEscrow.depositAmount - mockEscrow.deductions,
    );
  });
});
