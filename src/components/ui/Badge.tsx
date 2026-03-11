// ═══════════════════════════════════════════
// BARPHASE UI — BADGE COMPONENT v2
// ═══════════════════════════════════════════

import React from "react";

type BadgeVariant = "default" | "bull" | "bear" | "warning" | "info" | "neutral" | "violet" | "lime";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bp-border text-bp-text",
  bull: "bg-bp-bull/12 text-bp-bull border border-bp-bull/20",
  bear: "bg-bp-bear/12 text-bp-bear border border-bp-bear/20",
  warning: "bg-bp-fvg/12 text-bp-fvg border border-bp-fvg/20",
  info: "bg-bp-violet/12 text-bp-violet-light border border-bp-violet/20",
  neutral: "bg-bp-bg-tertiary text-bp-text-muted border border-bp-border",
  violet: "bg-bp-violet/12 text-bp-violet-light border border-bp-violet/25",
  lime: "bg-bp-lime/10 text-bp-lime border border-bp-lime/20",
};

const sizeStyles: Record<string, string> = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
  lg: "text-sm px-3 py-1",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  pulse = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md font-semibold
        leading-none tracking-wide uppercase
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pulse ? "animate-pulse-glow" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
