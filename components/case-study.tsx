import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Arrow } from "@/components/arrow";
import { CaseHeader } from "@/components/case-header";
import { GlassTouchScroll } from "@/components/glass-touch-scroll";
import { Motion } from "@/components/motion";
import { OG_LOCALE } from "@/components/root-document";
import { CASE_UI, caseStudyPath, type CaseSection, type CaseStudy } from "@/lib/case-studies";
import { CONTENT } from "@/lib/content";
import { HOME_PATH, LANGS, type Lang } from "@/lib/i18n";
import { CONTACT_SECTION, SITE_NAME } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");
const percent = (lang: Lang) =>
  new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

/** Title, description, canonical and hreflang links for one case study. The share image comes from the
    opengraph-image.tsx beside each page; metadataBase comes from the root layout. */
export function metadataForCase(study: CaseStudy, lang: Lang): Metadata {
  const title = `${study.meta.title[lang]} · ${SITE_NAME}`;
  const description = study.meta.description[lang];
  const url = caseStudyPath(study.slug, lang);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        id: caseStudyPath(study.slug, "id"),
        en: caseStudyPath(study.slug, "en"),
        "x-default": caseStudyPath(study.slug, "id"),
      },
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((other) => other !== lang).map((other) => OG_LOCALE[other]),
    },
  };
}

/** One case study page. Server-rendered throughout: the chart is a table and the figures are plain images,
    so the page reads the same without JavaScript. */
export function CaseStudyPage({ study, lang }: { study: CaseStudy; lang: Lang }) {
  const ui = CASE_UI[lang];
  return (
    <>
      <a className="skip-link" href="#main">
        {CONTENT[lang].skipLink}
      </a>
      <CaseHeader lang={lang} slug={study.slug} />
      <main id="main" className="case">
        <header className="case-hero container">
          <p className="eyebrow">
            {ui.kind} · {study.eyebrow[lang]}
          </p>
          <h1 className="case-title">
            {study.title.lead[lang]} <em>{study.title.em[lang]}</em>
          </h1>
          <p className="case-lede">{study.lede[lang]}</p>
          <dl className="case-facts">
            {study.facts.map((fact) => (
              <div key={fact.term.en}>
                <dt>{fact.term[lang]}</dt>
                <dd>{fact.detail[lang]}</dd>
              </div>
            ))}
          </dl>
          <ul className="case-stats">
            {study.stats.map((stat) => (
              <li key={stat.label.en}>
                <strong>{stat.value[lang]}</strong>
                <span>{stat.label[lang]}</span>
              </li>
            ))}
          </ul>
          {study.links.length > 0 && (
            <div className="case-links">
              {study.links.map((link) => (
                <a
                  key={link.href}
                  className="project-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label[lang]} <Arrow glyph="↗" />
                </a>
              ))}
            </div>
          )}
        </header>

        <div className="case-body container">
          <nav className="case-toc" aria-label={ui.contents}>
            <ol>
              {study.sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span aria-hidden="true">{pad(index + 1)}</span>
                    {section.label[lang]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="case-sections">
            {study.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className={`case-section is-${section.kind}`}
                aria-labelledby={`${section.id}-title`}
              >
                <p className="case-label">
                  <span aria-hidden="true">{pad(index + 1)}</span>
                  {section.label[lang]}
                </p>
                <h2 id={`${section.id}-title`}>{section.heading[lang]}</h2>
                <SectionBody section={section} lang={lang} />
              </section>
            ))}
            <div className="case-end">
              <a className="project-link" href={`${HOME_PATH[lang]}#project`}>
                <span className="case-end-label">
                  <Arrow glyph="←" />
                  {ui.back}
                </span>
              </a>
              <a className="project-link" href={`${HOME_PATH[lang]}#${CONTACT_SECTION}`}>
                {ui.contact} <Arrow glyph="→" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <GlassTouchScroll />
      {/* Smooth scrolling as on the home page; it also tells the boot script the app has started. */}
      <Motion />
    </>
  );
}

function SectionBody({ section, lang }: { section: CaseSection; lang: Lang }) {
  switch (section.kind) {
    case "prose":
      return (
        <div className="case-prose">
          {section.body.map((paragraph) => (
            <p key={paragraph.en}>{paragraph[lang]}</p>
          ))}
        </div>
      );
    case "steps":
      return (
        <ol className="case-steps">
          {section.steps.map((step, index) => (
            <li key={step.title.en}>
              <span className="step-num" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <div className="case-prose">
                <h3>{step.title[lang]}</h3>
                {step.body.map((paragraph) => (
                  <p key={paragraph.en}>{paragraph[lang]}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      );
    case "bars":
      return (
        <>
          <BarChart section={section} lang={lang} />
          <div className="case-prose">
            {section.body.map((paragraph) => (
              <p key={paragraph.en}>{paragraph[lang]}</p>
            ))}
          </div>
        </>
      );
    case "figures":
      return (
        <>
          <p className="case-intro">{section.intro[lang]}</p>
          <div className="case-figures">
            {section.figures.map((figure) => (
              <figure key={figure.src} className="case-figure">
                <Image
                  src={figure.src}
                  width={figure.width}
                  height={figure.height}
                  alt={figure.alt[lang]}
                  sizes="(max-width: 760px) calc(100vw - 40px), 760px"
                />
                <figcaption>{figure.caption[lang]}</figcaption>
              </figure>
            ))}
          </div>
          {section.points && (
            <ul className="case-list case-points">
              {section.points.map((point) => (
                <li key={point.en}>{point[lang]}</li>
              ))}
            </ul>
          )}
        </>
      );
    case "flows":
      return (
        <>
          <p className="case-intro">{section.intro[lang]}</p>
          <div className="case-flows">
            {section.columns.map((column) => (
              <div key={column.title.en} className="flow-col">
                <h3>{column.title[lang]}</h3>
                <ol>
                  {column.steps.map((step) => (
                    <li key={step.en}>{step[lang]}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      );
    case "ledger":
      return (
        <div className="case-ledger">
          {section.columns.map((column, index) => (
            <div key={column.title.en} className={index === 0 ? "ledger-col is-done" : "ledger-col"}>
              <h3>{column.title[lang]}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item.en}>{item[lang]}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "list":
      return (
        <>
          <p className="case-intro">{section.intro[lang]}</p>
          <ul className="case-list">
            {section.items.map((item) => (
              <li key={item.en}>{item[lang]}</li>
            ))}
          </ul>
        </>
      );
  }
}

/** Ranked horizontal bars from a zero baseline, built as a table so the numbers are readable without the bars.
    A hairline through every track marks the naive guess each model has to beat. */
function BarChart({
  section,
  lang,
}: {
  section: Extract<CaseSection, { kind: "bars" }>;
  lang: Lang;
}) {
  const format = percent(lang);
  const baseline = section.rows.find((row) => row.baseline)?.value;
  return (
    <figure className="case-chart">
      <table
        className="bars"
        style={baseline === undefined ? undefined : ({ "--base": baseline } as CSSProperties)}
      >
        <caption>{section.caption[lang]}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Model</th>
            <th scope="col">{section.valueLabel[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row) => (
            <tr key={row.name.en} className={row.baseline ? "is-baseline" : undefined}>
              <th scope="row">
                <span className="bar-name">{row.name[lang]}</span>
                <span className="bar-note">{row.note[lang]}</span>
              </th>
              <td>
                <span className="bar-line">
                  <span className="bar-track" aria-hidden="true">
                    <span className="bar" style={{ "--v": row.value } as CSSProperties} />
                  </span>
                  <span className="bar-value">{format.format(row.value)}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot aria-hidden="true">
          <tr>
            <td />
            <td>
              <span className="bars-axis">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </figure>
  );
}
