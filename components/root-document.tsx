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

export const OG_LOCALE: Record<Lang, string> = { id: "id_ID", en: "en_US" };

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
   the opening animates in. `has-intro` shows the intro (components/intro.tsx) on the first visit to a home
   page in this tab; `intro-go` starts its arrival once the serif face has loaded, or after 0.9 s without
   it. If the app has not started after six seconds (script blocked or failed), all of these are taken back
   so the page shows complete and still, as it does without JavaScript. */
const bootScript = `(function(){var r=document.documentElement,w=window;r.classList.add("nav-enhanced");var m=w.matchMedia("(prefers-reduced-motion: no-preference)").matches;if(m)r.classList.add("motion");if(m&&${JSON.stringify(Object.values(HOME_PATH))}.indexOf(location.pathname)>-1)try{if(!sessionStorage.getItem("rz-intro")){sessionStorage.setItem("rz-intro","1");w.__intro=true;r.classList.add("has-intro")}}catch(e){}if(w.__intro){var t=performance.now(),go=function(){if(w.__introAt===undefined){w.__introAt=performance.now();r.classList.add("intro-go")}},wait=function(){if(performance.now()-t>900)return go();document.fonts.load(${JSON.stringify(`italic 500 1em ${cormorant.style.fontFamily}`)}).then(function(f){f.length?go():setTimeout(wait,40)},go)};document.fonts?wait():go()}setTimeout(function(){if(w.__appStarted)return;r.classList.remove("nav-enhanced","motion","has-intro","intro-go","intro-leave");w.__motionOff=true;w.__intro=false},6000)})()`;

/* Production only, as on omb.umn.ac.id: the right-click menu and the shortcuts for DevTools (F12,
   Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C) and view source (Ctrl+U, Cmd+U) do nothing. It only deters a casual look:
   the browser's own menu, view-source: and any HTTP client still show everything, and the repository is
   public. Form fields keep their menu for paste and spelling suggestions. Keys are matched by `code`
   because Option changes `key` on a Mac. */
const guardScript = `(function(){var d=["KeyI","KeyJ","KeyC"];addEventListener("contextmenu",function(e){var t=e.target;if(!(t instanceof Element&&t.closest("input,textarea,[contenteditable]")))e.preventDefault()});addEventListener("keydown",function(e){var c=e.code;if(e.key==="F12"||((e.ctrlKey&&e.shiftKey)||(e.metaKey&&e.altKey))&&d.indexOf(c)>-1||(e.ctrlKey||e.metaKey)&&c==="KeyU"){e.preventDefault();e.stopPropagation()}},true)})()`;

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
        {process.env.NODE_ENV === "production" && (
          <script dangerouslySetInnerHTML={{ __html: guardScript }} />
        )}
      </head>
      <body>
        <SvgSprite />
        {children}
      </body>
    </html>
  );
}
