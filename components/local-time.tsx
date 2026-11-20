"use client";

import { useSyncExternalStore } from "react";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

// Tangerang keeps Western Indonesia Time (WIB, UTC+7) all year, with no daylight saving.
const FORMAT: Record<Lang, Intl.DateTimeFormat> = {
  id: new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }),
  en: new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour: "numeric", minute: "2-digit" }),
};

/** Calls `notify` at the start of every minute. */
function subscribeMinute(notify: () => void) {
  const untilNextMinute = () => 60_000 - (Date.now() % 60_000);
  let timer = window.setTimeout(function tick() {
    notify();
    timer = window.setTimeout(tick, untilNextMinute());
  }, untilNextMinute());
  return () => window.clearTimeout(timer);
}

/** "Sekarang pukul 14.32 WIB": the time in Tangerang, updated each minute. The server-rendered HTML keeps the line
    empty, so the prerendered page never shows a stale time. */
export function LocalTime({ lang }: { lang: Lang }) {
  const time = useSyncExternalStore(
    subscribeMinute,
    () => FORMAT[lang].format(Date.now()),
    () => null,
  );
  return (
    <span className="contact-time">
      {time ? CONTENT[lang].contact.location.time(time) : " "}
    </span>
  );
}
