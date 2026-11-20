import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SvgSprite } from "@/components/icons";
import { CONTENT } from "@/lib/content";
import { HOME_PATH, LANGS, type Lang } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
// The glass and smooth-scroll stylesheets come first so the page's own rules can tune them.
import "@zakisheriff/liquid-glass/styles.css";
import "lenis/dist/lenis.css";
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

const OG_LOCALE: Record<Lang, string> = { id: "id_ID", en: "en_US" };

export function metadataFor(lang: Lang): Metadata {
  const title = SITE_NAME;
  const { description } = CONTENT[lang].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: HOME_PATH[lang],
      languages: { id: HOME_PATH.id, en: HOME_PATH.en, "x-default": HOME_PATH.id },
    },
    // The image comes from the opengraph-image.tsx beside each page. Next.js fills the Twitter card
    // (summary_large_image, title, description, image) from these fields.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: HOME_PATH[lang],
      title,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((other) => other !== lang).map((other) => OG_LOCALE[other]),
    },
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
