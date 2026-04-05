"use client";

import {
  Alert,
  Button,
  Container,
  Heading,
  Spinner,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
} from "@pliq/ui";
import { useCallback, useState } from "react";
import { WalletStatus } from "@/components/features/WalletStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { updateMe } from "@/lib/api/users";

// Tab keys mapped by index
const _TAB_KEYS = ["profile", "theme", "notifications", "wallet"] as const;

function ProfileTab() {
  const { profile, login, token } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateMe({ displayName });
      if (token) login(token, updated);
      setSuccess(true);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }, [displayName, token, login]);

  return (
    <Stack gap="md">
      <TextInput
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your display name"
      />
      <Text size="sm" color="secondary">
        Avatar upload will be available in a future release.
      </Text>

      {success && <Alert variant="success">Profile updated.</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <Button variant="primary" isDisabled={saving} onClick={handleSave}>
        {saving ? <Spinner size="sm" /> : "Save"}
      </Button>
    </Stack>
  );
}

function ThemeTab() {
  const { theme, setTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <Stack gap="md">
      <Switch
        label="Dark mode"
        isChecked={isDark}
        onChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Text size="sm" color="secondary">
        Toggle between light and dark mode. Your preference is saved
        automatically.
      </Text>
    </Stack>
  );
}

function NotificationsTab() {
  const [appUpdates, setAppUpdates] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [messages, setMessages] = useState(true);
  const [leaseAlerts, setLeaseAlerts] = useState(true);

  return (
    <Stack gap="md">
      <Switch
        label="Application updates"
        isChecked={appUpdates}
        onChange={setAppUpdates}
      />
      <Switch
        label="Payment reminders"
        isChecked={paymentReminders}
        onChange={setPaymentReminders}
      />
      <Switch
        label="New messages"
        isChecked={messages}
        onChange={setMessages}
      />
      <Switch
        label="Lease alerts"
        isChecked={leaseAlerts}
        onChange={setLeaseAlerts}
      />
      <Text size="sm" color="secondary">
        Notification preferences are stored locally.
      </Text>
    </Stack>
  );
}

function WalletTab() {
  const { profile } = useAuth();

  return (
    <Stack gap="md">
      <WalletStatus
        address={profile?.walletAddress ?? undefined}
        balance={undefined}
        isConnected={!!profile?.walletAddress}
        onConnect={() => {
          // Stub: would trigger wallet connection flow
        }}
      />
    </Stack>
  );
}

export default function SettingsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Settings</Heading>

        <Tabs
          items={[
            { label: "Profile", content: <ProfileTab /> },
            { label: "Theme", content: <ThemeTab /> },
            { label: "Notifications", content: <NotificationsTab /> },
            { label: "Wallet", content: <WalletTab /> },
          ]}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
      </Stack>
    </Container>
  );
}
