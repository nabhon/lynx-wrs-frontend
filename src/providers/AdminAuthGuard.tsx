"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";

/**
 * A wrapper component that enforces authentication:
 * - Redirects unauthenticated users to "/login"
 * - Redirects authenticated users away from the login page to "/dashboard"
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useSession();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && (user?.role !== "ADMIN" && user?.role !== "MODERATOR")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Avoid flashing before redirect
  if (loading) return null;


  if (isAuthenticated && (user?.role === "ADMIN" || user?.role === "MODERATOR")) {
    return <>{children}</>;
  }

  return null;
}
