import Image from "next/image";
import { SplitHeadingText } from "@/components/split-heading";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { PROJECTS, type Project } from "@/lib/projects";

interface Tool {
  name: string;
  /** Logo in public/logos. A tool without one shows the page's mark. */
  logo?: string;
}

// Logos as in the tech band (Devicon, MIT; Google Sheets from Simple Icons, CC0). Pandas, Plotly and Streamlit are
// from Devicon too; the pandas bars are white instead of navy so they show on the dark chips. The MySQL dolphin has
// a stroke in its own colour, so its thin lines still read at 16px.
const SKILL_GROUPS: Array<{ title: string; tools: Tool[] }> = [
  {
    title: "Web & App Development",
    tools: [
      { name: "HTML", logo: "html5" },
      { name: "CSS", logo: "css3" },
      { name: "JavaScript", logo: "javascript" },
      { name: "TypeScript", logo: "typescript" },
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextjs" },
      { name: "Tailwind", logo: "tailwindcss" },
      { name: "Dart", logo: "dart" },
      { name: "Flutter", logo: "flutter" },
    ],
  },
  {
    title: "Data & Automation",
    tools: [
      { name: "Python", logo: "python" },
      { name: "Pandas", logo: "pandas" },
      { name: "Plotly", logo: "plotly" },
      { name: "Streamlit", logo: "streamlit" },
      { name: "MySQL", logo: "mysql" },
      { name: "Google Sheets", logo: "googlesheets" },
    ],
  },
  {
    title: "Design & Workflow",
    tools: [
      { name: "UI/UX Design" },
      { name: "Figma", logo: "figma" },
      { name: "Git", logo: "git" },
      { name: "VS Code", logo: "vscode" },
    ],
  },
];

// A project tag names a tool when the two differ only in case or a trailing ".js" (the tag "React.js" is React).
const toolKey = (name: string) => name.toLowerCase().replace(/\.js$/, "");

/** Projects whose tags name any of the tools, in timeline order. */
function projectsUsing(tools: Tool[]) {
  const keys = new Set(tools.map((tool) => toolKey(tool.name)));
  return PROJECTS.filter((project) => project.tags.some((tag) => keys.has(toolKey(tag))));
}

/** "Dipakai di UMN Softskill, HIMSI UMN, dan DigiTask.", each name a link to the project's card. */
function UsedIn({ projects, lang }: { projects: Project[]; lang: Lang }) {
  const names = projects.map((project) => project.name[lang]);
  const parts = new Intl.ListFormat(lang, { type: "conjunction" }).formatToParts(names);
  return (
    <p className="skill-proof">
      {CONTENT[lang].skills.usedIn}{" "}
      {parts.map((part) => {
        if (part.type === "literal") return part.value;
        const project = projects[names.indexOf(part.value)];
        return (
          <a key={project.id} href={`#project-${project.id}`}>
            {part.value}
          </a>
        );
      })}
      .
    </p>
  );
}

export function Skills({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].skills;
  return (
    <section
      className="skills-section section container"
      id="keahlian"
      aria-labelledby="skills-title"
    >
      <div className="section-top reveal">
        <p className="eyebrow">Skills & toolkit</p>
        <span className="small-label">{t.tagline}</span>
      </div>
      <div className="skills-layout">
        <div className="skills-intro">
          <h2 id="skills-title">
            <SplitHeadingText heading={t.title} />
          </h2>
          <p className="reveal">{t.intro}</p>
          <blockquote className="reveal">{t.quote}</blockquote>
        </div>
        <div className="skill-rows">
          {SKILL_GROUPS.map(({ title, tools }, index) => {
            const projects = projectsUsing(tools);
            return (
              <div className="skill-row reveal" key={title}>
                <h3>{title}</h3>
                <p>{t.summaries[index]}</p>
                <ul className="chips">
                  {tools.map(({ name, logo }) => (
                    <li key={name}>
                      {logo ? (
                        <Image src={`/logos/${logo}.svg`} alt="" width={16} height={16} />
                      ) : (
                        // The page's mark, without data-spin, so lib/motion.ts leaves it still.
                        <svg className="mark" aria-hidden="true">
                          <use href="#mark" />
                        </svg>
                      )}
                      {name}
                    </li>
                  ))}
                </ul>
                {projects.length > 0 && <UsedIn projects={projects} lang={lang} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
