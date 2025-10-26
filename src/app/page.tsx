"use client";

import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only run redirect logic once loading is complete
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  // Optional: show a simple loading state while checking session
  if (loading) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  }

  // You could also return null while redirecting
  return (
    null
  );
}
