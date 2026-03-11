// ═══════════════════════════════════════════
// BARPHASE — BOT PANEL (RIGHT SIDE) v2.1
// Now shows candle-close countdown + last evaluation time
// ═══════════════════════════════════════════

"use client";

import React, { useEffect, useState } from "react";
import { StatusCard } from "./StatusCard";
import { SetupChecklist } from "./SetupChecklist";
import { StructureCard } from "./StructureCard";
import { EntryConditions } from "./EntryConditions";
import { ActiveZones } from "./ActiveZones";
import { SignalBox } from "./SignalBox";
import type { BarphaseState } from "@/lib/engine/types";
import { formatCountdown } from "@/hooks/useBarphaseEngine";

interface BotPanelProps {
  state: BarphaseState;
  isRunning: boolean;
  countdown: number;
  lastClose: Date;
}

export function BotPanel({ state, isRunning, countdown, lastClose }: BotPanelProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const lastCloseStr = lastClose.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex h-full flex-col border-l border-bp-border bg-bp-bg">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-bp-border px-4 py-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7D39EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className="text-[12px] font-bold text-bp-text tracking-wider uppercase">
            Signal Engine
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${isRunning ? "bg-bp-lime animate-dot-pulse" : "bg-bp-text-dim"}`} />
          <span className={`text-[10px] font-medium ${isRunning ? "text-bp-lime" : "text-bp-text-dim"}`}>
            {isRunning ? "LIVE" : "PAUSED"}
          </span>
        </div>
      </div>

      {/* Candle Close Timer */}
      <div className="flex items-center justify-between border-b border-bp-border/50 px-4 py-1.5 bg-bp-bg-secondary/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-bp-text-dim uppercase tracking-wider">Next 3m close</span>
          <span className={`text-[12px] font-bold tabular-nums font-mono ${countdown <= 15 ? "text-bp-violet-light animate-pulse-glow" : "text-bp-text"}`}>
            {formatCountdown(countdown)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-bp-text-dim">Last eval</span>
          <span className="text-[10px] text-bp-text-muted tabular-nums font-mono">{lastCloseStr}</span>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        <SignalBox
          signal={state.signal}
          price={state.currentPrice}
          priceChange={state.priceChange}
          bias={state.marketStructure.bias}
        />
        <StatusCard
          status={state.botStatus}
          lastUpdate={state.lastUpdate}
          isRunning={isRunning}
        />
        <SetupChecklist evaluation={state.setupEvaluation} />
        <StructureCard structure={state.marketStructure} />
        <EntryConditions conditions={state.entryConditions} />
        <ActiveZones
          orderBlocks={state.orderBlocks}
          fairValueGaps={state.fairValueGaps}
        />
      </div>

      {/* Panel Footer */}
      <div className="border-t border-bp-border px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-bp-text-dim">
            MNQ • 3m • Candle-Close Only
          </span>
          <span className="text-[10px] text-bp-text-dim tabular-nums font-mono">
            {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
