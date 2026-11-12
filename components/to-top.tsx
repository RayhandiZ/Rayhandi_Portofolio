"use client";

import { GlassButton } from "@zakisheriff/liquid-glass";
import { CONTENT } from "@/lib/content";
import { useScrolledPast } from "@/lib/hooks";
import type { Lang } from "@/lib/i18n";

/** Appears once the page is well below the hero. Without JavaScript it is simply always there. */
export function ToTop({ lang }: { lang: Lang }) {
  const visible = useScrolledPast(600);
  return (
    <GlassButton
      href="#beranda"
      variant="clear"
      id="toTop"
      className={visible ? "to-top is-visible" : "to-top"}
      aria-label={CONTENT[lang].toTop}
      icon={<span aria-hidden="true">↑</span>}
    />
  );
}
