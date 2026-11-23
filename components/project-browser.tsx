"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { GlassSegmented } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { CASE_UI, caseStudyPath } from "@/lib/case-studies";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { PROJECTS, type Project, type ProjectCategory } from "@/lib/projects";

type Filter = "all" | ProjectCategory;

const FILTERS: Filter[] = ["all", "web", "app", "data"];
const matches = (filter: Filter, project: Project) =>
  filter === "all" || project.category === filter;

/** External links open in a new tab with ↗; a link to a page of this site (a case study) stays in the tab with →. */
function ProjectLink({ label, href, secondary }: { label: string; href: string; secondary: boolean }) {
  const external = /^https?:/.test(href);
  return (
    <a
      className={secondary ? "project-link secondary-link" : "project-link"}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {label} <Arrow glyph={external ? "↗" : "→"} />
    </a>
  );
}

/** The filter and the project timeline. Entries stay in the page when filtered out, so they can animate back. */
export function ProjectBrowser({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].work;
  const [selected, setSelected] = useState(0);
  // Once a filter has been used every card counts as revealed, whether or not it was scrolled to.
  const [revealed, setRevealed] = useState(false);

  // The count is part of the label text ("Web 02"): the lens redraws labels, and only labels, when it lifts.
  const options = FILTERS.map((key) => {
    const count = PROJECTS.filter((project) => matches(key, project)).length;
    return `${t.filters[key]} ${String(count).padStart(2, "0")}`;
  });
  const filter = FILTERS[selected];
  const visible = PROJECTS.filter((project) => matches(filter, project));

  const choose = (index: number) => {
    const apply = () =>
      flushSync(() => {
        setSelected(index);
        setRevealed(true);
      });
    const animated =
      document.documentElement.classList.contains("motion") &&
      typeof document.startViewTransition === "function";
    if (animated) document.startViewTransition(apply);
    else apply();
  };

  // A link to a card (the Skills section names projects) has to find it even while the filter hides it: the
  // filter goes back to All before the browser follows the link.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#project-"]');
      const project = PROJECTS.find((candidate) => link?.hash === `#project-${candidate.id}`);
      if (!project || matches(FILTERS[selected], project)) return;
      flushSync(() => {
        setSelected(0);
        setRevealed(true);
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [selected]);

  return (
    <>
      <div className="work-toolbar reveal">
        <GlassSegmented
          className="filters"
          aria-label={t.filterLabel}
          options={options}
          value={selected}
          onChange={choose}
        />
        <span
          id="filterStatus"
          className="small-label"
          role="status"
          aria-live="polite"
        >
          {t.status(visible.length)}
        </span>
      </div>
      {/* A centre line with one dot per project; cards alternate sides by their place among the visible ones. */}
      <ol className="timeline">
        {PROJECTS.map((project) => {
          const place = visible.indexOf(project);
          const links = [
            ...(project.caseStudy
              ? [{ label: CASE_UI[lang].read, href: caseStudyPath(project.id, lang) }]
              : []),
            ...project.links.map((link) => ({ label: link.label[lang], href: link.href })),
          ];
          return (
            <li
              key={project.id}
              id={`project-${project.id}`}
              className={[
                "timeline-item",
                place % 2 === 1 ? "timeline-right" : "timeline-left",
                place === visible.length - 1 && "timeline-end",
              ]
                .filter(Boolean)
                .join(" ")}
              hidden={place === -1}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <p className="timeline-when">
                <span>{project.period[lang]}</span>
                <small>{project.kicker}</small>
              </p>
              <article
                className={revealed ? "project-card is-in" : "project-card"}
                data-category={project.category}
              >
                <div className={`project-art ${project.art}`}>
                  {project.cover(lang)}
                </div>
                <div className="project-body">
                  <h3>{project.title[lang]}</h3>
                  <p>{project.description[lang]}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {links.length > 1 ? (
                    <div className="project-links">
                      {links.map((link, position) => (
                        <ProjectLink
                          key={link.href}
                          label={link.label}
                          href={link.href}
                          secondary={position > 0}
                        />
                      ))}
                    </div>
                  ) : (
                    <ProjectLink label={links[0].label} href={links[0].href} secondary={false} />
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </>
  );
}
