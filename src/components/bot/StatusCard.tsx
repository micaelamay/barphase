// ═══════════════════════════════════════════
// BARPHASE — BOT STATUS CARD v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Indicator } from "@/components/ui/Indicator";
import type { BotState } from "@/lib/constants";

interface StatusCardProps {
  status: BotState;
  lastUpdate: number;
  isRunning: boolean;
}

const statusConfig: Record<
  BotState,
  {
    label: string;
    description: string;
    variant: "neutral" | "info" | "warning" | "violet" | "lime";
    indicatorColor: "neutral" | "info" | "warning" | "violet" | "lime";
    pulse: boolean;
    cardVariant: "default" | "violet" | "lime";
  }
> = {
  IDLE: {
    label: "IDLE",
    description: "No active setup detected",
    variant: "neutral",
    indicatorColor: "neutral",
    pulse: false,
    cardVariant: "default",
  },
  WAITING: {
    label: "WAITING",
    description: "Liquidity sweep detected — monitoring structure",
    variant: "info",
    indicatorColor: "violet",
    pulse: true,
    cardVariant: "default",
  },
  PREPARE: {
    label: "PREPARE",
    description: "Structure broken — scanning for FVG entry zone",
    variant: "violet",
    indicatorColor: "violet",
    pulse: true,
    cardVariant: "violet",
  },
  READY: {
    label: "READY",
    description: "Price inside FVG — waiting for confirmation candle",
    variant: "lime",
    indicatorColor: "lime",
    pulse: true,
    cardVariant: "lime",
  },
  ENTER: {
    label: "ENTER",
    description: "All conditions met — entry signal active",
    variant: "lime",
    indicatorColor: "lime",
    pulse: true,
    cardVariant: "lime",
  },
};

export function StatusCard({ status, lastUpdate, isRunning }: StatusCardProps) {
  const config = statusConfig[status];
  const timeAgo = getTimeAgo(lastUpdate);

  return (
    <Card variant={config.cardVariant} glow={status === "ENTER" || status === "READY"}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Indicator color={config.indicatorColor} pulse={config.pulse} size="md" />
          <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">
            Bot Status
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="text-[10px] text-bp-text-dim">{timeAgo}</span>
          )}
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isRunning ? "bg-bp-lime animate-dot-pulse" : "bg-bp-text-dim"
            }`}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={config.variant} size="lg" pulse={config.pulse}>
          {config.label}
        </Badge>
      </div>
      <p className="mt-2 text-[11px] text-bp-text-dim leading-relaxed">
        {config.description}
      </p>
    </Card>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}
