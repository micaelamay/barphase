// ═══════════════════════════════════════════
// BARPHASE — NEXT.JS MIDDLEWARE (TEMPORARILY DISABLED FOR DEBUGGING)
// ═══════════════════════════════════════════

import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily pass all requests through — no auth check
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
