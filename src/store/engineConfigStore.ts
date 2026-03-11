// ═══════════════════════════════════════════
// BARPHASE — ENGINE CONFIGURATION STORE
// Persists to localStorage — controls what the signal engine checks
// ═══════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TradeDirection = "both" | "long_only" | "short_only";

export interface EngineChecks {
  liquiditySweep: boolean;
  displacementCandle: boolean;
  bosChochConfirmation: boolean;
  fvgCreation: boolean;
  priceInsideFVG: boolean;
  sessionValidity: boolean;
  confirmationCandle: boolean;
  newsAwareness: boolean;
}

export interface EngineConfigState {
  // ── Which checks are enabled ──
  checks: EngineChecks;

  // ── Trade direction filter ──
  tradeDirection: TradeDirection;

  // ── Minimum setup score to trigger READY (out of enabled checks) ──
  minScoreForReady: number;

  // ── Session hours (ET) ──
  sessionStart: string; // "09:30"
  sessionEnd: string;   // "16:00"

  // ── Sensitivity ──
  sensitivity: "conservative" | "normal" | "aggressive";

  // ── Actions ──
  toggleCheck: (key: keyof EngineChecks) => void;
  setTradeDirection: (dir: TradeDirection) => void;
  setMinScoreForReady: (score: number) => void;
  setSessionStart: (time: string) => void;
  setSessionEnd: (time: string) => void;
  setSensitivity: (s: "conservative" | "normal" | "aggressive") => void;
  resetDefaults: () => void;
}

const DEFAULT_CHECKS: EngineChecks = {
  liquiditySweep: true,
  displacementCandle: true,
  bosChochConfirmation: true,
  fvgCreation: true,
  priceInsideFVG: true,
  sessionValidity: true,
  confirmationCandle: true,
  newsAwareness: false,
};

const DEFAULTS = {
  checks: DEFAULT_CHECKS,
  tradeDirection: "both" as TradeDirection,
  minScoreForReady: 5,
  sessionStart: "09:30",
  sessionEnd: "16:00",
  sensitivity: "normal" as const,
};

export const useEngineConfigStore = create<EngineConfigState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      toggleCheck: (key) =>
        set((state) => ({
          checks: { ...state.checks, [key]: !state.checks[key] },
        })),

      setTradeDirection: (dir) => set({ tradeDirection: dir }),
      setMinScoreForReady: (score) => set({ minScoreForReady: score }),
      setSessionStart: (time) => set({ sessionStart: time }),
      setSessionEnd: (time) => set({ sessionEnd: time }),
      setSensitivity: (s) => set({ sensitivity: s }),

      resetDefaults: () => set(DEFAULTS),
    }),
    {
      name: "barphase-engine-config",
    }
  )
);

// ── Helper: Get count of enabled checks ──
export function getEnabledCheckCount(checks: EngineChecks): number {
  return Object.values(checks).filter(Boolean).length;
}

// ── Helper: Check label map ──
export const CHECK_LABELS: Record<keyof EngineChecks, { label: string; description: string; icon: string }> = {
  liquiditySweep: {
    label: "Liquidity Sweep",
    description: "Detect buy-side or sell-side liquidity sweeps before entry",
    icon: "💧",
  },
  displacementCandle: {
    label: "Displacement Candle",
    description: "Require a strong momentum candle showing institutional intent",
    icon: "🔥",
  },
  bosChochConfirmation: {
    label: "BOS / CHOCH Confirmation",
    description: "Wait for Break of Structure or Change of Character",
    icon: "📐",
  },
  fvgCreation: {
    label: "FVG Creation",
    description: "Require a Fair Value Gap to form after displacement",
    icon: "📊",
  },
  priceInsideFVG: {
    label: "Price Inside FVG",
    description: "Wait for price to retrace into the Fair Value Gap zone",
    icon: "🎯",
  },
  sessionValidity: {
    label: "Session Filter",
    description: "Only evaluate setups during active trading session hours",
    icon: "🕐",
  },
  confirmationCandle: {
    label: "Confirmation Candle",
    description: "Require a confirmation candle before triggering ENTER signal",
    icon: "✅",
  },
  newsAwareness: {
    label: "News Awareness",
    description: "Reduce confidence or pause near high-impact economic events",
    icon: "📰",
  },
};
