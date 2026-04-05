import { Button } from "@pliq/ui";
import type { WalletStatusProps } from "./WalletStatus.model";
import styles from "./WalletStatusStyles.module.css";

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletStatus({
  address,
  balance,
  isConnected,
  onConnect,
}: WalletStatusProps) {
  if (!isConnected) {
    return (
      <div className={styles.wrapper}>
        <div
          className={`${styles.indicator} ${styles.disconnected}`}
          aria-hidden="true"
        />
        <Button variant="primary" size="sm" onClick={onConnect}>
          Connect
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styles.indicator} ${styles.connected}`}
        role="img"
        aria-label="Connected"
      />
      <div className={styles.info}>
        {address && (
          <span className={styles.address} title={address}>
            {truncateAddress(address)}
          </span>
        )}
        {balance && <span className={styles.balance}>{balance}</span>}
      </div>
    </div>
  );
}
