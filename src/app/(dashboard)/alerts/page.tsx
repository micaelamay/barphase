// ═══════════════════════════════════════════
// BARPHASE — ALERTS
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Alert {
  id: string;
  type: "sweep" | "bos" | "choch" | "fvg" | "setup" | "risk";
  symbol: string;
  condition: string;
  status: "active" | "triggered" | "expired";
  createdAt: string;
  triggeredAt?: string;
}

const ALERTS: Alert[] = [
  { id: "1", type: "sweep", symbol: "MNQ", condition: "Liquidity sweep below 21400", status: "active", createdAt: "09:15" },
  { id: "2", type: "bos", symbol: "MNQ", condition: "Break of structure above 21480", status: "active", createdAt: "09:20" },
  { id: "3", type: "setup", symbol: "MNQ", condition: "Setup score reaches 5/6 or higher", status: "triggered", createdAt: "08:45", triggeredAt: "09:38" },
  { id: "4", type: "fvg", symbol: "MES", condition: "New FVG detected on 3m chart", status: "active", createdAt: "09:00" },
  { id: "5", type: "risk", symbol: "ALL", condition: "Daily loss exceeds $300", status: "active", createdAt: "08:00" },
  { id: "6", type: "choch", symbol: "MNQ", condition: "CHOCH detected on 3m timeframe", status: "triggered", createdAt: "08:30", triggeredAt: "10:48" },
  { id: "7", type: "sweep", symbol: "M2K", condition: "Liquidity sweep above 2290", status: "expired", createdAt: "Yesterday" },
];

const typeColors: Record<string, string> = {
  sweep: "violet",
  bos: "lime",
  choch: "warning",
  fvg: "info",
  setup: "lime",
  risk: "bear",
};

export default function AlertsPage() {
  const activeAlerts = ALERTS.filter((a) => a.status === "active").length;
  const triggeredAlerts = ALERTS.filter((a) => a.status === "triggered").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Alerts</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Set alerts for sweeps, structure breaks, and setup conditions</p>
          </div>
          <button className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors">
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
            <span className="text-xl font-bold text-bp-text-muted">{ALERTS.length}</span>
          </Card>
        </div>

        <div className="space-y-2">
          {ALERTS.map((alert) => (
            <Card
              key={alert.id}
              variant={alert.status === "triggered" ? "violet" : "default"}
              className={`${alert.status === "expired" ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    alert.status === "triggered" ? "bg-bp-violet/15" : alert.status === "active" ? "bg-bp-bg-tertiary" : "bg-bp-bg-tertiary/50"
                  }`}>
                    <span className="text-sm">
                      {alert.type === "sweep" ? "💧" : alert.type === "bos" ? "📈" : alert.type === "choch" ? "🔄" : alert.type === "fvg" ? "📊" : alert.type === "setup" ? "⚡" : "🛡️"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-bp-text">{alert.symbol}</span>
                      <Badge variant={typeColors[alert.type] as "violet" | "lime" | "warning" | "info" | "bear"} size="sm">{alert.type.toUpperCase()}</Badge>
                    </div>
                    <p className="text-[11px] text-bp-text-dim mt-0.5">{alert.condition}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <Badge
                    variant={alert.status === "active" ? "lime" : alert.status === "triggered" ? "violet" : "neutral"}
                    size="sm"
                  >
                    {alert.status}
                  </Badge>
                  <div className="text-[9px] text-bp-text-dim mt-1">
                    {alert.triggeredAt ? `Triggered @ ${alert.triggeredAt}` : `Created @ ${alert.createdAt}`}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
