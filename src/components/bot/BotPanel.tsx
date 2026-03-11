// ═══════════════════════════════════════════
// BARPHASE — BOT PANEL (RIGHT SIDE) v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { StatusCard } from "./StatusCard";
import { SetupChecklist } from "./SetupChecklist";
import { StructureCard } from "./StructureCard";
import { EntryConditions } from "./EntryConditions";
import { ActiveZones } from "./ActiveZones";
import { SignalBox } from "./SignalBox";
import type { BarphaseState } from "@/lib/engine/types";

interface BotPanelProps {
  state: BarphaseState;
  isRunning: boolean;
}

export function BotPanel({ state, isRunning }: BotPanelProps) {
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
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isRunning ? "bg-bp-lime animate-dot-pulse" : "bg-bp-text-dim"
            }`}
          />
          <span className={`text-[10px] font-medium ${isRunning ? "text-bp-lime" : "text-bp-text-dim"}`}>
            {isRunning ? "LIVE" : "PAUSED"}
          </span>
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
            MNQ • 3m • Barphase Engine
          </span>
          <span className="text-[10px] text-bp-text-dim tabular-nums">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
