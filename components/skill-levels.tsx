"use client";

import { useId, useState } from "react";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

// Self-assessed percentages kept from the earlier portfolio.
const SKILL_LEVELS = [
  { label: "HTML & CSS", level: 60 },
  { label: "JavaScript", level: 50 },
  { label: "React", level: 50 },
  { label: "Next.js", level: 50 },
  { label: "TypeScript", level: 50 },
  { label: "Tailwind", level: 50 },
  { label: "Dart & Flutter", level: 40 },
  { label: "Python", level: 60 },
  { label: "MySQL", level: 60 },
  { label: "Google Sheets", level: 60 },
  { label: "UI/UX Design", level: 70 },
];

const VISIBLE_COUNT = 5;

function SkillMeter({ label, level }: { label: string; level: number }) {
  return (
    <label>
      {label} <span>{level}%</span>
      <meter min={0} max={100} value={level}>
        {level}%
      </meter>
    </label>
  );
}

// The extra meters stay in the DOM while hidden, so the fill animation in lib/motion.ts
// still plays for them when they come into view after expanding.
export function SkillLevels({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].skills;
  const [expanded, setExpanded] = useState(false);
  const moreId = useId();

  return (
    <div className="skill-levels reveal" id="skillLevels">
      <h3>{t.levelsTitle}</h3>
      <p>{t.levelsNote}</p>
      {SKILL_LEVELS.slice(0, VISIBLE_COUNT).map((skill) => (
        <SkillMeter key={skill.label} {...skill} />
      ))}
      <div id={moreId} hidden={!expanded}>
        {SKILL_LEVELS.slice(VISIBLE_COUNT).map((skill) => (
          <SkillMeter key={skill.label} {...skill} />
        ))}
      </div>
      <button
        type="button"
        className="skill-levels-toggle"
        aria-expanded={expanded}
        aria-controls={moreId}
        onClick={() => setExpanded((open) => !open)}
      >
        {expanded ? t.showLess : t.showMore}
        <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}
