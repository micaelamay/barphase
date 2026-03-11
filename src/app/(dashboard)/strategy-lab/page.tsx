// ═══════════════════════════════════════════
// BARPHASE — STRATEGY LAB
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Strategy {
  id: string;
  name: string;
  description: string;
  winRate: number;
  avgR: number;
  trades: number;
  status: "active" | "testing" | "archived";
  tags: string[];
}

const STRATEGIES: Strategy[] = [
  {
    id: "1", name: "FVG Retrace Entry", description: "Wait for liquidity sweep, BOS/CHOCH confirmation, then enter on FVG retrace with confirmation candle. Core Barphase model.",
    winRate: 72, avgR: 1.8, trades: 64, status: "active", tags: ["FVG", "BOS", "Core"],
  },
  {
    id: "2", name: "OB Continuation", description: "Enter on bullish/bearish order block during trending market after structure break confirms direction.",
    winRate: 65, avgR: 1.5, trades: 38, status: "active", tags: ["OB", "Trend"],
  },
  {
    id: "3", name: "Sweep Reversal", description: "Liquidity sweep at key level followed by displacement candle and structure change (CHOCH). Counter-trend entry.",
    winRate: 58, avgR: 2.1, trades: 22, status: "active", tags: ["Sweep", "CHOCH", "Reversal"],
  },
  {
    id: "4", name: "VWAP Continuation", description: "Enter on VWAP bounce during strong trending sessions when price holds above/below VWAP after displacement.",
    winRate: 52, avgR: 1.2, trades: 15, status: "testing", tags: ["VWAP", "Trend"],
  },
  {
    id: "5", name: "Double Sweep Reversal", description: "Wait for both buy-side and sell-side liquidity to be swept before entering. Higher probability but lower frequency.",
    winRate: 0, avgR: 0, trades: 0, status: "testing", tags: ["Sweep", "Premium"],
  },
];

function StrategyCard({ strategy }: { strategy: Strategy }) {
  return (
    <Card variant={strategy.status === "active" ? "violet" : "default"} className="hover:border-bp-violet/30 transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold text-bp-text">{strategy.name}</h3>
        <Badge
          variant={strategy.status === "active" ? "lime" : strategy.status === "testing" ? "violet" : "neutral"}
          size="sm"
        >
          {strategy.status}
        </Badge>
      </div>
      <p className="text-[11px] text-bp-text-dim leading-relaxed mb-3">{strategy.description}</p>

      <div className="flex gap-1.5 mb-3 flex-wrap">
        {strategy.tags.map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-bp-bg-tertiary text-bp-text-muted">
            {tag}
          </span>
        ))}
      </div>

      {strategy.trades > 0 ? (
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-bp-border/50">
          <div>
            <span className="text-[9px] text-bp-text-dim block">Win Rate</span>
            <span className={`text-sm font-bold tabular-nums ${strategy.winRate >= 60 ? "text-bp-lime" : strategy.winRate >= 50 ? "text-bp-violet-light" : "text-bp-bear"}`}>
              {strategy.winRate}%
            </span>
          </div>
          <div>
            <span className="text-[9px] text-bp-text-dim block">Avg R</span>
            <span className="text-sm font-bold tabular-nums text-bp-text">{strategy.avgR.toFixed(1)}R</span>
          </div>
          <div>
            <span className="text-[9px] text-bp-text-dim block">Trades</span>
            <span className="text-sm font-bold tabular-nums text-bp-text-muted">{strategy.trades}</span>
          </div>
        </div>
      ) : (
        <div className="pt-3 border-t border-bp-border/50">
          <span className="text-[10px] text-bp-text-dim italic">No trades recorded yet — strategy under development</span>
        </div>
      )}
    </Card>
  );
}

export default function StrategyLabPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Strategy Lab</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Track, test, and compare trading models</p>
          </div>
          <button className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
            + New Strategy
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {STRATEGIES.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
