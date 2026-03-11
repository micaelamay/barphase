// ═══════════════════════════════════════════
// BARPHASE — CONSTANTS & DESIGN TOKENS v2
// ═══════════════════════════════════════════

export const BARPHASE = {
  name: "Barphase",
  version: "2.0.0",
  instrument: "MNQ",
  timeframe: "3m",
} as const;

// ── Color Palette ──────────────────────────
export const COLORS = {
  bg: {
    primary: "#09090F",
    secondary: "#111118",
    tertiary: "#1A1A24",
    elevated: "#222230",
  },
  border: {
    default: "#2A2A38",
    light: "#3A3A4A",
  },
  text: {
    primary: "#FFFFFF",
    muted: "#9898A8",
    dim: "#5E5E72",
  },
  violet: {
    primary: "#7D39EB",
    light: "#9B5FF5",
    dim: "#5A2BA8",
    bg: "rgba(125, 57, 235, 0.12)",
    glow: "rgba(125, 57, 235, 0.15)",
  },
  lime: {
    primary: "#C6FF33",
    muted: "#A3D42A",
    bg: "rgba(198, 255, 51, 0.12)",
    glow: "rgba(198, 255, 51, 0.12)",
  },
  bull: {
    primary: "#4CAF50",
    accent: "#7ED957",
    bg: "rgba(76, 175, 80, 0.20)",
    glow: "rgba(76, 175, 80, 0.15)",
  },
  bear: {
    primary: "#F23645",
    accent: "#FF6B6B",
    bg: "rgba(242, 54, 69, 0.20)",
    glow: "rgba(242, 54, 69, 0.15)",
  },
  fvg: {
    primary: "#FFEB3B",
    bg: "rgba(255, 235, 59, 0.20)",
  },
} as const;

// ── Bot States ──────────────────────────────
export const BOT_STATES = [
  "IDLE",
  "WAITING",
  "PREPARE",
  "READY",
  "ENTER",
] as const;

export type BotState = (typeof BOT_STATES)[number];

// ── Signal Types ────────────────────────────
export const SIGNAL_TYPES = [
  "WAIT",
  "READY",
  "ENTER_LONG",
  "ENTER_SHORT",
] as const;

export type SignalType = (typeof SIGNAL_TYPES)[number];

// ── Setup Steps ─────────────────────────────
export const SETUP_STEPS = [
  "Liquidity Sweep",
  "Displacement Candle",
  "BOS/CHOCH Confirmation",
  "FVG Creation",
  "Price Inside FVG",
  "Session Validity",
] as const;

export type SetupStep = (typeof SETUP_STEPS)[number];

// ── Structure Events ────────────────────────
export const STRUCTURE_EVENTS = [
  "BOS",
  "CHOCH",
  "Liquidity Sweep",
  "None",
] as const;

export type StructureEvent = (typeof STRUCTURE_EVENTS)[number];

// ── Navigation Items ────────────────────────
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string; // icon key
  section?: "main" | "analysis" | "tools" | "system";
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview",     label: "Overview",       href: "/overview",      icon: "grid",       section: "main" },
  { id: "chart",        label: "Chart",          href: "/chart",         icon: "candle",     section: "main" },
  { id: "signals",      label: "Signals",        href: "/signals",       icon: "zap",        section: "main" },
  { id: "journal",      label: "Journal",        href: "/journal",       icon: "book",       section: "analysis" },
  { id: "analytics",    label: "Analytics",      href: "/analytics",     icon: "bar-chart",  section: "analysis" },
  { id: "strategy-lab", label: "Strategy Lab",   href: "/strategy-lab",  icon: "flask",      section: "analysis" },
  { id: "news",         label: "News",           href: "/news",          icon: "newspaper",  section: "tools" },
  { id: "scanner",      label: "Scanner",        href: "/scanner",       icon: "scan",       section: "tools" },
  { id: "watchlist",    label: "Watchlist",      href: "/watchlist",     icon: "eye",        section: "tools" },
  { id: "risk",         label: "Risk",           href: "/risk",          icon: "shield",     section: "tools" },
  { id: "alerts",       label: "Alerts",         href: "/alerts",        icon: "bell",       section: "tools" },
  { id: "settings",     label: "Settings",       href: "/settings",      icon: "settings",   section: "system" },
];
