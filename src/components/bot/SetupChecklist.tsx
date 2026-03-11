// ═══════════════════════════════════════════
// BARPHASE — SETUP CHECKLIST (SCORE CARD) v2
// ═══════════════════════════════════════════

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import type { SetupEvaluation } from "@/lib/engine/types";
import { SETUP_STEPS } from "@/lib/constants";

interface SetupChecklistProps {
  evaluation: SetupEvaluation;
}

function CheckIcon({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
        <circle cx="7" cy="7" r="7" fill="rgba(198, 255, 51, 0.12)" />
        <path d="M4 7L6 9L10 5" stroke="#C6FF33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
      <circle cx="7" cy="7" r="6.5" stroke="#2A2A38" />
    </svg>
  );
}

export function SetupChecklist({ evaluation }: SetupChecklistProps) {
  const { steps, score, maxScore } = evaluation;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-bp-text-muted uppercase tracking-wider">
          Setup Score
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            score === maxScore
              ? "text-bp-lime"
              : score >= 4
              ? "text-bp-violet-light"
              : "text-bp-text-muted"
          }`}
        >
          {score}/{maxScore}
        </span>
      </div>

      <div className="h-1 w-full rounded-full bg-bp-bg-tertiary mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background:
              score === maxScore
                ? "#C6FF33"
                : score >= 4
                ? "#7D39EB"
                : score >= 2
                ? "#9B5FF5"
                : "#5E5E72",
          }}
        />
      </div>

      <div className="space-y-1.5">
        {SETUP_STEPS.map((step) => (
          <div
            key={step}
            className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-colors duration-200 ${
              steps[step] ? "bg-bp-lime/5" : "bg-transparent"
            }`}
          >
            <CheckIcon checked={steps[step]} />
            <span className={`text-[11px] ${steps[step] ? "text-bp-text font-medium" : "text-bp-text-dim"}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
