// ═══════════════════════════════════════════
// BARPHASE — STRATEGY LAB (Working Buttons)
// ═══════════════════════════════════════════

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { SETUP_TYPES } from "@/lib/constants";

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

const INITIAL_STRATEGIES: Strategy[] = [
  { id: "1", name: "FVG Retrace Entry", description: "Wait for liquidity sweep, BOS/CHOCH confirmation, then enter on FVG retrace with confirmation candle. Core Barphase model.", winRate: 72, avgR: 1.8, trades: 64, status: "active", tags: ["FVG", "BOS", "Core"] },
  { id: "2", name: "OB Continuation", description: "Enter on bullish/bearish order block during trending market after structure break confirms direction.", winRate: 65, avgR: 1.5, trades: 38, status: "active", tags: ["OB", "Trend"] },
  { id: "3", name: "Sweep Reversal", description: "Liquidity sweep at key level followed by displacement candle and structure change (CHOCH). Counter-trend entry.", winRate: 58, avgR: 2.1, trades: 22, status: "active", tags: ["Sweep", "CHOCH", "Reversal"] },
  { id: "4", name: "VWAP Continuation", description: "Enter on VWAP bounce during strong trending sessions when price holds above/below VWAP after displacement.", winRate: 52, avgR: 1.2, trades: 15, status: "testing", tags: ["VWAP", "Trend"] },
  { id: "5", name: "Double Sweep Reversal", description: "Wait for both buy-side and sell-side liquidity to be swept before entering. Higher probability but lower frequency.", winRate: 0, avgR: 0, trades: 0, status: "testing", tags: ["Sweep", "Premium"] },
];

function StrategyCard({ strategy, onArchive }: { strategy: Strategy; onArchive: (id: string) => void }) {
  return (
    <Card variant={strategy.status === "active" ? "violet" : "default"} className="hover:border-bp-violet/30 transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold text-bp-text">{strategy.name}</h3>
        <div className="flex items-center gap-2">
          <Badge variant={strategy.status === "active" ? "lime" : strategy.status === "testing" ? "violet" : "neutral"} size="sm">{strategy.status}</Badge>
          {strategy.status !== "archived" && (
            <button onClick={() => onArchive(strategy.id)} className="text-[9px] text-bp-text-dim hover:text-bp-bear transition-colors" title="Archive">✕</button>
          )}
        </div>
      </div>
      <p className="text-[11px] text-bp-text-dim leading-relaxed mb-3">{strategy.description}</p>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {strategy.tags.map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-bp-bg-tertiary text-bp-text-muted">{tag}</span>
        ))}
      </div>
      {strategy.trades > 0 ? (
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-bp-border/50">
          <div>
            <span className="text-[9px] text-bp-text-dim block">Win Rate</span>
            <span className={`text-sm font-bold tabular-nums ${strategy.winRate >= 60 ? "text-bp-lime" : strategy.winRate >= 50 ? "text-bp-violet-light" : "text-bp-bear"}`}>{strategy.winRate}%</span>
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

function NewStrategyForm({ onSubmit, onClose }: { onSubmit: (s: Strategy) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", description: "", tags: "", status: "testing" as "active" | "testing" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full bg-bp-bg-tertiary border border-bp-border rounded-lg px-3 py-2 text-[12px] text-bp-text outline-none focus:border-bp-violet transition-colors";
  const labelCls = "text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      winRate: 0,
      avgR: 0,
      trades: 0,
      status: form.status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Strategy Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. FVG Retrace Entry" className={inputCls} required />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe entry rules, conditions, and edge..." rows={3} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className={labelCls}>Tags (comma separated)</label>
        <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="FVG, BOS, Sweep" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Status</label>
        <div className="flex gap-2">
          {(["testing", "active"] as const).map((s) => (
            <button key={s} type="button" onClick={() => update("status", s)}
              className={`flex-1 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${form.status === s ? "bg-bp-violet/12 border-bp-violet/25 text-bp-violet-light" : "bg-bp-bg-tertiary border-bp-border text-bp-text-dim"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[12px] font-medium text-bp-text-dim bg-bp-bg-tertiary rounded-lg hover:bg-bp-bg-elevated transition-colors border border-bp-border">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-bp-violet rounded-lg hover:bg-bp-violet-light transition-colors">Create Strategy</button>
      </div>
    </form>
  );
}

export default function StrategyLabPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(INITIAL_STRATEGIES);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (s: Strategy) => setStrategies((prev) => [s, ...prev]);
  const handleArchive = (id: string) => setStrategies((prev) => prev.map((s) => s.id === id ? { ...s, status: "archived" as const } : s));

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Strategy Lab</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Track, test, and compare trading models</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
            + New Strategy
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {strategies.map((s) => (
            <StrategyCard key={s.id} strategy={s} onArchive={handleArchive} />
          ))}
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Strategy">
        <NewStrategyForm onSubmit={handleAdd} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
