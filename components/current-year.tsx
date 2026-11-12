"use client";

import { useCurrentYear } from "@/lib/hooks";

/** The footer year. The server-rendered HTML carries a fixed year; the browser replaces it with today's. */
export function CurrentYear() {
  return <span id="year">{useCurrentYear(2026)}</span>;
}
