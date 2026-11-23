"use client";

import { useEffect, useState } from "react";
import { GlassSegmented } from "@zakisheriff/liquid-glass";
import { CONTENT } from "@/lib/content";
import { HOME_PATH, LANGS, type Lang } from "@/lib/i18n";

const CODES = LANGS.map((code) => code.toUpperCase());
const NAMES: Record<Lang, string> = { id: "Bahasa Indonesia", en: "English" };

/** ID | EN. Each language is its own page, so switching loads the other one at the same section.
    Plain links stand in for the segmented control when script is unavailable. `paths` names the page in each
    language; it is the home page unless a case study passes its own. */
export function LanguageSwitch({
  lang,
  section = "",
  paths = HOME_PATH,
}: {
  lang: Lang;
  section?: string;
  paths?: Record<Lang, string>;
}) {
  const [selected, setSelected] = useState(() => LANGS.indexOf(lang));
  const hrefFor = (target: Lang) =>
    paths[target] + (section && section !== "beranda" ? `#${section}` : "");

  // Coming back with the browser's Back button can restore this page as it was left, mid-switch.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setSelected(LANGS.indexOf(lang));
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, [lang]);

  const choose = (index: number) => {
    setSelected(index);
    const target = LANGS[index];
    if (target === lang) return;
    // Let the selection slide across before the other page loads.
    const settle = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260;
    window.setTimeout(() => window.location.assign(hrefFor(target)), settle);
  };

  return (
    <div className="lang-switch">
      <GlassSegmented
        className="lang-track"
        aria-label={CONTENT[lang].nav.languageLabel}
        options={CODES}
        value={selected}
        onChange={choose}
      />
      <div className="lang-links">
        {LANGS.map((code) => (
          <a
            key={code}
            className="lang-link"
            href={paths[code]}
            hrefLang={code}
            lang={code}
            aria-label={NAMES[code]}
            aria-current={code === lang ? "page" : undefined}
          >
            {code.toUpperCase()}
          </a>
        ))}
      </div>
    </div>
  );
}
