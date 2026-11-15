import Image from "next/image";

interface Tool {
  name: string;
  logo: string;
}

// Two rows that drift in opposite directions. Logos are in public/logos (Devicon, MIT; Google Sheets from
// Simple Icons, CC0), recoloured where the original would vanish on the dark cards.
const ROWS: Tool[][] = [
  [
    { name: "HTML5", logo: "html5" },
    { name: "CSS3", logo: "css3" },
    { name: "JavaScript", logo: "javascript" },
    { name: "TypeScript", logo: "typescript" },
    { name: "React", logo: "react" },
    { name: "Next.js", logo: "nextjs" },
    { name: "Tailwind CSS", logo: "tailwindcss" },
    { name: "Figma", logo: "figma" },
  ],
  [
    { name: "Dart", logo: "dart" },
    { name: "Flutter", logo: "flutter" },
    { name: "Python", logo: "python" },
    { name: "MySQL", logo: "mysql" },
    { name: "Google Sheets", logo: "googlesheets" },
    { name: "Git", logo: "git" },
    { name: "VS Code", logo: "vscode" },
  ],
];

// Four copies per row: the loop shifts by one copy (25%), and the other three cover the screen meanwhile.
const COPIES = 4;

export function TechBand() {
  return (
    <div className="tech-band">
      {ROWS.map((tools, row) => (
        <div className="tech-row" key={row}>
          <div className="tech-track">
            {Array.from({ length: COPIES }, (_, copy) => (
              <ul className="tech-set" key={copy} aria-hidden={copy > 0 || undefined}>
                {tools.map(({ name, logo }) => (
                  <li className="tech-card" key={name}>
                    <Image src={`/logos/${logo}.svg`} alt="" width={32} height={32} />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
