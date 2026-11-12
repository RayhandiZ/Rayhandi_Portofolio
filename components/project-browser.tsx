"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { GlassSegmented } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { PROJECTS, type Project, type ProjectCategory } from "@/lib/projects";

type Filter = "all" | ProjectCategory;

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "Semua" },
  { key: "web", label: "Web" },
  { key: "app", label: "Aplikasi" },
];
const matches = (filter: Filter, project: Project) =>
  filter === "all" || project.category === filter;

// The count is part of the label text ("Web 02"): the lens redraws labels, and only labels, when it lifts.
const OPTIONS = FILTERS.map(({ key, label }) => {
  const count = PROJECTS.filter((project) => matches(key, project)).length;
  return `${label} ${String(count).padStart(2, "0")}`;
});

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
export function ProjectBrowser() {
  const [selected, setSelected] = useState(0);
  // Once a filter has been used every card counts as revealed, whether or not it was scrolled to.
  const [revealed, setRevealed] = useState(false);

  const filter = FILTERS[selected].key;
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
          aria-label="Filter project"
          options={OPTIONS}
          value={selected}
          onChange={choose}
        />
        <span
          id="filterStatus"
          className="small-label"
          role="status"
          aria-live="polite"
        >
          {visible.length} project ditampilkan
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
            <div className={`project-art ${project.art}`}>{project.cover}</div>
            <div className="project-body">
              <div className="project-kicker">
                <span>{project.kicker}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
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
                      {...link}
                      secondary={position > 0}
                    />
                  ))}
                </div>
              ) : (
                <ProjectLink {...project.links[0]} secondary={false} />
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
