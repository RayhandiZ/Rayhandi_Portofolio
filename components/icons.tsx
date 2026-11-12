/** Symbols referenced with <use>; rendered once in the root layout. */
export function SvgSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <symbol id="mark" viewBox="0 0 48 48">
        <path
          d="M24 3v42M3 24h42M9.2 9.2l29.6 29.6M38.8 9.2 9.2 38.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </symbol>
      <symbol id="icon-github" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
        />
      </symbol>
      <symbol id="icon-linkedin" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
        />
      </symbol>
      <symbol id="icon-mail" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7"
        />
      </symbol>
      <symbol id="icon-pin" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21.5s7-6.1 7-11.5a7 7 0 1 0-14 0c0 5.4 7 11.5 7 11.5zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        />
      </symbol>
    </svg>
  );
}

export function Icon({ name }: { name: "github" | "linkedin" | "mail" | "pin" }) {
  return (
    <svg aria-hidden="true">
      <use href={`#icon-${name}`} />
    </svg>
  );
}

/** The ✳ mark. `spin` is degrees of rotation per pixel scrolled, read by lib/motion.ts. */
export function Mark({ spin, className }: { spin: number; className?: string }) {
  return (
    <svg
      className={className ? `mark ${className}` : "mark"}
      data-spin={spin}
      aria-hidden="true"
    >
      <use href="#mark" />
    </svg>
  );
}
