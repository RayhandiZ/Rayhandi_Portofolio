import Image from "next/image";
import type { ReactNode } from "react";
import { Mark } from "@/components/icons";
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
  cover: ReactNode;
  kicker: string;
  title: string;
  description: string;
  tags: string[];
  /** The first link is the main one; any further links are shown as secondary. */
  links: Array<{ label: string; href: string }>;
}

/** The first project is the lead: it always takes the full-width layout. */
export const PROJECTS: Project[] = [
  {
    id: "umn-softskill",
    category: "web",
    depth: 0,
    art: "art-softskill",
    cover: (
      <>
        <div className="art-top">
          <span>Universitas Multimedia Nusantara</span>
          <span>Web</span>
        </div>
        <Image
          className="umn-logo"
          src={umnLogo}
          alt="Logo Universitas Multimedia Nusantara"
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
    title: "Website UMN Softskill (VIBE)",
    description:
      "Platform untuk mengelola dan memonitor soft skill mahasiswa di Universitas Multimedia Nusantara.",
    tags: ["Next.js", "TypeScript", "React.js", "Tailwind"],
    links: [
      {
        label: "Lihat source code",
        href: "https://github.com/RayhandiZ/Website_UMN_Softskill",
      },
    ],
  },
  {
    id: "himsi",
    category: "web",
    depth: -0.05,
    art: "art-himsi",
    cover: (
      <>
        <Mark className="art-mark" spin={0.12} />
        <div className="art-top">
          <span>Student community</span>
          <span>Web</span>
        </div>
        <div className="himsi-lockup">
          <Image src={himsiLogo} alt="Logo HIMSI UMN" width={96} height={96} />
          <div>
            HIMSI<span>Connect. Inform. Inspire.</span>
          </div>
        </div>
        <div className="art-bottom">
          <span>Sistem Informasi</span>
          <span>UMN</span>
        </div>
      </>
    ),
    kicker: "Web development",
    title: "Website HIMSI UMN",
    description:
      "Ruang digital organisasi mahasiswa untuk berbagi informasi, event, dan komunikasi.",
    tags: ["React.js", "TypeScript", "JavaScript"],
    links: [
      { label: "Kunjungi website", href: "https://himsi.umn.ac.id" },
      {
        label: "Source code",
        href: "https://github.com/RayhandiZ/Website_HIMSI",
      },
    ],
  },
  {
    id: "digitask",
    category: "app",
    depth: 0.07,
    art: "art-digitask",
    cover: (
      <>
        <Mark className="art-mark" spin={-0.12} />
        <div className="art-top">
          <span>Made for freelancers</span>
          <span>App</span>
        </div>
        <div className="digitask-lockup">
          <Image
            src={digitaskLogo}
            alt="Logo DigiTask"
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
    title: "Aplikasi DigiTask",
    description:
      "Aplikasi untuk membantu freelancer mengelola tugas dan proyek secara efisien.",
    tags: ["Dart", "Flutter"],
    links: [
      {
        label: "Lihat source code",
        href: "https://github.com/RayhandiZ/DigiTask",
      },
    ],
  },
];
