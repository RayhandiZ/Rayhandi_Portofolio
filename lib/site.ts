export const EMAIL = "rayhandizulmi@gmail.com";
export const GITHUB_URL = "https://github.com/RayhandiZ";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/rayhandi-zulmi-94333a360/";

/** Sections with a tab in the header, in page order. The contact section has its own button instead.
    The ids stay the same in both languages, so switching language keeps the reader's place. */
export const NAV_SECTIONS = ["beranda", "project", "tentang", "keahlian"] as const;
export type NavSectionId = (typeof NAV_SECTIONS)[number];

export const CONTACT_SECTION = "kontak";
