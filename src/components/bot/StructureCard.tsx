// ═══════════════════════════════════════════
// BARPHASE — MARKET STRUCTURE CARD v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { MarketStructure } from "@/lib/engine/types";

interface StructureCardProps {
  structure: MarketStructure;
}

export function StructureCard({ structure }: StructureCardProps) {
  const { bias, lastEvent, structureStrength } = structure;
  const isBullish = bias === "Bullish";
  const isBearish = bias === "Bearish";

  return (
    <Card
      variant={isBullish ? "lime" : isBearish ? "bear" : "default"}
      glow={structureStrength > 70 || structureStrength < 30}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">
          Market Structure
        </span>
        <Badge variant={isBullish ? "lime" : isBearish ? "bear" : "neutral"} size="sm">
          {bias}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-bp-text-dim">Structure Strength</span>
            <span
              className={`text-[11px] font-semibold tabular-nums ${
                structureStrength > 70
                  ? "text-bp-lime"
                  : structureStrength < 30
                  ? "text-bp-bear"
                  : "text-bp-text-muted"
              }`}
            >
              {structureStrength}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bp-bg-tertiary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${structureStrength}%`,
                background:
                  structureStrength > 70 ? "#C6FF33" : structureStrength < 30 ? "#F23645" : "#7D39EB",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-bp-text-dim">Last Event</span>
          <Badge
            variant={
              lastEvent === "BOS" ? "violet" : lastEvent === "CHOCH" ? "warning" : lastEvent === "Liquidity Sweep" ? "lime" : "neutral"
            }
            size="sm"
          >
            {lastEvent}
          </Badge>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <span className="text-[10px] text-bp-text-dim block mb-0.5">Swing High</span>
            <span className="text-xs font-semibold text-bp-text tabular-nums">
              {structure.lastSwingHigh > 0 ? structure.lastSwingHigh.toFixed(2) : "—"}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-bp-text-dim block mb-0.5">Swing Low</span>
            <span className="text-xs font-semibold text-bp-text tabular-nums">
              {structure.lastSwingLow > 0 ? structure.lastSwingLow.toFixed(2) : "—"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
