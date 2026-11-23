"use client";

import { useRef } from "react";
import { useRefraction } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { LanguageSwitch } from "@/components/language-switch";
import { CASE_UI, caseStudyPath } from "@/lib/case-studies";
import { CONTENT } from "@/lib/content";
import { useScrolledPast } from "@/lib/hooks";
import { HOME_PATH, type Lang } from "@/lib/i18n";

/** The case study's header: the home page's glass capsule, holding the wordmark, the way back to the project
    list, and the language switch, which keeps the reader on this case study. */
export function CaseHeader({ lang, slug }: { lang: Lang; slug: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledPast(8);
  // Same surface as the home page's capsule (components/site-header.tsx).
  useRefraction(bar, { kind: "surface", strength: 1, bezel: 16, thickness: 22 });

  return (
    <header className={scrolled ? "site-header case-header is-scrolled" : "site-header case-header"}>
      <div ref={bar} className="container nav-bar lg-glass lg-glass--host">
        <a className="wordmark" href={HOME_PATH[lang]} aria-label={CONTENT[lang].nav.homeLabel}>
          RZ
        </a>
        <div className="case-nav">
          <a className="case-back" href={`${HOME_PATH[lang]}#project`}>
            <Arrow glyph="←" />
            {/* Hidden from sight, not from screen readers, on the narrowest phones (app/globals.css). */}
            <span className="case-back-text">{CASE_UI[lang].back}</span>
          </a>
          <LanguageSwitch
            lang={lang}
            paths={{ id: caseStudyPath(slug, "id"), en: caseStudyPath(slug, "en") }}
          />
        </div>
      </div>
    </header>
  );
}
