import { CONTENT } from "@/lib/content";
import { OG_IMAGE_SIZE, ogImage } from "@/lib/og-image";

// The picture shown when the Indonesian page is shared. lib/og-image.tsx draws it for both languages.
export const alt = CONTENT.id.meta.imageAlt;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage("id");
}
