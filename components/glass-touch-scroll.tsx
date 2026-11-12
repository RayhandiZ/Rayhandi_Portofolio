"use client";

import { useEffect } from "react";

/* The glass library keeps a touch for itself once it lands on a button or a lens track, so a swipe that
   starts there does not scroll the page. On a long page that makes scrolling stall under the thumb.
   The stylesheet gives those controls `touch-action: pan-y`; this stops the library's touchmove handlers
   from cancelling the pan. A vertical swipe then scrolls and the control lets go, while taps and sideways
   drags (the lens) still belong to the control. Renders nothing. */
export function GlassTouchScroll() {
  useEffect(() => {
    const keepScrolling = (event: TouchEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.(".lg-button, .lg-track")) event.stopPropagation();
    };
    document.addEventListener("touchmove", keepScrolling, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener("touchmove", keepScrolling, { capture: true });
  }, []);

  return null;
}
