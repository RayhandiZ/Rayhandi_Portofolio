/** Where the site is published. metadataBase, the canonical and hreflang links, sitemap.xml, robots.txt and
    the share image are built from it, so a new domain only needs changing here. */
export const SITE_URL = "https://rayhandi-portofolio.vercel.app";
/** The page title, the Open Graph site name, and the name on the share image, in both languages. */
export const SITE_NAME = "Rayhandi Zulmi";

/** The CV in public/cv, linked from the Experience section and the contact cards. lib/experience.ts follows it. */
export const CV_PATH = "/cv/CV_Rayhandi_Zulmi.pdf";

export const EMAIL = "rayhandizulmi@gmail.com";
export const GITHUB_URL = "https://github.com/RayhandiZ";
export const LINKEDIN_URL = "https://www.linkedin.com/in/rayhandi-zulmi";

/** Sections with a tab in the header, in page order. The contact section has its own button instead.
    The ids stay the same in both languages, so switching language keeps the reader's place. */
export const NAV_SECTIONS = ["beranda", "project", "tentang", "keahlian"] as const;
export type NavSectionId = (typeof NAV_SECTIONS)[number];

export const CONTACT_SECTION = "kontak";
