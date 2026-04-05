import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { RoleSwitcher } from "./RoleSwitcher";

describe("RoleSwitcher", () => {
  test("renders tenant and landlord tabs", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="tenant" onSwitch={handleSwitch} />);
    expect(screen.getByText("Tenant")).toBeTruthy();
    expect(screen.getByText("Landlord")).toBeTruthy();
  });

  test("marks tenant as active when current role is tenant", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="tenant" onSwitch={handleSwitch} />);
    const tenantTab = screen.getByText("Tenant");
    expect(tenantTab.getAttribute("aria-selected")).toBe("true");
  });

  test("marks landlord as active when current role is landlord", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="landlord" onSwitch={handleSwitch} />);
    const landlordTab = screen.getByText("Landlord");
    expect(landlordTab.getAttribute("aria-selected")).toBe("true");
  });

  test("calls onSwitch with tenant when tenant clicked", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="landlord" onSwitch={handleSwitch} />);
    fireEvent.click(screen.getByText("Tenant"));
    expect(handleSwitch).toHaveBeenCalledWith("tenant");
  });

  test("calls onSwitch with landlord when landlord clicked", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="tenant" onSwitch={handleSwitch} />);
    fireEvent.click(screen.getByText("Landlord"));
    expect(handleSwitch).toHaveBeenCalledWith("landlord");
  });

  test("has tablist role on wrapper", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="tenant" onSwitch={handleSwitch} />);
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  test("tabs have tab role", () => {
    const handleSwitch = mock(() => {});
    render(<RoleSwitcher currentRole="tenant" onSwitch={handleSwitch} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(2);
  });
});
