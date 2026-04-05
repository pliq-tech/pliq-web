"use client";

import { useTheme } from "@pliq/ui";
import { createContext, type ReactNode, useContext } from "react";

type ThemeContextValue = ReturnType<typeof useTheme>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
