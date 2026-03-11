// ═══════════════════════════════════════════
// BARPHASE — RISK MANAGEMENT
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface RiskRule {
  id: string;
  name: string;
  description: string;
  threshold: string;
  current: string;
  status: "ok" | "warning" | "danger";
  percentage: number;
}

const RISK_RULES: RiskRule[] = [
  { id: "1", name: "Max Daily Loss", description: "Stop trading when daily loss exceeds threshold", threshold: "$500", current: "-$95", status: "ok", percentage: 19 },
  { id: "2", name: "Max Trades Per Day", description: "Limit number of trades to prevent overtrading", threshold: "8 trades", current: "5 trades", status: "ok", percentage: 62 },
  { id: "3", name: "Risk Per Trade", description: "Maximum risk allocated to a single position", threshold: "1.5% ($150)", current: "1.2% ($120)", status: "ok", percentage: 80 },
  { id: "4", name: "Consecutive Losses", description: "Pause after consecutive losing trades", threshold: "3 losses", current: "1 loss", status: "ok", percentage: 33 },
  { id: "5", name: "Position Size Limit", description: "Maximum contracts per trade", threshold: "4 contracts", current: "2 contracts", status: "ok", percentage: 50 },
  { id: "6", name: "Session Time Limit", description: "Only trade during valid session hours", threshold: "9:30-16:00 ET", current: "In session", status: "ok", percentage: 65 },
];

export default function RiskPage() {
  const activeWarnings = RISK_RULES.filter((r) => r.status !== "ok").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Risk Management</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">Define and monitor risk rules to protect your capital</p>
          </div>
          <Badge variant={activeWarnings > 0 ? "bear" : "lime"} size="lg">
            {activeWarnings > 0 ? `${activeWarnings} Warning${activeWarnings > 1 ? "s" : ""}` : "All Rules OK"}
          </Badge>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Account Balance</span>
            <span className="text-xl font-bold text-bp-text">$10,847.50</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Daily PnL</span>
            <span className="text-xl font-bold text-bp-lime">+$847.50</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Capital at Risk</span>
            <span className="text-xl font-bold text-bp-violet-light">$120.00</span>
            <span className="text-[9px] text-bp-text-dim">1.2% of account</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Risk Capacity</span>
            <span className="text-xl font-bold text-bp-lime">81%</span>
            <span className="text-[9px] text-bp-text-dim">remaining today</span>
          </Card>
        </div>

        {/* Rules */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-bp-text-muted uppercase tracking-wider">Active Rules</h2>
          {RISK_RULES.map((rule) => (
            <Card key={rule.id} variant={rule.status === "danger" ? "bear" : rule.status === "warning" ? "default" : "default"}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[13px] font-semibold text-bp-text">{rule.name}</span>
                  <p className="text-[11px] text-bp-text-dim">{rule.description}</p>
                </div>
                <Badge variant={rule.status === "ok" ? "lime" : rule.status === "warning" ? "warning" : "bear"} size="sm">
                  {rule.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-bp-text-dim">Current: <span className="text-bp-text">{rule.current}</span></span>
                <span className="text-[10px] text-bp-text-dim">Limit: <span className="text-bp-text">{rule.threshold}</span></span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-bp-bg-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${rule.percentage}%`,
                    background: rule.percentage > 80 ? "#F23645" : rule.percentage > 60 ? "#FFEB3B" : "#C6FF33",
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
