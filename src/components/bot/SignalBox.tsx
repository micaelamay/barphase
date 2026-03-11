// ═══════════════════════════════════════════
// BARPHASE — SIGNAL BOX (PRIMARY SIGNAL) v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import type { SignalType } from "@/lib/constants";

interface SignalBoxProps {
  signal: SignalType;
  price: number;
  priceChange: number;
  bias: "Bullish" | "Bearish" | "Neutral";
}

const signalConfig: Record<
  SignalType,
  {
    label: string;
    sublabel: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
    pulse: boolean;
    cardVariant: "default" | "bull" | "bear" | "violet" | "lime" | "signal";
    glow: boolean;
  }
> = {
  WAIT: {
    label: "WAIT",
    sublabel: "Scanning for setup...",
    color: "#5E5E72",
    bgColor: "rgba(94, 94, 114, 0.06)",
    borderColor: "rgba(94, 94, 114, 0.12)",
    icon: "⏳",
    pulse: false,
    cardVariant: "default",
    glow: false,
  },
  READY: {
    label: "READY",
    sublabel: "Awaiting confirmation...",
    color: "#7D39EB",
    bgColor: "rgba(125, 57, 235, 0.08)",
    borderColor: "rgba(125, 57, 235, 0.20)",
    icon: "⚡",
    pulse: true,
    cardVariant: "violet",
    glow: true,
  },
  ENTER_LONG: {
    label: "ENTER LONG",
    sublabel: "Bullish entry confirmed",
    color: "#C6FF33",
    bgColor: "rgba(198, 255, 51, 0.08)",
    borderColor: "rgba(198, 255, 51, 0.25)",
    icon: "▲",
    pulse: true,
    cardVariant: "lime",
    glow: true,
  },
  ENTER_SHORT: {
    label: "ENTER SHORT",
    sublabel: "Bearish entry confirmed",
    color: "#F23645",
    bgColor: "rgba(242, 54, 69, 0.08)",
    borderColor: "rgba(242, 54, 69, 0.25)",
    icon: "▼",
    pulse: true,
    cardVariant: "bear",
    glow: true,
  },
};

export function SignalBox({ signal, price, priceChange, bias }: SignalBoxProps) {
  const config = signalConfig[signal];
  const isEntry = signal === "ENTER_LONG" || signal === "ENTER_SHORT";

  return (
    <Card variant={config.cardVariant} glow={config.glow}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">
          Signal
        </span>
        {price > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-bp-text tabular-nums">
              {price.toFixed(2)}
            </span>
            <span
              className={`text-[10px] font-semibold tabular-nums ${
                priceChange >= 0 ? "text-bp-lime" : "text-bp-bear"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(4)}%
            </span>
          </div>
        )}
      </div>

      <div
        className={`relative rounded-xl p-4 text-center transition-all duration-300 ${
          config.pulse ? "animate-signal-pulse" : ""
        }`}
        style={{
          background: config.bgColor,
          border: `1px solid ${config.borderColor}`,
        }}
      >
        <div className="text-2xl mb-1">{config.icon}</div>
        <div
          className="text-xl font-black tracking-widest"
          style={{ color: config.color }}
        >
          {config.label}
        </div>
        <div className="text-[11px] text-bp-text-dim mt-1">
          {config.sublabel}
        </div>

        {isEntry && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ color: config.color, background: `${config.color}12` }}
            >
              {bias} Bias
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
