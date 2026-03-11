// ═══════════════════════════════════════════
// BARPHASE — NEWS INTELLIGENCE
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface NewsItem {
  id: string;
  time: string;
  title: string;
  source: string;
  impact: "high" | "medium" | "low";
  category: string;
}

interface CalendarEvent {
  id: string;
  time: string;
  event: string;
  actual: string;
  forecast: string;
  previous: string;
  impact: "high" | "medium" | "low";
  currency: string;
}

const NEWS: NewsItem[] = [
  { id: "1", time: "08:15", title: "Fed Officials Signal Potential Rate Hold Through Q2", source: "Reuters", impact: "high", category: "Monetary Policy" },
  { id: "2", time: "07:45", title: "US Futures Point Higher Ahead of Economic Data", source: "Bloomberg", impact: "medium", category: "Market" },
  { id: "3", time: "07:30", title: "PCE Inflation Expected to Show Modest Decline", source: "CNBC", impact: "high", category: "Inflation" },
  { id: "4", time: "06:00", title: "European Markets Mixed on ECB Rate Decision", source: "FT", impact: "low", category: "Global" },
  { id: "5", time: "Yesterday", title: "Tech Sector Leads Nasdaq Recovery After Selloff", source: "MarketWatch", impact: "medium", category: "Sector" },
];

const CALENDAR: CalendarEvent[] = [
  { id: "1", time: "08:30", event: "Initial Jobless Claims", actual: "—", forecast: "225K", previous: "221K", impact: "medium", currency: "USD" },
  { id: "2", time: "08:30", event: "GDP (Q4 Final)", actual: "—", forecast: "3.2%", previous: "3.2%", impact: "high", currency: "USD" },
  { id: "3", time: "10:00", event: "ISM Manufacturing PMI", actual: "—", forecast: "50.5", previous: "50.3", impact: "high", currency: "USD" },
  { id: "4", time: "10:00", event: "Pending Home Sales", actual: "—", forecast: "1.5%", previous: "-4.6%", impact: "medium", currency: "USD" },
  { id: "5", time: "14:00", event: "FOMC Meeting Minutes", actual: "—", forecast: "—", previous: "—", impact: "high", currency: "USD" },
];

export default function NewsPage() {
  const highImpactCount = CALENDAR.filter((e) => e.impact === "high").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold text-bp-text">News Intelligence</h1>
          <p className="text-[12px] text-bp-text-dim mt-0.5">Market news and economic events that impact volatility</p>
        </div>

        {/* Warning Banner */}
        {highImpactCount > 0 && (
          <Card variant="bear" className="!bg-bp-bear/6 border-bp-bear/20">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <span className="text-[12px] font-semibold text-bp-bear">High Impact News Incoming</span>
                <p className="text-[11px] text-bp-text-dim">{highImpactCount} high-impact events today. Bot confidence may be temporarily reduced during releases.</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic Calendar */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-bp-text-muted uppercase tracking-wider">Economic Calendar</h2>
            <Card className="!p-0 overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-bp-border">
                    {["Time", "Event", "Forecast", "Previous", "Impact"].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5 text-[10px] text-bp-text-dim uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CALENDAR.map((e) => (
                    <tr key={e.id} className="border-b border-bp-border/50 hover:bg-bp-bg-tertiary/50 transition-colors">
                      <td className="px-3 py-2.5 text-bp-text-muted tabular-nums font-mono">{e.time}</td>
                      <td className="px-3 py-2.5 text-bp-text font-medium">{e.event}</td>
                      <td className="px-3 py-2.5 text-bp-text-muted tabular-nums">{e.forecast}</td>
                      <td className="px-3 py-2.5 text-bp-text-dim tabular-nums">{e.previous}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={e.impact === "high" ? "bear" : e.impact === "medium" ? "warning" : "neutral"} size="sm">{e.impact}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* News Feed */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-bp-text-muted uppercase tracking-wider">Market News</h2>
            <div className="space-y-2">
              {NEWS.map((n) => (
                <Card key={n.id} className="hover:border-bp-violet/20 cursor-pointer transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[12px] text-bp-text font-medium leading-relaxed">{n.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-bp-text-dim tabular-nums">{n.time}</span>
                        <span className="text-[10px] text-bp-text-dim">•</span>
                        <span className="text-[10px] text-bp-violet-light">{n.source}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-bp-bg-tertiary text-bp-text-dim">{n.category}</span>
                      </div>
                    </div>
                    <Badge variant={n.impact === "high" ? "bear" : n.impact === "medium" ? "warning" : "neutral"} size="sm">
                      {n.impact}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
