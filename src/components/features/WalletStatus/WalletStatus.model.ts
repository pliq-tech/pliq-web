export interface WalletStatusProps {
  address?: string;
  balance?: string;
  isConnected: boolean;
  onConnect?: () => void;
}
