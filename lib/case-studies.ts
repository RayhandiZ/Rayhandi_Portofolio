import type { Lang, Localized } from "@/lib/i18n";

/* Case studies: one page per project, in both languages. The Indonesian page lives at /proyek/<slug> and the
   English one at /en/projects/<slug> (app/(id)/proyek and app/(en)/en/projects). Every figure here has to be
   traceable to the research files; the EWS numbers come from the 15-fold artifacts that the dashboard reads,
   the 25-fold comparison in the report (table 4.24) and the governance funnel CSVs. */

/** A row of the ranked bar chart: a model's mean accuracy, or the naive guess it has to beat. */
export interface BarRow {
  name: Localized;
  note: Localized;
  /** 0 to 1. */
  value: number;
  baseline?: boolean;
}

export interface CaseFigure {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  caption: Localized;
}

interface SectionBase {
  id: string;
  /** The short name in the contents list and above the heading. */
  label: Localized;
  heading: Localized;
}

export type CaseSection =
  | (SectionBase & { kind: "prose"; body: Localized[] })
  | (SectionBase & {
      kind: "steps";
      steps: Array<{ title: Localized; body: Localized[] }>;
    })
  | (SectionBase & {
      kind: "bars";
      caption: Localized;
      valueLabel: Localized;
      rows: BarRow[];
      body: Localized[];
    })
  | (SectionBase & {
      kind: "figures";
      intro: Localized;
      figures: CaseFigure[];
      /** A list under the figures, for what they show. */
      points?: Localized[];
    })
  | (SectionBase & {
      kind: "flows";
      intro: Localized;
      columns: Array<{ title: Localized; steps: Localized[] }>;
    })
  | (SectionBase & {
      kind: "ledger";
      columns: Array<{ title: Localized; items: Localized[] }>;
    })
  | (SectionBase & { kind: "list"; intro: Localized; items: Localized[] });

export interface CaseStudy {
  /** The URL segment in both languages, and the project's id in lib/projects.tsx. */
  slug: string;
  meta: { title: Localized; description: Localized; imageAlt: Localized };
  /** The share image: the project's name and one line under it (lib/og-image.tsx). */
  og: { name: Localized; line: Localized };
  eyebrow: Localized;
  /** The heading: `lead`, then `em` in serif italic. */
  title: { lead: Localized; em: Localized };
  lede: Localized;
  facts: Array<{ term: Localized; detail: Localized }>;
  stats: Array<{ value: Localized; label: Localized }>;
  links: Array<{ label: Localized; href: string }>;
  sections: CaseSection[];
}

export const CASE_STUDY_BASE: Record<Lang, string> = { id: "/proyek", en: "/en/projects" };

export const caseStudyPath = (slug: string, lang: Lang) => `${CASE_STUDY_BASE[lang]}/${slug}`;

/** Words the case study page itself needs, outside any one study. */
export const CASE_UI: Record<
  Lang,
  { kind: string; read: string; back: string; contents: string; contact: string }
> = {
  id: {
    kind: "Studi kasus",
    read: "Baca studi kasus",
    back: "Semua project",
    contents: "Isi studi kasus",
    contact: "Diskusikan project ini",
  },
  en: {
    kind: "Case study",
    read: "Read the case study",
    back: "All projects",
    contents: "Case study contents",
    contact: "Talk about this project",
  },
};

const EWS: CaseStudy = {
  slug: "ews-ipk",
  meta: {
    title: {
      id: "Studi kasus: Early Warning System IPK",
      en: "Case study: GPA Early Warning System",
    },
    description: {
      id: "Purwarupa early warning system yang memprediksi kategori IPK dari 40 faktor di luar kampus. Semua model berhenti di bawah 70%, jadi prediksi yang meragukan diarahkan ke dosen.",
      en: "A prototype early warning system that predicts a student's GPA band from 40 factors outside campus. Every model stalled below 70%, so uncertain predictions go to a lecturer.",
    },
    imageAlt: {
      id: "Studi kasus Early Warning System IPK oleh Rayhandi Zulmi",
      en: "GPA Early Warning System case study by Rayhandi Zulmi",
    },
  },
  og: {
    name: { id: "Early Warning System IPK", en: "GPA Early Warning System" },
    line: {
      id: "Semua model berhenti di bawah 70%, jadi prediksi yang meragukan diarahkan ke dosen.",
      en: "Every model stalled below 70%, so uncertain predictions go to a lecturer.",
    },
  },
  eyebrow: { id: "MBKM Penelitian · LPPM UMN", en: "MBKM research · LPPM UMN" },
  title: {
    lead: {
      id: "Semua model berhenti di bawah 70%. Kasus yang meragukan saya",
      en: "Every model stalled below 70%, so I routed the unsure cases",
    },
    em: { id: "arahkan ke dosen.", en: "to a lecturer." },
  },
  lede: {
    id: "Purwarupa early warning system untuk memprediksi apakah IPK seorang mahasiswa masuk kategori cum laude (3,67 ke atas) atau di bawah 3,50, hanya dari kehidupannya di luar kampus: keuangan, keluarga, pekerjaan, kesehatan, dan fasilitas belajar. Dalam tim tiga mahasiswa, saya mengerjakan model deep learning dan cara mengevaluasinya.",
    en: "A prototype early warning system that predicts whether a student's GPA lands in the cum laude band (3.67 and up) or below 3.50, using only their life outside campus: money, family, work, health and study facilities. In a team of three students, I built the deep learning models and the way they were evaluated.",
  },
  facts: [
    {
      term: { id: "Peran", en: "Role" },
      detail: { id: "Deep learning & evaluasi model", en: "Deep learning & model evaluation" },
    },
    {
      term: { id: "Tim", en: "Team" },
      detail: { id: "3 mahasiswa, 3 dosen pembimbing", en: "3 students, 3 supervising lecturers" },
    },
    {
      term: { id: "Waktu", en: "When" },
      detail: { id: "Februari sampai Juli 2026", en: "February to July 2026" },
    },
    {
      term: { id: "Status", en: "Status" },
      detail: { id: "Lulus sidang, 15 Juli 2026", en: "Passed the examination, 15 July 2026" },
    },
    {
      term: { id: "Tools", en: "Tools" },
      detail: {
        id: "Python, TensorFlow/Keras, scikit-learn, Pandas, Streamlit, Plotly",
        en: "Python, TensorFlow/Keras, scikit-learn, Pandas, Streamlit, Plotly",
      },
    },
  ],
  stats: [
    {
      value: { id: "169 → 136", en: "169 → 136" },
      label: {
        id: "jawaban survei, lalu sampel bersih setelah zona ambigu dibuang",
        en: "survey answers, then clean samples once the ambiguous band was removed",
      },
    },
    {
      value: { id: "40", en: "40" },
      label: {
        id: "faktor di luar kampus, dikelompokkan ke 8 domain kehidupan",
        en: "factors from outside campus, grouped into 8 areas of life",
      },
    },
    {
      value: { id: "68,9%", en: "68.9%" },
      label: {
        id: "akurasi validasi silang terbaik, dibanding 60,3% kalau selalu menebak cum laude",
        en: "best cross-validated accuracy, against 60.3% for always guessing cum laude",
      },
    },
  ],
  links: [
    {
      label: { id: "Lihat source code dashboard", en: "View the dashboard source code" },
      href: "https://github.com/RayhandiZ/mockup_ews",
    },
  ],
  sections: [
    {
      kind: "prose",
      id: "masalah",
      label: { id: "Masalah", en: "Problem" },
      heading: {
        id: "Kampus biasanya baru tahu setelah IPK turun.",
        en: "Campuses usually find out after the GPA has dropped.",
      },
      body: [
        {
          id: "Surat peringatan akademik datang di akhir semester, saat nilai sudah tercatat. Penelitian ini bertanya apakah tandanya bisa terlihat lebih awal dari kehidupan mahasiswa di luar kelas: tekanan ekonomi keluarga, jam kerja paruh waktu, kesejahteraan psikososial, atau fasilitas belajar di rumah.",
          en: "Academic warning letters arrive at the end of a semester, once the grades are on record. This research asked whether the signs show up earlier in a student's life outside class: money pressure at home, part-time work hours, psychosocial wellbeing, or study facilities at home.",
        },
        {
          id: "Riwayat nilai sengaja tidak dipakai. Dengan begitu model hanya mengukur pengaruh kehidupan di luar kampus, walaupun itu membatasi akurasinya sejak awal.",
          en: "Past grades were left out on purpose, so the models measure only life outside campus, even though that caps their accuracy from the start.",
        },
      ],
    },
    {
      kind: "prose",
      id: "data",
      label: { id: "Data", en: "Data" },
      heading: {
        id: "169 jawaban survei, dengan nilai yang menumpuk di atas.",
        en: "169 survey answers, with grades bunched at the top.",
      },
      body: [
        {
          id: "Datanya survei 169 mahasiswa Sistem Informasi UMN. Sebagian besar IPK berada di atas 3,50, sehingga memprediksi angka IPK secara langsung gagal: regresi menghasilkan R² negatif, lebih buruk daripada menebak rata-rata.",
          en: "The data is a survey of 169 Information Systems students at UMN. Most GPAs sit above 3.50, so predicting the GPA number directly failed: regression gave a negative R², worse than guessing the average.",
        },
        {
          id: "Saya mengusulkan mengubahnya menjadi dua kelas: di bawah 3,50, dan 3,67 ke atas. Sebanyak 32 jawaban di antara keduanya dibuang karena terlalu dekat dengan batas untuk diberi label yang tegas, begitu juga satu data anomali. Tersisa 136 sampel: 54 di bawah 3,50 dan 82 cum laude.",
          en: "I proposed turning it into two classes: below 3.50, and 3.67 and up. The 32 answers in between were dropped as too close to the line for a firm label, along with one anomaly. That left 136 samples: 54 below 3.50 and 82 cum laude.",
        },
        {
          id: "Angka 60,3% menjadi patokan. Model yang selalu menebak cum laude sudah benar sesering itu tanpa belajar apa pun, jadi setiap model harus melewatinya.",
          en: "60.3% became the bar to clear. A model that always guesses cum laude is right that often without learning anything, so every model had to beat it.",
        },
      ],
    },
    {
      kind: "steps",
      id: "keputusan",
      label: { id: "Keputusan", en: "Decisions" },
      heading: { id: "Yang saya putuskan, dan alasannya.", en: "What I decided, and why." },
      steps: [
        {
          title: {
            id: "Validasi silang menjadi hasil utama, bukan data uji.",
            en: "Cross-validation is the headline result, not the test set.",
          },
          body: [
            {
              id: "Data uji hanya berisi 28 sampel, jadi satu sampel bernilai 3,6 poin persen. Angka dari data sekecil itu terlalu rapuh untuk diklaim. Setiap model saya uji dengan repeated stratified k-fold (15 putaran untuk FNN dan BiLSTM, 25 putaran untuk perbandingan model sekuensial), dan setiap angka saya laporkan bersama sebarannya.",
              en: "The test set holds 28 samples, so one sample is worth 3.6 percentage points. A number from a set that small is too fragile to claim. I tested every model with repeated stratified k-fold (15 rounds for the FNN and BiLSTM, 25 for the comparison of sequential models) and reported each figure with its spread.",
            },
          ],
        },
        {
          title: {
            id: "40 kolom ditata menjadi 8 domain kehidupan.",
            en: "40 columns arranged into 8 areas of life.",
          },
          body: [
            {
              id: "LSTM dibuat untuk data berurutan, sedangkan survei berbentuk tabel. Saya menyusun 40 faktor menjadi 8 langkah, satu per domain kehidupan, supaya LSTM membacanya sebagai urutan. Dari tiga arsitektur sekuensial yang saya bandingkan, BiLSTM + Attention unggul dengan akurasi rata-rata 67,4%, di atas LSTM standar (64,0%) dan Transformer encoder (63,3%).",
              en: "LSTMs are built for sequences, and a survey is a table. I arranged the 40 factors into 8 steps, one per area of life, so the LSTM reads them as a sequence. Of the three sequential architectures I compared, BiLSTM + Attention came first with a mean accuracy of 67.4%, ahead of a standard LSTM (64.0%) and a Transformer encoder (63.3%).",
            },
          ],
        },
        {
          title: {
            id: "Prediksi yang meragukan ditahan untuk manusia.",
            en: "Uncertain predictions are held for a person.",
          },
          body: [
            {
              id: "Dengan akurasi sekitar 67%, kira-kira satu dari tiga prediksi salah. Setiap prediksi saya saring dengan dua ukuran: seberapa tajam probabilitasnya (confidence) dan seberapa merata sebarannya (entropi). Prediksi yang gagal di keduanya masuk zona kritis dan diserahkan ke dosen pembimbing akademik.",
              en: "At around 67% accuracy, roughly one prediction in three is wrong. I filtered every prediction on two measures: how sharp its probability is (confidence) and how evenly it is split (entropy). A prediction that fails both lands in a critical zone and goes to the student's academic advisor.",
            },
            {
              id: "Dari 324 prediksi validasi silang, FNN menahan 111 (34%) dan BiLSTM menahan 156 (48%). Angka itu menunjukkan berapa banyak kasus yang tetap butuh penilaian dosen.",
              en: "Of 324 cross-validated predictions, the FNN held back 111 (34%) and the BiLSTM 156 (48%). Those counts show how many cases would still need an advisor's judgement.",
            },
          ],
        },
      ],
    },
    {
      kind: "bars",
      id: "hasil",
      label: { id: "Hasil", en: "Results" },
      heading: {
        id: "Semua arsitektur berhenti di pita yang sama.",
        en: "Every architecture stopped in the same band.",
      },
      caption: {
        id: "Akurasi rata-rata validasi silang per model. Bar abu-abu adalah tebakan naif tanpa model.",
        en: "Mean cross-validated accuracy per model. The grey bar is the naive guess with no model.",
      },
      valueLabel: { id: "Akurasi rata-rata", en: "Mean accuracy" },
      rows: [
        {
          name: { id: "FNN", en: "FNN" },
          note: { id: "15 putaran", en: "15 rounds" },
          value: 0.689,
        },
        {
          name: { id: "BiLSTM + Attention", en: "BiLSTM + Attention" },
          note: { id: "25 putaran", en: "25 rounds" },
          value: 0.6736,
        },
        {
          name: { id: "BiLSTM", en: "BiLSTM" },
          note: { id: "15 putaran", en: "15 rounds" },
          value: 0.661,
        },
        {
          name: { id: "LSTM standar", en: "Standard LSTM" },
          note: { id: "25 putaran", en: "25 rounds" },
          value: 0.64,
        },
        {
          name: { id: "Transformer encoder", en: "Transformer encoder" },
          note: { id: "25 putaran", en: "25 rounds" },
          value: 0.6327,
        },
        {
          name: { id: "Selalu menebak cum laude", en: "Always guess cum laude" },
          note: { id: "tanpa model", en: "no model" },
          value: 0.603,
          baseline: true,
        },
      ],
      body: [
        {
          id: "Selisih model terbaik dan terburuk hanya 5,6 poin, dan semuanya hanya 3 sampai 9 poin di atas tebakan naif. Model sederhana (dummy, regresi logistik, random forest) juga hanya mencapai AUC 0,55 sampai 0,61. Batasnya ada di data: 40 faktor dari 136 sampel hanya membawa sinyal sebanyak itu, dan menambah lapisan tidak mengubahnya.",
          en: "The best and worst models sit only 5.6 points apart, and all of them are just 3 to 9 points above the naive guess. Simple models (a dummy, logistic regression, a random forest) also reached an AUC of only 0.55 to 0.61. The limit is in the data: 40 factors from 136 samples carry only that much signal, and adding layers does not change it.",
        },
        {
          id: "Hasil per putaran juga lebar. Akurasi FNN bergerak dari 54,5% sampai 81% tergantung bagian data yang menjadi data uji, sehingga urutan model bisa berubah dengan pembagian data yang lain.",
          en: "Results also swing from round to round. FNN accuracy ranged from 54.5% to 81% depending on which part of the data was held out, so the ranking could change with a different split.",
        },
        {
          id: "Faktor penggeraknya pun tidak stabil. Peringkat teratas FNN dan BiLSTM berbeda, dan pada 15 faktor teratas masing-masing model, simpangan baku kepentingannya lebih besar dari rata-ratanya. Tidak ada satu faktor yang konsisten mendominasi.",
          en: "The drivers are not stable either. The FNN and BiLSTM rank different factors on top, and for each model's top 15 factors, the importance varies more across rounds than its mean. No single factor dominates consistently.",
        },
      ],
    },
    {
      kind: "figures",
      id: "dashboard",
      label: { id: "Dashboard", en: "Dashboard" },
      heading: { id: "Dashboard untuk sidang.", en: "The dashboard for the examination." },
      intro: {
        id: "Saya membangun dashboard Streamlit untuk menjelaskan alurnya di depan penguji. Halaman simulasinya menunjukkan perjalanan satu profil mahasiswa: faktor eksternal masuk, probabilitas dan entropi keluar, lalu lapisan tata kelola menentukan apakah hasilnya boleh diproses otomatis.",
        en: "I built a Streamlit dashboard to walk the examiners through the system. Its simulation page follows one student profile: external factors go in, a probability and an entropy come out, and the governance layer decides whether the result may be handled automatically.",
      },
      figures: [
        {
          src: "/images/case-studies/ews-sim-form.webp",
          width: 1140,
          height: 745,
          alt: {
            id: "Form simulasi di dashboard: sembilan isian faktor eksternal dalam tiga kelompok domain, dengan status kerja paruh waktu diisi lebih dari 20 jam per minggu.",
            en: "The simulation form on the dashboard: nine external-factor inputs in three domain groups, with part-time work set to more than 20 hours a week.",
          },
          caption: {
            id: "Profil masuk. Halaman ini berjalan dalam mode demo: skornya dihitung dari bobot permutation importance, bukan dari file model.",
            en: "A profile goes in. This page runs in demo mode: the score comes from permutation-importance weights, not from the model file. The dashboard is in Indonesian.",
          },
        },
        {
          src: "/images/case-studies/ews-sim-result.webp",
          width: 1140,
          height: 1122,
          alt: {
            id: "Hasil simulasi: probabilitas cum laude 52,2%, entropi 1,00 bit, dan status human-in-the-loop required yang menahan keputusan otomatis.",
            en: "The simulation result: a 52.2% cum laude probability, an entropy of 1.00 bit, and a human-in-the-loop required status that holds back the automatic decision.",
          },
          caption: {
            id: "Probabilitas 52,2% berarti model praktis menebak acak, jadi keputusannya ditahan dan kasusnya diserahkan ke dosen pembimbing akademik.",
            en: "A 52.2% probability means the model is close to a coin toss, so the decision is held and the case goes to the academic advisor.",
          },
        },
      ],
    },
    {
      kind: "ledger",
      id: "validasi",
      label: { id: "Validasi", en: "Validation" },
      heading: {
        id: "Yang sudah tervalidasi, dan yang belum.",
        en: "What was validated, and what wasn't.",
      },
      columns: [
        {
          title: { id: "Sudah", en: "Validated" },
          items: [
            {
              id: "Lulus sidang pada 15 Juli 2026 di hadapan dosen pembimbing dan dosen penguji.",
              en: "Passed the examination on 15 July 2026 before the supervisor and the examiner.",
            },
            {
              id: "Batas akurasi yang sama muncul di lima arsitektur dan tiga model sederhana, jadi temuannya tidak bergantung pada satu model.",
              en: "The same accuracy ceiling appears across five architectures and three simple models, so the finding does not hinge on one model.",
            },
          ],
        },
        {
          title: { id: "Belum", en: "Not yet" },
          items: [
            {
              id: "Validasinya masih internal: satu program studi, satu kampus, satu periode.",
              en: "Validation is internal only: one study program, one campus, one period.",
            },
            {
              id: "Datanya 136 jawaban survei yang diisi sendiri, jadi rentan bias jawaban.",
              en: "The data is 136 self-reported survey answers, so it is open to response bias.",
            },
            {
              id: "Data uji 28 sampel terlalu kecil untuk mendukung klaim akurasi.",
              en: "A 28-sample test set is too small to support an accuracy claim.",
            },
            {
              id: "Simulasi di dashboard belum memanggil model yang sudah dilatih.",
              en: "The dashboard simulation does not call the trained model yet.",
            },
          ],
        },
      ],
    },
    {
      kind: "list",
      id: "peran",
      label: { id: "Peran saya", en: "My part" },
      heading: { id: "Bagian yang saya kerjakan.", en: "The part I did." },
      intro: {
        id: "Tiap mahasiswa di tim memegang fokus berbeda: model ensemble, deep learning, dan evaluasi generalisasi. Saya memegang deep learning, di atas data yang pra-pemrosesan awalnya dikerjakan rekan tim.",
        en: "Each student on the team had a separate focus: ensemble models, deep learning, and generalisation testing. Mine was deep learning, on data a teammate had first preprocessed.",
      },
      items: [
        {
          id: "Membangun dan menyetel FNN, BiLSTM, dan tiga arsitektur sekuensial pembanding (LSTM standar, BiLSTM + Attention, Transformer encoder).",
          en: "Built and tuned the FNN, the BiLSTM, and three sequential architectures for comparison (standard LSTM, BiLSTM + Attention, Transformer encoder).",
        },
        {
          id: "Mengusulkan klasifikasi dua kelas dengan zona ambigu dibuang, menggantikan regresi yang gagal.",
          en: "Proposed the two-class setup with the ambiguous band removed, replacing the regression that failed.",
        },
        {
          id: "Menyusun lapisan evaluasi: repeated stratified k-fold, kalibrasi probabilitas, permutation importance, dan funnel risiko.",
          en: "Built the evaluation layer: repeated stratified k-fold, probability calibration, permutation importance and the risk funnel.",
        },
        {
          id: "Membangun dashboard Streamlit untuk sidang dan menulis laporan penelitiannya.",
          en: "Built the Streamlit dashboard for the examination and wrote the research report.",
        },
      ],
    },
  ],
};

/* DigiTask. The app screens come from a web build of github.com/RayhandiZ/DigiTask (design v1 plus the Liquid
   Glass components); the v1 and v2 frames come from the DIGITASK Figma file, page 1 (v1) and
   "Digitask v2 · Redesign". Screen counts are the files under lib/features of the repository. */
const DIGITASK: CaseStudy = {
  slug: "digitask",
  meta: {
    title: { id: "Studi kasus: DigiTask", en: "Case study: DigiTask" },
    description: {
      id: "Aplikasi mobile marketplace freelance yang saya desain di Figma dan bangun dengan Flutter: 37 layar untuk customer dan freelancer, lalu desain ulang v2.",
      en: "A freelance marketplace mobile app I designed in Figma and built in Flutter: 37 screens for customers and freelancers, followed by a v2 redesign.",
    },
    imageAlt: {
      id: "Studi kasus DigiTask oleh Rayhandi Zulmi",
      en: "DigiTask case study by Rayhandi Zulmi",
    },
  },
  og: {
    name: { id: "DigiTask", en: "DigiTask" },
    line: {
      id: "37 layar untuk dua peran, didesain di Figma, dibangun dengan Flutter, lalu didesain ulang.",
      en: "37 screens for two roles, designed in Figma, built in Flutter, then redesigned.",
    },
  },
  eyebrow: { id: "Project pribadi · Mobile app", en: "Personal project · Mobile app" },
  title: {
    lead: {
      id: "Saya mendesain dan membangun 37 layar untuk dua peran, lalu",
      en: "I designed and built 37 screens for two roles, then",
    },
    em: { id: "mendesainnya ulang.", en: "redesigned them." },
  },
  lede: {
    id: "DigiTask adalah aplikasi mobile yang mempertemukan customer dengan freelancer, dari mencari jasa sampai mengunduh hasil kerja. Saya mendesain alurnya di Figma, membangunnya dengan Flutter, mencobanya ke pengguna, dan sekarang sedang mengerjakan versi kedua desainnya.",
    en: "DigiTask is a mobile app that connects customers with freelancers, from finding a service to downloading the finished work. I designed the flows in Figma, built them in Flutter, tried the app with users, and am now working on the second version of the design.",
  },
  facts: [
    {
      term: { id: "Peran", en: "Role" },
      detail: { id: "Desain UI & pengembangan mobile", en: "UI design & mobile development" },
    },
    {
      term: { id: "Jenis", en: "Type" },
      detail: { id: "Project pribadi", en: "Personal project" },
    },
    {
      term: { id: "Aplikasi", en: "App" },
      detail: { id: "Juli sampai November 2026", en: "July to November 2026" },
    },
    {
      term: { id: "Status", en: "Status" },
      detail: {
        id: "v1 berjalan di Flutter, v2 masih di Figma",
        en: "v1 runs in Flutter, v2 is still in Figma",
      },
    },
    {
      term: { id: "Tools", en: "Tools" },
      detail: {
        id: "Figma, Flutter (Dart), SQLite, Gemini API",
        en: "Figma, Flutter (Dart), SQLite, Gemini API",
      },
    },
  ],
  stats: [
    {
      value: { id: "37", en: "37" },
      label: {
        id: "layar di aplikasi: 17 untuk customer, 10 untuk freelancer, 9 untuk masuk dan daftar, 1 notifikasi",
        en: "screens in the app: 17 for customers, 10 for freelancers, 9 for signing in and up, 1 for notifications",
      },
    },
    {
      value: { id: "2", en: "2" },
      label: {
        id: "peran dengan navigasi masing-masing, dipilih sejak layar pertama",
        en: "roles with their own navigation, chosen on the first screen",
      },
    },
    {
      value: { id: "43", en: "43" },
      label: {
        id: "frame di desain ulang v2, disusun per alur di atas satu set komponen",
        en: "frames in the v2 redesign, grouped by flow on top of one component set",
      },
    },
  ],
  links: [
    {
      label: { id: "Lihat source code", en: "View the source code" },
      href: "https://github.com/RayhandiZ/DigiTask",
    },
  ],
  sections: [
    {
      kind: "prose",
      id: "konteks",
      label: { id: "Konteks", en: "Context" },
      heading: {
        id: "Dua pengguna dengan pekerjaan yang berbeda.",
        en: "Two users with different jobs to do.",
      },
      body: [
        {
          id: "Customer datang untuk mencari jasa, memesan, membayar, lalu mengunduh hasil. Freelancer datang untuk menerima pesanan, membaca brief, mengunggah hasil, dan menarik saldo. Keduanya bertemu di chat dan di halaman pesanan, tetapi hampir semua layar lain hanya dibutuhkan oleh salah satu peran.",
          en: "Customers come to find a service, order it, pay, and download the result. Freelancers come to take orders, read briefs, upload their work and withdraw their balance. The two meet in chat and on the order page, but almost every other screen is needed by only one of them.",
        },
        {
          id: "Karena itu peran dipilih di layar pertama. Setelah masuk, customer dan freelancer mendapat navigasi bawah masing-masing: customer melihat Chat dan Pesanan, sedangkan freelancer mendapat tambahan tab Layanan untuk mengelola jasa yang ditawarkannya.",
          en: "So the role is chosen on the first screen. After signing in, customers and freelancers each get their own bottom navigation: customers see Chat and Orders, and freelancers get an extra Services tab for managing what they offer.",
        },
      ],
    },
    {
      kind: "flows",
      id: "alur",
      label: { id: "Alur", en: "Flows" },
      heading: { id: "Dua alur yang bertemu di pesanan.", en: "Two flows that meet at the order." },
      intro: {
        id: "Urutan di bawah mengikuti layar-layar yang ada di aplikasi.",
        en: "The steps below follow the screens in the app.",
      },
      columns: [
        {
          title: { id: "Customer", en: "Customer" },
          steps: [
            {
              id: "Mencari jasa lewat beranda, kategori, atau pencarian.",
              en: "Find a service from the home screen, a category, or search.",
            },
            {
              id: "Membuka detail freelancer: harga, estimasi waktu, dan jumlah revisi.",
              en: "Open a freelancer's details: price, estimated time and number of revisions.",
            },
            {
              id: "Bertanya lewat chat, ke freelancer atau ke chatbot.",
              en: "Ask questions in chat, to the freelancer or to the chatbot.",
            },
            {
              id: "Memesan dan membayar dengan transfer bank, QRIS, atau kartu kredit.",
              en: "Order and pay by bank transfer, QRIS or credit card.",
            },
            {
              id: "Memantau pesanan yang sedang berjalan.",
              en: "Follow the order while it is in progress.",
            },
            {
              id: "Melihat dan mengunduh hasil kerja.",
              en: "View and download the finished work.",
            },
          ],
        },
        {
          title: { id: "Freelancer", en: "Freelancer" },
          steps: [
            { id: "Melihat pesanan yang masuk.", en: "See incoming orders." },
            { id: "Membaca brief dari client.", en: "Read the client's brief." },
            { id: "Mengobrol dengan client.", en: "Chat with the client." },
            { id: "Mengunggah hasil kerja.", en: "Upload the finished work." },
            { id: "Mengelola layanan yang ditawarkan.", en: "Manage the services on offer." },
            {
              id: "Melihat saldo dan riwayat invoice, lalu menarik dana.",
              en: "Check the balance and invoice history, then withdraw.",
            },
          ],
        },
      ],
    },
    {
      kind: "figures",
      id: "aplikasi",
      label: { id: "Aplikasi", en: "The app" },
      heading: { id: "Yang sudah berjalan di Flutter.", en: "What runs in Flutter today." },
      intro: {
        id: "Gambar di bawah diambil dari build web aplikasinya, jadi ini tampilan dari kode yang sebenarnya. Navigasi bawah dan tombol kembalinya memakai komponen Liquid Glass yang saya buat sendiri.",
        en: "The images below come from a web build of the app, so they show what the code actually renders. The bottom navigation and the back buttons use Liquid Glass components I built myself.",
      },
      figures: [
        {
          src: "/images/case-studies/digitask-app-customer.webp",
          width: 1520,
          height: 1067,
          alt: {
            id: "Tiga layar aplikasi DigiTask untuk customer: beranda dengan pencarian dan delapan kategori, detail freelancer dengan harga, estimasi, dan jumlah revisi, serta pilihan metode pembayaran.",
            en: "Three DigiTask customer screens: the home screen with search and eight categories, a freelancer's details with price, estimate and revisions, and the choice of payment method.",
          },
          caption: {
            id: "Alur customer: beranda, detail freelancer, lalu pembayaran dengan transfer bank, QRIS, atau kartu kredit.",
            en: "The customer flow: home, a freelancer's details, then payment by bank transfer, QRIS or credit card. The app is in Indonesian.",
          },
        },
        {
          src: "/images/case-studies/digitask-app-money.webp",
          width: 1520,
          height: 1067,
          alt: {
            id: "Tiga layar aplikasi: pembayaran QRIS untuk customer, saldo dan riwayat invoice freelancer dengan tombol Tarik Dana, serta detail pesanan yang sedang berjalan.",
            en: "Three app screens: QRIS payment for the customer, the freelancer's balance and invoice history with a Withdraw button, and the details of an order in progress.",
          },
          caption: {
            id: "Membayar dengan QRIS dan menarik saldo sama-sama meminta verifikasi biometrik sebelum lanjut.",
            en: "Paying by QRIS and withdrawing a balance both ask for biometric verification before they go ahead.",
          },
        },
      ],
    },
    {
      kind: "steps",
      id: "keputusan",
      label: { id: "Keputusan", en: "Decisions" },
      heading: { id: "Yang saya putuskan saat membangunnya.", en: "What I decided while building it." },
      steps: [
        {
          title: {
            id: "Uang baru bergerak setelah verifikasi biometrik.",
            en: "Money moves only after a biometric check.",
          },
          body: [
            {
              id: "Konfirmasi pembayaran QRIS dan penarikan saldo membuka lembar verifikasi Face ID atau sidik jari. Kalau gagal, pengguna bisa mencoba lagi atau membatalkan. Di perangkat tanpa sensor biometrik, versi demo ini memberi tahu pengguna lalu melewati verifikasinya.",
              en: "Confirming a QRIS payment or a withdrawal opens a Face ID or fingerprint sheet. If the check fails, the user can try again or cancel. On devices without a biometric sensor, this demo version says so and skips the check.",
            },
          ],
        },
        {
          title: {
            id: "Password tidak pernah disimpan apa adanya.",
            en: "Passwords are never stored as typed.",
          },
          body: [
            {
              id: "Akun disimpan di SQLite pada perangkat. Setiap akun mendapat salt acak, dan yang disimpan hanya hash SHA-256 dari salt dan password.",
              en: "Accounts live in SQLite on the device. Each account gets a random salt, and only the SHA-256 hash of the salt and password is stored.",
            },
          ],
        },
        {
          title: {
            id: "Komponen Liquid Glass saya tulis sendiri, lengkap dengan test.",
            en: "I wrote the Liquid Glass components myself, with tests.",
          },
          body: [
            {
              id: "Permukaannya hampir bening dengan pantulan cahaya di tepi, dan geraknya memakai pegas yang sedikit memantul sebelum diam. Tujuh widget test menjaga perilaku tab-nya, misalnya tab hanya berpindah saat jari dilepas dan gelembungnya tetap mengikuti seretan yang cepat. Dua test lain memastikan grid kategori tidak meluap di layar sempit.",
              en: "The surface is nearly clear with light on its edges, and it moves on a spring that overshoots slightly before it settles. Seven widget tests guard how the tabs behave, for example a tab changes only when the finger lifts, and the bubble keeps up with a fast drag. Two more tests check that the category grid does not overflow on narrow screens.",
            },
          ],
        },
        {
          title: {
            id: "Chatbot Gemini menjawab di dalam chat.",
            en: "A Gemini chatbot answers inside the chat.",
          },
          body: [
            {
              id: "Customer bisa bertanya ke asisten virtual DigiTask di layar chat. API key-nya diberikan saat build lewat dart-define, sehingga tidak ikut tersimpan di repository publik.",
              en: "Customers can ask DigiTask's virtual assistant questions on the chat screen. Its API key is passed in at build time with dart-define, so it never sits in the public repository.",
            },
          ],
        },
      ],
    },
    {
      kind: "figures",
      id: "desain-ulang",
      label: { id: "Desain ulang", en: "Redesign" },
      heading: { id: "v2: yang saya ubah di Figma.", en: "v2: what I changed in Figma." },
      intro: {
        id: "Setelah aplikasinya berjalan, saya mulai mendesain ulang semua layar di halaman Figma yang terpisah. Versi kedua ini masih dikerjakan dan belum masuk ke aplikasi.",
        en: "Once the app was running, I started redesigning every screen on a separate Figma page. This second version is still in progress and is not in the app yet.",
      },
      figures: [
        {
          src: "/images/case-studies/digitask-v1-v2.webp",
          width: 1520,
          height: 866,
          alt: {
            id: "Perbandingan frame Figma v1 dan v2 untuk beranda customer dan pembayaran QRIS. Beranda v2 punya kolom pencarian, bagian Expert populer, dan navigasi berlabel. QRIS v2 berjudul Bayar dengan QRIS, tanpa navigasi bawah, dengan batas waktu di chip tersendiri.",
            en: "Figma frames of v1 and v2 side by side for the customer home screen and QRIS payment. The v2 home has a search field, a Popular experts section and labelled navigation. The v2 QRIS screen is titled Bayar dengan QRIS, has no bottom navigation, and shows the time limit in its own chip.",
          },
          caption: {
            id: "Beranda dan pembayaran QRIS, v1 dan v2, langsung dari file Figma.",
            en: "The home screen and QRIS payment, v1 and v2, straight from the Figma file.",
          },
        },
        {
          src: "/images/case-studies/digitask-v2-components.webp",
          width: 1680,
          height: 1500,
          alt: {
            id: "Bagian Komponen di Figma v2: status bar, tombol dalam beberapa gaya dan ukuran, app bar, chip, kartu paket harga, navigasi bawah customer dan freelancer dengan lima state aktif, dan tiga logo contoh.",
            en: "The Components section of Figma v2: status bar, buttons in several styles and sizes, app bar, chip, price package card, customer and freelancer bottom navigation with five active states, and three sample logos.",
          },
          caption: {
            id: "Bagian Komponen di v2. Di v1 belum ada; garis pemisah pun digambar sebagai persegi panjang satu per satu.",
            en: "The Components section in v2. v1 had none; even the dividers were drawn as separate rectangles.",
          },
        },
      ],
      points: [
        {
          id: "Navigasi bawah mendapat label teks dan penanda tab aktif. Di v1 hanya ada ikon.",
          en: "The bottom navigation gained text labels and a marker for the active tab. v1 had icons only.",
        },
        {
          id: "Kolom pencarian dengan tombol filter pindah ke bagian atas beranda, dan beranda mendapat bagian Expert populer.",
          en: "A search field with a filter button moved to the top of the home screen, which also gained a Popular experts section.",
        },
        {
          id: "Teks di layar pembayaran diseragamkan ke bahasa Indonesia: Payment QRIS menjadi Bayar dengan QRIS, Download QR menjadi Unduh QR.",
          en: "The payment screen copy is now all Indonesian: Payment QRIS became Bayar dengan QRIS, Download QR became Unduh QR.",
        },
        {
          id: "Navigasi bawah disembunyikan di layar pembayaran, nominal tidak lagi ditulis merah, dan batas waktunya pindah ke chip tersendiri.",
          en: "The bottom navigation is hidden on the payment screen, the amount is no longer red, and the time limit moved into its own chip.",
        },
        {
          id: "Komponen dibuat sekali di bagian Komponen: tombol dalam tiga gaya dan dua ukuran beserta state tekannya, navigasi bawah untuk tiap peran dengan lima state, chip, dan kartu paket harga.",
          en: "Components are drawn once in a Components section: buttons in three styles and two sizes with their pressed states, bottom navigation for each role with five states, a chip and a price package card.",
        },
        {
          id: "Frame disusun per alur dengan nama yang konsisten: Komponen, Onboarding & Autentikasi, Customer, dan Freelancer.",
          en: "Frames are grouped by flow with consistent names: Components, Onboarding & Authentication, Customer and Freelancer.",
        },
      ],
    },
    {
      kind: "ledger",
      id: "validasi",
      label: { id: "Validasi", en: "Validation" },
      heading: { id: "Yang sudah teruji, dan yang belum.", en: "What has been tested, and what hasn't." },
      columns: [
        {
          title: { id: "Sudah", en: "Done" },
          items: [
            { id: "Sudah dicoba langsung ke pengguna.", en: "Tried with users." },
            {
              id: "37 layar berjalan di Flutter, dengan 9 widget test untuk komponen kaca dan tata letak kategori.",
              en: "37 screens run in Flutter, with 9 widget tests for the glass components and the category layout.",
            },
          ],
        },
        {
          title: { id: "Belum", en: "Not yet" },
          items: [
            {
              id: "Data freelancer, pesanan, dan chat masih data contoh. Belum ada server.",
              en: "Freelancers, orders and chats are sample data. There is no server yet.",
            },
            {
              id: "Akun masih tersimpan lokal di satu perangkat.",
              en: "Accounts are still stored locally on one device.",
            },
            {
              id: "Pembayaran QRIS masih simulasi, belum terhubung ke payment gateway.",
              en: "QRIS payment is a simulation, not yet connected to a payment gateway.",
            },
            {
              id: "Di perangkat tanpa sensor biometrik, verifikasi masih dilewati.",
              en: "On devices without a biometric sensor, verification is still skipped.",
            },
            {
              id: "Desain v2 belum diimplementasikan di aplikasi.",
              en: "The v2 design is not in the app yet.",
            },
          ],
        },
      ],
    },
    {
      kind: "list",
      id: "peran",
      label: { id: "Peran saya", en: "My part" },
      heading: { id: "Bagian yang saya kerjakan.", en: "The part I did." },
      intro: {
        id: "Ini project pribadi, jadi desain dan kodenya saya kerjakan sendiri.",
        en: "This is a personal project, so I did both the design and the code.",
      },
      items: [
        {
          id: "Mendesain v1 dan v2 di Figma, termasuk set komponen v2.",
          en: "Designed v1 and v2 in Figma, including the v2 component set.",
        },
        {
          id: "Membangun 37 layar dengan Flutter untuk dua peran.",
          en: "Built 37 screens in Flutter for two roles.",
        },
        {
          id: "Menulis autentikasi lokal, verifikasi biometrik, alur QRIS, dan integrasi chatbot Gemini.",
          en: "Wrote the local authentication, biometric verification, QRIS flow and Gemini chatbot integration.",
        },
        {
          id: "Membuat komponen Liquid Glass beserta widget test-nya.",
          en: "Built the Liquid Glass components and their widget tests.",
        },
      ],
    },
  ],
};

/** Keyed by slug. Each needs a page and a share image in both app/(id)/proyek and app/(en)/en/projects. */
export const CASE_STUDIES = { "ews-ipk": EWS, digitask: DIGITASK } satisfies Record<string, CaseStudy>;
