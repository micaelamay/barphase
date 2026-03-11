// ═══════════════════════════════════════════
// BARPHASE — OVERVIEW DASHBOARD
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useBarphaseEngine } from "@/hooks/useBarphaseEngine";

// ── Metric Card ─────────────────────────
function MetricCard({
  label,
  value,
  sub,
  accent = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "lime" | "bear" | "violet" | "default";
}) {
  const valueColor =
    accent === "lime"
      ? "text-bp-lime"
      : accent === "bear"
      ? "text-bp-bear"
      : accent === "violet"
      ? "text-bp-violet-light"
      : "text-bp-text";

  return (
    <Card>
      <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-1">
        {label}
      </span>
      <span className={`text-2xl font-bold tabular-nums ${valueColor}`}>{value}</span>
      {sub && <span className="text-[11px] text-bp-text-dim block mt-0.5">{sub}</span>}
    </Card>
  );
}

// ── Signal Summary Card ─────────────────
function SignalSummary({ signal, botStatus, price }: { signal: string; botStatus: string; price: number }) {
  const signalColor =
    signal === "ENTER_LONG"
      ? "text-bp-lime"
      : signal === "ENTER_SHORT"
      ? "text-bp-bear"
      : signal === "READY"
      ? "text-bp-violet-light"
      : "text-bp-text-dim";

  return (
    <Card variant={signal.includes("ENTER") ? "lime" : "default"} glow={signal.includes("ENTER")}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider">
          Live Signal
        </span>
        <Badge variant={signal.includes("ENTER") ? "lime" : "violet"} size="sm" pulse={signal !== "WAIT"}>
          {botStatus}
        </Badge>
      </div>
      <div className={`text-3xl font-black tracking-wider ${signalColor}`}>
        {signal.replace("_", " ")}
      </div>
      {price > 0 && (
        <div className="mt-2 text-sm text-bp-text-muted tabular-nums">
          MNQ @ {price.toFixed(2)}
        </div>
      )}
    </Card>
  );
}

// ── Upcoming Events Card ────────────────
function UpcomingEvents() {
  const events = [
    { time: "08:30", name: "Initial Claims", impact: "medium" },
    { time: "10:00", name: "ISM Manufacturing", impact: "high" },
    { time: "14:00", name: "FOMC Minutes", impact: "high" },
  ];

  return (
    <Card>
      <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-3">
        Upcoming Events
      </span>
      <div className="space-y-2">
        {events.map((e, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-bp-bg-tertiary/50">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-bp-text-muted tabular-nums font-mono">{e.time}</span>
              <span className="text-[11px] text-bp-text">{e.name}</span>
            </div>
            <Badge
              variant={e.impact === "high" ? "bear" : e.impact === "medium" ? "warning" : "neutral"}
              size="sm"
            >
              {e.impact}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Recent Signals Log ──────────────────
function RecentSignals() {
  const signals = [
    { time: "09:42", type: "ENTER LONG", score: "6/6", result: "+2.1R" },
    { time: "10:15", type: "WAIT", score: "2/6", result: "—" },
    { time: "10:51", type: "ENTER SHORT", score: "6/6", result: "-0.5R" },
    { time: "11:24", type: "READY", score: "5/6", result: "—" },
    { time: "12:03", type: "ENTER LONG", score: "6/6", result: "+1.8R" },
  ];

  return (
    <Card>
      <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-3">
        Recent Signals
      </span>
      <div className="space-y-1">
        {signals.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-bp-bg-tertiary/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-bp-text-dim tabular-nums font-mono w-10">{s.time}</span>
              <span
                className={`text-[11px] font-medium ${
                  s.type.includes("LONG")
                    ? "text-bp-lime"
                    : s.type.includes("SHORT")
                    ? "text-bp-bear"
                    : "text-bp-text-muted"
                }`}
              >
                {s.type}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-bp-text-dim">{s.score}</span>
              <span
                className={`text-[11px] font-semibold tabular-nums w-12 text-right ${
                  s.result.startsWith("+")
                    ? "text-bp-lime"
                    : s.result.startsWith("-")
                    ? "text-bp-bear"
                    : "text-bp-text-dim"
                }`}
              >
                {s.result}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Setup Performance Card ──────────────
function SetupPerformance() {
  const setups = [
    { name: "FVG Retrace", winRate: 72, trades: 28, color: "#C6FF33" },
    { name: "OB Continuation", winRate: 65, trades: 19, color: "#7D39EB" },
    { name: "Sweep Reversal", winRate: 58, trades: 14, color: "#9B5FF5" },
  ];

  return (
    <Card>
      <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-3">
        Best Setups
      </span>
      <div className="space-y-3">
        {setups.map((s, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-bp-text">{s.name}</span>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: s.color }}>
                {s.winRate}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-bp-bg-tertiary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${s.winRate}%`, background: s.color }}
              />
            </div>
            <span className="text-[9px] text-bp-text-dim">{s.trades} trades</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── MAIN PAGE ───────────────────────────
export default function OverviewPage() {
  const { state } = useBarphaseEngine();

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-bp-text">Overview</h1>
          <p className="text-[12px] text-bp-text-dim mt-0.5">
            Trading performance snapshot — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Today's PnL" value="+$847.50" sub="+3.2R total" accent="lime" />
          <MetricCard label="Win Rate" value="68%" sub="13/19 trades" accent="violet" />
          <MetricCard label="Trades Today" value="5" sub="3W • 1L • 1BE" />
          <MetricCard label="Active Signals" value={state.signal === "WAIT" ? "0" : "1"} sub={state.botStatus} accent={state.signal.includes("ENTER") ? "lime" : "default"} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Signal Summary — spans 1 column */}
          <SignalSummary
            signal={state.signal}
            botStatus={state.botStatus}
            price={state.currentPrice}
          />

          {/* Setup Performance */}
          <SetupPerformance />

          {/* Upcoming Events */}
          <UpcomingEvents />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <RecentSignals />

          {/* Quick Structure Summary */}
          <Card>
            <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-3">
              Market Structure
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-bp-text-dim block mb-1">Bias</span>
                <Badge variant={state.marketStructure.bias === "Bullish" ? "lime" : state.marketStructure.bias === "Bearish" ? "bear" : "neutral"} size="lg">
                  {state.marketStructure.bias}
                </Badge>
              </div>
              <div>
                <span className="text-[10px] text-bp-text-dim block mb-1">Last Event</span>
                <Badge variant="violet" size="lg">{state.marketStructure.lastEvent}</Badge>
              </div>
              <div>
                <span className="text-[10px] text-bp-text-dim block mb-1">Strength</span>
                <span className="text-lg font-bold tabular-nums text-bp-text">{state.marketStructure.structureStrength}%</span>
              </div>
              <div>
                <span className="text-[10px] text-bp-text-dim block mb-1">Setup Score</span>
                <span className="text-lg font-bold tabular-nums text-bp-violet-light">
                  {state.setupEvaluation.score}/{state.setupEvaluation.maxScore}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
