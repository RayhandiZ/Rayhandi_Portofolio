import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { GlassTouchScroll } from "@/components/glass-touch-scroll";
import { DisciplineBand, Hero } from "@/components/hero";
import { Motion } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";
import { ToTop } from "@/components/to-top";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <DisciplineBand />
        <Work />
        <About />
        <Skills />
        <Contact />
      </main>
      <ToTop />
      <GlassTouchScroll />
      {/* Last, and inside the page rather than the layout: the page hydrates after the layout, and the
          motion rewrites text that React must have hydrated first. */}
      <Motion />
    </>
  );
}
