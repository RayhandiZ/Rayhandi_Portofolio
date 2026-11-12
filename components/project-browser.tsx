"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { GlassSegmented } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { PROJECTS, type Project, type ProjectCategory } from "@/lib/projects";

type Filter = "all" | ProjectCategory;

const FILTERS: Filter[] = ["all", "web", "app"];
const matches = (filter: Filter, project: Project) =>
  filter === "all" || project.category === filter;

function ProjectLink({ label, href, secondary }: { label: string; href: string; secondary: boolean }) {
  return (
    <a
      className={secondary ? "project-link secondary-link" : "project-link"}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label} <Arrow glyph="↗" />
    </a>
  );
}

/** The filter and the project cards. Cards stay in the page when filtered out, so they can animate back. */
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
  // A supporting project left on its own takes the lead layout instead of leaving half a row empty.
  const supporting = visible.filter((project) => project !== PROJECTS[0]);
  const lone = supporting.length === 1 ? supporting[0] : null;

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
      <div className="project-grid">
        {PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className={[
              "project-card",
              (index === 0 || project === lone) && "project-featured",
              revealed && "is-in",
            ]
              .filter(Boolean)
              .join(" ")}
            data-category={project.category}
            data-depth={project.depth}
            hidden={!visible.includes(project)}
          >
            <div className={`project-art ${project.art}`}>
              {project.cover(lang)}
            </div>
            <div className="project-body">
              <div className="project-kicker">
                <span>{project.kicker}</span>
              </div>
              <h3>{project.title[lang]}</h3>
              <p>{project.description[lang]}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {project.links.length > 1 ? (
                <div className="project-links">
                  {project.links.map((link, position) => (
                    <ProjectLink
                      key={link.href}
                      label={link.label[lang]}
                      href={link.href}
                      secondary={position > 0}
                    />
                  ))}
                </div>
              ) : (
                <ProjectLink
                  label={project.links[0].label[lang]}
                  href={project.links[0].href}
                  secondary={false}
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
