import type { ReactNode } from "react";
import { metadataFor, RootDocument, VIEWPORT } from "@/components/root-document";

// Root layout for the Indonesian page at /. The English page has its own in app/(en).
export const metadata = metadataFor("id");
export const viewport = VIEWPORT;

export default function IndonesianLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="id">{children}</RootDocument>;
}
