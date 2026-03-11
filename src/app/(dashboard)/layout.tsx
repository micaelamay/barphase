// ═══════════════════════════════════════════
// BARPHASE — DASHBOARD LAYOUT (Auth + Sidebar + Content)
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGate } from "@/components/auth/AuthGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="flex h-screen w-screen overflow-hidden bg-bp-bg">
        <Sidebar />
        <main className="flex-1 min-w-0 h-full overflow-hidden">
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
