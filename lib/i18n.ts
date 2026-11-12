export type Lang = "id" | "en";

export const LANGS: readonly Lang[] = ["id", "en"];

/** Each language has its own home: Indonesian at the root, English under /en. */
export const HOME_PATH: Record<Lang, string> = { id: "/", en: "/en" };

/** A piece of text in both languages. */
export type Localized = Record<Lang, string>;
