"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { GlassButton, GlassNav, useRefraction } from "@zakisheriff/liquid-glass";
import { LanguageSwitch } from "@/components/language-switch";
import { CONTENT } from "@/lib/content";
import { useScrolledPast } from "@/lib/hooks";
import type { Lang } from "@/lib/i18n";
import { CONTACT_SECTION, NAV_SECTIONS } from "@/lib/site";

const MOBILE_NAV = "(max-width: 900px)";
const SPY_SECTIONS: string[] = [...NAV_SECTIONS, CONTACT_SECTION];
const tabOf = (id: string) => (NAV_SECTIONS as readonly string[]).indexOf(id);

interface NavState {
  /** Section under the middle of the viewport. */
  current: string;
  /** Section the page is travelling to after a choice. The selection waits there instead of
      visiting every section on the way. */
  pinned: string | null;
  /** Tab that carries the selection. It stays where it was while the contact section is current. */
  tab: number;
}
type NavAction =
  | { type: "seen"; id: string }
  | { type: "go"; id: string }
  | { type: "release" };

function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case "seen": {
      const pinned = state.pinned === action.id ? null : state.pinned;
      const tab = tabOf(action.id);
      return {
        current: action.id,
        pinned,
        tab: pinned || tab < 0 ? state.tab : tab,
      };
    }
    case "go": {
      const tab = tabOf(action.id);
      return { ...state, pinned: action.id, tab: tab < 0 ? state.tab : tab };
    }
    case "release": {
      if (!state.pinned) return state;
      const tab = tabOf(state.current);
      return { ...state, pinned: null, tab: tab < 0 ? state.tab : tab };
    }
  }
}

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].nav;
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [nav, dispatch] = useReducer(navReducer, {
    current: NAV_SECTIONS[0],
    pinned: null,
    tab: 0,
  });
  const scrolled = useScrolledPast(8);
  // The capsule is a glass host: the same surface the library's cards use, on our own element.
  useRefraction(bar, { kind: "surface", strength: 1, bezel: 16, thickness: 22 });

  const active = nav.pinned ?? nav.current;
  const away = active === CONTACT_SECTION;

  // Scroll spy: the section crossing the middle of the viewport is the current one.
  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) dispatch({ type: "seen", id: entry.target.id });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SPY_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    return () => spy.disconnect();
  }, []);

  // A pinned choice lets go once the page arrives, the visitor scrolls by hand, or time runs out.
  useEffect(() => {
    if (!nav.pinned) return;
    const release = () => dispatch({ type: "release" });
    const timer = window.setTimeout(release, 2200);
    const events = ["wheel", "touchmove", "scrollend"] as const;
    events.forEach((name) =>
      window.addEventListener(name, release, { passive: true }),
    );
    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, release));
    };
  }, [nav.pinned]);

  useEffect(() => {
    const onScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.scale = `${range > 0 ? (window.scrollY / range).toFixed(4) : 0} 1`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_NAV);
    const close = () => setOpen(false);
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    // The links come before the button in the DOM, so Tab would otherwise skip them.
    firstLink.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Tabs are buttons, so they do what a section link does: scroll there and record it in the address.
  const travel = (index: number) => {
    const id = NAV_SECTIONS[index];
    dispatch({ type: "go", id });
    document.getElementById(id)?.scrollIntoView();
    if (window.location.hash !== `#${id}`)
      window.history.pushState(null, "", `#${id}`);
  };

  const follow = (id: string) => {
    setOpen(false);
    dispatch({ type: "go", id });
    if (!window.matchMedia(MOBILE_NAV).matches) return;
    // From the overlay, focus follows the choice so the next Tab continues inside that section.
    const section = document.getElementById(id);
    section?.setAttribute("tabindex", "-1");
    section?.focus({ preventScroll: true });
  };

  return (
    <>
      <span className="scroll-progress" ref={progress} aria-hidden="true" />
      <header
        className={scrolled ? "site-header is-scrolled" : "site-header"}
        id="siteHeader"
      >
        <div ref={bar} className="container nav-bar lg-glass lg-glass--host">
          <a className="wordmark" href="#beranda" aria-label={t.homeLabel}>
            RZ
          </a>
          <nav
            id="mainNav"
            className={open ? "main-nav is-open" : "main-nav"}
            aria-label={t.mainLabel}
          >
            <GlassNav
              className={away ? "nav-track is-away" : "nav-track"}
              aria-label={t.tabsLabel}
              items={NAV_SECTIONS.map((id) => ({ label: t.sections[id] }))}
              activeIndex={nav.tab}
              onChange={travel}
            />
            <div className="nav-links">
              {NAV_SECTIONS.map((id, index) => (
                <a
                  key={id}
                  ref={index === 0 ? firstLink : undefined}
                  className="nav-link"
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  onClick={() => follow(id)}
                >
                  {t.sections[id]}
                </a>
              ))}
            </div>
            <GlassButton
              href={`#${CONTACT_SECTION}`}
              variant="clear"
              className={away ? "nav-contact is-current" : "nav-contact"}
              aria-current={away ? "true" : undefined}
              onClick={() => follow(CONTACT_SECTION)}
            >
              {t.contact}
            </GlassButton>
          </nav>
          <LanguageSwitch lang={lang} section={active} />
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mainNav"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}
