"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getUsersService, type User } from "@/services/userService";

type UserListContextType = {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const UserListContext = createContext<UserListContextType | undefined>(undefined);

export function UserListProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUsersService();
      setUsers(result.items);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      setUsers(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refresh = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return (
    <UserListContext.Provider
      value={{
        users,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </UserListContext.Provider>
  );
}

export function useUserList() {
  const ctx = useContext(UserListContext);
  if (!ctx) throw new Error("useUserList must be used within a UserListProvider");
  return ctx;
}
