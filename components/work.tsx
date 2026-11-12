import { Arrow } from "@/components/arrow";
import { ProjectBrowser } from "@/components/project-browser";
import { SplitHeadingText } from "@/components/split-heading";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

export function Work({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].work;
  return (
    <section
      className="work section container"
      id="project"
      aria-labelledby="work-title"
    >
      <div className="section-top reveal">
        <p className="eyebrow">Selected work</p>
        <span className="small-label">{t.tagline}</span>
      </div>
      <div className="section-heading">
        <h2 id="work-title">
          <SplitHeadingText heading={t.title} />
        </h2>
        <p className="reveal">{t.intro}</p>
      </div>
      <ProjectBrowser lang={lang} />
      <div className="work-foot reveal">
        <span>{t.more}</span>
        <a
          className="text-link"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/RayhandiZ <Arrow glyph="↗" />
        </a>
      </div>
    </section>
  );
}
