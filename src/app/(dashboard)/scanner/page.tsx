// ═══════════════════════════════════════════
// BARPHASE — MARKET SCANNER
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ScanResult {
  symbol: string;
  exchange: string;
  bias: "Bullish" | "Bearish" | "Neutral";
  event: string;
  score: number;
  price: number;
  change: number;
  signal: string;
}

const SCAN_RESULTS: ScanResult[] = [
  { symbol: "MNQ", exchange: "CME", bias: "Bullish", event: "BOS", score: 5, price: 21452.50, change: 0.42, signal: "READY" },
  { symbol: "MES", exchange: "CME", bias: "Bearish", event: "CHOCH", score: 4, price: 5892.25, change: -0.18, signal: "PREPARE" },
  { symbol: "MYM", exchange: "CBOT", bias: "Neutral", event: "None", score: 1, price: 42815.00, change: 0.05, signal: "IDLE" },
  { symbol: "M2K", exchange: "CME", bias: "Bullish", event: "Sweep", score: 3, price: 2285.40, change: 0.31, signal: "WAITING" },
  { symbol: "MNQ", exchange: "CME", bias: "Bullish", event: "BOS", score: 6, price: 21467.25, change: 0.52, signal: "ENTER" },
  { symbol: "MCL", exchange: "NYMEX", bias: "Bearish", event: "CHOCH", score: 2, price: 68.42, change: -1.24, signal: "WAITING" },
  { symbol: "MGC", exchange: "COMEX", bias: "Bullish", event: "BOS", score: 4, price: 2185.60, change: 0.67, signal: "PREPARE" },
  { symbol: "6E", exchange: "CME", bias: "Neutral", event: "None", score: 0, price: 1.0842, change: -0.03, signal: "IDLE" },
];

function getSignalColor(signal: string): string {
  if (signal === "ENTER") return "text-bp-lime";
  if (signal === "READY") return "text-bp-violet-light";
  if (signal === "PREPARE" || signal === "WAITING") return "text-bp-text-muted";
  return "text-bp-text-dim";
}

export default function ScannerPage() {
  const activeSignals = SCAN_RESULTS.filter((r) => r.score >= 4).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Market Scanner</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Scan multiple instruments for Barphase setups</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="violet" size="md">{activeSignals} setups detected</Badge>
            <button className="px-3 py-1.5 bg-bp-bg-tertiary text-bp-text-muted text-[11px] font-medium rounded-lg hover:bg-bp-bg-elevated transition-colors border border-bp-border">
              Refresh
            </button>
          </div>
        </div>

        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-bp-border">
                  {["Symbol", "Exchange", "Price", "Change", "Bias", "Event", "Score", "Signal"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] text-bp-text-dim uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCAN_RESULTS.map((r, i) => (
                  <tr key={i} className={`border-b border-bp-border/50 hover:bg-bp-bg-tertiary/50 transition-colors cursor-pointer ${r.score >= 5 ? "bg-bp-lime/3" : ""}`}>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-bp-text">{r.symbol}</span>
                    </td>
                    <td className="px-4 py-3 text-bp-text-dim">{r.exchange}</td>
                    <td className="px-4 py-3 text-bp-text tabular-nums font-mono">{r.price.toFixed(2)}</td>
                    <td className={`px-4 py-3 tabular-nums font-semibold ${r.change >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                      {r.change >= 0 ? "+" : ""}{r.change.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.bias === "Bullish" ? "lime" : r.bias === "Bearish" ? "bear" : "neutral"} size="sm">{r.bias}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.event !== "None" ? "violet" : "neutral"} size="sm">{r.event}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold tabular-nums ${r.score >= 5 ? "text-bp-lime" : r.score >= 3 ? "text-bp-violet-light" : "text-bp-text-dim"}`}>
                        {r.score}/6
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${getSignalColor(r.signal)}`}>{r.signal}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
