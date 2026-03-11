// ═══════════════════════════════════════════
// BARPHASE ENGINE — CORE STRATEGY LOGIC
// ═══════════════════════════════════════════
//
// Evaluates price action on each 3-min candle close:
//  1. Check for liquidity sweep
//  2. Wait for displacement candle + structure break (BOS/CHOCH)
//  3. Identify FVG creation
//  4. Wait for price retrace into FVG zone
//  5. Require confirmation candle before entry signal

import type {
  BarphaseState,
  Candle,
  EntryConditions,
  FairValueGap,
  MarketStructure,
  OrderBlock,
  SetupEvaluation,
} from "./types";
import type { BotState, SetupStep, SignalType, StructureEvent } from "../constants";
import { SETUP_STEPS } from "../constants";

// ── Helpers ──────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function isSessionValid(): boolean {
  const now = new Date();
  const hour = now.getUTCHours() - 5; // Approx ET offset
  return hour >= 9 && hour < 16;
}

function isBullishCandle(c: Candle): boolean {
  return c.close > c.open;
}

function candleBody(c: Candle): number {
  return Math.abs(c.close - c.open);
}

function candleRange(c: Candle): number {
  return c.high - c.low;
}

function isDisplacementCandle(candle: Candle, avgRange: number): boolean {
  return candleBody(candle) > avgRange * 1.5 && candleBody(candle) / candleRange(candle) > 0.6;
}

// ── Engine Class ─────────────────────────

export class BarphaseEngine {
  private candles: Candle[] = [];
  private state: BarphaseState;
  private avgRange: number = 0;

  constructor() {
    this.state = this.getDefaultState();
  }

  getDefaultState(): BarphaseState {
    return {
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
  }

  getState(): BarphaseState {
    return { ...this.state };
  }

  /** Process a new candle close */
  processCandle(candle: Candle): BarphaseState {
    this.candles.push(candle);
    if (this.candles.length > 200) this.candles.shift();

    // Update average range
    const recent = this.candles.slice(-20);
    this.avgRange = recent.reduce((s, c) => s + candleRange(c), 0) / recent.length;

    // Update price
    const prevPrice = this.state.currentPrice;
    this.state.currentPrice = candle.close;
    this.state.priceChange = prevPrice > 0 ? ((candle.close - prevPrice) / prevPrice) * 100 : 0;
    this.state.lastUpdate = Date.now();

    // Run evaluation pipeline
    this.evaluateStructure(candle);
    this.evaluateConditions(candle);
    this.detectZones(candle);
    this.evaluateSetup();
    this.determineBotStatus();
    this.determineSignal();

    return this.getState();
  }

  /** Apply a pre-built state (used by simulator) */
  applyState(partial: Partial<BarphaseState>): BarphaseState {
    this.state = { ...this.state, ...partial, lastUpdate: Date.now() };
    return this.getState();
  }

  // ── Structure Analysis ────────────────

  private evaluateStructure(candle: Candle): void {
    const ms = this.state.marketStructure;
    const len = this.candles.length;
    if (len < 5) return;

    // Simple swing detection using last 5 candles
    const last5 = this.candles.slice(-5);
    const highs = last5.map((c) => c.high);
    const lows = last5.map((c) => c.low);
    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);

    // Update swing points
    if (maxHigh > ms.lastSwingHigh || ms.lastSwingHigh === 0) {
      ms.lastSwingHigh = maxHigh;
    }
    if (minLow < ms.lastSwingLow || ms.lastSwingLow === 0) {
      ms.lastSwingLow = minLow;
    }

    // Determine bias based on candle close vs swing midpoint
    const mid = (ms.lastSwingHigh + ms.lastSwingLow) / 2;
    if (candle.close > mid) {
      ms.bias = "Bullish";
      ms.structureStrength = Math.min(100, ms.structureStrength + 5);
    } else if (candle.close < mid) {
      ms.bias = "Bearish";
      ms.structureStrength = Math.max(0, ms.structureStrength - 5);
    }

    // Detect BOS / CHOCH
    if (len >= 10) {
      const prev10 = this.candles.slice(-10, -5);
      const prevHigh = Math.max(...prev10.map((c) => c.high));
      const prevLow = Math.min(...prev10.map((c) => c.low));

      if (candle.close > prevHigh && ms.bias === "Bullish") {
        ms.lastEvent = "BOS";
      } else if (candle.close > prevHigh && ms.bias !== "Bullish") {
        ms.lastEvent = "CHOCH";
        ms.bias = "Bullish";
      } else if (candle.close < prevLow && ms.bias === "Bearish") {
        ms.lastEvent = "BOS";
      } else if (candle.close < prevLow && ms.bias !== "Bearish") {
        ms.lastEvent = "CHOCH";
        ms.bias = "Bearish";
      }
    }
  }

  // ── Condition Evaluation ──────────────

  private evaluateConditions(candle: Candle): void {
    const ec = this.state.entryConditions;
    const ms = this.state.marketStructure;

    // Session validity
    ec.sessionValid = isSessionValid();

    // Liquidity sweep: price wicked beyond swing then closed back
    if (this.candles.length >= 5) {
      const prevSwingLow = ms.lastSwingLow;
      const prevSwingHigh = ms.lastSwingHigh;
      if (candle.low < prevSwingLow && candle.close > prevSwingLow) {
        ec.liquiditySweep = true;
      } else if (candle.high > prevSwingHigh && candle.close < prevSwingHigh) {
        ec.liquiditySweep = true;
      }
    }

    // Displacement candle
    if (isDisplacementCandle(candle, this.avgRange)) {
      ec.displacementCandle = true;
    }

    // Structure break
    if (ms.lastEvent === "BOS" || ms.lastEvent === "CHOCH") {
      ec.structureBreak = true;
    }

    // FVG check
    if (this.state.fairValueGaps.some((f) => f.active)) {
      ec.fvgCreated = true;
    }

    // Price inside FVG
    const activeFVGs = this.state.fairValueGaps.filter((f) => f.active);
    ec.priceInFVG = activeFVGs.some(
      (f) => candle.close >= f.low && candle.close <= f.high
    );

    // Confirmation candle: after price enters FVG, need a candle that confirms direction
    if (ec.priceInFVG && ec.structureBreak) {
      if (ms.bias === "Bullish" && isBullishCandle(candle)) {
        ec.confirmationCandle = true;
      } else if (ms.bias === "Bearish" && !isBullishCandle(candle)) {
        ec.confirmationCandle = true;
      }
    }
  }

  // ── Zone Detection ────────────────────

  private detectZones(candle: Candle): void {
    const len = this.candles.length;
    if (len < 3) return;

    const c1 = this.candles[len - 3];
    const c2 = this.candles[len - 2];
    const c3 = candle;

    // FVG detection (3-candle gap)
    // Bullish FVG: c3.low > c1.high
    if (c3.low > c1.high) {
      this.state.fairValueGaps.push({
        id: generateId(),
        type: "bullish",
        high: c3.low,
        low: c1.high,
        time: c2.time,
        active: true,
        filled: false,
      });
    }

    // Bearish FVG: c3.high < c1.low
    if (c3.high < c1.low) {
      this.state.fairValueGaps.push({
        id: generateId(),
        type: "bearish",
        high: c1.low,
        low: c3.high,
        time: c2.time,
        active: true,
        filled: false,
      });
    }

    // Order block detection: displacement candle after consolidation
    if (isDisplacementCandle(c3, this.avgRange)) {
      if (isBullishCandle(c3)) {
        // Last bearish candle before displacement is bullish OB
        const bearishBefore = [...this.candles].reverse().find((c) => !isBullishCandle(c) && c.time < c3.time);
        if (bearishBefore) {
          this.state.orderBlocks.push({
            id: generateId(),
            type: "bullish",
            high: Math.max(bearishBefore.open, bearishBefore.close),
            low: Math.min(bearishBefore.open, bearishBefore.close),
            time: bearishBefore.time,
            active: true,
            mitigated: false,
          });
        }
      } else {
        const bullishBefore = [...this.candles].reverse().find((c) => isBullishCandle(c) && c.time < c3.time);
        if (bullishBefore) {
          this.state.orderBlocks.push({
            id: generateId(),
            type: "bearish",
            high: Math.max(bullishBefore.open, bullishBefore.close),
            low: Math.min(bullishBefore.open, bullishBefore.close),
            time: bullishBefore.time,
            active: true,
            mitigated: false,
          });
        }
      }
    }

    // Trim old zones (keep last 10)
    if (this.state.orderBlocks.length > 10) {
      this.state.orderBlocks = this.state.orderBlocks.slice(-10);
    }
    if (this.state.fairValueGaps.length > 10) {
      this.state.fairValueGaps = this.state.fairValueGaps.slice(-10);
    }

    // Mitigate / fill zones that price has passed through
    for (const ob of this.state.orderBlocks) {
      if (ob.active) {
        if (ob.type === "bullish" && candle.close < ob.low) {
          ob.mitigated = true;
          ob.active = false;
        } else if (ob.type === "bearish" && candle.close > ob.high) {
          ob.mitigated = true;
          ob.active = false;
        }
      }
    }

    for (const fvg of this.state.fairValueGaps) {
      if (fvg.active) {
        if (fvg.type === "bullish" && candle.close < fvg.low) {
          fvg.filled = true;
          fvg.active = false;
        } else if (fvg.type === "bearish" && candle.close > fvg.high) {
          fvg.filled = true;
          fvg.active = false;
        }
      }
    }
  }

  // ── Setup Evaluation ──────────────────

  private evaluateSetup(): void {
    const ec = this.state.entryConditions;
    const steps = this.state.setupEvaluation.steps;

    steps["Liquidity Sweep"] = ec.liquiditySweep;
    steps["Displacement Candle"] = ec.displacementCandle;
    steps["BOS/CHOCH Confirmation"] = ec.structureBreak;
    steps["FVG Creation"] = ec.fvgCreated;
    steps["Price Inside FVG"] = ec.priceInFVG;
    steps["Session Validity"] = ec.sessionValid;

    this.state.setupEvaluation.score = Object.values(steps).filter(Boolean).length;
  }

  // ── Bot Status Determination ──────────

  private determineBotStatus(): void {
    const ec = this.state.entryConditions;
    let status: BotState = "IDLE";

    if (ec.liquiditySweep) {
      status = "WAITING";
    }
    if (ec.liquiditySweep && ec.displacementCandle && ec.structureBreak) {
      status = "PREPARE";
    }
    if (status === "PREPARE" && ec.fvgCreated && ec.priceInFVG) {
      status = "READY";
    }
    if (status === "READY" && ec.confirmationCandle && ec.sessionValid) {
      status = "ENTER";
    }

    this.state.botStatus = status;
  }

  // ── Signal Determination ──────────────

  private determineSignal(): void {
    const bs = this.state.botStatus;
    const bias = this.state.marketStructure.bias;
    let signal: SignalType = "WAIT";

    if (bs === "READY") {
      signal = "READY";
    } else if (bs === "ENTER") {
      signal = bias === "Bullish" ? "ENTER_LONG" : "ENTER_SHORT";
    }

    this.state.signal = signal;
  }

  /** Reset the engine to initial state */
  reset(): void {
    this.candles = [];
    this.state = this.getDefaultState();
    this.avgRange = 0;
  }
}
