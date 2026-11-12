import { useSyncExternalStore } from "react";

const subscribeScroll = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
};
const never = () => () => {};

/** True once the page is scrolled past `offset` px. Re-renders only when the answer flips. */
export function useScrolledPast(offset: number) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > offset,
    () => false,
  );
}

/** False on the server and during hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    never,
    () => true,
    () => false,
  );
}

/** The current year in the browser; `fallback` in the server-rendered HTML. */
export function useCurrentYear(fallback: number) {
  return useSyncExternalStore(
    never,
    () => new Date().getFullYear(),
    () => fallback,
  );
}
