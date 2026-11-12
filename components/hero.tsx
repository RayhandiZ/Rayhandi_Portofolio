import Image from "next/image";
import { GlassButton } from "@zakisheriff/liquid-glass";
import { Arrow } from "@/components/arrow";
import { Icon, Mark } from "@/components/icons";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/site";
import portrait from "@/public/images/rayhandi-pantai.jpeg";

export function Hero() {
  return (
    <section className="hero-stage" id="beranda" aria-labelledby="hero-title">
      <canvas className="hero-canvas" id="heroCanvas" aria-hidden="true" />
      <div className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">Hai, saya</p>
          <h1 id="hero-title">
            <span className="name-line">
              <span className="name-first">Rayhandi</span>
            </span>{" "}
            <span className="name-line">
              <em>Zulmi.</em>
            </span>
          </h1>
          <p className="hero-role">
            <span className="sr-only">
              Web developer, UI/UX designer, data analyst, dan dashboard
              builder.
            </span>
            <span aria-hidden="true">
              <span id="typedRole">Web Developer</span>
              <span className="caret" />
            </span>
          </p>
          <p className="hero-statement">
            Menghubungkan <span>data, desain,</span> dan pengalaman digital.
            Dari antarmuka web hingga dashboard real-time, saya merancang
            solusi yang bekerja dengan baik dan terasa nyaman digunakan.
          </p>
          <div className="hero-actions">
            <GlassButton
              href="#project"
              variant="filled"
              size="lg"
              className="button button-solid"
            >
              Jelajahi project <Arrow glyph="↓" />
            </GlassButton>
            <GlassButton
              href="#tentang"
              variant="clear"
              size="lg"
              tint="var(--sea-light)"
              className="button"
            >
              Kenali saya
            </GlassButton>
            <div className="hero-socials">
              <GlassButton
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="clear"
                aria-label="GitHub"
                icon={<Icon name="github" />}
              />
              <GlassButton
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="clear"
                aria-label="LinkedIn"
                icon={<Icon name="linkedin" />}
              />
              <GlassButton
                href={`mailto:${EMAIL}`}
                variant="clear"
                aria-label="Email"
                icon={<Icon name="mail" />}
              />
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <figure className="portrait">
            <div className="portrait-rim" id="portraitRim">
              <div className="portrait-frame">
                <Image
                  src={portrait}
                  alt="Rayhandi Zulmi berdiri di tepi pantai"
                  width={720}
                  height={960}
                  sizes="(max-width: 760px) 100vw, 48vw"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
            <figcaption>
              <span>The person behind the pixels</span>
              <a
                className="text-link"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore my GitHub <Arrow glyph="↗" />
              </a>
            </figcaption>
          </figure>
          <div className="portrait-note">
            <Mark spin={0.22} />
            <p>
              Logika yang terstruktur.
              <br />
              <em>Sentuhan yang personal.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DisciplineBand() {
  return (
    <div className="discipline-band">
      <div className="discipline-track" id="disciplineTrack">
        <div className="discipline-set">
          <span>Web development</span>
          <Mark spin={0.3} />
          <em>UI/UX design</em>
          <Mark spin={0.3} />
          <span>Data analytics</span>
          <Mark spin={0.3} />
          <em>Dashboard</em>
          <Mark spin={0.3} />
        </div>
      </div>
    </div>
  );
}
