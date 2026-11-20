import { Mark } from "@/components/icons";
import { SplitHeadingText } from "@/components/split-heading";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

export function About({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].about;
  return (
    <section
      className="about-section section unfold"
      id="tentang"
      aria-labelledby="about-title"
    >
      <div className="container about-layout">
        <div className="about-aside">
          <p className="eyebrow">A little about me</p>
          <div className="about-monogram" aria-hidden="true">
            r<span>z</span>
            <Mark spin={0.28} />
          </div>
          <p className="aside-caption">
            {t.caption[0]}
            <br />
            {t.caption[1]}
          </p>
        </div>
        <div className="about-copy">
          <h2 id="about-title">
            <SplitHeadingText heading={t.title} />
          </h2>
          <p className="about-lead" id="aboutLead">
            {t.lead}
          </p>
          <div className="about-body">
            {t.body.map((paragraph) => (
              <p className="reveal" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <dl className="about-facts reveal">
            {t.facts.map(({ term, detail }) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
