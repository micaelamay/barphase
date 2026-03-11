// ═══════════════════════════════════════════
// BARPHASE — SETTINGS
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function SettingToggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-[12px] font-medium text-bp-text">{label}</span>
        <p className="text-[11px] text-bp-text-dim">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
          on ? "bg-bp-violet" : "bg-bp-bg-tertiary"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform duration-200 ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SettingSelect({ label, description, options, defaultValue }: { label: string; description: string; options: string[]; defaultValue: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-[12px] font-medium text-bp-text">{label}</span>
        <p className="text-[11px] text-bp-text-dim">{description}</p>
      </div>
      <select
        defaultValue={defaultValue}
        className="bg-bp-bg-tertiary border border-bp-border rounded-lg px-3 py-1.5 text-[11px] text-bp-text outline-none focus:border-bp-violet transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-bp-text">Settings</h1>
          <p className="text-[12px] text-bp-text-dim mt-0.5">Configure your Barphase trading environment</p>
        </div>

        {/* Engine Settings */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-bp-text">Engine Configuration</span>
            <Badge variant="violet" size="sm">Core</Badge>
          </div>
          <div className="divide-y divide-bp-border/50">
            <SettingSelect label="Primary Instrument" description="Default symbol for the Barphase engine" options={["MNQ", "MES", "MYM", "M2K"]} defaultValue="MNQ" />
            <SettingSelect label="Timeframe" description="Candle interval for strategy evaluation" options={["1m", "3m", "5m", "15m"]} defaultValue="3m" />
            <SettingSelect label="Bot Sensitivity" description="How aggressively the bot identifies setups" options={["Conservative", "Normal", "Aggressive"]} defaultValue="Normal" />
            <SettingSelect label="Session Hours" description="Active trading session window" options={["NY Open (9:30-12:00)", "Full Session (9:30-16:00)", "Extended (8:00-17:00)"]} defaultValue="Full Session (9:30-16:00)" />
          </div>
        </Card>

        {/* Chart Overlays */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-4">Chart Overlays</span>
          <div className="divide-y divide-bp-border/50">
            <SettingToggle label="Order Blocks" description="Display bullish and bearish order block zones" defaultOn={true} />
            <SettingToggle label="Fair Value Gaps" description="Show FVG zones on the chart" defaultOn={true} />
            <SettingToggle label="Structure Labels" description="Show BOS, CHOCH, and sweep labels" defaultOn={true} />
            <SettingToggle label="Entry Markers" description="Display entry arrows when signals trigger" defaultOn={true} />
            <SettingToggle label="Swing Points" description="Mark swing highs and lows" defaultOn={false} />
          </div>
        </Card>

        {/* Risk Settings */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-4">Risk Parameters</span>
          <div className="divide-y divide-bp-border/50">
            <SettingSelect label="Risk Per Trade" description="Maximum risk per trade as % of account" options={["0.5%", "1.0%", "1.5%", "2.0%"]} defaultValue="1.5%" />
            <SettingSelect label="Max Daily Loss" description="Stop trading after reaching this loss" options={["$200", "$300", "$500", "$750", "$1000"]} defaultValue="$500" />
            <SettingSelect label="Max Daily Trades" description="Limit trades per session" options={["5", "8", "10", "15", "Unlimited"]} defaultValue="8" />
            <SettingToggle label="Auto-Pause on Max Loss" description="Automatically pause the bot when max daily loss is reached" defaultOn={true} />
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-4">Notifications</span>
          <div className="divide-y divide-bp-border/50">
            <SettingToggle label="Signal Alerts" description="Get notified when entry signals trigger" defaultOn={true} />
            <SettingToggle label="Risk Warnings" description="Alert when approaching risk thresholds" defaultOn={true} />
            <SettingToggle label="News Alerts" description="Notify on high-impact economic events" defaultOn={true} />
            <SettingToggle label="Sound Effects" description="Play sounds for signal state changes" defaultOn={false} />
          </div>
        </Card>

        {/* About */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-2">About Barphase</span>
          <div className="space-y-1 text-[11px] text-bp-text-dim">
            <p>Version 2.0.0</p>
            <p>Proprietary Trading Operating System</p>
            <p className="text-bp-violet-light">Built for futures price action trading</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
