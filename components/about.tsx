import { Mark } from "@/components/icons";

const FACTS = [
  { term: "Berbasis di", detail: "Kab. Tangerang, Indonesia" },
  { term: "Saat ini", detail: "Internship di Universitas Multimedia Nusantara" },
];

// Kept from the earlier portfolio; lib/motion.ts counts each number up when it is first seen.
const STATS = [
  { count: 15, label: "Project selesai" },
  { count: 3, label: "Tahun berkarya" },
  { count: 10, label: "Teknologi" },
];

export function About() {
  return (
    <section
      className="about-section section unfold"
      id="tentang"
      aria-labelledby="about-title"
    >
      <div className="container about-layout">
        <div className="about-aside">
          <p className="eyebrow">A little about me</p>
          <div className="about-monogram" aria-hidden="true">
            r<span>z</span>
            <Mark spin={0.28} />
          </div>
          <p className="aside-caption">
            Rasa ingin tahu sebagai awal.
            <br />
            Detail sebagai pembeda.
          </p>
        </div>
        <div className="about-copy">
          <h2 id="about-title">
            Di balik setiap baris kode<span className="tuck">,</span> ada{" "}
            <em>rasa ingin tahu.</em>
          </h2>
          <p className="about-lead" id="aboutLead">
            Saya Rayhandi, mahasiswa Sistem Informasi yang percaya bahwa detail
            kecil membuat perbedaan besar.
          </p>
          <div className="about-body">
            <p className="reveal">
              Berawal dari rasa penasaran tentang cara kerja website, saya kini
              membangun aplikasi web, antarmuka, dan dashboard real-time. Saya
              senang mengubah ide menjadi produk nyata dengan menjembatani
              pengolahan data, pengembangan web, dan desain UI/UX.
            </p>
            <p className="reveal">
              Di luar menulis kode, saya mengeksplorasi teknologi baru dan
              mengasah kepekaan visual. Bagi saya, solusi yang baik bukan hanya
              fungsional, tetapi juga mudah dipahami.
            </p>
          </div>
          <dl className="about-facts reveal">
            {FACTS.map(({ term, detail }) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
          <div className="stats reveal">
            {STATS.map(({ count, label }) => (
              <div className="stat" key={label}>
                <strong>
                  <span data-count={count}>{count}</span>+
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
