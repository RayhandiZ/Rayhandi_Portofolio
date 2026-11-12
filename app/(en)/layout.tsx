import type { ReactNode } from "react";
import { metadataFor, RootDocument, VIEWPORT } from "@/components/root-document";

// Root layout for the English page at /en. Moving between the two root layouts is a full page load.
export const metadata = metadataFor("en");
export const viewport = VIEWPORT;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
