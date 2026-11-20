import Lenis from "lenis";

/* Smooth scrolling: Lenis eases the wheel and in-page links, the way the reference site scrolls. Touch keeps the
   browser's own scrolling. It runs only with the page motion (components/motion.tsx), so reduced motion and the
   still fallback keep native scrolling. Lenis scrolls the window itself, so lib/motion.ts, the scroll spy and
   the glass all keep reading the real scroll position. */

let lenis: Lenis | null = null;

/** Starts smooth scrolling and returns the function that stops it. */
export function startSmoothScroll(): () => void {
  lenis = new Lenis({
    autoRaf: true,
    // About half the distance in 0.15 s and settled within a second: the curve measured on the reference site.
    lerp: 0.08,
    // In-page links ease too. Lenis reads scroll-padding-top, so they stop below the header as before.
    anchors: true,
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Scrolls to a section as an in-page link would: eased by Lenis when it runs, by the browser otherwise. */
export function scrollToSection(section: HTMLElement) {
  if (lenis) lenis.scrollTo(section);
  else section.scrollIntoView();
}

/** True while Lenis is easing toward a target (as opposed to the visitor scrolling by hand). */
export function isEasing() {
  return lenis?.isScrolling === "smooth";
}
