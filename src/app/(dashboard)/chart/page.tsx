// ═══════════════════════════════════════════
// BARPHASE — CHART PAGE (Chart + Bot Panel)
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { ChartPanel } from "@/components/chart/ChartPanel";
import { BotPanel } from "@/components/bot/BotPanel";
import { useBarphaseEngine } from "@/hooks/useBarphaseEngine";

export default function ChartPage() {
  const { state, isRunning } = useBarphaseEngine();

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left: Chart (75%) */}
      <div className="flex-[3] min-w-0 h-full">
        <ChartPanel />
      </div>
      {/* Right: Bot Panel (25%) */}
      <div className="w-[360px] min-w-[320px] max-w-[400px] h-full flex-shrink-0">
        <BotPanel state={state} isRunning={isRunning} />
      </div>
    </div>
  );
}
