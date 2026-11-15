import { SkillLevels } from "@/components/skill-levels";
import { SplitHeadingText } from "@/components/split-heading";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

const SKILL_GROUPS = [
  {
    title: "Web & App Development",
    tools: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind",
      "Dart",
      "Flutter",
    ],
  },
  { title: "Data & Automation", tools: ["Python", "MySQL", "Google Sheets"] },
  {
    title: "Design & Workflow",
    tools: ["UI/UX Design", "Figma", "Git", "VS Code"],
  },
];

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
          {SKILL_GROUPS.map(({ title, tools }, index) => (
            <div className="skill-row reveal" key={title}>
              <h3>{title}</h3>
              <p>{t.summaries[index]}</p>
              <ul className="chips">
                {tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
          <SkillLevels lang={lang} />
        </div>
      </div>
    </section>
  );
}
