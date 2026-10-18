import Link from "next/link";
import "./landing.css";

const fieldImage =
  "https://images.unsplash.com/photo-1679026219018-d4adf3f3dfbd?auto=format&fit=crop&w=2000&q=88";

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero" style={{ "--hero-image": `url("${fieldImage}")` } as React.CSSProperties}>
        <div className="hero-shade" />
        <header className="landing-header">
          <Link className="landing-brand" href="/" aria-label="Agri-Mart home">
            <span className="landing-brand-icon">✳</span>
            <span><strong>Agri-Mart</strong><small>GROW TOGETHER</small></span>
          </Link>
          <nav className="landing-nav" aria-label="Main navigation">
            <div className="landing-nav-group">
              <span className="landing-nav-heading">How it works</span>
              <div className="landing-nav-subitems">
                <Link href="/for-farmers">For farmers</Link>
                <Link href="/for-enterprises">For enterprises</Link>
              </div>
            </div>
          </nav>
          <Link className="landing-sign-in" href="/login">Sign in</Link>
        </header>

        <div className="landing-hero-content">
          <div className="hero-message">
            <span className="landing-kicker"><i /> A more connected food system</span>
            <div className="landing-role-choices" aria-label="Choose your Agri-Mart workspace">
              <Link className="landing-role-choice" href="/login/farmer">Farmer <span>↗</span></Link>
              <Link className="landing-role-choice enterprise-choice" href="/login/enterprise">Enterprise <span>↗</span></Link>
            </div>
            <h1>Growing together.<br /><em>Feeding tomorrow.</em></h1>
            <p>Small farms grow stronger when the right people can see what’s growing. Agri-Mart connects farmer crop records with enterprise supply planning.</p>
            <div className="hero-actions">
              <Link className="landing-button landing-button-bright" href="#choose-path">Explore Agri-Mart <span>↗</span></Link>
              <a className="landing-button landing-button-glass" href="#how-it-works">See how it works <span>↓</span></a>
            </div>
            <div className="hero-assurance"><span className="assurance-leaf">✳</span><span>Built around the people who grow and source our food</span></div>
          </div>

          <aside className="hero-preview" aria-label="Example crop supply preview">
            <div className="preview-top"><span className="preview-icon">⌁</span><span className="preview-label">SUPPLY OUTLOOK <i /></span><span className="preview-menu">···</span></div>
            <div className="preview-region"><span>Eastern Cape · Sample view</span><span className="preview-period">THIS SEASON</span></div>
            <h2>Growing supply,<br />visible earlier.</h2>
            <div className="preview-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><span className="chart-glow" /></div>
            <div className="preview-months"><span>OCT</span><span>NOV</span><span>DEC</span><span>JAN</span><span>FEB</span><span>MAR</span></div>
            <div className="preview-divider" />
            <div className="preview-bottom"><span><i className="preview-dot forecast-dot" /> Farmer forecast</span><span><i className="preview-dot ready-dot" /> Sale-ready</span><strong>Live crop records <b>↗</b></strong></div>
            <p className="preview-note">Sample data · Forecasts are farmer reported</p>
          </aside>
        </div>

        <div className="hero-bottomline"><span>FROM FIELD TO MARKET</span><span>Growing opportunity across every season <b>↓</b></span></div>
      </section>

      <section className="landing-intro" id="choose-path">
        <div className="section-heading">
          <span className="section-eyebrow"><i>✳</i> ONE PLATFORM, TWO PATHS</span>
          <h2>Made for the people<br /><em>behind every harvest.</em></h2>
          <p>Whether you grow the crop or source it, start with a view built around your work.</p>
        </div>

        <div className="role-card-grid">
          <article className="role-card farmer-role" id="farmer-path">
            <div className="role-card-image role-image-farmer" style={{ backgroundImage: `url("${fieldImage}")` }} />
            <div className="role-card-overlay" />
            <div className="role-card-content">
              <span className="role-number">01 / FARMER WORKSPACE</span>
              <span className="role-icon">✳</span>
              <h3>Make every<br />growing season count.</h3>
              <p>Track crop progress, expected harvest dates, yield estimates, and the quantity ready to sell—all in one place.</p>
            </div>
          </article>

          <article className="role-card enterprise-role" id="enterprise-path">
            <div className="role-card-image role-image-enterprise" />
            <div className="enterprise-art-lines" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="role-card-content enterprise-content">
              <span className="role-number">02 / ENTERPRISE SOURCING</span>
              <span className="role-icon dark-role-icon">◈</span>
              <h3>Plan supply<br />with a clearer view.</h3>
              <p>Explore advertised suppliers, upcoming crops, reported quantities, expected harvest windows, and sale-ready stock.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="how-copy">
          <span className="section-eyebrow"><i>✳</i> FROM FIELD TO MARKET</span>
          <h2>A stronger link<br />at every stage.</h2>
          <p>Agri-Mart gives farmers a simple way to keep crop records current, while helping buyers plan around supply that is still growing.</p>
          <Link href="/login/farmer" className="how-link">Start with your farm <span>↗</span></Link>
        </div>
        <div className="how-steps">
          <article className="how-step"><span className="step-index">01</span><div><h3>Farmers record what’s growing</h3><p>Add fields and crops, then share progress, expected harvest times, and yield estimates.</p></div><span className="step-symbol">↗</span></article>
          <article className="how-step"><span className="step-index">02</span><div><h3>Supply becomes easier to see</h3><p>Enterprises can discover advertised suppliers and review farmer-reported crop availability.</p></div><span className="step-symbol">◈</span></article>
          <article className="how-step"><span className="step-index">03</span><div><h3>Harvest readiness gets confirmed</h3><p>As crops are harvested, farmers update sale-ready quantities and quality details.</p></div><span className="step-symbol">✳</span></article>
        </div>
      </section>

      <footer className="landing-footer"><Link className="landing-brand footer-brand" href="/"><span className="landing-brand-icon">✳</span><span><strong>Agri-Mart</strong><small>GROW TOGETHER</small></span></Link><span>Connecting growers and buyers, one harvest at a time.</span><span>© 2026 Agri-Mart</span></footer>
    </main>
  );
}
