// ═══════════════════════════════════════════
// BARPHASE — CHART PANEL (TradingView) v2.1
// Uses full Advanced Chart Widget with popup login support
// ═══════════════════════════════════════════

"use client";

import React, { useEffect, useRef, memo, useState } from "react";

function ChartPanelInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartMode, setChartMode] = useState<"widget" | "full">("widget");

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

  return (
    <div className="flex h-full flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-bp-border px-4 py-2 flex-shrink-0">
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
        <div className="flex items-center gap-3">
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
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-bp-bg-tertiary rounded-lg p-0.5">
            <button
              onClick={() => setChartMode("widget")}
              className={`text-[10px] px-2 py-1 rounded transition-colors ${
                chartMode === "widget"
                  ? "bg-bp-violet/15 text-bp-violet-light"
                  : "text-bp-text-dim hover:text-bp-text"
              }`}
            >
              Widget
            </button>
            <button
              onClick={() => setChartMode("full")}
              className={`text-[10px] px-2 py-1 rounded transition-colors ${
                chartMode === "full"
                  ? "bg-bp-violet/15 text-bp-violet-light"
                  : "text-bp-text-dim hover:text-bp-text"
              }`}
            >
              Full Chart
            </button>
          </div>
        </div>
      </div>

      {/* Chart Body */}
      {chartMode === "widget" ? (
        <div ref={containerRef} className="flex-1 min-h-0" />
      ) : (
        <div className="flex-1 min-h-0 relative">
          <iframe
            src="https://www.tradingview.com/widgetembed/?hideideas=1&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en#%7B%22symbol%22%3A%22CME_MINI%3AMNQ1!%22%2C%22frameElementId%22%3A%22tradingview_barphase%22%2C%22interval%22%3A%223%22%2C%22hide_side_toolbar%22%3A%220%22%2C%22allow_symbol_change%22%3A%221%22%2C%22save_image%22%3A%220%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22timezone%22%3A%22America%2FNew_York%22%2C%22withdateranges%22%3A%221%22%2C%22show_popup_button%22%3A%221%22%2C%22popup_width%22%3A%221200%22%2C%22popup_height%22%3A%22800%22%7D"
            className="w-full h-full border-0"
            allowFullScreen
            allow="clipboard-write"
          />
          <div className="absolute bottom-3 left-3 bg-bp-bg/90 backdrop-blur-sm border border-bp-border rounded-lg px-3 py-2">
            <p className="text-[10px] text-bp-text-dim">
              💡 Log into your TradingView account above to access futures data.
              <br />
              Click the profile icon in the chart toolbar to sign in.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export const ChartPanel = memo(ChartPanelInner);
