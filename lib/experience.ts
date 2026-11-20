import type { Localized } from "@/lib/i18n";

/* Experience, organisations and education, condensed from the CV in public/cv. Newest first. When the CV changes,
   change this file with it: the page and the PDF should tell the same story. */

export interface Role {
  id: string;
  period: Localized;
  title: Localized;
  org: string;
  /** Two highlights, written as results rather than duties. */
  points: [Localized, Localized];
  tags: string[];
  /** Id of a project card on the timeline that came out of this role. */
  project?: string;
}

export const ROLES: Role[] = [
  {
    id: "umn-student-engagement",
    period: { id: "Agu 2026 – Sekarang", en: "Aug 2026 – Present" },
    title: { id: "Front-End Developer Intern", en: "Front-End Developer Intern" },
    org: "Student Engagement UMN",
    points: [
      {
        id: "Mengembangkan front-end Sistem Informasi Penilaian Softskill 5C, platform yang diminta bagian kemahasiswaan untuk mencatat dan menilai poin softskill mahasiswa di seluruh fakultas UMN.",
        en: "Developing the front end of the Softskill 5C Assessment System, a platform the Student Affairs office requested to record and assess student softskill points across every UMN faculty.",
      },
      {
        id: "Membuat dashboard admin dan mahasiswa untuk lima dimensi 5C, lalu memigrasikan prototipe dari React + Vite ke Next.js dengan TypeScript bersama developer back-end (Prisma, PostgreSQL).",
        en: "Built admin and student dashboards for the five 5C dimensions, then moved the prototype from React + Vite to Next.js with TypeScript alongside a back-end developer (Prisma, PostgreSQL).",
      },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
    project: "umn-softskill",
  },
  {
    id: "link-net",
    period: { id: "Apr – Agu 2026", en: "Apr – Aug 2026" },
    title: { id: "HR Data Analytics Intern", en: "HR Data Analytics Intern" },
    org: "PT Link Net Tbk",
    points: [
      {
        id: "Membangun dashboard HR real-time di Google Sheets, Looker Studio, dan Streamlit untuk memantau penyelesaian survei, SLA rekrutmen, dan headcount di 4 entitas bisnis, menggantikan laporan manual.",
        en: "Built real-time HR dashboards in Google Sheets, Looker Studio, and Streamlit tracking survey completion, recruitment SLA, and headcount across 4 business entities, replacing manual reports.",
      },
      {
        id: "Mengotomatiskan penggajian intern dengan FILTER, XLOOKUP, dan NETWORKDAYS yang memperhitungkan kalender libur nasional, sehingga hari kerja dan tunjangan tak lagi dihitung manual.",
        en: "Automated intern payroll with FILTER, XLOOKUP, and NETWORKDAYS against the Indonesian public-holiday calendar, so working days and allowances are no longer counted by hand.",
      },
    ],
    tags: ["Google Sheets", "Looker Studio", "Python", "Streamlit"],
  },
  {
    id: "lppm-umn",
    period: { id: "Feb – Mei 2026", en: "Feb – May 2026" },
    title: { id: "Research Intern, MBKM Riset", en: "Research Intern, MBKM Research Program" },
    org: "LPPM UMN",
    points: [
      {
        id: "Membandingkan model FNN dan BiLSTM + Attention untuk memprediksi predikat Cum Laude dari 40 faktor gaya hidup, berdasarkan survei 169 responden.",
        en: "Benchmarked FNN and BiLSTM + Attention models predicting Cum Laude standing from 40 lifestyle factors in a 169-respondent survey.",
      },
      {
        id: "Menyusun pipeline praproses tanpa kebocoran data (102 fitur, validasi Repeated Stratified K-Fold 5×3), lalu menyajikan hasilnya dalam mockup Early Warning System 5 halaman di Streamlit.",
        en: "Built a leakage-safe preprocessing pipeline (102 features, 5×3 Repeated Stratified K-Fold) and presented the results as a 5-page Streamlit Early Warning System mockup.",
      },
    ],
    tags: ["Python", "TensorFlow", "scikit-learn", "Streamlit"],
    project: "ews-ipk",
  },
];

export interface Organisation {
  id: string;
  period: Localized;
  title: Localized;
  org: string;
  summary: Localized;
}

export const ORGANISATIONS: Organisation[] = [
  {
    id: "isfest",
    period: { id: "Feb – Nov 2025", en: "Feb – Nov 2025" },
    title: { id: "Koordinator Akademik", en: "Academic Coordinator" },
    org: "ISFEST by HIMSI UMN",
    summary: {
      id: "Memimpin kompetisi akademik nasional dan internasional kategori Data dan UI/UX, termasuk aturan dan kriteria penilaiannya.",
      en: "Led national and international academic competitions in the Data and UI/UX categories, including their rules and judging criteria.",
    },
  },
  {
    id: "himsi-academic",
    period: { id: "Des 2024 – Des 2025", en: "Dec 2024 – Dec 2025" },
    title: { id: "Anggota Divisi Akademik", en: "Academic Division Member" },
    org: "HIMSI UMN",
    summary: {
      id: "Mendukung tutoring, workshop, dan persiapan ujian, serta ikut merawat konten website resmi HIMSI.",
      en: "Supported tutoring, workshops, and exam preparation, and helped maintain the official HIMSI website.",
    },
  },
  {
    id: "lead",
    period: { id: "Nov – Des 2024", en: "Nov – Dec 2024" },
    title: { id: "Koordinator Logistik", en: "Logistics Coordinator" },
    org: "LEAD by HIMSI",
    summary: {
      id: "Memimpin pengadaan, jadwal distribusi, dan pencatatan stok acara.",
      en: "Led procurement, distribution scheduling, and stock tracking for the event.",
    },
  },
];

export const EDUCATION = {
  school: "Universitas Multimedia Nusantara",
  degree: { id: "S1 Sistem Informasi", en: "Bachelor of Information Systems" } as Localized,
  period: { id: "Agu 2023 – Sekarang", en: "Aug 2023 – Present" } as Localized,
  gpa: { id: "3,56 / 4,00", en: "3.56 / 4.00" } as Localized,
  focus: {
    id: "Big data analysis dan visualisasi data, semester 7",
    en: "Big data analysis and data visualisation, 7th semester",
  } as Localized,
};

export const CERTIFICATES = [
  { name: "Intro to Programming", issuer: "Onetwocode Indonesia", year: "2022" },
];
