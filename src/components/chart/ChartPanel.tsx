// ═══════════════════════════════════════════
// BARPHASE — CHART PANEL (TradingView) v2.3
// Widget mode: embedded chart | Full mode: TradingView with login
// ═══════════════════════════════════════════

"use client";

import React, { useEffect, useRef, memo, useState, useCallback } from "react";

const TV_CHART_URL = "https://www.tradingview.com/chart/?symbol=CME_MINI%3AMNQ1!&interval=3&theme=dark";

function ChartPanelInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartMode, setChartMode] = useState<"widget" | "full">("widget");

  // Load the embedded widget
  useEffect(() => {
    if (!containerRef.current || chartMode !== "widget") return;

    const container = containerRef.current;
    container.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const innerDiv = document.createElement("div");
    innerDiv.className = "tradingview-widget-container__widget";
    innerDiv.style.height = "100%";
    innerDiv.style.width = "100%";
    widgetContainer.appendChild(innerDiv);

    container.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "PEPPERSTONE:NAS100",
      interval: "3",
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#09090F",
      gridColor: "rgba(42, 42, 56, 0.25)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: false,
      show_popup_button: true,
      popup_width: "1200",
      popup_height: "800",
      support_host: "https://www.tradingview.com",
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#4CAF50",
        "mainSeriesProperties.candleStyle.downColor": "#F23645",
        "mainSeriesProperties.candleStyle.borderUpColor": "#4CAF50",
        "mainSeriesProperties.candleStyle.borderDownColor": "#F23645",
        "mainSeriesProperties.candleStyle.wickUpColor": "#4CAF50",
        "mainSeriesProperties.candleStyle.wickDownColor": "#F23645",
        "paneProperties.background": "#09090F",
        "paneProperties.backgroundType": "solid",
        "paneProperties.vertGridProperties.color": "rgba(42, 42, 56, 0.25)",
        "paneProperties.horzGridProperties.color": "rgba(42, 42, 56, 0.25)",
        "scalesProperties.textColor": "#9898A8",
        "scalesProperties.lineColor": "#2A2A38",
      },
    });

    widgetContainer.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [chartMode]);

  const openTradingView = useCallback(() => {
    const width = Math.min(window.screen.width * 0.85, 1400);
    const height = Math.min(window.screen.height * 0.85, 900);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(
      TV_CHART_URL,
      "tradingview_barphase",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes,resizable=yes`
    );
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-bp-border px-4 py-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-bp-lime animate-dot-pulse" />
            <span className="text-sm font-semibold text-bp-text tracking-wide">
              NAS100
            </span>
          </div>
          <span className="text-[10px] text-bp-violet-light font-semibold px-1.5 py-0.5 bg-bp-violet/10 rounded">
            3m
          </span>
          <span className="text-[10px] text-bp-text-dim px-1.5 py-0.5 bg-bp-bg-tertiary rounded">
            Preview
          </span>
          <span className="text-[9px] text-bp-text-dim/60">
            MNQ1! via Open TradingView →
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Overlay legend */}
          <div className="flex items-center gap-4 mr-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ background: "rgba(76, 175, 80, 0.5)" }} />
              <span className="text-[10px] text-bp-text-dim">Bull OB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ background: "rgba(242, 54, 69, 0.5)" }} />
              <span className="text-[10px] text-bp-text-dim">Bear OB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ background: "rgba(255, 235, 59, 0.5)" }} />
              <span className="text-[10px] text-bp-text-dim">FVG</span>
            </div>
          </div>
          {/* Open TradingView with login */}
          <button
            onClick={openTradingView}
            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg bg-bp-violet/15 text-bp-violet-light hover:bg-bp-violet/25 transition-colors font-medium"
            title="Open full TradingView with your account — log in for futures access"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open TradingView
          </button>
        </div>
      </div>

      {/* Chart Widget */}
      <div ref={containerRef} className="flex-1 min-h-0" />
    </div>
  );
}

export const ChartPanel = memo(ChartPanelInner);
