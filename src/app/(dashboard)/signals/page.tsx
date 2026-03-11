// ═══════════════════════════════════════════
// BARPHASE — SIGNALS LOG
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useBarphaseEngine } from "@/hooks/useBarphaseEngine";

interface SignalEntry {
  id: string;
  timestamp: string;
  signal: string;
  botStatus: string;
  bias: string;
  score: number;
  price: number;
  event: string;
  outcome: string;
}

const MOCK_SIGNALS: SignalEntry[] = [
  { id: "1", timestamp: "09:42:15", signal: "ENTER LONG", botStatus: "ENTER", bias: "Bullish", score: 6, price: 21432.50, event: "BOS", outcome: "+2.1R" },
  { id: "2", timestamp: "09:38:00", signal: "READY", botStatus: "READY", bias: "Bullish", score: 5, price: 21428.75, event: "BOS", outcome: "→ Entry" },
  { id: "3", timestamp: "09:33:00", signal: "WAIT", botStatus: "PREPARE", bias: "Bullish", score: 4, price: 21420.00, event: "BOS", outcome: "→ Ready" },
  { id: "4", timestamp: "09:27:00", signal: "WAIT", botStatus: "WAITING", bias: "Neutral", score: 2, price: 21415.50, event: "Sweep", outcome: "→ Prepare" },
  { id: "5", timestamp: "10:51:30", signal: "ENTER SHORT", botStatus: "ENTER", bias: "Bearish", score: 6, price: 21489.00, event: "CHOCH", outcome: "-0.5R" },
  { id: "6", timestamp: "12:03:00", signal: "ENTER LONG", botStatus: "ENTER", bias: "Bullish", score: 6, price: 21445.75, event: "BOS", outcome: "+1.8R" },
  { id: "7", timestamp: "13:15:45", signal: "WAIT", botStatus: "IDLE", bias: "Neutral", score: 0, price: 21460.25, event: "None", outcome: "—" },
  { id: "8", timestamp: "14:06:00", signal: "WAIT", botStatus: "WAITING", bias: "Bearish", score: 2, price: 21472.00, event: "Sweep", outcome: "→ Expired" },
];

export default function SignalsPage() {
  const { state } = useBarphaseEngine();

  const entryCount = MOCK_SIGNALS.filter((s) => s.signal.includes("ENTER")).length;
  const winCount = MOCK_SIGNALS.filter((s) => s.outcome.startsWith("+")).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold text-bp-text">Signal Log</h1>
          <p className="text-[12px] text-bp-text-dim mt-0.5">Complete history of bot-generated signals and outcomes</p>
        </div>

        {/* Live Signal */}
        <Card variant={state.signal.includes("ENTER") ? "lime" : state.signal === "READY" ? "violet" : "default"} glow={state.signal !== "WAIT"}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${state.signal !== "WAIT" ? "bg-bp-lime animate-dot-pulse" : "bg-bp-text-dim"}`} />
              <div>
                <span className="text-[10px] text-bp-text-dim uppercase tracking-wider">Live Signal</span>
                <div className={`text-lg font-black tracking-wider ${
                  state.signal.includes("LONG") ? "text-bp-lime" : state.signal.includes("SHORT") ? "text-bp-bear" : state.signal === "READY" ? "text-bp-violet-light" : "text-bp-text-dim"
                }`}>
                  {state.signal.replace("_", " ")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-bp-text tabular-nums">{state.currentPrice.toFixed(2)}</span>
              <div className="text-[10px] text-bp-text-dim">Score: {state.setupEvaluation.score}/6</div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Total Signals</span>
            <span className="text-xl font-bold text-bp-text">{MOCK_SIGNALS.length}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Entry Signals</span>
            <span className="text-xl font-bold text-bp-violet-light">{entryCount}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Win Rate</span>
            <span className="text-xl font-bold text-bp-lime">{entryCount > 0 ? Math.round((winCount / entryCount) * 100) : 0}%</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Accuracy</span>
            <span className="text-xl font-bold text-bp-text-muted">
              {Math.round((entryCount / MOCK_SIGNALS.length) * 100)}%
            </span>
            <span className="text-[9px] text-bp-text-dim">signal-to-entry</span>
          </Card>
        </div>

        {/* Signal Table */}
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-bp-border">
                  {["Time", "Signal", "Status", "Bias", "Score", "Price", "Event", "Outcome"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] text-bp-text-dim uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_SIGNALS.map((s) => (
                  <tr key={s.id} className="border-b border-bp-border/50 hover:bg-bp-bg-tertiary/50 transition-colors">
                    <td className="px-4 py-3 text-bp-text-muted tabular-nums font-mono">{s.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        s.signal.includes("LONG") ? "text-bp-lime" : s.signal.includes("SHORT") ? "text-bp-bear" : s.signal === "READY" ? "text-bp-violet-light" : "text-bp-text-dim"
                      }`}>
                        {s.signal}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge variant="neutral" size="sm">{s.botStatus}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={s.bias === "Bullish" ? "lime" : s.bias === "Bearish" ? "bear" : "neutral"} size="sm">{s.bias}</Badge></td>
                    <td className="px-4 py-3 text-bp-text tabular-nums font-semibold">{s.score}/6</td>
                    <td className="px-4 py-3 text-bp-text tabular-nums">{s.price.toFixed(2)}</td>
                    <td className="px-4 py-3"><Badge variant="violet" size="sm">{s.event}</Badge></td>
                    <td className={`px-4 py-3 font-semibold tabular-nums ${
                      s.outcome.startsWith("+") ? "text-bp-lime" : s.outcome.startsWith("-") ? "text-bp-bear" : "text-bp-text-dim"
                    }`}>
                      {s.outcome}
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
