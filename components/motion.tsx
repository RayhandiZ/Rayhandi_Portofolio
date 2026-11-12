"use client";

import { useEffect, useLayoutEffect } from "react";
import { startMotion } from "@/lib/motion";

declare global {
  interface Window {
    /** Set once the app has hydrated. Without it the boot script in app/layout.tsx falls back to a still page. */
    __appStarted?: boolean;
    /** Set by that fallback: the page has already settled into its still state, so motion stays off. */
    __motionOff?: boolean;
  }
}

/** Runs the page motion when the visitor allows it. Renders nothing. */
export function Motion() {
  useLayoutEffect(() => {
    // The boot script set these classes before first paint. React's development remount resets <html> to
    // the attributes it manages, so they are put back here; in production this changes nothing.
    const root = document.documentElement;
    window.__appStarted = true;
    root.classList.add("nav-enhanced");
    if (
      !window.__motionOff &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    )
      root.classList.add("motion");
  }, []);

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion")) return;
    return startMotion();
  }, []);

  return null;
}
