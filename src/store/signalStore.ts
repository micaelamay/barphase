// ═══════════════════════════════════════════
// BARPHASE — ZUSTAND SIGNAL STORE
// ═══════════════════════════════════════════

import { create } from "zustand";
import type { BarphaseState } from "@/lib/engine/types";
import { SETUP_STEPS } from "@/lib/constants";
import type { SetupStep } from "@/lib/constants";

interface SignalStore {
  state: BarphaseState;
  isRunning: boolean;
  updateState: (newState: BarphaseState) => void;
  setRunning: (running: boolean) => void;
  reset: () => void;
}

const defaultState: BarphaseState = {
  botStatus: "IDLE",
  signal: "WAIT",
  lastUpdate: Date.now(),
  marketStructure: {
    bias: "Neutral",
    lastEvent: "None",
    structureStrength: 50,
    lastSwingHigh: 0,
    lastSwingLow: 0,
  },
  setupEvaluation: {
    steps: Object.fromEntries(SETUP_STEPS.map((s) => [s, false])) as Record<SetupStep, boolean>,
    score: 0,
    maxScore: SETUP_STEPS.length,
  },
  entryConditions: {
    liquiditySweep: false,
    displacementCandle: false,
    structureBreak: false,
    fvgCreated: false,
    priceInFVG: false,
    confirmationCandle: false,
    sessionValid: false,
  },
  orderBlocks: [],
  fairValueGaps: [],
  currentPrice: 0,
  priceChange: 0,
};

export const useSignalStore = create<SignalStore>((set) => ({
  state: defaultState,
  isRunning: false,
  updateState: (newState) => set({ state: newState }),
  setRunning: (running) => set({ isRunning: running }),
  reset: () => set({ state: defaultState, isRunning: false }),
}));
