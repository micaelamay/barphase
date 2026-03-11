// ═══════════════════════════════════════════
// BARPHASE — TRADE JOURNAL v2.1
// Calendar + Emoji Emotions + Working Log Trade
// ═══════════════════════════════════════════

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EMOTIONS, getEmotion, INSTRUMENTS, SETUP_TYPES } from "@/lib/constants";
import type { Emotion } from "@/lib/constants";

// ── Types ───────────────────────────────
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
  emotion: string; // emotion value key
  notes: string;
  score: number;
}

// ── Date Helpers ────────────────────────
function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: string, b: string): boolean {
  return a === b;
}

// ── Initial Mock Data ───────────────────
const today = fmtDate(new Date());
const yesterday = fmtDate(new Date(Date.now() - 86400000));

const INITIAL_TRADES: TradeEntry[] = [
  { id: "1", date: today, time: "09:42", instrument: "MNQ", direction: "Long", setup: "FVG Retrace", entry: 21432.50, exit: 21467.25, rMultiple: 2.1, pnl: 347.50, emotion: "confident", notes: "Clean sweep + BOS + FVG retrace. Textbook entry.", score: 6 },
  { id: "2", date: today, time: "10:51", instrument: "MNQ", direction: "Short", setup: "Sweep Reversal", entry: 21489.00, exit: 21498.50, rMultiple: -0.5, pnl: -95.00, emotion: "fomo", notes: "Entered too early before confirmation candle. Need more patience.", score: 4 },
  { id: "3", date: today, time: "12:03", instrument: "MNQ", direction: "Long", setup: "OB Continuation", entry: 21445.75, exit: 21478.00, rMultiple: 1.8, pnl: 322.50, emotion: "disciplined", notes: "Waited for full confirmation. Perfect execution.", score: 6 },
  { id: "4", date: yesterday, time: "09:33", instrument: "MNQ", direction: "Long", setup: "FVG Retrace", entry: 21398.25, exit: 21442.50, rMultiple: 2.8, pnl: 442.50, emotion: "focused", notes: "Early session sweep into bullish FVG. Strong displacement.", score: 6 },
  { id: "5", date: yesterday, time: "11:15", instrument: "MNQ", direction: "Short", setup: "CHOCH Entry", entry: 21455.00, exit: 21425.75, rMultiple: 1.5, pnl: 292.50, emotion: "calm", notes: "CHOCH at premium + bearish OB entry. Clean short.", score: 5 },
];

// ══════════════════════════════════════════
// CALENDAR COMPONENT
// ══════════════════════════════════════════

function TradeCalendar({
  selectedDate,
  onSelectDate,
  tradeDates,
}: {
  selectedDate: string;
  onSelectDate: (d: string) => void;
  tradeDates: Set<string>;
}) {
  const [viewDate, setViewDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayStr = fmtDate(now);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun
  const totalDays = lastDay.getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const monthLabel = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <Card className="w-full">
      {/* Live Date/Time */}
      <div className="mb-3">
        <div className="text-[13px] font-semibold text-bp-text">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
        <div className="text-[18px] font-bold text-bp-violet-light tabular-nums font-mono">
          {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="text-bp-text-dim hover:text-bp-text transition-colors px-2 py-0.5 rounded hover:bg-bp-bg-tertiary text-sm">
          ‹
        </button>
        <span className="text-[12px] font-semibold text-bp-text">{monthLabel}</span>
        <button onClick={nextMonth} className="text-bp-text-dim hover:text-bp-text transition-colors px-2 py-0.5 rounded hover:bg-bp-bg-tertiary text-sm">
          ›
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-[9px] text-bp-text-dim text-center font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasTrades = tradeDates.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative text-[11px] py-1.5 rounded-lg transition-all duration-150 font-medium
                ${isSelected
                  ? "bg-bp-violet text-white"
                  : isToday
                  ? "bg-bp-violet/15 text-bp-violet-light"
                  : "hover:bg-bp-bg-tertiary text-bp-text-muted"
                }
              `}
            >
              {day}
              {hasTrades && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-bp-lime" />
              )}
            </button>
          );
        })}
      </div>

      {/* Show All */}
      <button
        onClick={() => onSelectDate("")}
        className={`w-full mt-2 text-[10px] py-1.5 rounded-lg transition-colors ${
          selectedDate === "" ? "bg-bp-violet/12 text-bp-violet-light" : "text-bp-text-dim hover:bg-bp-bg-tertiary"
        }`}
      >
        Show All Trades
      </button>
    </Card>
  );
}

// ══════════════════════════════════════════
// EMOJI EMOTION PICKER
// ══════════════════════════════════════════

function EmotionPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-2">Emotional State</label>
      <div className="grid grid-cols-5 gap-1.5">
        {EMOTIONS.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => onChange(e.value)}
            className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg transition-all text-center ${
              value === e.value
                ? "bg-bp-violet/15 border border-bp-violet/30"
                : "bg-bp-bg-tertiary/50 border border-transparent hover:border-bp-border"
            }`}
          >
            <span className="text-lg">{e.emoji}</span>
            <span className="text-[8px] text-bp-text-dim leading-tight">{e.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// EMOTION DISPLAY
// ══════════════════════════════════════════

function EmotionTag({ value }: { value: string }) {
  const e = getEmotion(value);
  return (
    <span className="inline-flex items-center gap-1" title={e.label}>
      <span className="text-sm">{e.emoji}</span>
      <span className="text-[10px] text-bp-text-muted">{e.label}</span>
    </span>
  );
}

// ══════════════════════════════════════════
// LOG TRADE MODAL
// ══════════════════════════════════════════

function LogTradeForm({ onSubmit, onClose }: { onSubmit: (t: TradeEntry) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    date: fmtDate(new Date()),
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    instrument: "MNQ",
    direction: "Long" as "Long" | "Short",
    setup: "FVG Retrace",
    entry: "",
    exit: "",
    rMultiple: "",
    pnl: "",
    emotion: "neutral",
    notes: "",
    score: "6",
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trade: TradeEntry = {
      id: Date.now().toString(),
      date: form.date,
      time: form.time,
      instrument: form.instrument,
      direction: form.direction,
      setup: form.setup,
      entry: parseFloat(form.entry) || 0,
      exit: parseFloat(form.exit) || 0,
      rMultiple: parseFloat(form.rMultiple) || 0,
      pnl: parseFloat(form.pnl) || 0,
      emotion: form.emotion,
      notes: form.notes,
      score: parseInt(form.score) || 0,
    };
    onSubmit(trade);
    onClose();
  };

  const inputCls = "w-full bg-bp-bg-tertiary border border-bp-border rounded-lg px-3 py-2 text-[12px] text-bp-text outline-none focus:border-bp-violet transition-colors";
  const labelCls = "text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Time</label>
          <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Instrument</label>
          <select value={form.instrument} onChange={(e) => update("instrument", e.target.value)} className={inputCls}>
            {INSTRUMENTS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Direction</label>
          <div className="flex gap-1">
            {(["Long", "Short"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => update("direction", d)}
                className={`flex-1 py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
                  form.direction === d
                    ? d === "Long" ? "bg-bp-lime/12 border-bp-lime/25 text-bp-lime" : "bg-bp-bear/12 border-bp-bear/25 text-bp-bear"
                    : "bg-bp-bg-tertiary border-bp-border text-bp-text-dim"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Setup Type</label>
          <select value={form.setup} onChange={(e) => update("setup", e.target.value)} className={inputCls}>
            {SETUP_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelCls}>Entry Price</label>
          <input type="number" step="0.01" placeholder="21432.50" value={form.entry} onChange={(e) => update("entry", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Exit Price</label>
          <input type="number" step="0.01" placeholder="21467.25" value={form.exit} onChange={(e) => update("exit", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>R-Multiple</label>
          <input type="number" step="0.1" placeholder="2.1" value={form.rMultiple} onChange={(e) => update("rMultiple", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>PnL ($)</label>
          <input type="number" step="0.01" placeholder="347.50" value={form.pnl} onChange={(e) => update("pnl", e.target.value)} className={inputCls} />
        </div>
      </div>

      <EmotionPicker value={form.emotion} onChange={(v) => update("emotion", v)} />

      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Trade analysis, what went well, what to improve..."
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>Setup Score (1-6)</label>
        <select value={form.score} onChange={(e) => update("score", e.target.value)} className={inputCls}>
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}/6{n >= 5 ? " ✓" : ""}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-[12px] font-medium text-bp-text-dim bg-bp-bg-tertiary rounded-lg hover:bg-bp-bg-elevated transition-colors border border-bp-border">
          Cancel
        </button>
        <button type="submit" className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-bp-violet rounded-lg hover:bg-bp-violet-light transition-colors">
          Save Trade
        </button>
      </div>
    </form>
  );
}

// ══════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════

export default function JournalPage() {
  const [trades, setTrades] = useState<TradeEntry[]>(INITIAL_TRADES);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTrade, setSelectedTrade] = useState<TradeEntry | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  // Dates that have trades (for calendar dots)
  const tradeDates = useMemo(
    () => new Set(trades.map((t) => t.date)),
    [trades]
  );

  // Filter trades by selected date
  const filteredTrades = useMemo(
    () => selectedDate ? trades.filter((t) => isSameDay(t.date, selectedDate)) : trades,
    [trades, selectedDate]
  );

  // Stats
  const totalPnl = filteredTrades.reduce((s, t) => s + t.pnl, 0);
  const winCount = filteredTrades.filter((t) => t.pnl > 0).length;
  const avgR = filteredTrades.length > 0 ? filteredTrades.reduce((s, t) => s + t.rMultiple, 0) / filteredTrades.length : 0;

  const handleLogTrade = (trade: TradeEntry) => {
    setTrades((prev) => [trade, ...prev]);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Trade Journal</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">
              Log and analyze every trade for continuous improvement
            </p>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 bg-bp-violet text-white text-[12px] font-semibold rounded-lg hover:bg-bp-violet-light transition-colors"
          >
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
            <span className="text-xl font-bold text-bp-text">{filteredTrades.length}</span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Win Rate</span>
            <span className="text-xl font-bold text-bp-violet-light">
              {filteredTrades.length > 0 ? Math.round((winCount / filteredTrades.length) * 100) : 0}%
            </span>
          </Card>
          <Card>
            <span className="text-[10px] text-bp-text-dim uppercase tracking-wider block mb-1">Avg R</span>
            <span className="text-xl font-bold text-bp-lime tabular-nums">{avgR.toFixed(1)}R</span>
          </Card>
        </div>

        {/* Calendar + Table */}
        <div className="flex gap-4">
          {/* Left: Calendar */}
          <div className="w-[280px] flex-shrink-0">
            <TradeCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tradeDates={tradeDates}
            />
          </div>

          {/* Right: Trade Table */}
          <div className="flex-1 min-w-0">
            {selectedDate && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] text-bp-text-muted">Showing trades for</span>
                <Badge variant="violet" size="sm">{new Date(selectedDate + "T12:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Badge>
              </div>
            )}

            <Card className="!p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-bp-border">
                      {["Date", "Time", "Dir", "Setup", "Entry", "Exit", "R", "PnL", "Emotion", "Score"].map((h) => (
                        <th key={h} className="text-left px-3 py-2.5 text-[10px] text-bp-text-dim uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrades.length === 0 ? (
                      <tr><td colSpan={10} className="px-3 py-8 text-center text-[12px] text-bp-text-dim">No trades for this date</td></tr>
                    ) : (
                      filteredTrades.map((t) => (
                        <tr
                          key={t.id}
                          onClick={() => setSelectedTrade(t)}
                          className={`border-b border-bp-border/50 cursor-pointer transition-colors hover:bg-bp-bg-tertiary/50 ${selectedTrade?.id === t.id ? "bg-bp-violet/8" : ""}`}
                        >
                          <td className="px-3 py-2.5 text-bp-text-muted tabular-nums">{t.date}</td>
                          <td className="px-3 py-2.5 text-bp-text-muted tabular-nums font-mono">{t.time}</td>
                          <td className="px-3 py-2.5"><Badge variant={t.direction === "Long" ? "lime" : "bear"} size="sm">{t.direction}</Badge></td>
                          <td className="px-3 py-2.5 text-bp-text">{t.setup}</td>
                          <td className="px-3 py-2.5 text-bp-text tabular-nums">{t.entry.toFixed(2)}</td>
                          <td className="px-3 py-2.5 text-bp-text tabular-nums">{t.exit.toFixed(2)}</td>
                          <td className={`px-3 py-2.5 font-semibold tabular-nums ${t.rMultiple >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>{t.rMultiple >= 0 ? "+" : ""}{t.rMultiple.toFixed(1)}R</td>
                          <td className={`px-3 py-2.5 font-semibold tabular-nums ${t.pnl >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>{t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}</td>
                          <td className="px-3 py-2.5"><EmotionTag value={t.emotion} /></td>
                          <td className="px-3 py-2.5">
                            <span className={`text-[11px] font-semibold ${t.score >= 5 ? "text-bp-lime" : t.score >= 3 ? "text-bp-violet-light" : "text-bp-bear"}`}>{t.score}/6</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

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
              <EmotionTag value={selectedTrade.emotion} />
            </div>
            <p className="text-[12px] text-bp-text-muted leading-relaxed">{selectedTrade.notes}</p>
            <div className="mt-3 flex gap-6">
              <div>
                <span className="text-[10px] text-bp-text-dim block">Result</span>
                <span className={`text-[13px] font-bold tabular-nums ${selectedTrade.rMultiple >= 0 ? "text-bp-lime" : "text-bp-bear"}`}>
                  {selectedTrade.rMultiple >= 0 ? "+" : ""}{selectedTrade.rMultiple.toFixed(1)}R (${selectedTrade.pnl >= 0 ? "+" : ""}${selectedTrade.pnl.toFixed(2)})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-bp-text-dim block">Setup Score</span>
                <span className="text-[13px] text-bp-violet-light font-bold">{selectedTrade.score}/6</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Log Trade Modal */}
      <Modal open={showLogModal} onClose={() => setShowLogModal(false)} title="Log Trade" width="lg">
        <LogTradeForm onSubmit={handleLogTrade} onClose={() => setShowLogModal(false)} />
      </Modal>
    </div>
  );
}
