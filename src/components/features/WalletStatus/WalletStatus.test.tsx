import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { WalletStatus } from "./WalletStatus";

describe("WalletStatus", () => {
  test("renders connect button when disconnected", () => {
    render(<WalletStatus isConnected={false} />);
    expect(screen.getByText("Connect")).toBeTruthy();
  });

  test("calls onConnect when connect clicked", () => {
    const handleConnect = mock(() => {});
    render(<WalletStatus isConnected={false} onConnect={handleConnect} />);
    fireEvent.click(screen.getByText("Connect"));
    expect(handleConnect).toHaveBeenCalledTimes(1);
  });

  test("renders truncated address when connected", () => {
    render(
      <WalletStatus
        isConnected={true}
        address="0x1234567890abcdef1234567890abcdef12345678"
      />,
    );
    expect(screen.getByText("0x1234...5678")).toBeTruthy();
  });

  test("renders full address in title attribute", () => {
    const fullAddr = "0x1234567890abcdef1234567890abcdef12345678";
    render(<WalletStatus isConnected={true} address={fullAddr} />);
    const el = screen.getByText("0x1234...5678");
    expect(el.getAttribute("title")).toBe(fullAddr);
  });

  test("renders balance when provided", () => {
    render(
      <WalletStatus
        isConnected={true}
        address="0x1234567890abcdef1234567890abcdef12345678"
        balance="1,200 EURC"
      />,
    );
    expect(screen.getByText("1,200 EURC")).toBeTruthy();
  });

  test("does not render balance when not provided", () => {
    render(
      <WalletStatus
        isConnected={true}
        address="0x1234567890abcdef1234567890abcdef12345678"
      />,
    );
    expect(screen.queryByText(/EURC/)).toBeNull();
  });

  test("shows connected indicator when connected", () => {
    render(
      <WalletStatus
        isConnected={true}
        address="0x1234567890abcdef1234567890abcdef12345678"
      />,
    );
    expect(screen.getByLabelText("Connected")).toBeTruthy();
  });

  test("does not render address when disconnected", () => {
    render(<WalletStatus isConnected={false} />);
    expect(screen.queryByText(/0x/)).toBeNull();
  });
});
