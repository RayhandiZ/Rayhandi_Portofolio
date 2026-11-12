import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SvgSprite } from "@/components/icons";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
// The glass stylesheet comes first so the page's own rules can tune it.
import "@zakisheriff/liquid-glass/styles.css";
import "@/app/globals.css";

const jakarta = localFont({
  src: "../app/fonts/plus-jakarta-sans.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
});

// Latin-only WOFF2 cut of Cormorant Garamond italic; app/fonts/README.md says how it was made.
const cormorant = localFont({
  src: "../app/fonts/cormorant-italic.woff2",
  weight: "500",
  style: "italic",
  display: "swap",
  variable: "--font-cormorant",
  adjustFontFallback: "Times New Roman",
});

export function metadataFor(lang: Lang): Metadata {
  return {
    title: "Rayhandi Zulmi",
    description: CONTENT[lang].meta.description,
  };
}

export const VIEWPORT: Viewport = {
  themeColor: "#051221",
  colorScheme: "dark",
};

/* Runs before first paint. `nav-enhanced` switches the header to its scripted form and `motion` hides what
   the opening animates in. If the app has not started after six seconds (script blocked or failed), both
   are taken back so the page shows complete and still, as it does without JavaScript. */
const bootScript = `(function(){var r=document.documentElement;r.classList.add("nav-enhanced");if(window.matchMedia("(prefers-reduced-motion: no-preference)").matches)r.classList.add("motion");setTimeout(function(){if(window.__appStarted)return;r.classList.remove("nav-enhanced","motion");window.__motionOff=true},6000)})()`;

/** The HTML document both languages share. Each language's root layout renders it with its own `lang`. */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html
      lang={lang}
      data-theme="dark"
      className={`${jakarta.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      {/* This is the root layout's <head>, shared by both languages. The rule only expects it in
          app/layout files and suggests next/head, which the App Router does not use. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SvgSprite />
        {children}
      </body>
    </html>
  );
}
