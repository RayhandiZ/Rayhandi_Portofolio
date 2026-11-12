import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SvgSprite } from "@/components/icons";
// The glass stylesheet comes first so the page's own rules can tune it.
import "@zakisheriff/liquid-glass/styles.css";
import "./globals.css";

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
});

const cormorant = localFont({
  src: "./fonts/cormorant-italic.ttf",
  weight: "500",
  style: "italic",
  display: "swap",
  variable: "--font-cormorant",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: "Rayhandi Zulmi",
  description:
    "Rayhandi Zulmi — Web Developer, UI/UX Designer & Data Analyst. Project web, dashboard, dan aplikasi yang menghubungkan data dengan pengalaman pengguna.",
};

export const viewport: Viewport = {
  themeColor: "#051221",
  colorScheme: "dark",
};

/* Runs before first paint. `nav-enhanced` switches the header to its scripted form and `motion` hides what
   the opening animates in. If the app has not started after six seconds (script blocked or failed), both
   are taken back so the page shows complete and still, as it does without JavaScript. */
const bootScript = `(function(){var r=document.documentElement;r.classList.add("nav-enhanced");if(window.matchMedia("(prefers-reduced-motion: no-preference)").matches)r.classList.add("motion");setTimeout(function(){if(window.__appStarted)return;r.classList.remove("nav-enhanced","motion");window.__motionOff=true},6000)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="dark"
      className={`${jakarta.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
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
