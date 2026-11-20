"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { CONTENT } from "@/lib/content";
import { useHydrated } from "@/lib/hooks";
import type { Lang } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";

type Result = "idle" | "done" | "failed";

/** Copies the email address, for visitors whose browser has no email app to open the mailto: link. It appears only
    once the page runs and the browser offers the clipboard; without it the card's link is still there. */
export function CopyEmail({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].contact.copy;
  const hydrated = useHydrated();
  const [result, setResult] = useState<Result>("idle");

  // The confirmation stays for a moment, then the button reads "Copy" again.
  useEffect(() => {
    if (result === "idle") return;
    const timer = window.setTimeout(() => setResult("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [result]);

  if (!hydrated || !navigator.clipboard) return null;

  const copy = () =>
    navigator.clipboard.writeText(EMAIL).then(
      () => setResult("done"),
      () => setResult("failed"),
    );

  return (
    <>
      <button
        type="button"
        className={result === "done" ? "copy-email is-done" : "copy-email"}
        aria-label={t.action}
        onClick={copy}
      >
        <Icon name={result === "done" ? "check" : "copy"} />
        <span className="copy-email-label">
          {result === "done" ? t.done : result === "failed" ? t.failed : t.label}
        </span>
      </button>
      <span className="sr-only" role="status">
        {result === "done" ? t.copied : result === "failed" ? t.notCopied : ""}
      </span>
    </>
  );
}
