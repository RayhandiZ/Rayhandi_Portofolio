import type { MetadataRoute } from "next";
import { HOME_PATH, LANGS } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const absolute = (path: string) => new URL(path, SITE_URL).href;

/** One entry per language. Each lists both versions, so search engines treat them as translations of one page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    id: absolute(HOME_PATH.id),
    en: absolute(HOME_PATH.en),
    "x-default": absolute(HOME_PATH.id),
  };
  return LANGS.map((lang) => ({
    url: absolute(HOME_PATH[lang]),
    alternates: { languages },
  }));
}
