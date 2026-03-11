// ═══════════════════════════════════════════
// BARPHASE — SETTINGS (with Engine Config)
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  useEngineConfigStore,
  CHECK_LABELS,
  getEnabledCheckCount,
  type EngineChecks,
} from "@/store/engineConfigStore";

// ── Toggle Component ──
function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
        on ? "bg-bp-violet" : "bg-bp-bg-tertiary"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform duration-200 ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ── Setting Row ──
function SettingToggle({
  label,
  description,
  on,
  onChange,
  icon,
}: {
  label: string;
  description: string;
  on: boolean;
  onChange: () => void;
  icon?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="flex items-start gap-2.5">
        {icon && <span className="text-base mt-0.5">{icon}</span>}
        <div>
          <span className={`text-[12px] font-medium ${on ? "text-bp-text" : "text-bp-text-dim"}`}>
            {label}
          </span>
          <p className="text-[11px] text-bp-text-dim">{description}</p>
        </div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function SettingSelect({
  label,
  description,
  options,
  value,
  onChange,
}: {
  label: string;
  description: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-[12px] font-medium text-bp-text">{label}</span>
        <p className="text-[11px] text-bp-text-dim">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-bp-bg-tertiary border border-bp-border rounded-lg px-3 py-1.5 text-[11px] text-bp-text outline-none focus:border-bp-violet transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const {
    checks,
    tradeDirection,
    minScoreForReady,
    sensitivity,
    sessionStart,
    sessionEnd,
    toggleCheck,
    setTradeDirection,
    setMinScoreForReady,
    setSensitivity,
    setSessionStart,
    setSessionEnd,
    resetDefaults,
  } = useEngineConfigStore();

  const enabledCount = getEnabledCheckCount(checks);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-bp-text">Settings</h1>
            <p className="text-[12px] text-bp-text-dim mt-0.5">
              Configure your Barphase trading engine and environment
            </p>
          </div>
          <button
            onClick={resetDefaults}
            className="text-[10px] px-3 py-1.5 rounded-lg bg-bp-bg-tertiary text-bp-text-dim hover:text-bp-text hover:bg-bp-bg-elevated transition-colors"
          >
            Reset Defaults
          </button>
        </div>

        {/* ════════════════════════════════════════
           SIGNAL ENGINE — CHECKS
           ════════════════════════════════════════ */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-bp-text">
                Signal Engine Checks
              </span>
              <Badge variant="violet" size="sm">Core</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-bp-text-dim">
                {enabledCount} of {Object.keys(checks).length} active
              </span>
              <div className="w-16 h-1.5 rounded-full bg-bp-bg-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full bg-bp-violet transition-all"
                  style={{ width: `${(enabledCount / Object.keys(checks).length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-bp-text-dim mb-4">
            Toggle which conditions the engine evaluates on each 3-minute candle close.
            Disabled checks are skipped — the engine only scores enabled ones.
          </p>
          <div className="divide-y divide-bp-border/50">
            {(Object.keys(CHECK_LABELS) as (keyof EngineChecks)[]).map((key) => {
              const info = CHECK_LABELS[key];
              return (
                <SettingToggle
                  key={key}
                  label={info.label}
                  description={info.description}
                  icon={info.icon}
                  on={checks[key]}
                  onChange={() => toggleCheck(key)}
                />
              );
            })}
          </div>
        </Card>

        {/* ════════════════════════════════════════
           ENGINE CONFIGURATION
           ════════════════════════════════════════ */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-bp-text">
              Engine Configuration
            </span>
            <Badge variant="lime" size="sm">Strategy</Badge>
          </div>
          <div className="divide-y divide-bp-border/50">
            <SettingSelect
              label="Trade Direction"
              description="Filter which signals the engine can produce"
              value={tradeDirection}
              onChange={(v) => setTradeDirection(v as "both" | "long_only" | "short_only")}
              options={[
                { value: "both", label: "Long & Short" },
                { value: "long_only", label: "Long Only" },
                { value: "short_only", label: "Short Only" },
              ]}
            />
            <SettingSelect
              label="Min Score for READY"
              description={`Minimum enabled checks that must pass (max: ${enabledCount})`}
              value={String(minScoreForReady)}
              onChange={(v) => setMinScoreForReady(parseInt(v, 10))}
              options={Array.from({ length: enabledCount }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1} of ${enabledCount}`,
              }))}
            />
            <SettingSelect
              label="Sensitivity"
              description="How aggressively the engine interprets setups"
              value={sensitivity}
              onChange={(v) => setSensitivity(v as "conservative" | "normal" | "aggressive")}
              options={[
                { value: "conservative", label: "Conservative — stricter thresholds" },
                { value: "normal", label: "Normal — balanced" },
                { value: "aggressive", label: "Aggressive — looser thresholds" },
              ]}
            />
            <SettingSelect
              label="Session Start"
              description="Engine only evaluates during session hours (ET)"
              value={sessionStart}
              onChange={setSessionStart}
              options={[
                { value: "08:00", label: "8:00 AM ET" },
                { value: "08:30", label: "8:30 AM ET" },
                { value: "09:00", label: "9:00 AM ET" },
                { value: "09:30", label: "9:30 AM ET (NY Open)" },
                { value: "10:00", label: "10:00 AM ET" },
              ]}
            />
            <SettingSelect
              label="Session End"
              description="Stop evaluating after this time"
              value={sessionEnd}
              onChange={setSessionEnd}
              options={[
                { value: "12:00", label: "12:00 PM ET (AM Only)" },
                { value: "14:00", label: "2:00 PM ET" },
                { value: "16:00", label: "4:00 PM ET (Full Session)" },
                { value: "17:00", label: "5:00 PM ET (Extended)" },
              ]}
            />
          </div>
        </Card>

        {/* ════════════════════════════════════════
           CHART OVERLAYS
           ════════════════════════════════════════ */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-4">
            Chart Overlays
          </span>
          <div className="divide-y divide-bp-border/50">
            <SettingToggleSimple label="Order Blocks" description="Display bullish and bearish order block zones" defaultOn={true} />
            <SettingToggleSimple label="Fair Value Gaps" description="Show FVG zones on the chart" defaultOn={true} />
            <SettingToggleSimple label="Structure Labels" description="Show BOS, CHOCH, and sweep labels" defaultOn={true} />
            <SettingToggleSimple label="Entry Markers" description="Display entry arrows when signals trigger" defaultOn={true} />
            <SettingToggleSimple label="Swing Points" description="Mark swing highs and lows" defaultOn={false} />
          </div>
        </Card>

        {/* ════════════════════════════════════════
           RISK PARAMETERS
           ════════════════════════════════════════ */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-4">
            Risk Parameters
          </span>
          <div className="divide-y divide-bp-border/50">
            <SettingSelectSimple label="Risk Per Trade" description="Maximum risk per trade as % of account" options={["0.5%", "1.0%", "1.5%", "2.0%"]} defaultValue="1.5%" />
            <SettingSelectSimple label="Max Daily Loss" description="Stop trading after reaching this loss" options={["$200", "$300", "$500", "$750", "$1000"]} defaultValue="$500" />
            <SettingSelectSimple label="Max Daily Trades" description="Limit trades per session" options={["5", "8", "10", "15", "Unlimited"]} defaultValue="8" />
            <SettingToggleSimple label="Auto-Pause on Max Loss" description="Automatically pause the bot when max daily loss is reached" defaultOn={true} />
          </div>
        </Card>

        {/* ════════════════════════════════════════
           NOTIFICATIONS
           ════════════════════════════════════════ */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-4">
            Notifications
          </span>
          <div className="divide-y divide-bp-border/50">
            <SettingToggleSimple label="Signal Alerts" description="Get notified when entry signals trigger" defaultOn={true} />
            <SettingToggleSimple label="Risk Warnings" description="Alert when approaching risk thresholds" defaultOn={true} />
            <SettingToggleSimple label="News Alerts" description="Notify on high-impact economic events" defaultOn={true} />
            <SettingToggleSimple label="Sound Effects" description="Play sounds for signal state changes" defaultOn={false} />
          </div>
        </Card>

        {/* About */}
        <Card>
          <span className="text-sm font-semibold text-bp-text block mb-2">About Barphase</span>
          <div className="space-y-1 text-[11px] text-bp-text-dim">
            <p>Version 2.3.0</p>
            <p>Proprietary Trading Operating System</p>
            <p className="text-bp-violet-light">Built for futures price action trading</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Simple toggle/select (not connected to store, for non-engine settings) ──
function SettingToggleSimple({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-[12px] font-medium text-bp-text">{label}</span>
        <p className="text-[11px] text-bp-text-dim">{description}</p>
      </div>
      <Toggle on={on} onChange={() => setOn(!on)} />
    </div>
  );
}

function SettingSelectSimple({ label, description, options, defaultValue }: { label: string; description: string; options: string[]; defaultValue: string }) {
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
