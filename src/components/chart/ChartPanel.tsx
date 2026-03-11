// ═══════════════════════════════════════════
// BARPHASE — CHART PANEL (TradingView Widget) v2
// ═══════════════════════════════════════════

"use client";

import React, { useEffect, useRef, memo } from "react";

function ChartPanelInner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
      symbol: "CME_MINI:MNQ1!",
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
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-bp-border px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-bp-lime animate-dot-pulse" />
            <span className="text-sm font-semibold text-bp-text tracking-wide">
              MNQ1!
            </span>
          </div>
          <span className="text-[10px] text-bp-violet-light font-semibold px-1.5 py-0.5 bg-bp-violet/10 rounded">
            3m
          </span>
          <span className="text-[10px] text-bp-text-dim px-1.5 py-0.5 bg-bp-bg-tertiary rounded">
            CME
          </span>
        </div>
        <div className="flex items-center gap-4">
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
      </div>

      {/* Chart Widget Container */}
      <div ref={containerRef} className="flex-1 min-h-0" />
    </div>
  );
}

export const ChartPanel = memo(ChartPanelInner);
