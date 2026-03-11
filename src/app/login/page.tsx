// ═══════════════════════════════════════════
// BARPHASE — LOGIN PAGE
// ═══════════════════════════════════════════

"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/overview");
    router.refresh();
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bp-bg">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-bp-violet/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-bp-lime/3 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#2A2A38" strokeWidth="1" />
              <path d="M16 1C8.268 1 2 7.268 2 15c0 7.732 6.268 14 14 14" fill="#7D39EB" opacity="0.85" />
              <path d="M16 1c7.732 0 14 6.268 14 14 0 7.732-6.268 14-14 14" fill="#C6FF33" opacity="0.85" />
              <circle cx="16" cy="9" r="3" fill="#C6FF33" />
              <circle cx="16" cy="23" r="3" fill="#7D39EB" />
              <circle cx="16" cy="9" r="1.2" fill="#09090F" />
              <circle cx="16" cy="23" r="1.2" fill="#09090F" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-bp-text tracking-wider">BARPHASE</h1>
          <p className="text-[11px] text-bp-text-dim tracking-[0.2em] mt-1">PROPRIETARY TRADING OS</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-bp-bg-secondary border border-bp-border rounded-lg px-4 py-3 text-[13px] text-bp-text outline-none focus:border-bp-violet transition-colors placeholder:text-bp-text-dim/50"
            />
          </div>

          <div>
            <label className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-bp-bg-secondary border border-bp-border rounded-lg px-4 py-3 text-[13px] text-bp-text outline-none focus:border-bp-violet transition-colors placeholder:text-bp-text-dim/50"
            />
          </div>

          {error && (
            <div className="text-[11px] text-bp-bear bg-bp-bear/8 border border-bp-bear/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-[13px] font-semibold rounded-lg transition-all ${
              loading
                ? "bg-bp-violet/50 text-white/50 cursor-wait"
                : "bg-bp-violet text-white hover:bg-bp-violet-light hover:shadow-lg hover:shadow-bp-violet/20"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-bp-text-dim">
            Authorized access only
          </p>
          <p className="text-[9px] text-bp-text-dim/50 mt-1">
            © {new Date().getFullYear()} Barphase. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
