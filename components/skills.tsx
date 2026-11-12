const SKILL_GROUPS = [
  {
    title: "Web & App Development",
    summary: "Antarmuka interaktif untuk web dan mobile.",
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
  {
    title: "Data & Automation",
    summary: "Dari pengolahan data ke dashboard real-time.",
    tools: ["Python", "MySQL", "Google Sheets"],
  },
  {
    title: "Design & Workflow",
    summary: "Detail visual dan alur kerja yang terstruktur.",
    tools: ["UI/UX Design", "Figma", "Git", "VS Code"],
  },
];

// Self-assessed percentages kept from the earlier portfolio.
const SKILL_LEVELS = [
  { label: "HTML & CSS", level: 70 },
  { label: "JavaScript", level: 65 },
  { label: "React", level: 65 },
  { label: "Google Sheets", level: 75 },
  { label: "UI/UX Design", level: 70 },
];

export function Skills() {
  return (
    <section
      className="skills-section section container"
      id="keahlian"
      aria-labelledby="skills-title"
    >
      <div className="section-top reveal">
        <p className="eyebrow">Skills & toolkit</p>
        <span className="small-label">
          Selalu ada hal baru untuk dipelajari.
        </span>
      </div>
      <div className="skills-layout">
        <div className="skills-intro">
          <h2 id="skills-title">
            Satu ide<span className="tuck">.</span>
            <br />
            <em>Banyak kemungkinan.</em>
          </h2>
          <p className="reveal">
            Perpaduan kemampuan teknis dan kepekaan desain untuk membangun
            pengalaman digital secara menyeluruh.
          </p>
          <blockquote className="reveal">
            “Teknologi selalu berubah, yang saya jaga adalah rasa ingin tahu dan
            kemauan untuk terus belajar.”
          </blockquote>
        </div>
        <div className="skill-rows">
          {SKILL_GROUPS.map(({ title, summary, tools }) => (
            <div className="skill-row reveal" key={title}>
              <h3>{title}</h3>
              <p>{summary}</p>
              <ul className="chips">
                {tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="skill-levels reveal" id="skillLevels">
            <h3>Penilaian kemampuan pribadi</h3>
            <p>Penilaian mandiri dari portofolio awal.</p>
            {SKILL_LEVELS.map(({ label, level }) => (
              <label key={label}>
                {label} <span>{level}%</span>
                <meter min={0} max={100} value={level}>
                  {level}%
                </meter>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
