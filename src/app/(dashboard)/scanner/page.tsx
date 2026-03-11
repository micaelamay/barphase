// ═══════════════════════════════════════════
// BARPHASE — MARKET SCANNER (Working Refresh)
// ═══════════════════════════════════════════

"use client";

import React, { useState, useCallback } from "react";
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

function jitter(base: number, range: number): number {
  return Math.round((base + (Math.random() - 0.5) * range) * 100) / 100;
}

function generateScanData(): ScanResult[] {
  const biases: ("Bullish" | "Bearish" | "Neutral")[] = ["Bullish", "Bearish", "Neutral"];
  const events = ["BOS", "CHOCH", "Sweep", "None"];
  const signals = ["IDLE", "WAITING", "PREPARE", "READY", "ENTER"];

  return [
    { symbol: "MNQ", exchange: "CME", price: 21452.50, base: 21452.50 },
    { symbol: "MES", exchange: "CME", price: 5892.25, base: 5892.25 },
    { symbol: "MYM", exchange: "CBOT", price: 42815.00, base: 42815.00 },
    { symbol: "M2K", exchange: "CME", price: 2285.40, base: 2285.40 },
    { symbol: "MCL", exchange: "NYMEX", price: 68.42, base: 68.42 },
    { symbol: "MGC", exchange: "COMEX", price: 2185.60, base: 2185.60 },
    { symbol: "6E", exchange: "CME", price: 1.0842, base: 1.0842 },
    { symbol: "MBT", exchange: "CME", price: 97420.00, base: 97420.00 },
  ].map((item) => {
    const score = Math.floor(Math.random() * 7);
    const biasIdx = score >= 4 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3);
    const eventIdx = score >= 3 ? Math.floor(Math.random() * 3) : (Math.random() > 0.5 ? 3 : Math.floor(Math.random() * 4));
    const signalIdx = Math.min(score >= 6 ? 4 : score >= 5 ? 3 : Math.max(0, Math.floor(score / 2)), 4);
    return {
      symbol: item.symbol,
      exchange: item.exchange,
      bias: biases[biasIdx],
      event: events[eventIdx],
      score,
      price: jitter(item.price, item.price * 0.005),
      change: jitter(0, 2),
      signal: signals[signalIdx],
    };
  });
}

function getSignalColor(signal: string): string {
  if (signal === "ENTER") return "text-bp-lime";
  if (signal === "READY") return "text-bp-violet-light";
  if (signal === "PREPARE" || signal === "WAITING") return "text-bp-text-muted";
  return "text-bp-text-dim";
}

export default function ScannerPage() {
  const [results, setResults] = useState<ScanResult[]>(generateScanData);
  const [lastScan, setLastScan] = useState(new Date());
  const [scanning, setScanning] = useState(false);

  const handleRefresh = useCallback(() => {
    setScanning(true);
    // Simulate scan delay for visual feedback
    setTimeout(() => {
      setResults(generateScanData());
      setLastScan(new Date());
      setScanning(false);
    }, 600);
  }, []);

  const activeSignals = results.filter((r) => r.score >= 4).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Market Scanner</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">
              Scan multiple instruments for Barphase setups — Last scan: {lastScan.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="violet" size="md">{activeSignals} setups detected</Badge>
            <button
              onClick={handleRefresh}
              disabled={scanning}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                scanning
                  ? "bg-bp-violet/12 border-bp-violet/25 text-bp-violet-light animate-pulse"
                  : "bg-bp-bg-tertiary text-bp-text-muted hover:bg-bp-bg-elevated hover:text-bp-text border-bp-border"
              }`}
            >
              {scanning ? "Scanning..." : "⟳ Refresh"}
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
                {results.map((r, i) => (
                  <tr key={`${r.symbol}-${i}`} className={`border-b border-bp-border/50 hover:bg-bp-bg-tertiary/50 transition-colors cursor-pointer ${r.score >= 5 ? "bg-bp-lime/3" : ""}`}>
                    <td className="px-4 py-3"><span className="font-semibold text-bp-text">{r.symbol}</span></td>
                    <td className="px-4 py-3 text-bp-text-dim">{r.exchange}</td>
                    <td className="px-4 py-3 text-bp-text tabular-nums font-mono">{r.price.toFixed(r.price < 10 ? 4 : 2)}</td>
                    <td className={`px-4 py-3 tabular-nums font-semibold ${r.change >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                      {r.change >= 0 ? "+" : ""}{r.change.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3"><Badge variant={r.bias === "Bullish" ? "lime" : r.bias === "Bearish" ? "bear" : "neutral"} size="sm">{r.bias}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={r.event !== "None" ? "violet" : "neutral"} size="sm">{r.event}</Badge></td>
                    <td className="px-4 py-3">
                      <span className={`font-bold tabular-nums ${r.score >= 5 ? "text-bp-lime" : r.score >= 3 ? "text-bp-violet-light" : "text-bp-text-dim"}`}>{r.score}/6</span>
                    </td>
                    <td className="px-4 py-3"><span className={`font-semibold ${getSignalColor(r.signal)}`}>{r.signal}</span></td>
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
