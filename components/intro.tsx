import type { CSSProperties } from "react";
import type { Lang, Localized } from "@/lib/i18n";

const LABEL: Localized = { id: "Portofolio", en: "Portfolio" };

/* The eight arms of the ✳ mark (icons.tsx draws it as four strokes), each drawn from the centre outward,
   clockwise from the top. */
const ARMS = [
  [24, 3],
  [38.8, 9.2],
  [45, 24],
  [38.8, 38.8],
  [24, 45],
  [9.2, 38.8],
  [3, 24],
  [9.2, 9.2],
];

function Letters() {
  return (
    <>
      <span className="intro-letter">r</span>
      <span className="intro-letter">z</span>
    </>
  );
}

/** The opening title over the home page: the rz monogram rises out of a horizon line with its reflection
    below, then the screen parts along that line. It stays hidden unless the boot script in root-document.tsx
    put .has-intro on <html>; lib/intro.ts ends it. Purely decorative, so screen readers skip it. */
export function Intro({ lang }: { lang: Lang }) {
  return (
    <div className="intro" aria-hidden="true" data-lenis-prevent>
      <div className="intro-half intro-top">
        <div className="intro-type intro-logo">
          <Letters />
          <span className="intro-mark">
            <svg viewBox="0 0 48 48">
              {ARMS.map(([x, y], index) => (
                <line
                  key={index}
                  x1="24"
                  y1="24"
                  x2={x}
                  y2={y}
                  pathLength={1}
                  style={{ "--i": index } as CSSProperties}
                />
              ))}
            </svg>
          </span>
        </div>
      </div>
      <div className="intro-half intro-bottom">
        <span className="intro-ring" />
        <span className="intro-ring" />
        <div className="intro-type intro-reflection">
          <Letters />
        </div>
        <p className="intro-meta">
          <span>
            <span>Rayhandi Zulmi</span>
          </span>
          <span>
            <span>{LABEL[lang]}</span>
          </span>
        </p>
      </div>
      <span className="intro-horizon" />
    </div>
  );
}
