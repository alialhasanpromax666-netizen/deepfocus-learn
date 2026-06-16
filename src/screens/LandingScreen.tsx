import { useLanding } from "@/i18n/landing";
import { LangToggle } from "@/components/LangToggle";
import { Reveal } from "@/components/Reveal";
import { AppPreview } from "@/components/AppPreview";

interface LandingScreenProps {
  onEnter: () => void;
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.8">
      <circle cx="60" cy="60" r="56"/>
      <circle cx="60" cy="60" r="38" opacity="0.2"/>
      <circle cx="60" cy="60" r="6" fill="currentColor"/>
    </svg>
  );
}

export function LandingScreen({ onEnter }: LandingScreenProps) {
  const c = useLanding();

  return (
    <div className="landing">
      {/* NAV */}
      <nav className="lnav">
        <div className="landing-inner lnav-row">
          <div className="brand">
            <BrandMark />
            <span>{c.footer.tagline.split("·")[0].trim()}</span>
          </div>
          <div className="lnav-links">
            <a className="hide-sm" href="#features">{c.nav.features}</a>
            <a className="hide-sm" href="#how">{c.nav.how}</a>
            <LangToggle />
            <button className="cta cta-sm" onClick={onEnter}>{c.nav.start}</button>
          </div>
        </div>
      </nav>

      <main className="landing-inner">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <span className="hero-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
              {c.hero.badge}
            </span>
            <h1>
              {c.hero.titleA}<br />
              <span className="accent">{c.hero.titleB}</span><br />
              {c.hero.titleC}
            </h1>
            <p className="hero-sub">{c.hero.sub}</p>
            <div className="hero-actions">
              <button className="cta" onClick={onEnter}>{c.hero.ctaPrimary}</button>
              <a className="cta cta-ghost" href="#how">{c.hero.ctaSecondary}</a>
            </div>
            <p className="hero-note">{c.hero.note}</p>
          </div>
          <div className="hero-art">
            <AppPreview />
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section" id="features">
          <Reveal>
            <div className="section-head" style={{ textAlign: "start", margin: "0 0 32px" }}>
              <h2>{c.problem.title}</h2>
              <p>{c.problem.sub}</p>
            </div>
          </Reveal>
          <div className="asym-grid">
            {c.problem.cards.map((card, i) => (
              <Reveal key={card.title} delay={i * 80}>
                <article className={`lcard${i === 0 ? " lcard-wide" : ""}`}>
                  <div className="ic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {i === 0 && <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
                      {i === 1 && <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                      {i === 2 && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                    </svg>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section className="section" id="how">
          <Reveal>
            <div className="section-head">
              <h2>{c.how.title}</h2>
              <p>{c.how.sub}</p>
            </div>
          </Reveal>
          <div className="steps">
            {c.how.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="step">
                  <div className="num">{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="section" id="features">
          <Reveal>
            <div className="section-head">
              <h2>{c.features.title}</h2>
              <p>{c.features.sub}</p>
            </div>
          </Reveal>
          <div className="feat-grid">
            {c.features.items.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 70}>
                <article className="lcard">
                  <div className="ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {i === 0 && <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></>}
                      {i === 1 && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                      {i === 2 && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>}
                      {i === 3 && <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                      {i === 4 && <><circle cx="12" cy="12" r="10"/><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>}
                      {i === 5 && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                    </svg>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* VALUE */}
        <section className="section">
          <Reveal>
            <div className="value">
              <div className="eq">
                {c.value.a}<span className="plus"> = </span>
                {c.value.b}<span className="plus"> + </span>
                {c.value.c}<span className="plus"> + </span>
                {c.value.d}<br />
                <span className="res">— {c.value.res}</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FINAL CTA */}
        <section className="final">
          <Reveal>
            <h2>{c.final.title}</h2>
            <p>{c.final.sub}</p>
            <button className="cta" onClick={onEnter} style={{ padding: "16px 36px", fontSize: "1.05rem" }}>
              {c.final.cta}
            </button>
          </Reveal>
        </section>
      </main>

      <footer className="landing-inner lfooter">
        <span>{c.footer.tagline}</span>
        <span>{c.footer.note}</span>
      </footer>
    </div>
  );
}
