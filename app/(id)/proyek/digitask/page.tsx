import { CaseStudyPage, metadataForCase } from "@/components/case-study";
import { CASE_STUDIES } from "@/lib/case-studies";

// The Indonesian case study of DigiTask. Its text lives in lib/case-studies.ts.
const study = CASE_STUDIES.digitask;

export const metadata = metadataForCase(study, "id");

export default function DigitaskCaseStudy() {
  return <CaseStudyPage study={study} lang="id" />;
}
