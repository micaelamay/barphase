// Root page → redirect to /overview
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/overview");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bp-bg">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-bp-violet border-t-transparent" />
    </div>
  );
}
