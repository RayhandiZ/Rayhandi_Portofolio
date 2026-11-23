import { CASE_STUDIES } from "@/lib/case-studies";
import { caseOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

// The picture shown when the English case study is shared. lib/og-image.tsx draws it.
const study = CASE_STUDIES["ews-ipk"];

export const alt = study.meta.imageAlt.en;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return caseOgImage(study, "en");
}
