// ═══════════════════════════════════════════
// BARPHASE — TRADE JOURNAL
// ═══════════════════════════════════════════

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface TradeEntry {
  id: string;
  date: string;
  time: string;
  instrument: string;
  direction: "Long" | "Short";
  setup: string;
  entry: number;
  exit: number;
  rMultiple: number;
  pnl: number;
  emotion: string;
  notes: string;
  score: number;
}

const MOCK_TRADES: TradeEntry[] = [
  { id: "1", date: "2026-03-11", time: "09:42", instrument: "MNQ", direction: "Long", setup: "FVG Retrace", entry: 21432.50, exit: 21467.25, rMultiple: 2.1, pnl: 347.50, emotion: "Confident", notes: "Clean sweep + BOS + FVG retrace. Textbook entry.", score: 6 },
  { id: "2", date: "2026-03-11", time: "10:51", instrument: "MNQ", direction: "Short", setup: "Sweep Reversal", entry: 21489.00, exit: 21498.50, rMultiple: -0.5, pnl: -95.00, emotion: "FOMO", notes: "Entered too early before confirmation candle. Need more patience.", score: 4 },
  { id: "3", date: "2026-03-11", time: "12:03", instrument: "MNQ", direction: "Long", setup: "OB Continuation", entry: 21445.75, exit: 21478.00, rMultiple: 1.8, pnl: 322.50, emotion: "Disciplined", notes: "Waited for full confirmation. Perfect execution.", score: 6 },
  { id: "4", date: "2026-03-10", time: "09:33", instrument: "MNQ", direction: "Long", setup: "FVG Retrace", entry: 21398.25, exit: 21442.50, rMultiple: 2.8, pnl: 442.50, emotion: "Focused", notes: "Early session sweep into bullish FVG. Strong displacement.", score: 6 },
  { id: "5", date: "2026-03-10", time: "11:15", instrument: "MNQ", direction: "Short", setup: "CHOCH Reversal", entry: 21455.00, exit: 21425.75, rMultiple: 1.5, pnl: 292.50, emotion: "Calm", notes: "CHOCH at premium + bearish OB entry. Clean short.", score: 5 },
];

export default function JournalPage() {
  const [selectedTrade, setSelectedTrade] = useState<TradeEntry | null>(null);

  const totalPnl = MOCK_TRADES.reduce((s, t) => s + t.pnl, 0);
  const winCount = MOCK_TRADES.filter((t) => t.pnl > 0).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Trade Journal</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Log and analyze every trade for continuous improvement</p>
          </div>
          <button className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
            + Log Trade
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Total PnL</span>
            <span className={`text-xl font-bold tabular-nums ${totalPnl >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
            </span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Trades</span>
            <span className="text-xl font-bold text-bp-text">{MOCK_TRADES.length}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Win Rate</span>
            <span className="text-xl font-bold text-bp-violet-light">{Math.round((winCount / MOCK_TRADES.length) * 100)}%</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Avg R</span>
            <span className="text-xl font-bold text-bp-lime tabular-nums">
              {(MOCK_TRADES.reduce((s, t) => s + t.rMultiple, 0) / MOCK_TRADES.length).toFixed(1)}R
            </span>
          </Card>
        </div>

        {/* Trade Table */}
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-bp-border">
                  {["Date", "Time", "Direction", "Setup", "Entry", "Exit", "R", "PnL", "Emotion", "Score"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] text-bp-text-dim uppercase tracking-wider font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TRADES.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTrade(t)}
                    className={`border-b border-bp-border/50 cursor-pointer transition-colors hover:bg-bp-bg-tertiary/50 ${
                      selectedTrade?.id === t.id ? "bg-bp-violet/8" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-bp-text-muted tabular-nums">{t.date}</td>
                    <td className="px-4 py-3 text-bp-text-muted tabular-nums font-mono">{t.time}</td>
                    <td className="px-4 py-3">
                      <Badge variant={t.direction === "Long" ? "lime" : "bear"} size="sm">{t.direction}</Badge>
                    </td>
                    <td className="px-4 py-3 text-bp-text">{t.setup}</td>
                    <td className="px-4 py-3 text-bp-text tabular-nums">{t.entry.toFixed(2)}</td>
                    <td className="px-4 py-3 text-bp-text tabular-nums">{t.exit.toFixed(2)}</td>
                    <td className={`px-4 py-3 font-semibold tabular-nums ${t.rMultiple >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                      {t.rMultiple >= 0 ? "+" : ""}{t.rMultiple.toFixed(1)}R
                    </td>
                    <td className={`px-4 py-3 font-semibold tabular-nums ${t.pnl >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                      {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-bp-text-muted">{t.emotion}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold ${t.score >= 5 ? "text-bp-lime" : t.score >= 3 ? "text-bp-violet-light" : "text-bp-bear"}`}>
                        {t.score}/6
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Selected Trade Detail */}
        {selectedTrade && (
          <Card variant="violet" className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">Trade Notes</span>
              <button onClick={() => setSelectedTrade(null)} className="text-bp-text-dim hover:text-bp-text text-sm">✕</button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={selectedTrade.direction === "Long" ? "lime" : "bear"} size="lg">{selectedTrade.direction}</Badge>
              <span className="text-bp-text font-semibold">{selectedTrade.setup}</span>
              <span className="text-bp-text-dim">@ {selectedTrade.entry.toFixed(2)}</span>
            </div>
            <p className="text-[12px] text-bp-text-muted leading-relaxed">{selectedTrade.notes}</p>
            <div className="mt-3 flex gap-4">
              <div>
                <span className="text-[10px] text-bp-text-dim block">Emotional State</span>
                <span className="text-[12px] text-bp-text">{selectedTrade.emotion}</span>
              </div>
              <div>
                <span className="text-[10px] text-bp-text-dim block">Setup Score</span>
                <span className="text-[12px] text-bp-violet-light font-bold">{selectedTrade.score}/6</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
