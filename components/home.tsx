import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { GlassTouchScroll } from "@/components/glass-touch-scroll";
import { DisciplineBand, Hero } from "@/components/hero";
import { Motion } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";
import { ToTop } from "@/components/to-top";
import { Work } from "@/components/work";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

/** The whole portfolio in one language. app/(id)/page.tsx and app/(en)/en/page.tsx render it. */
export function Home({ lang }: { lang: Lang }) {
  return (
    <>
      <a className="skip-link" href="#main">
        {CONTENT[lang].skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <DisciplineBand />
        <Work lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
        <Contact lang={lang} />
      </main>
      <ToTop lang={lang} />
      <GlassTouchScroll />
      {/* Last, and inside the page rather than the layout: the page hydrates after the layout, and the
          motion rewrites text that React must have hydrated first. */}
      <Motion />
    </>
  );
}
