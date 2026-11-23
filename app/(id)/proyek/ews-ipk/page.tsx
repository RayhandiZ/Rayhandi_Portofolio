import { CaseStudyPage, metadataForCase } from "@/components/case-study";
import { CASE_STUDIES } from "@/lib/case-studies";

// The Indonesian case study of the GPA early warning system. Its text lives in lib/case-studies.ts.
const study = CASE_STUDIES["ews-ipk"];

export const metadata = metadataForCase(study, "id");

export default function EwsCaseStudy() {
  return <CaseStudyPage study={study} lang="id" />;
}
