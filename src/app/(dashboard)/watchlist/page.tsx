// ═══════════════════════════════════════════
// BARPHASE — WATCHLIST
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface WatchItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  bias: "Bullish" | "Bearish" | "Neutral";
  structureStrength: number;
  lastEvent: string;
  notes: string;
}

const WATCHLIST: WatchItem[] = [
  { symbol: "MNQ", name: "Micro E-mini Nasdaq", price: 21452.50, change: 0.42, bias: "Bullish", structureStrength: 78, lastEvent: "BOS", notes: "Primary instrument — watching for FVG fill" },
  { symbol: "MES", name: "Micro E-mini S&P", price: 5892.25, change: -0.18, bias: "Bearish", structureStrength: 32, lastEvent: "CHOCH", notes: "Potential short setup forming at premium" },
  { symbol: "M2K", name: "Micro Russell 2000", price: 2285.40, change: 0.31, bias: "Bullish", structureStrength: 65, lastEvent: "Sweep", notes: "Liquidity swept — waiting for displacement" },
  { symbol: "MCL", name: "Micro Crude Oil", price: 68.42, change: -1.24, bias: "Bearish", structureStrength: 25, lastEvent: "BOS", notes: "Strong bearish structure — monitoring for entries" },
  { symbol: "MGC", name: "Micro Gold", price: 2185.60, change: 0.67, bias: "Bullish", structureStrength: 72, lastEvent: "BOS", notes: "Gold in bullish structure — FVG forming" },
];

export default function WatchlistPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Watchlist</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Track preferred instruments with structure summaries</p>
          </div>
          <button className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
            + Add Symbol
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {WATCHLIST.map((item) => (
            <Card key={item.symbol} variant={item.bias === "Bullish" ? "lime" : item.bias === "Bearish" ? "bear" : "default"} className="hover:border-bp-violet/30 cursor-pointer transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-sm font-bold text-bp-text">{item.symbol}</span>
                    <span className="text-[10px] text-bp-text-dim block">{item.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-bp-text tabular-nums">{item.price.toFixed(2)}</span>
                  <span className={`text-[11px] font-semibold tabular-nums block ${item.change >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant={item.bias === "Bullish" ? "lime" : item.bias === "Bearish" ? "bear" : "neutral"} size="sm">{item.bias}</Badge>
                <Badge variant="violet" size="sm">{item.lastEvent}</Badge>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-bp-text-dim">Structure Strength</span>
                  <span className="text-[10px] font-semibold tabular-nums" style={{ color: item.structureStrength > 60 ? "#C6FF33" : item.structureStrength < 40 ? "#F23645" : "#7D39EB" }}>
                    {item.structureStrength}%
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-bp-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.structureStrength}%`, background: item.structureStrength > 60 ? "#C6FF33" : item.structureStrength < 40 ? "#F23645" : "#7D39EB" }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-bp-text-dim leading-relaxed">{item.notes}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
