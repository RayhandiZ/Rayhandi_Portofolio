"use client";

import { useEffect, useLayoutEffect } from "react";
import { playIntro, restoreIntro } from "@/lib/intro";
import { startMotion } from "@/lib/motion";
import { startSmoothScroll } from "@/lib/smooth-scroll";

declare global {
  interface Window {
    /** Set once the app has hydrated. Without it the boot script in app/layout.tsx falls back to a still page. */
    __appStarted?: boolean;
    /** Set by that fallback: the page has already settled into its still state, so motion stays off. */
    __motionOff?: boolean;
  }
}

/** Runs the intro's exit, the page motion, and smooth scrolling when the visitor allows motion. Renders nothing. */
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
    restoreIntro();
  }, []);

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion")) return;
    // First, so the hero's opening in startMotion knows whether to wait for the intro.
    const stopIntro = playIntro();
    const stopScroll = startSmoothScroll();
    const stopMotion = startMotion();
    return () => {
      stopMotion();
      stopScroll();
      stopIntro();
    };
  }, []);

  return null;
}
