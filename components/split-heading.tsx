import type { SplitHeading } from "@/lib/content";

/** The words of a heading whose last part turns into serif italic (see lib/motion.ts). */
export function SplitHeadingText({ heading }: { heading: SplitHeading }) {
  const { lead, tuck, joiner, em, breakBefore } = heading;
  return (
    <>
      {lead}
      {tuck && <span className="tuck">{tuck}</span>}
      {joiner && ` ${joiner}`}
      {breakBefore ? <br /> : " "}
      <em>{em}</em>
    </>
  );
}
