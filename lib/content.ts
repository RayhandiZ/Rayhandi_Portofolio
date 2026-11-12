import type { Lang } from "@/lib/i18n";
import type { NavSectionId } from "@/lib/site";

/* Every visible text of the page, in both languages. Labels that the Indonesian page already shows in
   English ("Selected work", "Let's connect", the discipline band) stay the same in both and live in the
   components. Project texts live with the projects in lib/projects.tsx. */

/** A heading that ends in serif italic: `lead`, an optional tucked punctuation mark, then `em`. */
export interface SplitHeading {
  lead: string;
  tuck?: string;
  /** Words between the tucked mark and the serif part, on the same line. */
  joiner?: string;
  em: string;
  /** Put the serif part on its own line. */
  breakBefore?: boolean;
}

export interface Content {
  meta: { description: string };
  skipLink: string;
  nav: {
    sections: Record<NavSectionId, string>;
    contact: string;
    homeLabel: string;
    mainLabel: string;
    tabsLabel: string;
    openMenu: string;
    closeMenu: string;
    languageLabel: string;
  };
  hero: {
    eyebrow: string;
    rolesForScreenReaders: string;
    statement: { before: string; highlight: string; after: string };
    explore: string;
    meet: string;
    portraitAlt: string;
    note: { lead: string; em: string };
  };
  work: {
    tagline: string;
    title: SplitHeading;
    intro: string;
    filterLabel: string;
    filters: { all: string; web: string; app: string };
    status: (shown: number) => string;
    more: string;
  };
  about: {
    caption: [string, string];
    title: SplitHeading;
    lead: string;
    body: [string, string];
    facts: Array<{ term: string; detail: string }>;
    stats: [string, string, string];
  };
  skills: {
    tagline: string;
    title: SplitHeading;
    intro: string;
    quote: string;
    summaries: [string, string, string];
    levelsTitle: string;
    levelsNote: string;
  };
  contact: {
    tagline: string;
    title: SplitHeading;
    intro: string;
    location: { label: string; value: string };
    status: { label: string; value: string };
    form: {
      title: { lead: string; tuck: string };
      name: string;
      email: string;
      message: string;
      submit: string;
      hint: string;
      blank: string;
      ready: string;
      reopen: string;
      noScript: string;
      subject: (name: string) => string;
      greeting: string;
      signOff: string;
    };
  };
  toTop: string;
}

export const CONTENT: Record<Lang, Content> = {
  id: {
    meta: {
      description:
        "Rayhandi Zulmi — Web Developer, UI/UX Designer & Data Analyst. Project web, dashboard, dan aplikasi yang menghubungkan data dengan pengalaman pengguna.",
    },
    skipLink: "Lewati ke konten",
    nav: {
      sections: {
        beranda: "Beranda",
        project: "Project",
        tentang: "Tentang",
        keahlian: "Keahlian",
      },
      contact: "Mari berdiskusi",
      homeLabel: "Rayhandi Zulmi, beranda",
      mainLabel: "Navigasi utama",
      tabsLabel: "Bagian halaman",
      openMenu: "Buka menu",
      closeMenu: "Tutup menu",
      languageLabel: "Bahasa",
    },
    hero: {
      eyebrow: "Hai, saya",
      rolesForScreenReaders:
        "Web developer, UI/UX designer, data analyst, dan dashboard builder.",
      statement: {
        before: "Menghubungkan",
        highlight: "data, desain,",
        after:
          "dan pengalaman digital. Dari antarmuka web hingga dashboard real-time, saya merancang solusi yang bekerja dengan baik dan terasa nyaman digunakan.",
      },
      explore: "Jelajahi project",
      meet: "Kenali saya",
      portraitAlt: "Rayhandi Zulmi berdiri di tepi pantai",
      note: { lead: "Logika yang terstruktur.", em: "Sentuhan yang personal." },
    },
    work: {
      tagline: "Ide menjadi sesuatu yang nyata.",
      title: {
        lead: "Dibangun dengan logika",
        tuck: ".",
        em: "Dirancang dengan rasa.",
        breakBefore: true,
      },
      intro:
        "Beberapa project yang mempertemukan pengembangan, data, dan desain.",
      filterLabel: "Filter project",
      filters: { all: "Semua", web: "Web", app: "Aplikasi" },
      status: (shown) => `${shown} project ditampilkan`,
      more: "Eksplorasi lainnya ada di GitHub.",
    },
    about: {
      caption: ["Rasa ingin tahu sebagai awal.", "Detail sebagai pembeda."],
      title: {
        lead: "Di balik setiap baris kode",
        tuck: ",",
        joiner: "ada",
        em: "rasa ingin tahu.",
      },
      lead: "Saya Rayhandi, mahasiswa Sistem Informasi yang percaya bahwa detail kecil membuat perbedaan besar.",
      body: [
        "Berawal dari rasa penasaran tentang cara kerja website, saya kini membangun aplikasi web, antarmuka, dan dashboard real-time. Saya senang mengubah ide menjadi produk nyata dengan menjembatani pengolahan data, pengembangan web, dan desain UI/UX.",
        "Di luar menulis kode, saya mengeksplorasi teknologi baru dan mengasah kepekaan visual. Bagi saya, solusi yang baik bukan hanya fungsional, tetapi juga mudah dipahami.",
      ],
      facts: [
        { term: "Berbasis di", detail: "Kab. Tangerang, Indonesia" },
        {
          term: "Saat ini",
          detail: "Internship di Universitas Multimedia Nusantara",
        },
      ],
      stats: ["Project selesai", "Tahun berkarya", "Teknologi"],
    },
    skills: {
      tagline: "Selalu ada hal baru untuk dipelajari.",
      title: {
        lead: "Satu ide",
        tuck: ".",
        em: "Banyak kemungkinan.",
        breakBefore: true,
      },
      intro:
        "Perpaduan kemampuan teknis dan kepekaan desain untuk membangun pengalaman digital secara menyeluruh.",
      quote:
        "“Teknologi selalu berubah, yang saya jaga adalah rasa ingin tahu dan kemauan untuk terus belajar.”",
      summaries: [
        "Antarmuka interaktif untuk web dan mobile.",
        "Dari pengolahan data ke dashboard real-time.",
        "Detail visual dan alur kerja yang terstruktur.",
      ],
      levelsTitle: "Penilaian kemampuan pribadi",
      levelsNote: "Penilaian mandiri dari portofolio awal.",
    },
    contact: {
      tagline: "Punya project, ide, atau peluang kolaborasi?",
      title: { lead: "Ide bagus dimulai dari", em: "percakapan." },
      intro:
        "Saya selalu terbuka untuk diskusi, kolaborasi, maupun peluang baru. Saya ingin mendengar idemu.",
      location: { label: "Lokasi", value: "Kab. Tangerang, Indonesia" },
      status: { label: "Status", value: "Tersedia untuk freelance" },
      form: {
        title: { lead: "Mari mulai sesuatu", tuck: "." },
        name: "Nama",
        email: "Email",
        message: "Ceritakan idemu",
        submit: "Buka aplikasi email",
        hint: "Form ini menyiapkan draft di aplikasi email, bukan mengirim pesan langsung.",
        blank: "Mohon isi kolom ini, bukan hanya spasi.",
        ready:
          "Draft siap dibuka; pesan belum terkirim. Kirim melalui aplikasi email kamu. Jika tidak terbuka, atur aplikasi email default atau gunakan alamat email di samping.",
        reopen: "Buka ulang draft email",
        noScript:
          "Aktifkan JavaScript untuk menggunakan form, atau hubungi melalui tautan email.",
        subject: (name) => `Pesan dari ${name} — Website Portofolio`,
        greeting: "Halo Rayhandi,",
        signOff: "Salam,",
      },
    },
    toTop: "Kembali ke atas",
  },

  en: {
    meta: {
      description:
        "Rayhandi Zulmi — Web Developer, UI/UX Designer & Data Analyst. Web projects, dashboards, and apps that connect data with the people who use them.",
    },
    skipLink: "Skip to content",
    nav: {
      sections: {
        beranda: "Home",
        project: "Projects",
        tentang: "About",
        keahlian: "Skills",
      },
      contact: "Let’s talk",
      homeLabel: "Rayhandi Zulmi, home",
      mainLabel: "Main navigation",
      tabsLabel: "Page sections",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      languageLabel: "Language",
    },
    hero: {
      eyebrow: "Hi, I’m",
      rolesForScreenReaders:
        "Web developer, UI/UX designer, data analyst, and dashboard builder.",
      statement: {
        before: "Connecting",
        highlight: "data, design,",
        after:
          "and digital experiences. From web interfaces to real-time dashboards, I build solutions that work well and feel good to use.",
      },
      explore: "Explore projects",
      meet: "Get to know me",
      portraitAlt: "Rayhandi Zulmi standing on a beach",
      note: { lead: "Structured logic.", em: "A personal touch." },
    },
    work: {
      tagline: "Ideas, made real.",
      title: {
        lead: "Built with logic",
        tuck: ".",
        em: "Designed with feeling.",
        breakBefore: true,
      },
      intro: "A few projects where development, data, and design meet.",
      filterLabel: "Filter projects",
      filters: { all: "All", web: "Web", app: "Apps" },
      status: (shown) => `${shown} ${shown === 1 ? "project" : "projects"} shown`,
      more: "More experiments live on GitHub.",
    },
    about: {
      caption: ["Curiosity to begin with.", "Detail to set it apart."],
      title: {
        lead: "Behind every line of code",
        tuck: ",",
        joiner: "there is",
        em: "curiosity.",
      },
      lead: "I’m Rayhandi, an Information Systems student who believes small details make a big difference.",
      body: [
        "It started with wondering how websites work. Now I build web apps, interfaces, and real-time dashboards, and I enjoy turning ideas into real products by bridging data processing, web development, and UI/UX design.",
        "Beyond writing code, I explore new technology and sharpen my eye for visuals. To me, a good solution is not only functional but also easy to understand.",
      ],
      facts: [
        { term: "Based in", detail: "Tangerang Regency, Indonesia" },
        { term: "Currently", detail: "Intern at Universitas Multimedia Nusantara" },
      ],
      stats: ["Projects completed", "Years of building", "Technologies"],
    },
    skills: {
      tagline: "There’s always something new to learn.",
      title: {
        lead: "One idea",
        tuck: ".",
        em: "Many possibilities.",
        breakBefore: true,
      },
      intro:
        "Technical skill and an eye for design, combined to build digital experiences from end to end.",
      quote:
        "“Technology keeps changing. What I hold on to is curiosity and the will to keep learning.”",
      summaries: [
        "Interactive interfaces for web and mobile.",
        "From data processing to real-time dashboards.",
        "Visual detail and a structured workflow.",
      ],
      levelsTitle: "Self-assessed skill levels",
      levelsNote: "Self-assessment carried over from the first portfolio.",
    },
    contact: {
      tagline: "Have a project, an idea, or a chance to collaborate?",
      title: { lead: "Good ideas start with a", em: "conversation." },
      intro:
        "I’m always open to discussions, collaborations, and new opportunities. I’d love to hear your idea.",
      location: { label: "Location", value: "Tangerang Regency, Indonesia" },
      status: { label: "Status", value: "Available for freelance work" },
      form: {
        title: { lead: "Let’s start something", tuck: "." },
        name: "Name",
        email: "Email",
        message: "Tell me your idea",
        submit: "Open email app",
        hint: "This form prepares a draft in your email app. It does not send the message itself.",
        blank: "Please fill in this field with more than spaces.",
        ready:
          "Your draft is ready to open; the message has not been sent yet. Send it from your email app. If nothing opened, set a default email app or use the email address on this page.",
        reopen: "Reopen the email draft",
        noScript:
          "Turn on JavaScript to use this form, or get in touch through the email link.",
        subject: (name) => `Message from ${name} — Portfolio website`,
        greeting: "Hi Rayhandi,",
        signOff: "Best regards,",
      },
    },
    toTop: "Back to top",
  },
};
