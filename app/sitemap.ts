import type { MetadataRoute } from "next";
import { CASE_STUDIES, caseStudyPath } from "@/lib/case-studies";
import { HOME_PATH, LANGS, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const absolute = (path: string) => new URL(path, SITE_URL).href;

/** One entry per page and language. Each lists both versions, so search engines treat them as translations
    of one page. */
function entries(pathFor: (lang: Lang) => string): MetadataRoute.Sitemap {
  const languages = {
    id: absolute(pathFor("id")),
    en: absolute(pathFor("en")),
    "x-default": absolute(pathFor("id")),
  };
  return LANGS.map((lang) => ({ url: absolute(pathFor(lang)), alternates: { languages } }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entries((lang) => HOME_PATH[lang]),
    ...Object.values(CASE_STUDIES).flatMap((study) =>
      entries((lang) => caseStudyPath(study.slug, lang)),
    ),
  ];
}
