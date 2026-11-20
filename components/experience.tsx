import { Arrow } from "@/components/arrow";
import { SplitHeadingText } from "@/components/split-heading";
import { CONTENT } from "@/lib/content";
import { CERTIFICATES, EDUCATION, ORGANISATIONS, ROLES } from "@/lib/experience";
import type { Lang } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import { CV_PATH } from "@/lib/site";

/** Work, organisations and education from the CV, the CV itself, a reference letter quote beside its role, and the
    certificates. It follows About, and the header keeps the About tab lit here instead of growing a tab of its own. */
export function Experience({ lang }: { lang: Lang }) {
  const t = CONTENT[lang].experience;
  return (
    <section
      className="experience-section section container"
      id="pengalaman"
      aria-labelledby="experience-title"
    >
      <div className="section-top reveal">
        <p className="eyebrow">Experience & education</p>
        <span className="small-label">{t.tagline}</span>
      </div>
      <div className="experience-layout">
        <div className="experience-intro">
          <h2 id="experience-title">
            <SplitHeadingText heading={t.title} />
          </h2>
          <p className="reveal">{t.intro}</p>
          <a className="text-link cv-link reveal" href={CV_PATH} download>
            {t.cv} <Arrow glyph="↓" />
          </a>
          <div className="education reveal">
            <h3>{t.education}</h3>
            <p className="education-school">{EDUCATION.school}</p>
            <p className="education-degree">
              {EDUCATION.degree[lang]}, {EDUCATION.period[lang]}
            </p>
            <dl>
              <div>
                <dt>{t.gpa}</dt>
                <dd>{EDUCATION.gpa[lang]}</dd>
              </div>
              <div>
                <dt>{t.focus}</dt>
                <dd>{EDUCATION.focus[lang]}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="roles">
          <ol className="role-list">
            {ROLES.map((role) => {
              const project = PROJECTS.find(({ id }) => id === role.project);
              return (
                <li className="role reveal" key={role.id}>
                  <p className="role-when">{role.period[lang]}</p>
                  <h3>{role.title[lang]}</h3>
                  <p className="role-org">{role.org}</p>
                  <ul className="role-points">
                    {role.points.map((point) => (
                      <li key={point.en}>{point[lang]}</li>
                    ))}
                  </ul>
                  <div className="tags">
                    {role.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {project && (
                    <a className="role-project" href={`#project-${project.id}`}>
                      {t.seeProject(project.name[lang])}
                    </a>
                  )}
                  {role.reference && (
                    <figure className="role-reference">
                      <blockquote lang={role.reference.lang}>
                        <p>“{role.reference.quote}”</p>
                      </blockquote>
                      <figcaption>
                        <strong>{role.reference.name}</strong>, {role.reference.title}
                        <span>{t.reference(role.reference.date[lang])}</span>
                      </figcaption>
                    </figure>
                  )}
                </li>
              );
            })}
          </ol>
          <h3 className="orgs-title reveal">{t.organisations}</h3>
          <ul className="org-list">
            {ORGANISATIONS.map((item) => (
              <li className="org reveal" key={item.id}>
                <div className="org-head">
                  <strong>{item.title[lang]}</strong>
                  <span>{item.org}</span>
                  <span className="role-when">{item.period[lang]}</span>
                </div>
                <p>{item.summary[lang]}</p>
              </li>
            ))}
          </ul>
          <h3 className="orgs-title reveal">{t.certificates}</h3>
          <ul className="org-list">
            {CERTIFICATES.map((cert) => (
              <li className="org reveal" key={cert.id}>
                <div className="org-head">
                  <strong>{cert.name}</strong>
                  <span>{cert.issuer}</span>
                  <span className="role-when">{cert.year}</span>
                </div>
                <p>{cert.note[lang]}</p>
                <a className="cert-link" href={cert.file} target="_blank" rel="noopener noreferrer">
                  {t.viewCertificate}
                  <span className="sr-only">: {cert.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
