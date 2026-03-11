// ═══════════════════════════════════════════
// BARPHASE UI — CARD COMPONENT v2
// ═══════════════════════════════════════════

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bull" | "bear" | "violet" | "lime" | "signal";
  glow?: boolean;
}

export function Card({
  children,
  className = "",
  variant = "default",
  glow = false,
}: CardProps) {
  const variantStyles: Record<string, string> = {
    default: "border-bp-border hover:border-bp-border-light",
    bull: "border-bp-bull/25 hover:border-bp-bull/40",
    bear: "border-bp-bear/25 hover:border-bp-bear/40",
    violet: "border-bp-violet/25 hover:border-bp-violet/40",
    lime: "border-bp-lime/20 hover:border-bp-lime/35",
    signal: "border-bp-lime/30 hover:border-bp-lime/50",
  };

  const glowStyles: Record<string, string> = {
    default: "",
    bull: "glow-bull",
    bear: "glow-bear",
    violet: "glow-violet",
    lime: "glow-lime",
    signal: "glow-signal",
  };

  return (
    <div
      className={`
        bg-bp-bg-secondary rounded-xl border p-4
        transition-all duration-200 ease-out
        ${variantStyles[variant]}
        ${glow ? glowStyles[variant] : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
