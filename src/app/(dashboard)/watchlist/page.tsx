// ═══════════════════════════════════════════
// BARPHASE — WATCHLIST (Working Add Symbol)
// ═══════════════════════════════════════════

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

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

const INITIAL_WATCHLIST: WatchItem[] = [
  { symbol: "MNQ", name: "Micro E-mini Nasdaq", price: 21452.50, change: 0.42, bias: "Bullish", structureStrength: 78, lastEvent: "BOS", notes: "Primary instrument — watching for FVG fill" },
  { symbol: "MES", name: "Micro E-mini S&P", price: 5892.25, change: -0.18, bias: "Bearish", structureStrength: 32, lastEvent: "CHOCH", notes: "Potential short setup forming at premium" },
  { symbol: "M2K", name: "Micro Russell 2000", price: 2285.40, change: 0.31, bias: "Bullish", structureStrength: 65, lastEvent: "Sweep", notes: "Liquidity swept — waiting for displacement" },
  { symbol: "MCL", name: "Micro Crude Oil", price: 68.42, change: -1.24, bias: "Bearish", structureStrength: 25, lastEvent: "BOS", notes: "Strong bearish structure — monitoring for entries" },
  { symbol: "MGC", name: "Micro Gold", price: 2185.60, change: 0.67, bias: "Bullish", structureStrength: 72, lastEvent: "BOS", notes: "Gold in bullish structure — FVG forming" },
];

function AddSymbolForm({ onSubmit, onClose }: { onSubmit: (w: WatchItem) => void; onClose: () => void }) {
  const [form, setForm] = useState({ symbol: "", name: "", notes: "", bias: "Neutral" as "Bullish" | "Bearish" | "Neutral" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full bg-bp-bg-tertiary border border-bp-border rounded-lg px-3 py-2 text-[12px] text-bp-text outline-none focus:border-bp-violet transition-colors";
  const labelCls = "text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symbol.trim()) return;
    onSubmit({
      symbol: form.symbol.toUpperCase(),
      name: form.name || form.symbol.toUpperCase(),
      price: 0,
      change: 0,
      bias: form.bias,
      structureStrength: 50,
      lastEvent: "None",
      notes: form.notes,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Symbol</label>
          <input value={form.symbol} onChange={(e) => update("symbol", e.target.value)} placeholder="MNQ" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Name</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Micro E-mini Nasdaq" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Initial Bias</label>
        <div className="flex gap-2">
          {(["Bullish", "Neutral", "Bearish"] as const).map((b) => (
            <button key={b} type="button" onClick={() => update("bias", b)}
              className={`flex-1 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
                form.bias === b
                  ? b === "Bullish" ? "bg-bp-lime/12 border-bp-lime/25 text-bp-lime" : b === "Bearish" ? "bg-bp-bear/12 border-bp-bear/25 text-bp-bear" : "bg-bp-violet/12 border-bp-violet/25 text-bp-violet-light"
                  : "bg-bp-bg-tertiary border-bp-border text-bp-text-dim"
              }`}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>Notes</label>
        <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Why are you watching this instrument?" rows={2} className={`${inputCls} resize-none`} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[12px] font-medium text-bp-text-dim bg-bp-bg-tertiary rounded-lg hover:bg-bp-bg-elevated transition-colors border border-bp-border">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-bp-violet rounded-lg hover:bg-bp-violet-light transition-colors">Add to Watchlist</button>
      </div>
    </form>
  );
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>(INITIAL_WATCHLIST);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (w: WatchItem) => setWatchlist((prev) => [...prev, w]);
  const handleRemove = (symbol: string) => setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Watchlist</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Track preferred instruments with structure summaries</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
            + Add Symbol
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {watchlist.map((item) => (
            <Card key={item.symbol} variant={item.bias === "Bullish" ? "lime" : item.bias === "Bearish" ? "bear" : "default"} className="hover:border-bp-violet/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-sm font-bold text-bp-text">{item.symbol}</span>
                    <span className="text-[10px] text-bp-text-dim block">{item.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-bp-text tabular-nums">{item.price > 0 ? item.price.toFixed(2) : "—"}</span>
                    {item.price > 0 && (
                      <span className={`text-[11px] font-semibold tabular-nums block ${item.change >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                        {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleRemove(item.symbol)} className="text-bp-text-dim hover:text-bp-bear transition-colors text-sm" title="Remove">✕</button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={item.bias === "Bullish" ? "lime" : item.bias === "Bearish" ? "bear" : "neutral"} size="sm">{item.bias}</Badge>
                <Badge variant="violet" size="sm">{item.lastEvent}</Badge>
              </div>
              {item.structureStrength > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-bp-text-dim">Structure Strength</span>
                    <span className="text-[10px] font-semibold tabular-nums" style={{ color: item.structureStrength > 60 ? "#C6FF33" : item.structureStrength < 40 ? "#F23645" : "#7D39EB" }}>{item.structureStrength}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-bp-bg-tertiary overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.structureStrength}%`, background: item.structureStrength > 60 ? "#C6FF33" : item.structureStrength < 40 ? "#F23645" : "#7D39EB" }} />
                  </div>
                </div>
              )}
              <p className="text-[11px] text-bp-text-dim leading-relaxed">{item.notes}</p>
            </Card>
          ))}
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add to Watchlist">
        <AddSymbolForm onSubmit={handleAdd} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
