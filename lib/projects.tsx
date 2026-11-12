import Image from "next/image";
import type { ReactNode } from "react";
import { Mark } from "@/components/icons";
import type { Lang, Localized } from "@/lib/i18n";
import digitaskLogo from "@/public/images/logo-digitask.png";
import himsiLogo from "@/public/images/logo-himsi.jpg";
import umnLogo from "@/public/images/logo-umn.png";

export type ProjectCategory = "web" | "app";

export interface Project {
  id: string;
  category: ProjectCategory;
  /** How far the card drifts against the scroll; 0 keeps it still. Read by lib/motion.ts. */
  depth: number;
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

/** The first project is the lead: it always takes the full-width layout. */
export const PROJECTS: Project[] = [
  {
    id: "umn-softskill",
    category: "web",
    depth: 0,
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
    id: "himsi",
    category: "web",
    depth: -0.05,
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
    id: "digitask",
    category: "app",
    depth: 0.07,
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
];
