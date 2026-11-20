import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CONTENT } from "@/lib/content";
import { HOME_PATH, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/* The PNG comes out at about 380 KB. Keep it under 600 KB, the size WhatsApp allows for a link preview image
   (older guides say 300 KB); a second photo or a busier background would push it there. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// next/og reads TTF, OTF and WOFF but not WOFF2, so it gets static TTF cuts of the page fonts (app/fonts/README.md).
// The portrait is a 480 x 600 crop of the beach photo, which keeps everything well inside next/og's 500 KB budget.
// Each path is written out in full: the bundler traces only literal paths, and a variable one would make it
// ship the whole project with the server code.
const [jakartaSemiBold, jakartaExtraBold, cormorantItalic, portrait] = await Promise.all([
  readFile(join(process.cwd(), "app/fonts/og/plus-jakarta-sans-600.ttf")),
  readFile(join(process.cwd(), "app/fonts/og/plus-jakarta-sans-800.ttf")),
  readFile(join(process.cwd(), "app/fonts/og/cormorant-italic.ttf")),
  readFile(join(process.cwd(), "public/images/rayhandi-og.jpg")),
]);
const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

// The page palette, from app/globals.css.
const BG = "#051221";
const WHITE = "#f6fbff";
const MUTED = "#9fb4ca";
const SEA = "#3b97df";
const SEA_LIGHT = "#8ccfff";
const SEA_FOAM = "#d4eeff";

/** The share card for one language: the hero's greeting and name beside the portrait in its arched frame. */
export function ogImage(lang: Lang) {
  const url = new URL(HOME_PATH[lang], SITE_URL);
  const address = url.host + (url.pathname === "/" ? "" : url.pathname);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "56px 72px 56px 84px",
          backgroundColor: BG,
          // The hero's glow (.hero-stage in app/globals.css).
          backgroundImage:
            "radial-gradient(62% 72% at 80% 26%, rgba(59, 151, 223, 0.2), rgba(59, 151, 223, 0) 72%)",
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: SEA_LIGHT }}>
              {CONTENT[lang].hero.eyebrow}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 132,
                fontWeight: 800,
                letterSpacing: "-0.06em",
                lineHeight: 0.94,
                color: WHITE,
              }}
            >
              Rayhandi
            </div>
            {/* As on the page: serif italic in the sea gradient, padded so the gradient reaches every stroke. */}
            <div
              style={{
                alignSelf: "flex-start",
                padding: "0.14em 0.12em",
                margin: "-0.14em -0.12em",
                fontFamily: "Cormorant Garamond",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 153,
                letterSpacing: "-0.045em",
                lineHeight: 0.94,
                backgroundImage: `linear-gradient(120deg, ${SEA_FOAM} 0%, ${SEA_LIGHT} 45%, ${SEA} 100%)`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Zulmi.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              fontWeight: 600,
              color: MUTED,
            }}
          >
            {/* The page's mark (components/icons.tsx). */}
            <svg width="28" height="28" viewBox="0 0 48 48">
              <path
                d="M24 3v42M3 24h42M9.2 9.2l29.6 29.6M38.8 9.2 9.2 38.8"
                fill="none"
                stroke={SEA_LIGHT}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </svg>
            {address}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: 2,
            borderTopLeftRadius: 124,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            backgroundImage: `linear-gradient(160deg, ${SEA_LIGHT} 0%, ${SEA} 24%, rgba(59, 151, 223, 0.08) 50%, rgba(59, 151, 223, 0.08) 72%, ${SEA} 100%)`,
            boxShadow: "0 20px 60px rgba(0, 6, 14, 0.55)",
          }}
        >
          {/* next/og draws plain <img> elements; next/image does not apply here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitSrc}
            alt=""
            width={400}
            height={500}
            style={{
              objectFit: "cover",
              borderTopLeftRadius: 122,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              borderBottomLeftRadius: 6,
            }}
          />
          {/* The page's dusk over the daylight photo (.portrait-frame::after), lighter at the left because no
              text crosses the photo here. */}
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 2,
              width: 400,
              height: 500,
              borderTopLeftRadius: 122,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              borderBottomLeftRadius: 6,
              backgroundColor: "rgba(5, 18, 33, 0.08)",
              backgroundImage:
                "linear-gradient(0deg, rgba(5, 18, 33, 0.5), rgba(5, 18, 33, 0.16) 16%, rgba(5, 18, 33, 0) 32%), linear-gradient(90deg, rgba(5, 18, 33, 0.5), rgba(5, 18, 33, 0.14) 16%, rgba(5, 18, 33, 0) 34%)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: "Plus Jakarta Sans", data: jakartaSemiBold, weight: 600, style: "normal" },
        { name: "Plus Jakarta Sans", data: jakartaExtraBold, weight: 800, style: "normal" },
        { name: "Cormorant Garamond", data: cormorantItalic, weight: 500, style: "italic" },
      ],
    },
  );
}
