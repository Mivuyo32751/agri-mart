import Link from "next/link";
import type { ReactNode } from "react";

type MarketingPageProps = {
  kind: "how" | "farmer" | "enterprise";
};

const content = {
  how: {
    label: "HOW AGRI-MART WORKS",
    title: <>From field updates<br />to clearer <em>supply.</em></>,
    description: "Agri-Mart helps farmers keep production records current and gives enterprise buyers a clearer view of what may be available and when.",
    primary: "Open farmer workspace",
    href: "/login/farmer",
    steps: [
      ["01", "Farmers record what is growing", "Add crops, planting dates, field details, and estimated quantities to build a useful production record."],
      ["02", "Progress is updated through the season", "Farmers record growth stages, yield changes, expected harvest timing, and sale-ready stock as things change."],
      ["03", "Buyers discover advertised supply", "Enterprise users search suppliers by produce and location, review shared crop information, and contact farmers."],
    ],
  },
  farmer: {
    label: "FOR FARMERS",
    title: <>Your growing season,<br />clear from <em>planting to sale.</em></>,
    description: "Keep crop and harvest information together, then share the updates that help buyers plan around your production.",
    primary: "Sign in to farmer workspace",
    href: "/login/farmer",
    steps: [
      ["01", "Create crop records", "Record crop type, field, planting date, production details, and expected harvest date."],
      ["02", "Track growth and yield", "Update growth stage and yield estimates as crops develop, keeping your harvest outlook useful."],
      ["03", "Confirm what is available", "When produce is ready, update the sale quantity and quality details buyers are allowed to see."],
    ],
  },
  enterprise: {
    label: "FOR ENTERPRISES",
    title: <>Find local supply<br />with a more <em>useful view.</em></>,
    description: "Explore advertised suppliers, see where they are based, and compare crop outlooks with confirmed sale-ready quantities.",
    primary: "Sign in to enterprise sourcing",
    href: "/login/enterprise",
    steps: [
      ["01", "Search suppliers and produce", "Filter advertised listings by crop, location, and availability to find relevant growers."],
      ["02", "Review shared production details", "See farmer-reported growth stages, estimated yields, expected harvest windows, and sale-ready amounts when access permits."],
      ["03", "Contact suppliers and plan", "Send an enquiry to a farmer and use the information shared to plan sourcing with clearer expectations."],
    ],
  },
} satisfies Record<MarketingPageProps["kind"], {
  label: string;
  title: ReactNode;
  description: string;
  primary: string;
  href: string;
  steps: string[][];
}>;

export default function MarketingPage({ kind }: MarketingPageProps) {
  const page = content[kind];
  return (
    <main className="marketing-detail">
      <header className="marketing-header">
        <Link className="marketing-back" href="/">← <span>Back</span></Link>
        <Link className="marketing-brand" href="/" aria-label="Agri-Mart home"><span>✳</span><b>Agri-Mart</b></Link>
        <nav aria-label="Main navigation">
          <div className="marketing-nav-group">
            <span className="marketing-nav-heading">How it works</span>
            <div className="marketing-nav-subitems">
              <Link href="/for-farmers">For farmers</Link>
              <Link href="/for-enterprises">For enterprises</Link>
            </div>
          </div>
        </nav>
        <Link className="marketing-signin" href="/login">Sign in <span>↗</span></Link>
      </header>

      <section className={`marketing-hero marketing-hero-${kind}`}>
        <span className="marketing-eyebrow"><i />{page.label}</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <div className="marketing-actions">
          <Link className="marketing-primary" href={page.href}>{page.primary} <span>↗</span></Link>
          {kind === "farmer" && <Link className="marketing-secondary" href="/#how-it-works">See how Agri-Mart works</Link>}
        </div>
        <div className="marketing-hero-note"><span>✳</span> Farmer-reported updates. Clearer conversations. Better planning.</div>
      </section>

      <section className="marketing-steps">
        <div className="marketing-section-heading">
          <span className="marketing-overline">A SIMPLE WORKFLOW</span>
          <h2>{kind === "farmer" ? "A practical record for every crop." : kind === "enterprise" ? "A clearer route from search to supply." : "A shared view, built one update at a time."}</h2>
          <p>Information is shared according to each user’s access and the details farmers choose to advertise.</p>
        </div>
        <div className="marketing-step-grid">
          {page.steps.map(([number, title, description]) => (
            <article className="marketing-step-card" key={number}>
              <span className="marketing-step-number">{number}</span>
              <span className="marketing-step-icon">{number === "01" ? "✳" : number === "02" ? "◷" : "↗"}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="marketing-footer"><span>Connecting growers and buyers, one harvest at a time.</span></footer>
    </main>
  );
}
