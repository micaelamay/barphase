// ═══════════════════════════════════════════
// BARPHASE — ENGINE HOOK (3-MIN CANDLE CLOSE)
// ═══════════════════════════════════════════
//
// CRITICAL: The engine evaluates ONLY on the close of each
// 3-minute candle. State is FROZEN between candle closes.
// No intrabar updates, no second-by-second changes.
// Reads engine config from engineConfigStore.

"use client";

import { useEffect, useState, useRef } from "react";
import { useSignalStore } from "@/store/signalStore";
import { useEngineConfigStore } from "@/store/engineConfigStore";
import { getNextSimulatedState, resetSimulation } from "@/lib/engine/simulator";
import { BARPHASE } from "@/lib/constants";

const CANDLE_MS = BARPHASE.candlePeriodMs; // 180,000ms = 3 minutes

/** Calculate milliseconds until the next 3-minute candle close */
function getMsUntilNextClose(): number {
  const now = Date.now();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const msSinceMidnight = now - midnight.getTime();
  const msIntoCandle = msSinceMidnight % CANDLE_MS;
  const msUntilClose = CANDLE_MS - msIntoCandle;
  return msUntilClose;
}

/** Get the timestamp of the last completed 3-minute candle close */
function getLastCandleCloseTime(): Date {
  const now = Date.now();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const msSinceMidnight = now - midnight.getTime();
  const completedCandles = Math.floor(msSinceMidnight / CANDLE_MS);
  return new Date(midnight.getTime() + completedCandles * CANDLE_MS);
}

/** Format seconds into M:SS countdown */
export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function useBarphaseEngine() {
  const { state, isRunning, updateState, setRunning, reset } = useSignalStore();
  const { checks, tradeDirection, minScoreForReady, sensitivity } = useEngineConfigStore();
  const [countdown, setCountdown] = useState(() => Math.ceil(getMsUntilNextClose() / 1000));
  const [lastClose, setLastClose] = useState<Date>(() => getLastCandleCloseTime());
  const evaluationScheduled = useRef(false);

  // Store config in ref so the scheduled callback always has latest
  const configRef = useRef({ checks, tradeDirection, minScoreForReady, sensitivity });
  configRef.current = { checks, tradeDirection, minScoreForReady, sensitivity };

  useEffect(() => {
    // ── Initial evaluation on mount ──
    const cfg = configRef.current;
    const initialState = getNextSimulatedState(cfg.checks, cfg.tradeDirection, cfg.minScoreForReady, cfg.sensitivity);
    updateState(initialState);
    setLastClose(getLastCandleCloseTime());
    setRunning(true);

    // ── Schedule evaluation at each 3-minute candle close ──
    let evalTimeout: ReturnType<typeof setTimeout>;

    function scheduleNextEval() {
      const msUntil = getMsUntilNextClose();
      evalTimeout = setTimeout(() => {
        // Candle just closed — evaluate once with current config
        const cfg = configRef.current;
        const nextState = getNextSimulatedState(cfg.checks, cfg.tradeDirection, cfg.minScoreForReady, cfg.sensitivity);
        updateState(nextState);
        setLastClose(new Date());

        // Schedule the next candle close
        scheduleNextEval();
      }, msUntil);
    }

    scheduleNextEval();
    evaluationScheduled.current = true;

    // ── Countdown timer — purely visual, updates every second ──
    const countdownInterval = setInterval(() => {
      const secsLeft = Math.max(0, Math.ceil(getMsUntilNextClose() / 1000));
      setCountdown(secsLeft);
    }, 1000);

    return () => {
      clearTimeout(evalTimeout);
      clearInterval(countdownInterval);
    };
    // Run once on mount only — engine is self-scheduling
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetEngine = () => {
    resetSimulation();
    reset();
  };

  return {
    state,
    isRunning,
    countdown,      // seconds until next candle close
    lastClose,      // Date of last completed candle close
    reset: resetEngine,
  };
}
