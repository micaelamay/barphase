// ═══════════════════════════════════════════
// BARPHASE — PERFORMANCE ANALYTICS
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// ── Bar Chart Component (CSS-based) ─────
function BarChart({ data, label }: { data: { name: string; value: number; color: string }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <Card>
      <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-4">{label}</span>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-bp-text">{d.name}</span>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: d.color }}>{d.value}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-bp-bg-tertiary overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.value / max) * 100}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Equity Curve (simplified CSS) ───────
function EquityCurve() {
  const points = [0, 120, 80, 250, 200, 380, 340, 520, 470, 620, 580, 750, 690, 847];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;

  return (
    <Card className="col-span-2">
      <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-4">Equity Curve</span>
      <div className="h-40 flex items-end gap-1">
        {points.map((p, i) => {
          const height = range > 0 ? ((p - min) / range) * 100 : 50;
          const isUp = i > 0 && p >= points[i - 1];
          return (
            <div key={i} className="flex-1 flex flex-col justify-end items-center">
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${Math.max(height, 4)}%`,
                  background: isUp ? "rgba(198, 255, 51, 0.6)" : "rgba(242, 54, 69, 0.6)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-bp-text-dim">Day 1</span>
        <span className="text-[10px] text-bp-text-dim">Day 14</span>
      </div>
    </Card>
  );
}

// ── Stats Grid ──────────────────────────
function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <Card>
      <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">{label}</span>
      <span className={`text-2xl font-bold tabular-nums`} style={{ color: accent }}>{value}</span>
      <span className="text-[10px] text-bp-text-dim block mt-0.5">{sub}</span>
    </Card>
  );
}

export default function AnalyticsPage() {
  const winRateData = [
    { name: "FVG Retrace", value: 72, color: "#C6FF33" },
    { name: "OB Continuation", value: 65, color: "#7D39EB" },
    { name: "Sweep Reversal", value: 58, color: "#9B5FF5" },
    { name: "CHOCH Entry", value: 54, color: "#5E5E72" },
  ];

  const sessionData = [
    { name: "NY Open (9:30-10:30)", value: 74, color: "#C6FF33" },
    { name: "Mid-Morning (10:30-12)", value: 61, color: "#7D39EB" },
    { name: "Lunch (12-14)", value: 42, color: "#F23645" },
    { name: "Power Hour (14-16)", value: 68, color: "#9B5FF5" },
  ];

  const mistakeData = [
    { name: "Early Entry (no confirm)", value: 35, color: "#F23645" },
    { name: "FOMO Re-entry", value: 25, color: "#FF6B6B" },
    { name: "Oversizing", value: 20, color: "#FFEB3B" },
    { name: "Counter-trend", value: 15, color: "#5E5E72" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold text-bp-text">Performance Analytics</h1>
          <p className="text-[12px] text-bp-text-dim mt-0.5">Deep dive into your trading performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard label="Total PnL" value="+$4,280" sub="Last 30 days" accent="#C6FF33" />
          <StatCard label="Win Rate" value="68%" sub="87/128 trades" accent="#7D39EB" />
          <StatCard label="Avg R" value="1.6R" sub="Per winning trade" accent="#9B5FF5" />
          <StatCard label="Profit Factor" value="2.4" sub="Win $ / Loss $" accent="#C6FF33" />
          <StatCard label="Max Drawdown" value="-$620" sub="3 consecutive losses" accent="#F23645" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <EquityCurve />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <BarChart data={winRateData} label="Win Rate by Setup" />
          <BarChart data={sessionData} label="Win Rate by Session" />
          <BarChart data={mistakeData} label="Common Mistakes" />
        </div>

        {/* Distribution */}
        <Card>
          <span className="text-[10px] font-medium text-bp-text-dim uppercase tracking-wider block mb-4">Trade Distribution (R-Multiple)</span>
          <div className="flex items-end gap-1 h-32">
            {[
              { r: "-3R", count: 1 }, { r: "-2R", count: 3 }, { r: "-1R", count: 8 },
              { r: "-0.5R", count: 12 }, { r: "BE", count: 6 }, { r: "+0.5R", count: 10 },
              { r: "+1R", count: 22 }, { r: "+1.5R", count: 18 }, { r: "+2R", count: 15 },
              { r: "+2.5R", count: 8 }, { r: "+3R+", count: 4 },
            ].map((d, i) => {
              const maxC = 22;
              const pct = (d.count / maxC) * 100;
              const isPositive = d.r.startsWith("+") || d.r === "BE";
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                  <span className="text-[9px] text-bp-text-dim tabular-nums">{d.count}</span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${Math.max(pct, 3)}%`,
                      background: isPositive ? "rgba(198, 255, 51, 0.5)" : "rgba(242, 54, 69, 0.5)",
                    }}
                  />
                  <span className="text-[8px] text-bp-text-dim tabular-nums">{d.r}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
