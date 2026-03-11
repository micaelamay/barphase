// ═══════════════════════════════════════════
// BARPHASE UI — INDICATOR DOT COMPONENT v2
// ═══════════════════════════════════════════

import React from "react";

type IndicatorColor = "bull" | "bear" | "warning" | "neutral" | "info" | "violet" | "lime";

interface IndicatorProps {
  color?: IndicatorColor;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap: Record<IndicatorColor, string> = {
  bull: "bg-bp-bull",
  bear: "bg-bp-bear",
  warning: "bg-bp-fvg",
  neutral: "bg-bp-text-dim",
  info: "bg-bp-violet",
  violet: "bg-bp-violet",
  lime: "bg-bp-lime",
};

const sizeMap: Record<string, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

export function Indicator({
  color = "neutral",
  pulse = false,
  size = "md",
  className = "",
}: IndicatorProps) {
  return (
    <span
      className={`
        inline-block rounded-full
        ${colorMap[color]}
        ${sizeMap[size]}
        ${pulse ? "animate-dot-pulse" : ""}
        ${className}
      `}
    />
  );
}
