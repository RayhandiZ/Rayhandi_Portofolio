import { ContactForm } from "@/components/contact-form";
import { CurrentYear } from "@/components/current-year";
import { Icon } from "@/components/icons";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

/** The closing section: contact details, the form, and the footer inside the same unfolding panel. */
export function Contact() {
  return (
    <section
      className="contact-section section unfold"
      id="kontak"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <div className="section-top reveal">
          <p className="eyebrow">Let’s connect</p>
          <span className="small-label">
            Punya project, ide, atau peluang kolaborasi?
          </span>
        </div>
        <div className="contact-layout">
          <div className="contact-copy">
            <h2 id="contact-title">
              Ide bagus dimulai dari <em>percakapan.</em>
            </h2>
            <p className="reveal">
              Saya selalu terbuka untuk diskusi, kolaborasi, maupun peluang
              baru. Saya ingin mendengar idemu.
            </p>
            <div className="contact-cards reveal">
              <a className="contact-card" href={`mailto:${EMAIL}`}>
                <span className="contact-icon">
                  <Icon name="mail" />
                </span>
                <span>
                  <strong>Email</strong>
                  <span>{EMAIL}</span>
                </span>
              </a>
              <div className="contact-card">
                <span className="contact-icon">
                  <Icon name="pin" />
                </span>
                <span>
                  <strong>Lokasi</strong>
                  <span>Kab. Tangerang, Indonesia</span>
                </span>
              </div>
              <div className="contact-card">
                <span className="contact-icon">
                  <span className="status-dot" aria-hidden="true" />
                </span>
                <span>
                  <strong>Status</strong>
                  <span>Tersedia untuk freelance</span>
                </span>
              </div>
            </div>
          </div>
          <ContactForm />
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
