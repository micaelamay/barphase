// ═══════════════════════════════════════════
// BARPHASE ENGINE — TYPE DEFINITIONS
// ═══════════════════════════════════════════

import type { BotState, SetupStep, SignalType, StructureEvent } from "../constants";

/** Represents a single OHLCV candle */
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Represents an Order Block zone */
export interface OrderBlock {
  id: string;
  type: "bullish" | "bearish";
  high: number;
  low: number;
  time: number;
  active: boolean;
  mitigated: boolean;
}

/** Represents a Fair Value Gap zone */
export interface FairValueGap {
  id: string;
  type: "bullish" | "bearish";
  high: number;
  low: number;
  time: number;
  active: boolean;
  filled: boolean;
}

/** Market structure state */
export interface MarketStructure {
  bias: "Bullish" | "Bearish" | "Neutral";
  lastEvent: StructureEvent;
  structureStrength: number; // 0-100
  lastSwingHigh: number;
  lastSwingLow: number;
}

/** Setup evaluation result */
export interface SetupEvaluation {
  steps: Record<SetupStep, boolean>;
  score: number; // count of satisfied steps
  maxScore: number; // total steps (6)
}

/** Entry conditions */
export interface EntryConditions {
  liquiditySweep: boolean;
  displacementCandle: boolean;
  structureBreak: boolean;
  fvgCreated: boolean;
  priceInFVG: boolean;
  confirmationCandle: boolean;
  sessionValid: boolean;
}

/** Complete engine state */
export interface BarphaseState {
  // Bot
  botStatus: BotState;
  signal: SignalType;
  lastUpdate: number;

  // Market structure
  marketStructure: MarketStructure;

  // Setup
  setupEvaluation: SetupEvaluation;
  entryConditions: EntryConditions;

  // Zones
  orderBlocks: OrderBlock[];
  fairValueGaps: FairValueGap[];

  // Current price
  currentPrice: number;
  priceChange: number;
}

/** Engine configuration */
export interface EngineConfig {
  instrument: string;
  timeframe: string;
  sessionStart: number; // hour (e.g. 9 for 9:30 AM ET)
  sessionEnd: number;   // hour (e.g. 16 for 4:00 PM ET)
}
