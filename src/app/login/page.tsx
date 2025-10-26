"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/form/loginform";
import { useSession } from "@/providers/SessionProvider";

export default function LoginPage() {
  const { isAuthenticated, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard"); // replace() avoids adding a new entry to history
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      null
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
}
