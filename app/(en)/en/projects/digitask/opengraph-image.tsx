import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CASE_STUDIES } from "@/lib/case-studies";
import { caseOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

// The picture shown when the English case study is shared: lib/og-image.tsx draws it around a 300 x 652 cut of
// the app's home screen. The path is literal so the bundler ships the file.
const study = CASE_STUDIES.digitask;
const phone = await readFile(join(process.cwd(), "public/images/case-studies/digitask-og-phone.jpg"));

export const alt = study.meta.imageAlt.en;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return caseOgImage(study, "en", `data:image/jpeg;base64,${phone.toString("base64")}`);
}
