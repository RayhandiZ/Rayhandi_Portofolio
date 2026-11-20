import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { CurrentYear } from "@/components/current-year";
import { Icon } from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { SplitHeadingText } from "@/components/split-heading";
import { CONTENT } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { CV_PATH, EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

/** The closing section: contact details, the form, and the footer inside the same unfolding panel. */
export function Contact({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].contact;
  // On a narrow card the address may break, and only after the @.
  const [mailbox, domain] = EMAIL.split("@");
  return (
    <section
      className="contact-section section unfold"
      id="kontak"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <div className="section-top reveal">
          <p className="eyebrow">Let’s connect</p>
          <span className="small-label">{t.tagline}</span>
        </div>
        <div className="contact-layout">
          <div className="contact-copy">
            <h2 id="contact-title">
              <SplitHeadingText heading={t.title} />
            </h2>
            <p className="reveal">{t.intro}</p>
            <div className="contact-cards reveal">
              {/* The address link covers the whole card; the copy button sits above it. */}
              <div className="contact-card">
                <span className="contact-icon">
                  <Icon name="mail" />
                </span>
                <span>
                  <strong>Email</strong>
                  <a className="contact-link" href={`mailto:${EMAIL}`}>
                    {mailbox}@<wbr />
                    {domain}
                  </a>
                </span>
                <CopyEmail lang={lang} />
              </div>
              <a className="contact-card" href={CV_PATH} download>
                <span className="contact-icon">
                  <Icon name="file" />
                </span>
                <span>
                  <strong>{t.cv.label}</strong>
                  <span>{t.cv.value}</span>
                </span>
              </a>
              <div className="contact-card">
                <span className="contact-icon">
                  <Icon name="pin" />
                </span>
                <span>
                  <strong>{t.location.label}</strong>
                  <span>{t.location.value}</span>
                  <LocalTime lang={lang} />
                </span>
              </div>
              <div className="contact-card">
                <span className="contact-icon">
                  <span className="status-dot" aria-hidden="true" />
                </span>
                <span>
                  <strong>{t.status.label}</strong>
                  <span>{t.status.value}</span>
                </span>
              </div>
            </div>
          </div>
          <ContactForm lang={lang} />
        </div>
        <div className="footer-name" aria-hidden="true">
          Rayhandi <em>Zulmi.</em>
        </div>
        <footer className="footer">
          <a className="footer-brand" href="#beranda">
            RZ
          </a>
          <p>
            © <CurrentYear /> Rayhandi Zulmi
          </p>
          <div className="footer-links">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
