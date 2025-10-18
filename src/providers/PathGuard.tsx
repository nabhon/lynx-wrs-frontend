"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";

/**
 * A wrapper component that enforces authentication:
 * - Redirects unauthenticated users to "/login"
 * - Redirects authenticated users away from the login page to "/dashboard"
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useSession();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/login");
    }

    if (isAuthenticated && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Avoid flashing before redirect
  if (loading) return null;

  // Render children only if logged in OR on login page
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
