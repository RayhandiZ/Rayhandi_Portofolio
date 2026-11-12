import { Arrow } from "@/components/arrow";
import { ProjectBrowser } from "@/components/project-browser";
import { GITHUB_URL } from "@/lib/site";

export function Work() {
  return (
    <section
      className="work section container"
      id="project"
      aria-labelledby="work-title"
    >
      <div className="section-top reveal">
        <p className="eyebrow">Selected work</p>
        <span className="small-label">Ide menjadi sesuatu yang nyata.</span>
      </div>
      <div className="section-heading">
        <h2 id="work-title">
          Dibangun dengan logika<span className="tuck">.</span>
          <br />
          <em>Dirancang dengan rasa.</em>
        </h2>
        <p className="reveal">
          Beberapa project yang mempertemukan pengembangan, data, dan desain.
        </p>
      </div>
      <ProjectBrowser />
      <div className="work-foot reveal">
        <span>Eksplorasi lainnya ada di GitHub.</span>
        <a
          className="text-link"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/RayhandiZ <Arrow glyph="↗" />
        </a>
      </div>
    </section>
  );
}
