// ═══════════════════════════════════════════
// BARPHASE — ALERTS (Working New Alert + Delete)
// ═══════════════════════════════════════════

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface Alert {
  id: string;
  type: "sweep" | "bos" | "choch" | "fvg" | "setup" | "risk";
  symbol: string;
  condition: string;
  status: "active" | "triggered" | "expired";
  createdAt: string;
  triggeredAt?: string;
}

const INITIAL_ALERTS: Alert[] = [
  { id: "1", type: "sweep", symbol: "MNQ", condition: "Liquidity sweep below 21400", status: "active", createdAt: "09:15" },
  { id: "2", type: "bos", symbol: "MNQ", condition: "Break of structure above 21480", status: "active", createdAt: "09:20" },
  { id: "3", type: "setup", symbol: "MNQ", condition: "Setup score reaches 5/6 or higher", status: "triggered", createdAt: "08:45", triggeredAt: "09:38" },
  { id: "4", type: "fvg", symbol: "MES", condition: "New FVG detected on 3m chart", status: "active", createdAt: "09:00" },
  { id: "5", type: "risk", symbol: "ALL", condition: "Daily loss exceeds $300", status: "active", createdAt: "08:00" },
  { id: "6", type: "choch", symbol: "MNQ", condition: "CHOCH detected on 3m timeframe", status: "triggered", createdAt: "08:30", triggeredAt: "10:48" },
  { id: "7", type: "sweep", symbol: "M2K", condition: "Liquidity sweep above 2290", status: "expired", createdAt: "Yesterday" },
];

const typeColors: Record<string, "violet" | "lime" | "warning" | "info" | "bear"> = {
  sweep: "violet",
  bos: "lime",
  choch: "warning",
  fvg: "info",
  setup: "lime",
  risk: "bear",
};

const typeIcons: Record<string, string> = {
  sweep: "💧", bos: "📈", choch: "🔄", fvg: "📊", setup: "⚡", risk: "🛡️",
};

const alertTypes = ["sweep", "bos", "choch", "fvg", "setup", "risk"] as const;

function NewAlertForm({ onSubmit, onClose }: { onSubmit: (a: Alert) => void; onClose: () => void }) {
  const [form, setForm] = useState({ type: "sweep" as Alert["type"], symbol: "MNQ", condition: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full bg-bp-bg-tertiary border border-bp-border rounded-lg px-3 py-2 text-[12px] text-bp-text outline-none focus:border-bp-violet transition-colors";
  const labelCls = "text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.condition.trim()) return;
    const now = new Date();
    onSubmit({
      id: Date.now().toString(),
      type: form.type,
      symbol: form.symbol.toUpperCase(),
      condition: form.condition,
      status: "active",
      createdAt: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Alert Type</label>
        <div className="grid grid-cols-3 gap-1.5">
          {alertTypes.map((t) => (
            <button key={t} type="button" onClick={() => update("type", t)}
              className={`flex items-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                form.type === t ? "bg-bp-violet/12 border-bp-violet/25 text-bp-violet-light" : "bg-bp-bg-tertiary border-bp-border text-bp-text-dim"
              }`}>
              <span>{typeIcons[t]}</span>
              <span className="uppercase">{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>Symbol</label>
        <input value={form.symbol} onChange={(e) => update("symbol", e.target.value)} placeholder="MNQ" className={inputCls} required />
      </div>
      <div>
        <label className={labelCls}>Condition</label>
        <input value={form.condition} onChange={(e) => update("condition", e.target.value)} placeholder="e.g. Liquidity sweep below 21400" className={inputCls} required />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[12px] font-medium text-bp-text-dim bg-bp-bg-tertiary rounded-lg hover:bg-bp-bg-elevated transition-colors border border-bp-border">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-bp-violet rounded-lg hover:bg-bp-violet-light transition-colors">Create Alert</button>
      </div>
    </form>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (a: Alert) => setAlerts((prev) => [a, ...prev]);
  const handleDelete = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const activeAlerts = alerts.filter((a) => a.status === "active").length;
  const triggeredAlerts = alerts.filter((a) => a.status === "triggered").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Alerts</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Set alerts for sweeps, structure breaks, and setup conditions</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
            + New Alert
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Active</span>
            <span className="text-xl font-bold text-bp-lime">{activeAlerts}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Triggered</span>
            <span className="text-xl font-bold text-bp-violet-light">{triggeredAlerts}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Total</span>
            <span className="text-xl font-bold text-bp-text-muted">{alerts.length}</span>
          </Card>
        </div>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card key={alert.id} variant={alert.status === "triggered" ? "violet" : "default"} className={`${alert.status === "expired" ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${alert.status === "triggered" ? "bg-bp-violet/15" : alert.status === "active" ? "bg-bp-bg-tertiary" : "bg-bp-bg-tertiary/50"}`}>
                    <span className="text-sm">{typeIcons[alert.type]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-bp-text">{alert.symbol}</span>
                      <Badge variant={typeColors[alert.type]} size="sm">{alert.type.toUpperCase()}</Badge>
                    </div>
                    <p className="text-[11px] text-bp-text-dim mt-0.5">{alert.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <Badge variant={alert.status === "active" ? "lime" : alert.status === "triggered" ? "violet" : "neutral"} size="sm">{alert.status}</Badge>
                    <div className="text-[9px] text-bp-text-dim mt-1">
                      {alert.triggeredAt ? `Triggered @ ${alert.triggeredAt}` : `Created @ ${alert.createdAt}`}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(alert.id)} className="text-bp-text-dim hover:text-bp-bear transition-colors text-sm" title="Delete">✕</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Alert">
        <NewAlertForm onSubmit={handleAdd} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
