// ═══════════════════════════════════════════
// BARPHASE — NEWS INTELLIGENCE v2.1
// Live dates, API-ready structure, real timestamps
// ═══════════════════════════════════════════

"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  generateCalendarForDate,
  generateNewsForDate,
  hasUpcomingHighImpact,
  formatRelativeTime,
  type EconomicEvent,
  type NewsItem,
} from "@/lib/news";

export default function NewsPage() {
  const [now, setNow] = useState(new Date());

  // Tick clock every 30 seconds for relative timestamps
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const calendarEvents: EconomicEvent[] = useMemo(() => generateCalendarForDate(now), [now]);
  const newsItems: NewsItem[] = useMemo(() => generateNewsForDate(now), [now]);
  const highImpactSoon = useMemo(() => hasUpcomingHighImpact(calendarEvents, 30), [calendarEvents]);

  const highImpactCount = calendarEvents.filter((e) => e.impact === "high").length;
  const passedCount = calendarEvents.filter((e) => e.passed).length;

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header with live time */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">News Intelligence</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">
              {dateStr}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-bold text-bp-violet-light tabular-nums font-mono">
              {timeStr}
            </div>
            <div className="text-[10px] text-bp-text-dim">Eastern Time</div>
          </div>
        </div>

        {/* High Impact Warning */}
        {highImpactSoon && (
          <Card variant="bear" className="!bg-bp-bear/6 border-bp-bear/20">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <span className="text-[12px] font-semibold text-bp-bear">
                  High Impact News Incoming
                </span>
                <p className="text-[11px] text-bp-text-dim">
                  High-impact economic event within the next 30 minutes.
                  Barphase engine confidence reduced — consider widening stops or waiting.
                </p>
              </div>
              <Badge variant="bear" size="sm" className="ml-auto flex-shrink-0">CAUTION</Badge>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Today&apos;s Events</span>
            <span className="text-xl font-bold text-bp-text">{calendarEvents.length}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">High Impact</span>
            <span className="text-xl font-bold text-bp-bear">{highImpactCount}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Released</span>
            <span className="text-xl font-bold text-bp-lime">{passedCount}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Upcoming</span>
            <span className="text-xl font-bold text-bp-violet-light">{calendarEvents.length - passedCount}</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic Calendar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-bp-text-muted uppercase tracking-wider">
                Economic Calendar
              </h2>
              <span className="text-[10px] text-bp-text-dim">
                {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>

            {calendarEvents.length === 0 ? (
              <Card>
                <p className="text-[12px] text-bp-text-dim text-center py-4">
                  No major economic events scheduled for today (weekend/holiday)
                </p>
              </Card>
            ) : (
              <Card className="!p-0 overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-bp-border">
                      {["Time", "Event", "Fcst", "Prev", "Impact"].map((h) => (
                        <th key={h} className="text-left px-3 py-2.5 text-[10px] text-bp-text-dim uppercase tracking-wider font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calendarEvents.map((e) => (
                      <tr
                        key={e.id}
                        className={`border-b border-bp-border/50 transition-colors ${
                          e.passed ? "opacity-50" : "hover:bg-bp-bg-tertiary/50"
                        }`}
                      >
                        <td className="px-3 py-2.5 text-bp-text-muted tabular-nums font-mono whitespace-nowrap">
                          {e.time} ET
                        </td>
                        <td className="px-3 py-2.5 text-bp-text font-medium">
                          {e.event}
                          {e.passed && e.actual !== "—" && (
                            <span className="text-[10px] text-bp-lime ml-2 font-mono">
                              Act: {e.actual}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-bp-text-muted tabular-nums">{e.forecast}</td>
                        <td className="px-3 py-2.5 text-bp-text-dim tabular-nums">{e.previous}</td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant={e.impact === "high" ? "bear" : e.impact === "medium" ? "warning" : "neutral"}
                            size="sm"
                          >
                            {e.impact}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* API Integration Note */}
            <div className="px-3 py-2 rounded-lg bg-bp-bg-tertiary/30 border border-bp-border/30">
              <p className="text-[10px] text-bp-text-dim">
                📡 Calendar data is template-based for the current day. Connect to{" "}
                <span className="text-bp-violet-light">Trading Economics</span>,{" "}
                <span className="text-bp-violet-light">Finnhub</span>, or{" "}
                <span className="text-bp-violet-light">ForexFactory API</span>{" "}
                for live event data and actual values.
              </p>
            </div>
          </div>

          {/* Market News */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-bp-text-muted uppercase tracking-wider">
                Latest Market News
              </h2>
              <span className="text-[10px] text-bp-text-dim">
                {newsItems.length} articles
              </span>
            </div>

            <div className="space-y-2">
              {newsItems.map((n) => (
                <Card
                  key={n.id}
                  className="hover:border-bp-violet/20 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[12px] text-bp-text font-medium leading-relaxed">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-bp-text-dim tabular-nums">
                          {formatRelativeTime(n.timestamp)}
                        </span>
                        <span className="text-[10px] text-bp-text-dim">•</span>
                        <span className="text-[10px] text-bp-violet-light font-medium">
                          {n.source}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-bp-bg-tertiary text-bp-text-dim">
                          {n.category}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        n.impact === "high"
                          ? "bear"
                          : n.impact === "medium"
                          ? "warning"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {n.impact}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* API Integration Note */}
            <div className="px-3 py-2 rounded-lg bg-bp-bg-tertiary/30 border border-bp-border/30">
              <p className="text-[10px] text-bp-text-dim">
                📡 News feed uses template articles for today&apos;s date. Connect to{" "}
                <span className="text-bp-violet-light">Benzinga</span>,{" "}
                <span className="text-bp-violet-light">NewsAPI</span>, or{" "}
                <span className="text-bp-violet-light">Alpha Vantage</span>{" "}
                for live market news and sentiment data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
