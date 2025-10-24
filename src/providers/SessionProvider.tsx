"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loginService,
  logoutService,
  refreshService,
  validateSessionService,
} from "@/services/authService";

import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type SessionContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // =======================
  // Reload Session
  // =======================
  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = localStorage.getItem("session_user");
      const userData: User | null = storedUser ? JSON.parse(storedUser) : null;

      try {
        const hasCookies = await validateSessionService();

        // if either missing -> logout and clear
        if (!hasCookies || !userData) {
          console.warn("Session invalid. Clearing and logging out.");
          await logoutService();
          localStorage.removeItem("session_user");
          setUser(null);
          setLoading(false);
          return;
        }

        // both exist — restore
        setUser(userData);
      } catch (err) {
        console.error("Session check failed:", err);
        await logoutService();
        localStorage.removeItem("session_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // =======================
  // Login
  // =======================
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await loginService({ email, password }); // authService sets cookies
      const newUser: User = { id: data.userId, role: data.userRole, email: data.userEmail, name: data.userDisplayName };
      setUser(newUser);
      localStorage.setItem("session_user", JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  }, []);

  // =======================
  // Logout
  // =======================
  const logout = useCallback(async () => {
    try {
      await logoutService(); // clears cookies
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      localStorage.removeItem("session_user");
      setUser(null);
      router.push("/login");
    }
  }, []);

  // =======================
  // Refresh
  // =======================
  const refresh = useCallback(async () => {
    try {
      const data = await refreshService(); 
    } catch (err) {
      console.error("Token refresh failed:", err);
      await logout();
    }
  }, [logout]);

  // =======================
  // Auto Refresh
  // =======================
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      refresh();
    }, 1000 * 60 * 10); // every 10 mins
    return () => clearInterval(interval);
  }, [user, refresh]);

  return (
    <SessionContext.Provider
      value={{
        user,
        login,
        logout,
        refresh,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

  // =======================
  // Hook
  // =======================
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
