import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Mark } from "@/components/icons";
import type { Lang, Localized } from "@/lib/i18n";
import digitaskLogo from "@/public/images/logo-digitask.png";
import himsiLogo from "@/public/images/logo-himsi.jpg";
import umnLogo from "@/public/images/logo-umn.png";

export type ProjectCategory = "web" | "app" | "data";

export interface Project {
  id: string;
  category: ProjectCategory;
  /** When the work happened, shown beside the project's dot on the timeline. */
  period: Localized;
  /** Class that styles the cover in app/globals.css. */
  art: string;
  /** Cover content: a composition of type and the real logo, not a screenshot. */
  cover: (lang: Lang) => ReactNode;
  kicker: string;
  title: Localized;
  description: Localized;
  tags: string[];
  /** The first link is the main one; any further links are shown as secondary. */
  links: Array<{ label: Localized; href: string }>;
}

const SOURCE_CODE: Localized = { id: "Lihat source code", en: "View source code" };

// Mean of the 15 cross-validation folds in data/fnn_fold_results.csv and data/lstm_fold_results.csv
// of the mockup_ews repository.
const EWS_METRICS = [
  { label: "Acc", fnn: 0.689, lstm: 0.661 },
  { label: "F1", fnn: 0.659, lstm: 0.607 },
  { label: "AUC", fnn: 0.692, lstm: 0.62 },
  { label: "B-Acc", fnn: 0.69, lstm: 0.63 },
  { label: "MCC", fnn: 0.403, lstm: 0.326 },
];
const bar = (value: number) => ({ "--v": value }) as CSSProperties;

/** Newest first: this is the order of the timeline. Periods follow each repository's commit history. */
export const PROJECTS: Project[] = [
  {
    id: "umn-softskill",
    category: "web",
    period: { id: "Sep – Okt 2026", en: "Sep – Oct 2026" },
    art: "art-softskill",
    cover: (lang) => (
      <>
        <div className="art-top">
          <span>Universitas Multimedia Nusantara</span>
          <span>Web</span>
        </div>
        <Image
          className="umn-logo"
          src={umnLogo}
          alt={
            lang === "id"
              ? "Logo Universitas Multimedia Nusantara"
              : "Universitas Multimedia Nusantara logo"
          }
          width={160}
          height={160}
        />
        <div className="art-title">
          Beyond
          <br />
          <em>academics.</em>
        </div>
        <div className="art-bottom">
          <span>UMN Softskill</span>
          <span>Monitoring & development</span>
        </div>
      </>
    ),
    kicker: "Web development",
    title: {
      id: "Website UMN Softskill (VIBE)",
      en: "UMN Softskill Website (VIBE)",
    },
    description: {
      id: "Platform untuk mengelola dan memonitor soft skill mahasiswa di Universitas Multimedia Nusantara.",
      en: "A platform for managing and monitoring students’ soft skills at Universitas Multimedia Nusantara.",
    },
    tags: ["Next.js", "TypeScript", "React.js", "Tailwind"],
    links: [
      {
        label: SOURCE_CODE,
        href: "https://github.com/RayhandiZ/Website_UMN_Softskill",
      },
    ],
  },
  {
    id: "digitask",
    category: "app",
    period: { id: "Jul – Nov 2026", en: "Jul – Nov 2026" },
    art: "art-digitask",
    cover: (lang) => (
      <>
        <Mark className="art-mark" spin={-0.12} />
        <div className="art-top">
          <span>Made for freelancers</span>
          <span>App</span>
        </div>
        <div className="digitask-lockup">
          <Image
            src={digitaskLogo}
            alt={lang === "id" ? "Logo DigiTask" : "DigiTask logo"}
            width={110}
            height={110}
          />
          <div>
            DigiTask<span>Less friction. More focus.</span>
          </div>
        </div>
        <div className="art-bottom">
          <span>Task & project management</span>
          <span>Mobile</span>
        </div>
      </>
    ),
    kicker: "App development",
    title: { id: "Aplikasi DigiTask", en: "DigiTask App" },
    description: {
      id: "Aplikasi untuk membantu freelancer mengelola tugas dan proyek secara efisien.",
      en: "An app that helps freelancers manage their tasks and projects efficiently.",
    },
    tags: ["Dart", "Flutter"],
    links: [
      { label: SOURCE_CODE, href: "https://github.com/RayhandiZ/DigiTask" },
    ],
  },
  {
    id: "himsi",
    category: "web",
    period: { id: "Jul 2026", en: "Jul 2026" },
    art: "art-himsi",
    cover: (lang) => (
      <>
        <Mark className="art-mark" spin={0.12} />
        <div className="art-top">
          <span>Student community</span>
          <span>Web</span>
        </div>
        <div className="himsi-lockup">
          <Image
            src={himsiLogo}
            alt={lang === "id" ? "Logo HIMSI UMN" : "HIMSI UMN logo"}
            width={96}
            height={96}
          />
          <div>
            HIMSI<span>Connect. Inform. Inspire.</span>
          </div>
        </div>
        <div className="art-bottom">
          <span>{lang === "id" ? "Sistem Informasi" : "Information Systems"}</span>
          <span>UMN</span>
        </div>
      </>
    ),
    kicker: "Web development",
    title: { id: "Website HIMSI UMN", en: "HIMSI UMN Website" },
    description: {
      id: "Ruang digital organisasi mahasiswa untuk berbagi informasi, event, dan komunikasi.",
      en: "A digital home for a student organisation to share news, events, and updates.",
    },
    tags: ["React.js", "TypeScript", "JavaScript"],
    links: [
      {
        label: { id: "Kunjungi website", en: "Visit website" },
        href: "https://himsi.umn.ac.id",
      },
      {
        label: { id: "Source code", en: "Source code" },
        href: "https://github.com/RayhandiZ/Website_HIMSI",
      },
    ],
  },
  {
    id: "ews-ipk",
    category: "data",
    period: { id: "Jul 2026", en: "Jul 2026" },
    art: "art-ews",
    cover: (lang) => (
      <>
        <div className="art-top">
          <span>{lang === "id" ? "MBKM Penelitian · LPPM UMN" : "MBKM research · LPPM UMN"}</span>
          <span>Data</span>
        </div>
        <div className="ews-stage">
          <div
            className="ews-chart"
            role="img"
            aria-label={
              lang === "id"
                ? "Rata-rata skor validasi silang 15 fold. FNN unggul di kelima metrik, misalnya akurasi 0,69 berbanding 0,66 untuk BiLSTM + Attention."
                : "Mean scores over 15 cross-validation folds. FNN leads on all five metrics, for example accuracy 0.69 against 0.66 for BiLSTM + Attention."
            }
          >
            <div className="ews-plot">
              {EWS_METRICS.map(({ label, fnn, lstm }) => (
                <div className="ews-group" key={label}>
                  <span className="ews-bar" style={bar(fnn)} />
                  <span className="ews-bar ews-bar-alt" style={bar(lstm)} />
                </div>
              ))}
            </div>
            <div className="ews-axis">
              {EWS_METRICS.map(({ label }) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
          <div className="art-title">
            Early
            <br />
            <em>warning.</em>
          </div>
        </div>
        <div className="art-bottom">
          <span className="ews-legend">
            <span className="ews-swatch" aria-hidden="true" />
            FNN
            <span className="ews-swatch ews-swatch-alt" aria-hidden="true" />
            BiLSTM + Attention
          </span>
          <span>15-fold CV</span>
        </div>
      </>
    ),
    kicker: "Big Data Analytics",
    title: {
      id: "Early Warning System Prediksi IPK",
      en: "GPA Early Warning System",
    },
    description: {
      id: "Purwarupa early warning system yang mendeteksi dini mahasiswa berisiko akademik dari 40 faktor di luar kampus, dengan komparasi model FNN dan BiLSTM + Attention serta dashboard tata kelola risiko AI.",
      en: "A prototype early warning system that flags students at academic risk from 40 factors outside campus, comparing FNN and BiLSTM + Attention models, with a dashboard for AI risk governance.",
    },
    tags: ["Python", "Streamlit", "Pandas", "Plotly"],
    links: [
      { label: SOURCE_CODE, href: "https://github.com/RayhandiZ/mockup_ews" },
    ],
  },
];
