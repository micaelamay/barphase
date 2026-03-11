// ═══════════════════════════════════════════
// BARPHASE ENGINE — CANDLE SIMULATOR
// ═══════════════════════════════════════════
//
// Generates realistic MNQ price action for demo purposes.
// Cycles through trading scenarios to showcase all bot states.
// Respects engine configuration from engineConfigStore.

import type { BarphaseState, OrderBlock, FairValueGap } from "./types";
import type { BotState, SignalType, StructureEvent } from "../constants";
import { SETUP_STEPS } from "../constants";
import type { SetupStep } from "../constants";
import type { EngineChecks, TradeDirection } from "@/store/engineConfigStore";

// Scenario definitions for the demo cycle
interface Scenario {
  botStatus: BotState;
  signal: SignalType;
  bias: "Bullish" | "Bearish" | "Neutral";
  lastEvent: StructureEvent;
  structureStrength: number;
  stepsComplete: SetupStep[];
  hasOBs: boolean;
  hasFVGs: boolean;
}

const SCENARIOS: Scenario[] = [
  {
    botStatus: "IDLE",
    signal: "WAIT",
    bias: "Neutral",
    lastEvent: "None",
    structureStrength: 45,
    stepsComplete: [],
    hasOBs: false,
    hasFVGs: false,
  },
  {
    botStatus: "IDLE",
    signal: "WAIT",
    bias: "Neutral",
    lastEvent: "None",
    structureStrength: 48,
    stepsComplete: ["Session Validity"],
    hasOBs: false,
    hasFVGs: false,
  },
  {
    botStatus: "WAITING",
    signal: "WAIT",
    bias: "Bearish",
    lastEvent: "Liquidity Sweep",
    structureStrength: 35,
    stepsComplete: ["Liquidity Sweep", "Session Validity"],
    hasOBs: true,
    hasFVGs: false,
  },
  {
    botStatus: "WAITING",
    signal: "WAIT",
    bias: "Bullish",
    lastEvent: "Liquidity Sweep",
    structureStrength: 62,
    stepsComplete: ["Liquidity Sweep", "Session Validity"],
    hasOBs: true,
    hasFVGs: false,
  },
  {
    botStatus: "PREPARE",
    signal: "WAIT",
    bias: "Bullish",
    lastEvent: "BOS",
    structureStrength: 72,
    stepsComplete: ["Liquidity Sweep", "Displacement Candle", "BOS/CHOCH Confirmation", "Session Validity"],
    hasOBs: true,
    hasFVGs: true,
  },
  {
    botStatus: "PREPARE",
    signal: "WAIT",
    bias: "Bearish",
    lastEvent: "CHOCH",
    structureStrength: 30,
    stepsComplete: ["Liquidity Sweep", "Displacement Candle", "BOS/CHOCH Confirmation", "FVG Creation", "Session Validity"],
    hasOBs: true,
    hasFVGs: true,
  },
  {
    botStatus: "READY",
    signal: "READY",
    bias: "Bullish",
    lastEvent: "BOS",
    structureStrength: 82,
    stepsComplete: ["Liquidity Sweep", "Displacement Candle", "BOS/CHOCH Confirmation", "FVG Creation", "Price Inside FVG", "Session Validity"],
    hasOBs: true,
    hasFVGs: true,
  },
  {
    botStatus: "ENTER",
    signal: "ENTER_LONG",
    bias: "Bullish",
    lastEvent: "BOS",
    structureStrength: 88,
    stepsComplete: ["Liquidity Sweep", "Displacement Candle", "BOS/CHOCH Confirmation", "FVG Creation", "Price Inside FVG", "Session Validity"],
    hasOBs: true,
    hasFVGs: true,
  },
  {
    botStatus: "READY",
    signal: "READY",
    bias: "Bearish",
    lastEvent: "CHOCH",
    structureStrength: 22,
    stepsComplete: ["Liquidity Sweep", "Displacement Candle", "BOS/CHOCH Confirmation", "FVG Creation", "Price Inside FVG", "Session Validity"],
    hasOBs: true,
    hasFVGs: true,
  },
  {
    botStatus: "ENTER",
    signal: "ENTER_SHORT",
    bias: "Bearish",
    lastEvent: "CHOCH",
    structureStrength: 15,
    stepsComplete: ["Liquidity Sweep", "Displacement Candle", "BOS/CHOCH Confirmation", "FVG Creation", "Price Inside FVG", "Session Validity"],
    hasOBs: true,
    hasFVGs: true,
  },
];

let scenarioIndex = 0;
let basePrice = 21450;

function jitter(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

function generateOrderBlocks(price: number, bullish: boolean): OrderBlock[] {
  const blocks: OrderBlock[] = [];
  if (bullish) {
    blocks.push({
      id: "ob-bull-1",
      type: "bullish",
      high: price - 8,
      low: price - 22,
      time: Date.now() - 600_000,
      active: true,
      mitigated: false,
    });
  }
  blocks.push({
    id: "ob-bear-1",
    type: "bearish",
    high: price + 25,
    low: price + 12,
    time: Date.now() - 900_000,
    active: true,
    mitigated: false,
  });
  if (!bullish) {
    blocks.push({
      id: "ob-bear-2",
      type: "bearish",
      high: price + 40,
      low: price + 28,
      time: Date.now() - 1_200_000,
      active: true,
      mitigated: false,
    });
  }
  return blocks;
}

function generateFVGs(price: number, bullish: boolean): FairValueGap[] {
  const gaps: FairValueGap[] = [];
  if (bullish) {
    gaps.push({
      id: "fvg-bull-1",
      type: "bullish",
      high: price - 2,
      low: price - 10,
      time: Date.now() - 360_000,
      active: true,
      filled: false,
    });
  } else {
    gaps.push({
      id: "fvg-bear-1",
      type: "bearish",
      high: price + 10,
      low: price + 2,
      time: Date.now() - 360_000,
      active: true,
      filled: false,
    });
  }
  return gaps;
}

// ── Map setup steps to engine check keys ──
const STEP_TO_CHECK: Record<SetupStep, keyof EngineChecks> = {
  "Liquidity Sweep": "liquiditySweep",
  "Displacement Candle": "displacementCandle",
  "BOS/CHOCH Confirmation": "bosChochConfirmation",
  "FVG Creation": "fvgCreation",
  "Price Inside FVG": "priceInsideFVG",
  "Session Validity": "sessionValidity",
};

/** Apply engine config to filter scenario results */
function applyConfig(
  scenario: Scenario,
  checks: EngineChecks,
  tradeDirection: TradeDirection,
  minScoreForReady: number,
  sensitivity: "conservative" | "normal" | "aggressive"
): { botStatus: BotState; signal: SignalType; filteredSteps: SetupStep[]; score: number; maxScore: number } {
  // Filter steps based on enabled checks
  const filteredSteps = scenario.stepsComplete.filter((step) => {
    const checkKey = STEP_TO_CHECK[step];
    return checkKey ? checks[checkKey] : true;
  });

  // Calculate max possible score based on enabled checks
  const enabledStepCount = SETUP_STEPS.filter((step) => {
    const checkKey = STEP_TO_CHECK[step];
    return checkKey ? checks[checkKey] : true;
  }).length;

  const score = filteredSteps.length;
  const maxScore = enabledStepCount;

  // Determine effective min score based on sensitivity
  let effectiveMinScore = minScoreForReady;
  if (sensitivity === "conservative") effectiveMinScore = Math.min(maxScore, minScoreForReady + 1);
  if (sensitivity === "aggressive") effectiveMinScore = Math.max(1, minScoreForReady - 1);

  // Apply trade direction filter
  let signal = scenario.signal;
  let botStatus = scenario.botStatus;

  if (tradeDirection === "long_only" && signal === "ENTER_SHORT") {
    signal = "WAIT";
    botStatus = "WAITING";
  }
  if (tradeDirection === "short_only" && signal === "ENTER_LONG") {
    signal = "WAIT";
    botStatus = "WAITING";
  }

  // Apply score threshold
  if (score < effectiveMinScore && (signal === "READY" || signal === "ENTER_LONG" || signal === "ENTER_SHORT")) {
    signal = "WAIT";
    if (score >= 2) botStatus = "PREPARE";
    else botStatus = "WAITING";
  }

  // News awareness: if enabled, reduce to PREPARE max
  if (checks.newsAwareness) {
    // Simulate occasional news impact (every ~5th candle)
    const candleNum = Math.floor(Date.now() / 180000);
    if (candleNum % 5 === 0 && (signal === "ENTER_LONG" || signal === "ENTER_SHORT")) {
      signal = "READY";
      botStatus = "READY";
    }
  }

  return { botStatus, signal, filteredSteps, score, maxScore };
}

/** Get the next simulated state (cycles through scenarios) */
export function getNextSimulatedState(
  checks?: EngineChecks,
  tradeDirection?: TradeDirection,
  minScoreForReady?: number,
  sensitivity?: "conservative" | "normal" | "aggressive"
): BarphaseState {
  const scenario = SCENARIOS[scenarioIndex];
  scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;

  // Drift price
  basePrice = jitter(basePrice, 15);
  const price = Math.round(basePrice * 100) / 100;
  const change = jitter(0, 0.12);

  // Apply config if provided
  const config = checks
    ? applyConfig(scenario, checks, tradeDirection ?? "both", minScoreForReady ?? 5, sensitivity ?? "normal")
    : null;

  const effectiveStatus = config?.botStatus ?? scenario.botStatus;
  const effectiveSignal = config?.signal ?? scenario.signal;
  const effectiveSteps = config?.filteredSteps ?? scenario.stepsComplete;
  const effectiveScore = config?.score ?? scenario.stepsComplete.length;
  const effectiveMaxScore = config?.maxScore ?? SETUP_STEPS.length;

  // Build steps record
  const steps = Object.fromEntries(
    SETUP_STEPS.map((s) => [s, effectiveSteps.includes(s)])
  ) as Record<SetupStep, boolean>;

  const isBullish = scenario.bias === "Bullish";

  const state: BarphaseState = {
    botStatus: effectiveStatus,
    signal: effectiveSignal,
    lastUpdate: Date.now(),

    marketStructure: {
      bias: scenario.bias,
      lastEvent: scenario.lastEvent,
      structureStrength: scenario.structureStrength,
      lastSwingHigh: price + jitter(20, 5),
      lastSwingLow: price - jitter(20, 5),
    },

    setupEvaluation: {
      steps,
      score: effectiveScore,
      maxScore: effectiveMaxScore,
    },

    entryConditions: {
      liquiditySweep: effectiveSteps.includes("Liquidity Sweep"),
      displacementCandle: effectiveSteps.includes("Displacement Candle"),
      structureBreak: effectiveSteps.includes("BOS/CHOCH Confirmation"),
      fvgCreated: effectiveSteps.includes("FVG Creation"),
      priceInFVG: effectiveSteps.includes("Price Inside FVG"),
      confirmationCandle: effectiveStatus === "ENTER",
      sessionValid: effectiveSteps.includes("Session Validity"),
    },

    orderBlocks: scenario.hasOBs ? generateOrderBlocks(price, isBullish) : [],
    fairValueGaps: scenario.hasFVGs ? generateFVGs(price, isBullish) : [],

    currentPrice: price,
    priceChange: Math.round(change * 10000) / 10000,
  };

  return state;
}

/** Reset simulation */
export function resetSimulation(): void {
  scenarioIndex = 0;
  basePrice = 21450;
}
