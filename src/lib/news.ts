// ═══════════════════════════════════════════
// BARPHASE — NEWS & ECONOMIC CALENDAR DATA
// ═══════════════════════════════════════════
//
// Data models and generators for economic events + market news.
// Architected for real API integration — swap the fetch functions
// with live data from Finnhub, Trading Economics, or similar.

export type EventImpact = "high" | "medium" | "low";

export interface EconomicEvent {
  id: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM (ET)
  event: string;
  actual: string;
  forecast: string;
  previous: string;
  impact: EventImpact;
  currency: string;
  passed: boolean;     // true if event time has passed today
}

export interface NewsItem {
  id: string;
  timestamp: Date;
  title: string;
  source: string;
  impact: EventImpact;
  category: string;
  url?: string;
}

// ── Weekly economic calendar template ───────
// Events are generated based on real day-of-week patterns.
// When connected to a real API (Trading Economics, Finnhub),
// replace generateCalendarForDate() with a live fetch.

interface EventTemplate {
  time: string;
  event: string;
  forecast: string;
  previous: string;
  impact: EventImpact;
  currency: string;
  days: number[];  // 0=Sun, 1=Mon, ..., 6=Sat
}

const EVENT_TEMPLATES: EventTemplate[] = [
  // Monday
  { time: "10:00", event: "Factory Orders", forecast: "-0.5%", previous: "0.2%", impact: "low", currency: "USD", days: [1] },

  // Tuesday
  { time: "08:30", event: "PPI Final Demand", forecast: "0.3%", previous: "0.4%", impact: "medium", currency: "USD", days: [2] },
  { time: "10:00", event: "JOLTS Job Openings", forecast: "8.85M", previous: "8.76M", impact: "medium", currency: "USD", days: [2] },
  { time: "13:00", event: "3-Year Note Auction", forecast: "—", previous: "4.32%", impact: "low", currency: "USD", days: [2] },

  // Wednesday
  { time: "07:00", event: "MBA Mortgage Applications", forecast: "—", previous: "-1.2%", impact: "low", currency: "USD", days: [3] },
  { time: "08:30", event: "CPI Month-over-Month", forecast: "0.3%", previous: "0.4%", impact: "high", currency: "USD", days: [3] },
  { time: "08:30", event: "CPI Year-over-Year", forecast: "2.9%", previous: "3.0%", impact: "high", currency: "USD", days: [3] },
  { time: "08:30", event: "Core CPI Month-over-Month", forecast: "0.3%", previous: "0.3%", impact: "high", currency: "USD", days: [3] },
  { time: "10:30", event: "EIA Crude Oil Inventories", forecast: "-1.2M", previous: "3.6M", impact: "medium", currency: "USD", days: [3] },

  // Thursday
  { time: "08:30", event: "Initial Jobless Claims", forecast: "225K", previous: "221K", impact: "medium", currency: "USD", days: [4] },
  { time: "08:30", event: "Retail Sales", forecast: "0.6%", previous: "-0.9%", impact: "high", currency: "USD", days: [4] },
  { time: "10:00", event: "Business Inventories", forecast: "0.1%", previous: "0.2%", impact: "low", currency: "USD", days: [4] },

  // Friday
  { time: "08:30", event: "Import/Export Prices", forecast: "0.1%", previous: "0.3%", impact: "low", currency: "USD", days: [5] },
  { time: "10:00", event: "Michigan Consumer Sentiment (Prelim)", forecast: "63.5", previous: "64.7", impact: "medium", currency: "USD", days: [5] },
];

/** Generate economic calendar events for a specific date */
export function generateCalendarForDate(date: Date): EconomicEvent[] {
  const dayOfWeek = date.getDay();
  const dateStr = formatDateYMD(date);
  const now = new Date();

  return EVENT_TEMPLATES
    .filter((t) => t.days.includes(dayOfWeek))
    .map((t, i) => {
      const [hours, minutes] = t.time.split(":").map(Number);
      const eventTime = new Date(date);
      eventTime.setHours(hours, minutes, 0, 0);

      return {
        id: `cal-${dateStr}-${i}`,
        date: dateStr,
        time: t.time,
        event: t.event,
        actual: eventTime < now ? (Math.random() > 0.5 ? t.forecast : t.previous) : "—",
        forecast: t.forecast,
        previous: t.previous,
        impact: t.impact,
        currency: t.currency,
        passed: eventTime < now,
      };
    })
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** Generate latest market news for today (mock data structured for API replacement) */
export function generateNewsForDate(date: Date): NewsItem[] {
  const now = new Date();
  const dayOfWeek = date.getDay();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];
  const monthName = date.toLocaleString("en-US", { month: "long" });

  // Generate realistic news items anchored to today's date
  const newsTemplates = [
    {
      minutesAgo: 12,
      title: `US Futures Steady Ahead of Key Economic Data — ${dayName} Session`,
      source: "Bloomberg",
      impact: "medium" as EventImpact,
      category: "Markets",
    },
    {
      minutesAgo: 35,
      title: "Fed Officials Weigh Inflation Progress Against Labor Market Resilience",
      source: "Reuters",
      impact: "high" as EventImpact,
      category: "Monetary Policy",
    },
    {
      minutesAgo: 58,
      title: `Tech Sector Leads Pre-Market Movement on ${monthName} ${date.getDate()} Ahead of CPI`,
      source: "CNBC",
      impact: "medium" as EventImpact,
      category: "Sector",
    },
    {
      minutesAgo: 95,
      title: "Treasury Yields Hold Steady as Markets Await Inflation Data",
      source: "MarketWatch",
      impact: "high" as EventImpact,
      category: "Bonds",
    },
    {
      minutesAgo: 140,
      title: "European Markets Mixed on Diverging Central Bank Expectations",
      source: "Financial Times",
      impact: "low" as EventImpact,
      category: "Global",
    },
    {
      minutesAgo: 210,
      title: "Crude Oil Prices Under Pressure — Inventories Report Due Today",
      source: "Reuters",
      impact: "medium" as EventImpact,
      category: "Commodities",
    },
    {
      minutesAgo: 340,
      title: "Asian Markets Close Higher on Optimistic Growth Outlook",
      source: "Bloomberg",
      impact: "low" as EventImpact,
      category: "Global",
    },
  ];

  return newsTemplates.map((t, i) => ({
    id: `news-${i}`,
    timestamp: new Date(now.getTime() - t.minutesAgo * 60 * 1000),
    title: t.title,
    source: t.source,
    impact: t.impact,
    category: t.category,
  }));
}

/** Check if any high-impact events are within the next N minutes */
export function hasUpcomingHighImpact(events: EconomicEvent[], withinMinutes: number = 30): boolean {
  const now = new Date();
  return events.some((e) => {
    if (e.impact !== "high" || e.passed) return false;
    const [h, m] = e.time.split(":").map(Number);
    const eventDate = new Date(e.date);
    eventDate.setHours(h, m, 0, 0);
    const diffMs = eventDate.getTime() - now.getTime();
    return diffMs > 0 && diffMs < withinMinutes * 60 * 1000;
  });
}

/** Format relative time */
export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDateYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
