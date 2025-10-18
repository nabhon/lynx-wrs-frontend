"use client";
import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function home() {
  const { isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    </div>
  )
}
