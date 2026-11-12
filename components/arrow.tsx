import type { CSSProperties } from "react";

type Glyph = "↗" | "↓" | "↑";

// Where the second copy waits before it slides in: below for ↑, above for ↓.
const ENTRY: Partial<Record<Glyph, string>> = { "↑": "110%", "↓": "-110%" };

/** An arrow with a second copy that swaps in on hover of the enclosing link or button. */
export function Arrow({ glyph }: { glyph: Glyph }) {
  const from = ENTRY[glyph];
  return (
    <span aria-hidden="true">
      <span
        className={from ? "arrow arrow-v" : "arrow"}
        style={from ? ({ "--from": from } as CSSProperties) : undefined}
      >
        <i>{glyph}</i>
        <i>{glyph}</i>
      </span>
    </span>
  );
}
