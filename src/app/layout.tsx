import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "@pliq/ui/src/styles/tokens.css";
import "@pliq/ui/src/styles/reset.css";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geist = Geist({
  variable: "--font-family",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pliq — Privacy-Preserving Rentals",
  description:
    "Find and manage rentals with privacy-preserving credentials and on-chain reputation.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pliq",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
