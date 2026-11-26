/* The opening title (components/intro.tsx). The boot script in components/root-document.tsx decides before
   first paint whether it plays, and adds .intro-go once the serif face has loaded; CSS draws the arrival.
   This module ends it: once the logo is complete and the app has started, the two halves part along the
   horizon, and the hero's own opening (lib/motion.ts) waits for that. A click or Escape ends it early. */

declare global {
  interface Window {
    /** True from the boot script's decision until the intro has gone. */
    __intro?: boolean;
    /** performance.now() when the arrival started (.intro-go), set by the boot script. */
    __introAt?: number;
  }
}

/** From .intro-go until the logo is complete: the last arrival animation in globals.css ends at 1.65 s. */
const ARRIVAL = 1750;
/** Into the exit, when the halves have begun to part (they wait 0.4 s) and the hero starts its opening. */
const REVEAL_AT = 600;
/** The whole exit: 0.4 s for the horizon to reach the edges, then 1 s for the halves. */
const EXIT = 1450;

const CLASSES = ["has-intro", "intro-go", "intro-leave"];

let revealed: Promise<void> = Promise.resolve();
let leaving = false;
let pendingFinish = 0;

function finish() {
  window.__intro = false;
  leaving = false;
  document.documentElement.classList.remove(...CLASSES);
}

/** Puts the intro's classes back on <html> after React's development remount reset them. */
export function restoreIntro() {
  if (!window.__intro) return;
  const root = document.documentElement;
  root.classList.add("has-intro");
  if (window.__introAt !== undefined) root.classList.add("intro-go");
  if (leaving) root.classList.add("intro-leave");
}

/** Resolves when the hero may start its opening: at once when no intro is showing. */
export function introRevealed() {
  return revealed;
}

/** Ends the intro when its time comes and returns the cleanup. Does nothing when no intro is showing. */
export function playIntro(): () => void {
  // React's development remount stops and restarts this at once; only a stop that is not followed by a
  // start takes the intro away.
  window.clearTimeout(pendingFinish);
  const overlay = document.querySelector<HTMLElement>(".intro");
  if (!window.__intro || !overlay) {
    finish();
    revealed = Promise.resolve();
    return () => {};
  }

  let release = () => {};
  revealed = new Promise((resolve) => {
    release = resolve;
  });
  const timers: number[] = [];
  const later = (callback: () => void, delay: number) =>
    timers.push(window.setTimeout(callback, delay));
  const done = () => {
    finish();
    release();
  };

  const leave = () => {
    if (leaving) return;
    leaving = true;
    document.documentElement.classList.add("intro-leave");
    later(release, REVEAL_AT);
    later(done, EXIT);
  };
  // The arrival starts when the serif has loaded, which can be after the app has started.
  const schedule = () => {
    const start = window.__introAt;
    if (start === undefined) later(schedule, 80);
    else later(leave, Math.max(0, start + ARRIVAL - performance.now()));
  };
  schedule();

  const skipByKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") leave();
  };
  overlay.addEventListener("pointerdown", leave);
  window.addEventListener("keydown", skipByKey);

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    overlay.removeEventListener("pointerdown", leave);
    window.removeEventListener("keydown", skipByKey);
    if (leaving) done();
    else pendingFinish = window.setTimeout(done, 0);
  };
}
