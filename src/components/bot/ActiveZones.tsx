// ═══════════════════════════════════════════
// BARPHASE — ACTIVE ZONES CARD v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { OrderBlock, FairValueGap } from "@/lib/engine/types";

interface ActiveZonesProps {
  orderBlocks: OrderBlock[];
  fairValueGaps: FairValueGap[];
}

function ZoneRow({ type, label, high, low, active }: { type: "bullish" | "bearish"; label: string; high: number; low: number; active: boolean }) {
  const isBull = type === "bullish";
  return (
    <div
      className={`flex items-center justify-between py-1.5 px-2 rounded-lg border transition-all duration-200 ${
        active
          ? isBull
            ? "border-bp-lime/12 bg-bp-lime/4"
            : "border-bp-bear/12 bg-bp-bear/4"
          : "border-transparent bg-transparent opacity-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-1 h-4 rounded-full ${isBull ? "bg-bp-lime" : "bg-bp-bear"}`} />
        <div>
          <span className="text-[11px] text-bp-text block">{label}</span>
          <span className="text-[10px] text-bp-text-dim tabular-nums">
            {low.toFixed(2)} — {high.toFixed(2)}
          </span>
        </div>
      </div>
      <Badge variant={isBull ? "lime" : "bear"} size="sm">
        {active ? "ACTIVE" : "MITIGATED"}
      </Badge>
    </div>
  );
}

export function ActiveZones({ orderBlocks, fairValueGaps }: ActiveZonesProps) {
  const activeOBs = orderBlocks.filter((ob) => ob.active);
  const activeFVGs = fairValueGaps.filter((fvg) => fvg.active);
  const totalActive = activeOBs.length + activeFVGs.length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">Active Zones</span>
        <span className="text-[11px] text-bp-text-dim tabular-nums">{totalActive} active</span>
      </div>
      <div className="space-y-1.5">
        {activeOBs.length === 0 && activeFVGs.length === 0 && (
          <p className="text-[11px] text-bp-text-dim text-center py-2">No active zones detected</p>
        )}
        {activeOBs.map((ob) => (
          <ZoneRow key={ob.id} type={ob.type} label={`${ob.type === "bullish" ? "Bull" : "Bear"} OB`} high={ob.high} low={ob.low} active={ob.active} />
        ))}
        {activeFVGs.map((fvg) => (
          <ZoneRow key={fvg.id} type={fvg.type} label={`${fvg.type === "bullish" ? "Bull" : "Bear"} FVG`} high={fvg.high} low={fvg.low} active={fvg.active} />
        ))}
      </div>
    </Card>
  );
}
