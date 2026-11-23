import type { CSSProperties } from "react";

type Glyph = "↗" | "↓" | "↑" | "→" | "←";

// Where the second copy waits before it slides in: below for ↑, above for ↓, behind for → and ←.
const ENTRY: Partial<Record<Glyph, string>> = { "↑": "110%", "↓": "-110%" };
const ENTRY_X: Partial<Record<Glyph, string>> = { "→": "-110%", "←": "110%" };

/** An arrow with a second copy that swaps in on hover of the enclosing link or button. */
export function Arrow({ glyph }: { glyph: Glyph }) {
  const fromX = ENTRY_X[glyph];
  const from = ENTRY[glyph] ?? fromX;
  const variant = fromX ? " arrow-h" : from ? " arrow-v" : "";
  return (
    <span aria-hidden="true">
      <span
        className={`arrow${variant}`}
        style={from ? ({ "--from": from } as CSSProperties) : undefined}
      >
        <i>{glyph}</i>
        <i>{glyph}</i>
      </span>
    </span>
  );
}
