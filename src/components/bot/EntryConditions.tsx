// ═══════════════════════════════════════════
// BARPHASE — ENTRY CONDITIONS CARD v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Indicator } from "@/components/ui/Indicator";
import type { EntryConditions as EntryConditionsType } from "@/lib/engine/types";

interface EntryConditionsProps {
  conditions: EntryConditionsType;
}

const CONDITION_ROWS: { label: string; key: keyof EntryConditionsType }[] = [
  { label: "Liquidity Sweep", key: "liquiditySweep" },
  { label: "Displacement", key: "displacementCandle" },
  { label: "Structure Break", key: "structureBreak" },
  { label: "FVG Created", key: "fvgCreated" },
  { label: "Price in FVG", key: "priceInFVG" },
  { label: "Confirmation", key: "confirmationCandle" },
  { label: "Session Valid", key: "sessionValid" },
];

export function EntryConditions({ conditions }: EntryConditionsProps) {
  const metCount = Object.values(conditions).filter(Boolean).length;
  const totalCount = CONDITION_ROWS.length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">
          Entry Conditions
        </span>
        <span className={`text-[11px] font-semibold tabular-nums ${metCount === totalCount ? "text-bp-lime" : "text-bp-text-dim"}`}>
          {metCount}/{totalCount}
        </span>
      </div>

      <div className="space-y-1">
        {CONDITION_ROWS.map((row) => {
          const met = conditions[row.key];
          return (
            <div
              key={row.key}
              className={`flex items-center justify-between py-1.5 px-2 rounded-lg transition-all duration-200 ${
                met ? "bg-bp-lime/5" : "bg-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <Indicator color={met ? "lime" : "neutral"} pulse={met} size="sm" />
                <span className={`text-[11px] ${met ? "text-bp-text" : "text-bp-text-dim"}`}>
                  {row.label}
                </span>
              </div>
              <span className={`text-[10px] ${met ? "text-bp-lime font-medium" : "text-bp-text-dim"}`}>
                {met ? "MET" : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
