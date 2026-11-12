"use client";

import { GlassButton } from "@zakisheriff/liquid-glass";
import { useScrolledPast } from "@/lib/hooks";

/** Appears once the page is well below the hero. Without JavaScript it is simply always there. */
export function ToTop() {
  const visible = useScrolledPast(600);
  return (
    <GlassButton
      href="#beranda"
      variant="clear"
      id="toTop"
      className={visible ? "to-top is-visible" : "to-top"}
      aria-label="Kembali ke atas"
      icon={<span aria-hidden="true">↑</span>}
    />
  );
}
