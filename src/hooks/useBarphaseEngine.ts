// ═══════════════════════════════════════════
// BARPHASE — ENGINE HOOK
// ═══════════════════════════════════════════

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSignalStore } from "@/store/signalStore";
import { getNextSimulatedState, resetSimulation } from "@/lib/engine/simulator";

const TICK_INTERVAL = 4000; // 4 seconds per simulated candle cycle

export function useBarphaseEngine() {
  const { state, isRunning, updateState, setRunning, reset } = useSignalStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const nextState = getNextSimulatedState();
      updateState(nextState);
    }, TICK_INTERVAL);
    // Immediate first tick
    updateState(getNextSimulatedState());
  }, [setRunning, updateState]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, [setRunning]);

  const resetEngine = useCallback(() => {
    stop();
    resetSimulation();
    reset();
  }, [stop, reset]);

  // Auto-start on mount
  useEffect(() => {
    start();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start]);

  return {
    state,
    isRunning,
    start,
    stop,
    reset: resetEngine,
  };
}
