// ═══════════════════════════════════════════
// BARPHASE — SIDEBAR NAVIGATION
// ═══════════════════════════════════════════

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

// ── SVG Icon Map ─────────────────────────
function NavIcon({ name, className = "" }: { name: string; className?: string }) {
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };

  switch (name) {
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "candle":
      return <svg {...props}><line x1="9" y1="2" x2="9" y2="22" /><line x1="15" y1="2" x2="15" y2="22" /><rect x="7" y="6" width="4" height="8" rx="0.5" fill="currentColor" opacity="0.3" /><rect x="13" y="8" width="4" height="10" rx="0.5" fill="currentColor" opacity="0.3" /></svg>;
    case "zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
    case "book":
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    case "bar-chart":
      return <svg {...props}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
    case "flask":
      return <svg {...props}><path d="M9 3h6v5l4 9a1 1 0 0 1-.9 1.4H5.9A1 1 0 0 1 5 17l4-9V3z" /><line x1="9" y1="3" x2="15" y2="3" /></svg>;
    case "newspaper":
      return <svg {...props}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>;
    case "scan":
      return <svg {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></svg>;
    case "eye":
      return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "bell":
      return <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

// ── Section Labels ──────────────────────
const SECTIONS = [
  { key: "main", label: null },
  { key: "analysis", label: "Analysis" },
  { key: "tools", label: "Tools" },
  { key: "system", label: "System" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[200px] flex-col border-r border-bp-border bg-bp-bg flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-bp-border">
        <BarphaseLogoV2 />
        <div>
          <div className="text-[13px] font-bold text-bp-text tracking-wider">
            BARPHASE
          </div>
          <div className="text-[9px] text-bp-text-dim font-medium tracking-widest">
            TRADING OS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {SECTIONS.map((section) => {
          const items = NAV_ITEMS.filter((i) => i.section === section.key);
          if (items.length === 0) return null;
          return (
            <div key={section.key}>
              {section.label && (
                <div className="px-3 pt-4 pb-1.5">
                  <span className="text-[9px] font-semibold text-bp-text-dim uppercase tracking-[0.15em]">
                    {section.label}
                  </span>
                </div>
              )}
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                  >
                    <NavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-bp-border px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-bp-lime animate-dot-pulse" />
          <span className="text-[10px] text-bp-text-dim">Engine Active</span>
        </div>
        <div className="text-[9px] text-bp-text-dim mt-1 pl-3.5">
          MNQ • 3m • v2.0
        </div>
      </div>
    </aside>
  );
}

function BarphaseLogoV2() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="#2A2A38" strokeWidth="1" />
      <path
        d="M16 1C8.268 1 2 7.268 2 15c0 7.732 6.268 14 14 14"
        fill="#7D39EB"
        opacity="0.85"
      />
      <path
        d="M16 1c7.732 0 14 6.268 14 14 0 7.732-6.268 14-14 14"
        fill="#C6FF33"
        opacity="0.85"
      />
      <circle cx="16" cy="9" r="3" fill="#C6FF33" />
      <circle cx="16" cy="23" r="3" fill="#7D39EB" />
      <circle cx="16" cy="9" r="1.2" fill="#09090F" />
      <circle cx="16" cy="23" r="1.2" fill="#09090F" />
    </svg>
  );
}
