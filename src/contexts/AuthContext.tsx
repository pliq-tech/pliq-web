"use client";

import type { UserProfile } from "@/lib/types/auth";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  nullifierHash: string | null;
  token: string | null;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("pliq_token");
    const savedProfile = sessionStorage.getItem("pliq_profile");
    if (savedToken && savedProfile) {
      setToken(savedToken);
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newProfile: UserProfile) => {
    setToken(newToken);
    setProfile(newProfile);
    sessionStorage.setItem("pliq_token", newToken);
    sessionStorage.setItem("pliq_profile", JSON.stringify(newProfile));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setProfile(null);
    sessionStorage.removeItem("pliq_token");
    sessionStorage.removeItem("pliq_profile");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isLoading,
        profile,
        nullifierHash: profile?.nullifierHash ?? null,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
