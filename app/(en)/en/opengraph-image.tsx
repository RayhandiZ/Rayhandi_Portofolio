import { CONTENT } from "@/lib/content";
import { OG_IMAGE_SIZE, ogImage } from "@/lib/og-image";
import { HEADLINE_ROLE } from "@/lib/site";

// The picture shown when the English page is shared. It sits beside the page rather than the layout, because
// app/(en)/opengraph-image would be served at /opengraph-image, the address of the Indonesian one.
export const alt = CONTENT.en.meta.imageAlt(HEADLINE_ROLE);
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage("en");
}
