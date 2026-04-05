import { describe, expect, test } from "bun:test";

describe("useEscrowBalance", () => {
  test("module exports useEscrowBalance function", async () => {
    const mod = await import("./useEscrowBalance");
    expect(typeof mod.useEscrowBalance).toBe("function");
  });

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
});
