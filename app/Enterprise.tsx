"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./enterprise.css";

type CropListing = {
  id?: number;
  name: string;
  variety: string;
  field: string;
  planted?: string;
  stage: string;
  progress: number;
  harvest: string;
  estimate: number;
  ready: number;
  quality?: string;
  cropType?: string;
  quantity?: number;
  quantityPlanted?: number;
  unit?: string;
  yieldPerUnit?: number;
  expectedYieldPerUnit?: number;
  unitYield?: string;
  daysToHarvest?: number;
  status?: "planted" | "growing" | "near_harvest";
  daysSincePlanting?: number;
  estimatedHarvestDays?: number;
  currentAvailableQty?: number;
  availabilityNotes?: string;
};

type EnquiryRecord = { supplierId: string; crop: string; quantity: string; message: string };
type SubscriptionState = { id: string; tier: string; status: "requested" | "active" | "inactive"; requestedAt: string; updatedAt: string };
type EnterpriseBusinessProfile = { name: string; email: string; businessName: string; location: string; phone: string; companySize: string };

type Supplier = {
  id: string;
  name: string;
  initials: string;
  location: string;
  district: string;
  province: string;
  type: string;
  lastUpdate: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  crops: CropListing[];
  isRegistered?: boolean;
};

const suppliers: Supplier[] = [
  {
    id: "khula-fields",
    name: "Khula Fields Cooperative",
    initials: "KF",
    location: "Makhanda",
    district: "Makana Municipality",
    province: "Eastern Cape",
    type: "Smallholder cooperative",
    lastUpdate: "Updated today",
    image: "https://images.squarespace-cdn.com/content/v1/621960e998414f0593aa9656/484c7f08-1e4a-466c-88c2-0bc8dea126bd/Screen%2BShot%2B2022-04-04%2Bat%2B2.31.14%2BPM.png",
    imageAlt: "Organized wholesale crates of fresh produce ready for buyers",
    imageLabel: "WHOLESALE PRODUCE · SOURCING",
    crops: [
      { name: "Maize", variety: "White maize · PAN 6Q-445B", field: "Field 03", stage: "Grain fill", progress: 76, harvest: "18–25 Nov 2026", estimate: 8.4, ready: 0 },
      { name: "Butternut", variety: "Waltham", field: "Field 01", stage: "Fruit development", progress: 54, harvest: "02–09 Dec 2026", estimate: 3.1, ready: 0 },
      { name: "Spinach", variety: "Fordhook Giant", field: "Tunnel 02", stage: "Harvesting", progress: 100, harvest: "Available now", estimate: 0.42, ready: 0.28 },
    ],
  },
  {
    id: "peddie-garden",
    name: "Peddie Garden Project",
    initials: "PG",
    location: "Peddie",
    district: "Ngqushwa Municipality",
    province: "Eastern Cape",
    type: "Community grower",
    lastUpdate: "Updated yesterday",
    image: "https://medias.reussir.fr/fruits-legumes/2024-10/_fel453_enquete_residusniv2grossiste-ctifl.jpg",
    imageAlt: "Produce buyers inspecting quality in a wholesale market",
    imageLabel: "QUALITY REVIEW · FRESH PRODUCE",
    crops: [
      { name: "Tomatoes", variety: "Roma · Open field", field: "Plot A", stage: "Fruit setting", progress: 68, harvest: "10–18 Nov 2026", estimate: 2.6, ready: 0 },
      { name: "Cabbage", variety: "Green Coronet", field: "Plot C", stage: "Head formation", progress: 81, harvest: "26 Nov–04 Dec 2026", estimate: 4.2, ready: 0 },
    ],
  },
  {
    id: "sunrise-produce",
    name: "Sunrise Produce Farm",
    initials: "SP",
    location: "Fort Beaufort",
    district: "Nkonkobe area",
    province: "Eastern Cape",
    type: "Family farm",
    lastUpdate: "Updated 2 days ago",
    image: "https://www.hortidaily.com/remote/https/agfstorage.blob.core.windows.net/misc/FP_com/2026/02/12/CourchesneLarose_distributioncenter_1200.jpg?preset=ContentFullSmall",
    imageAlt: "Pallets of produce organized for wholesale distribution",
    imageLabel: "DISTRIBUTION · MARKET SUPPLY",
    crops: [
      { name: "Potatoes", variety: "Mondial", field: "North field", stage: "Bulking", progress: 72, harvest: "05–15 Dec 2026", estimate: 6.8, ready: 0 },
      { name: "Carrots", variety: "Nantes", field: "Irrigated block", stage: "Root development", progress: 60, harvest: "20–30 Nov 2026", estimate: 1.9, ready: 0 },
    ],
  },
  {
    id: "salem-growers",
    name: "Salem Growers Network",
    initials: "SG",
    location: "Salem",
    district: "Makana Municipality",
    province: "Eastern Cape",
    type: "Smallholder network",
    lastUpdate: "Updated today",
    image: "https://www.sustainweb.org/image/image-gt-1106-23apr25.jpg",
    imageAlt: "Fresh produce crates in an organic wholesaler distribution warehouse",
    imageLabel: "SEASONAL SUPPLY · WHOLESALE",
    crops: [
      { name: "Butternut", variety: "Jill-Be-Little", field: "Block 2", stage: "Maturing", progress: 91, harvest: "29 Oct–06 Nov 2026", estimate: 1.7, ready: 0 },
      { name: "Spinach", variety: "Baby leaf mix", field: "Shade house", stage: "Harvesting", progress: 100, harvest: "Available now", estimate: 0.65, ready: 0.4 },
    ],
  },
];

function totalBy(supplier: Supplier, key: "estimate" | "ready") {
  return supplier.crops.reduce((sum, crop) => sum + crop[key], 0);
}

function EnquiryModal({ supplier, onClose, onSave }: { supplier: Supplier; onClose: () => void; onSave: (enquiry: EnquiryRecord) => Promise<string | null> }) {
  const [crop, setCrop] = useState(supplier.crops[0]?.name ?? "");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const message = await onSave({ supplierId: supplier.id, crop, quantity, message: notes });
    setSending(false);
    if (message) setError(message);
    else setSaved(true);
  }

  return <div className="modal-scrim enterprise-modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="enterprise-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
      <div className="enquiry-modal-heading"><div><span className="enterprise-overline">SOURCING ENQUIRY</span><h2 id="enquiry-title">Ask {supplier.name}</h2><p>{supplier.location}, {supplier.province}</p></div><button className="enquiry-close" onClick={onClose} aria-label="Close enquiry">×</button></div>
      {saved ? <div className="enquiry-success"><span>✓</span><h3>Enquiry sent</h3><p>Your enquiry is saved to your account. The supplier can review it from their Agri-Mart workspace.</p><button className="enquiry-submit" onClick={onClose}>Done</button></div> : <form className="enquiry-form" onSubmit={submit}>
        <div className="enquiry-form-row"><label>Crop<select value={crop} onChange={(event) => setCrop(event.target.value)}>{supplier.crops.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>Quantity needed (tonnes)<input type="number" min="0.1" step="0.1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label></div>
        <label>Message to supplier<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Timing, grade, packaging, or collection needs" rows={3} required /></label>
        {error && <p className="enquiry-local-note" role="alert">{error}</p>}
        <button className="enquiry-submit" type="submit" disabled={sending}>{sending ? "Sending…" : "Send supplier enquiry"} <span>→</span></button>
      </form>}
    </section>
  </div>;
}

function SubscriptionModal({ tier, onClose, onSave }: { tier: string; onClose: () => void; onSave: (tier: string) => Promise<string | null> }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const message = await onSave(tier);
    setSending(false);
    if (message) setError(message);
    else setSaved(true);
  }

  return <div className="modal-scrim enterprise-modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="enterprise-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="subscription-title">
      <div className="enquiry-modal-heading"><div><span className="enterprise-overline">ENTERPRISE MEMBERSHIP</span><h2 id="subscription-title">Request {tier} details</h2><p>{tier} · pricing shared by the Agri-Mart team</p></div><button className="enquiry-close" onClick={onClose} aria-label="Close subscription request">×</button></div>
      {saved ? <div className="enquiry-success"><span>✓</span><h3>Request submitted</h3><p>Your {tier} request is recorded. An administrator must activate it before subscriber-only analytics are available.</p><button className="enquiry-submit" onClick={onClose}>Done</button></div> : <form className="enquiry-form" onSubmit={submit}>
        <p className="enquiry-local-note">Request the {tier} tier for your signed-in business. Pricing and activation are handled by an administrator.</p>
        {error && <p className="enquiry-local-note" role="alert">{error}</p>}
        <button className="enquiry-submit" type="submit" disabled={sending}>{sending ? "Submitting…" : "Submit subscription request"} <span>→</span></button>
      </form>}
    </section>
  </div>;
}

function BusinessProfileModal({ profile, onClose, onSave }: { profile: EnterpriseBusinessProfile; onClose: () => void; onSave: (profile: EnterpriseBusinessProfile) => Promise<void> }) {
  const [form, setForm] = useState(profile);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try { await onSave(form); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save the profile."); setSaving(false); }
  }
  return <div className="modal-scrim enterprise-modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="enterprise-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="business-profile-title">
      <div className="enquiry-modal-heading"><div><span className="enterprise-overline">ACCOUNT SETTINGS</span><h2 id="business-profile-title">Business profile</h2><p>Manage the details attached to your enterprise account.</p></div><button className="enquiry-close" onClick={onClose} aria-label="Close business profile">×</button></div>
      <form className="enquiry-form" onSubmit={submit}>
        <label>Contact name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Business name<input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} required /></label>
        <label>Account email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>Business location<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
        <div className="enquiry-form-row"><label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>Company size<input value={form.companySize} onChange={(event) => setForm({ ...form, companySize: event.target.value })} placeholder="e.g. 10–50 staff" /></label></div>
        {error && <p className="enquiry-local-note" role="alert">{error}</p>}
        <button className="enquiry-submit" type="submit" disabled={saving}>{saving ? "Saving…" : "Save business profile"} <span>✓</span></button>
      </form>
    </section>
  </div>;
}

export default function Enterprise() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cropFilter, setCropFilter] = useState("All crops");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [availabilityFilter, setAvailabilityFilter] = useState("Any availability");
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [accountReady, setAccountReady] = useState(false);
  const [serverSuppliers, setServerSuppliers] = useState<Array<{ id: string; name: string; contactName: string; location: string; crops: CropListing[] }>>([]);
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [businessProfile, setBusinessProfile] = useState<EnterpriseBusinessProfile>({ name: "", email: "", businessName: "", location: "", phone: "", companySize: "" });
  const [showBusinessProfile, setShowBusinessProfile] = useState(false);
  const [myEnquiries, setMyEnquiries] = useState<Array<{ id: string; crop: string; quantity: string; message: string; status: string; createdAt: string; supplierName: string }>>([]);

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: number | undefined;
    async function loadWorkspace() {
      try {
        const sessionResponse = await fetch("/api/auth/me", { cache: "no-store" });
        if (!sessionResponse.ok) { router.replace("/login/enterprise"); return; }
        const session = await sessionResponse.json() as { user: { role: string; name: string; email: string; profile: Record<string, string> } };
        if (session.user.role !== "enterprise") { router.replace(session.user.role === "farmer" ? "/login/farmer" : "/login/enterprise"); return; }
        const [supplierResponse, subscriptionResponse, enquiryResponse] = await Promise.all([fetch("/api/suppliers", { cache: "no-store" }), fetch("/api/subscriptions", { cache: "no-store" }), fetch("/api/enquiries", { cache: "no-store" })]);
        const [supplierData, subscriptionData, enquiryData] = await Promise.all([supplierResponse.json(), subscriptionResponse.json(), enquiryResponse.json()]) as [{ suppliers: Array<{ id: string; name: string; contactName: string; location: string; crops: CropListing[] }> }, { subscription: SubscriptionState | null }, { enquiries: typeof myEnquiries }];
        if (cancelled) return;
        setServerSuppliers(supplierData.suppliers);
        setSubscription(subscriptionData.subscription);
        setMyEnquiries(enquiryData.enquiries);
        setBusinessProfile({ name: session.user.name, email: session.user.email, businessName: session.user.profile.businessName ?? "", location: session.user.profile.location ?? "", phone: session.user.profile.phone ?? "", companySize: session.user.profile.companySize ?? "" });
        setAccountReady(true);
        refreshTimer = window.setInterval(() => {
          void Promise.all([fetch("/api/suppliers", { cache: "no-store" }), fetch("/api/subscriptions", { cache: "no-store" }), fetch("/api/enquiries", { cache: "no-store" })]).then(async ([supplierResponse, subscriptionResponse, enquiryResponse]) => {
            if (!supplierResponse.ok || !subscriptionResponse.ok || !enquiryResponse.ok) return;
            const [supplierData, subscriptionData, enquiryData] = await Promise.all([supplierResponse.json(), subscriptionResponse.json(), enquiryResponse.json()]) as [{ suppliers: typeof serverSuppliers }, { subscription: SubscriptionState | null }, { enquiries: typeof myEnquiries }];
            if (!cancelled) { setServerSuppliers(supplierData.suppliers); setSubscription(subscriptionData.subscription); setMyEnquiries(enquiryData.enquiries); }
          }).catch(() => undefined);
        }, 15000);
      } catch {
        if (!cancelled) router.replace("/login/enterprise");
      }
    }
    void loadWorkspace();
    return () => { cancelled = true; if (refreshTimer !== undefined) window.clearInterval(refreshTimer); };
  }, [router]);

  const liveSuppliers = useMemo<Supplier[]>(() => serverSuppliers.map((supplier) => {
    const locationParts = supplier.location.split(",").map((part) => part.trim());
    const initials = supplier.contactName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return { id: supplier.id, name: supplier.name, initials, location: locationParts[0] || "Location not provided", district: locationParts[0] || "Farmer-reported location", province: locationParts[1] || "South Africa", type: "Registered farmer", lastUpdate: "Live · farmer account", image: "/farmer-field-garden.jpg", imageAlt: "Farmer-reported growing field", imageLabel: "FARMER ADVERTISED LISTING", crops: supplier.crops, isRegistered: true };
  }), [serverSuppliers]);
  const directorySuppliers = useMemo(() => [...liveSuppliers, ...suppliers], [liveSuppliers]);
  const availableCropOptions = ["All crops", ...Array.from(new Set(directorySuppliers.flatMap((supplier) => supplier.crops.map((crop) => crop.name))))].sort((a, b) => a === "All crops" ? -1 : a.localeCompare(b));
  const availableLocationOptions = ["All locations", ...Array.from(new Set(directorySuppliers.map((supplier) => supplier.location)))];

  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return directorySuppliers.filter((supplier) => {
      const hasSearchMatch = !normalizedQuery || [
        supplier.name,
        supplier.location,
        supplier.district,
        ...supplier.crops.flatMap((crop) => [crop.name, crop.variety]),
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const hasCrop = cropFilter === "All crops" || supplier.crops.some((crop) => crop.name === cropFilter);
      const hasLocation = locationFilter === "All locations" || supplier.location === locationFilter;
      const hasAvailability = availabilityFilter === "Any availability"
        || (availabilityFilter === "Sale-ready now" && supplier.crops.some((crop) => crop.ready > 0))
        || (availabilityFilter === "Growing" && supplier.crops.some((crop) => crop.ready === 0));
      return hasSearchMatch && hasCrop && hasLocation && hasAvailability;
    });
  }, [availabilityFilter, cropFilter, directorySuppliers, locationFilter, query]);

  const listingCount = directorySuppliers.reduce((sum, supplier) => sum + supplier.crops.length, 0);
  const availableNow = directorySuppliers.reduce((sum, supplier) => sum + totalBy(supplier, "ready"), 0);
  const expectedYield = directorySuppliers.reduce((sum, supplier) => sum + totalBy(supplier, "estimate"), 0);
  const hasInsightsAccess = subscription?.status === "active" && ["Insights", "Network"].includes(subscription.tier);

  function clearFilters() {
    setQuery("");
    setCropFilter("All crops");
    setLocationFilter("All locations");
    setAvailabilityFilter("Any availability");
  }

  async function saveEnquiry(enquiry: EnquiryRecord): Promise<string | null> {
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(enquiry) });
      const result = await response.json() as { error?: string; enquiry?: typeof myEnquiries[number] };
      if (!response.ok) return result.error ?? "The enquiry could not be sent.";
      if (result.enquiry) setMyEnquiries((current) => [result.enquiry!, ...current]);
      return null;
    } catch {
      return "The enquiry could not be sent. Check your connection and try again.";
    }
  }

  async function saveSubscriptionRequest(tier: string): Promise<string | null> {
    try {
      const response = await fetch("/api/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier }) });
      const result = await response.json() as { error?: string; subscription?: SubscriptionState };
      if (!response.ok) return result.error ?? "The request could not be submitted.";
      setSubscription(result.subscription ?? null);
      return null;
    } catch {
      return "The request could not be submitted. Check your connection and try again.";
    }
  }

  async function saveBusinessProfile(nextProfile: typeof businessProfile) {
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextProfile) });
    const result = await response.json() as { error?: string; user?: { name: string; email: string; profile: Record<string, string> } };
    if (!response.ok || !result.user) throw new Error(result.error ?? "Could not save the business profile.");
    setBusinessProfile(nextProfile);
    setShowBusinessProfile(false);
  }

  async function reportListing(supplier: Supplier) {
    if (!supplier.isRegistered || !supplier.crops[0]?.id) return;
    const reason = window.prompt(`Why are you reporting ${supplier.name}'s ${supplier.crops[0].name} listing?`);
    if (!reason?.trim()) return;
    const response = await fetch("/api/listing-reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ farmerId: supplier.id, cropId: supplier.crops[0].id, reason }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) window.alert(result.error ?? "The report could not be submitted.");
    else window.alert("Thanks. Your listing report was sent for administrator review.");
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login/enterprise");
  }

  function downloadReport() {
    if (!hasInsightsAccess) { setSubscriptionTier("Insights"); return; }
    const fields = ["Supplier", "Location", "Crop", "Field", "Stage", "Growth progress", "Expected harvest", "Estimated tonnes", "Sale-ready tonnes", "Quality"];
    const escapeCsv = (value: unknown) => { const safe = String(value ?? "").replace(/^[=+\-@]/, "'$&"); return `"${safe.replaceAll('"', '""')}"`; };
    const rows = directorySuppliers.flatMap((supplier) => supplier.crops.map((crop) => [supplier.name, `${supplier.location}, ${supplier.province}`, crop.name, crop.field, crop.stage, `${crop.progress}%`, crop.harvest, crop.estimate, crop.ready, crop.quality ?? "Not reported"]));
    const csv = [fields, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "agri-mart-supplier-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!accountReady) return <main className="enterprise-page"><div className="enterprise-loading">Loading your enterprise workspace…</div></main>;

  return (
    <main className="enterprise-page">
      <header className="enterprise-header">
        <button className="enterprise-back-button" onClick={() => router.push("/")} aria-label="Back to Agri-Mart home">← <span>Back</span></button>
        <Link className="enterprise-brand" href="/" aria-label="Agri-Mart home">
          <span className="enterprise-brand-mark">✳</span>
          <span><strong>Agri-Mart</strong><small>GROW TOGETHER</small></span>
        </Link>
        <nav className="enterprise-nav" aria-label="Enterprise navigation">
          <a href="#supplier-list">Browse suppliers</a>
          <a href="#enterprise-plans">Plans</a>
          <a href="#how-supply-works">How supply works</a>
        </nav>
        <div className="enterprise-header-actions">
          <span className="enterprise-mode"><i /> {subscription ? `${subscription.tier} · ${subscription.status}` : "No active subscription"}</span>
          <button className="enterprise-profile-button" onClick={() => setShowBusinessProfile(true)}>Business profile</button>
          <button className="enterprise-profile-button" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <section className="enterprise-hero">
        <div className="enterprise-hero-copy">
          <span className="enterprise-eyebrow"><i /> SUPPLIER DIRECTORY · SAMPLE NETWORK</span>
          <h1>Find the growers<br />behind your <em>next order.</em></h1>
          <p>Browse local suppliers by crop and location. See what is growing, when it may be ready, and what farmers have confirmed for sale.</p>
          <a className="enterprise-hero-button" href="#supplier-list">Browse suppliers <span>↓</span></a>
        </div>
        <aside className="enterprise-hero-card">
          <span className="hero-card-label">IN SEASON · EASTERN CAPE</span>
          <div className="hero-card-feature"><span className="hero-card-produce">✳</span><div><strong>Spinach</strong><small>Harvesting now · 2 growers</small></div></div>
          <div className="hero-card-number"><strong>{availableNow.toFixed(2)}</strong><span>tonnes<br />sale-ready</span></div>
          <div className="hero-card-rule" />
          <div className="hero-card-row"><span>Next forecast</span><strong>Butternut · Nov</strong></div>
          <p>Availability is reported by suppliers and may change.</p>
        </aside>
        <div className="enterprise-hero-bottom"><span>LOCAL GROWERS</span><span>Clearer sourcing, season by season <b>↗</b></span></div>
      </section>

      <section className="enterprise-plans" id="enterprise-plans">
        <div className="enterprise-plans-intro"><span className="enterprise-overline">BUILT FOR SOURCING TEAMS</span><h2>Choose how you work with the grower network.</h2><p>Start with supplier discovery, then request access to deeper availability and production insights for your buying team.</p></div>
        <div className="enterprise-plan-grid">
          <article className="enterprise-plan-card"><span className="enterprise-plan-label">TIER 1 · START HERE</span><h3>Essentials</h3><p className="enterprise-plan-price">Contact for pricing</p><ul><li>Browse advertised supplier profiles</li><li>Crop, location, and harvest filters</li><li>View farmer-reported availability</li></ul><button onClick={() => setSubscriptionTier("Essentials")}>Request this tier <span>→</span></button></article>
          <article className="enterprise-plan-card enterprise-plan-featured"><span className="enterprise-plan-label">TIER 2 · SOURCING TEAMS</span><h3>Insights</h3><p className="enterprise-plan-price">Contact for pricing</p><ul><li>Availability and quantity analysis</li><li>Supplier production update history</li><li>Harvest outlook for sourcing plans</li></ul><button onClick={() => setSubscriptionTier("Insights")}>Request this tier <span>→</span></button></article>
          <article className="enterprise-plan-card"><span className="enterprise-plan-label">TIER 3 · LARGE BUYERS</span><h3>Network</h3><p className="enterprise-plan-price">Contact for pricing</p><ul><li>Multi-region supplier discovery</li><li>Expanded crop and quality reporting</li><li>Tailored sourcing review with our team</li></ul><button onClick={() => setSubscriptionTier("Network")}>Request this tier <span>→</span></button></article>
        </div>
      </section>

      <section className="enterprise-overview" id="how-supply-works">
        <div className="enterprise-section-title">
          <div><span className="enterprise-overline">SUPPLY AT A GLANCE</span><h2>Know what’s growing<br />near your market.</h2></div>
          <p>Each listing connects a supplier with their growing location and crop records. Forecasts stay marked as estimates until the farmer confirms sale-ready stock.</p>
        </div>
        <div className="enterprise-stat-row">
          <article><span className="stat-label">SUPPLIER PROFILES</span><strong>{directorySuppliers.length.toString().padStart(2, "0")}</strong><small>{liveSuppliers.length ? `${liveSuppliers.length} registered farmer accounts` : "Example network available"}</small></article>
          <article><span className="stat-label">CROP LISTINGS</span><strong>{listingCount.toString().padStart(2, "0")}</strong><small>Growing and harvesting</small></article>
          <article><span className="stat-label">FARMER FORECAST</span><strong>{expectedYield.toFixed(1)} <i>t</i></strong><small>Estimated yield in records</small></article>
          <article className="stat-sale-ready"><span className="stat-label">SALE-READY NOW</span><strong>{availableNow.toFixed(2)} <i>t</i></strong><small>Supplier-confirmed sample stock</small></article>
        </div>
      </section>

      <section className="supplier-section" id="supplier-list">
        <div className="supplier-heading">
          <div><span className="enterprise-overline">GROWER NETWORK</span><h2>Browse suppliers</h2><p>Search crop records or narrow the list by location and availability.</p></div>
          <div className="sample-notice"><span>i</span><p><strong>{liveSuppliers.length ? "Registered + example suppliers" : "Example supplier records"}</strong><br />{liveSuppliers.length ? "Farmer-advertised crop records from registered accounts are shown alongside clearly identified examples." : "Example listings are labelled; registered farmers will appear here when they advertise crops."}</p></div>
        </div>

        <div className="supplier-filters">
          <label className="supplier-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search supplier, crop, or place" aria-label="Search supplier, crop, or place" /></label>
          <label className="filter-select-wrap"><span>Crop</span><select value={cropFilter} onChange={(event) => setCropFilter(event.target.value)} aria-label="Filter by crop">{availableCropOptions.map((crop) => <option key={crop}>{crop}</option>)}</select></label>
          <label className="filter-select-wrap"><span>Location</span><select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} aria-label="Filter by location">{availableLocationOptions.map((location) => <option key={location}>{location}</option>)}</select></label>
          <label className="filter-select-wrap availability-filter"><span>Availability</span><select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} aria-label="Filter by availability"><option>Any availability</option><option>Sale-ready now</option><option>Growing</option></select></label>
        </div>

        <div className="supplier-result-line"><span><strong>{filteredSuppliers.length}</strong> {filteredSuppliers.length === 1 ? "supplier" : "suppliers"} found</span><div className="supplier-result-actions"><button onClick={downloadReport}>Download report <span>↓</span></button><button onClick={clearFilters}>Reset filters <span>↺</span></button></div></div>

        {filteredSuppliers.length > 0 ? (
          <div className="supplier-grid">
            {filteredSuppliers.map((supplier) => {
              const isExpanded = expandedSupplier === supplier.id;
              const ready = totalBy(supplier, "ready");
              const estimate = totalBy(supplier, "estimate");
              return (
                <article className={`supplier-card${isExpanded ? " supplier-card-expanded" : ""}`} key={supplier.id}>
                  <div className="supplier-cover" role="img" aria-label={supplier.imageAlt} style={{ backgroundImage: `linear-gradient(0deg, rgba(17, 37, 23, .68), rgba(17, 37, 23, 0) 72%), url("${supplier.image}")` }}>
                    <span>{supplier.imageLabel}</span>
                  </div>
                  <div className="supplier-card-top">
                    <span className="supplier-avatar">{supplier.initials}</span>
                    <span className={`supplier-status${ready > 0 ? " status-ready" : ""}`}><i />{ready > 0 ? "Has sale-ready stock" : "Growing crops"}</span>
                    <button className="supplier-more" onClick={() => setExpandedSupplier(isExpanded ? null : supplier.id)} aria-label={`${isExpanded ? "Hide" : "View"} production for ${supplier.name}`}>{isExpanded ? "−" : "+"}</button>
                  </div>
                  <h3>{supplier.name}</h3>
                  <p className="supplier-type">{supplier.type}</p>
                  <a className="supplier-location" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${supplier.location}, ${supplier.province}, South Africa`)}`} target="_blank" rel="noreferrer"><span>⌖</span><div><strong>{supplier.location}, {supplier.province}</strong><small>{supplier.district}</small></div><span className="location-arrow">↗</span></a>
                  <div className="supplier-crops-label">PRODUCING <span>{supplier.crops.length} crops</span></div>
                  <div className="supplier-crop-tags">{supplier.crops.map((crop) => <span key={`${supplier.id}-${crop.name}`}>{crop.name}</span>)}</div>
                  <div className="supplier-summary">
                    <div><span>Forecast</span><strong>{estimate.toFixed(1)} t</strong></div>
                    <div><span>Sale-ready</span><strong className={ready > 0 ? "ready-quantity" : ""}>{ready.toFixed(2)} t</strong></div>
                  </div>
                  <div className="supplier-card-footer"><span>{supplier.lastUpdate}</span><button onClick={() => setExpandedSupplier(isExpanded ? null : supplier.id)}>{isExpanded ? "Hide production" : "View production"} <span>{isExpanded ? "↑" : "→"}</span></button></div>
                  {supplier.isRegistered ? <button className="supplier-enquiry-trigger" onClick={() => setSelectedSupplier(supplier)}>Ask about supply <span>↗</span></button> : <p className="sample-enquiry-note">Example listing · enquiries are available on registered farmer listings.</p>}
                  {supplier.isRegistered && <button className="supplier-report-link" onClick={() => void reportListing(supplier)}>Report listing</button>}

                  {isExpanded && (hasInsightsAccess ? <div className="supplier-production">
                    <div className="production-heading"><span className="enterprise-overline">CROP PRODUCTION</span><span>{supplier.location}</span></div>
                    {supplier.crops.map((crop) => <div className="production-row" key={`${supplier.id}-${crop.field}-${crop.name}`}>
                      <div className="production-row-title"><div><strong>{crop.name}</strong><small>{crop.variety} · {crop.field}</small></div><span className={`production-stage${crop.ready > 0 ? " production-stage-ready" : ""}`}>{crop.ready > 0 ? "Ready now" : crop.stage}</span></div>
                      <div className="production-progress"><i style={{ width: `${crop.progress}%` }} /></div>
                      <div className="production-meta"><span>{crop.progress}% growth</span><span>{crop.ready > 0 ? `${crop.ready.toFixed(2)} t confirmed` : `${crop.estimate.toFixed(1)} t estimated`}</span></div>
                      <div className="production-harvest"><span>Planted</span><strong>{crop.planted ?? "Not recorded"}</strong></div>
                      <div className="production-harvest"><span>Expected harvest</span><strong>{crop.harvest}</strong></div>
                      <div className="production-harvest"><span>Quality / grade</span><strong>{crop.quality ?? (crop.ready > 0 ? "Not reported" : "Pending harvest")}</strong></div>
                      <div className="production-indicators"><div><span>Crop type · planted</span><strong>{crop.cropType ?? "Not reported"} · {crop.quantityPlanted ?? crop.quantity ?? "—"} {crop.unit ?? ""}</strong></div><div><span>Expected yield rate</span><strong>{crop.expectedYieldPerUnit != null || crop.yieldPerUnit != null ? `${(crop.expectedYieldPerUnit ?? crop.yieldPerUnit)!.toLocaleString()} ${crop.unitYield ?? "kg/ha"}` : "Not reported"}</strong></div><div><span>Production status</span><strong>{(crop.status ?? (crop.ready > 0 ? "near_harvest" : "growing")).replace("_", " ")}</strong></div><div><span>Growing cycle</span><strong>{crop.daysSincePlanting ?? "—"} / {crop.estimatedHarvestDays ?? crop.daysToHarvest ?? "—"} days</strong></div></div>
                      {crop.availabilityNotes && <p className="production-availability-note">Availability note: {crop.availabilityNotes}</p>}
                    </div>)}
                  </div> : <div className="production-locked"><strong>Production analytics are subscriber-only</strong><p>Insights or Network access unlocks growth progress, planting dates, quality details, and harvest reporting.</p><a href="#enterprise-plans">View enterprise tiers →</a></div>)}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="supplier-empty"><span>⌕</span><h3>No suppliers match those filters.</h3><p>Try a different crop, location, or search term.</p><button onClick={clearFilters}>Clear filters</button></div>
        )}
      </section>

      <section className="enterprise-overview enterprise-enquiries-section" id="my-enquiries"><div className="enterprise-section-title"><div><span className="enterprise-overline">ACCOUNT ACTIVITY</span><h2>Your supplier enquiries</h2></div><p>Track enquiries sent from this enterprise account.</p></div>{myEnquiries.length ? <div className="enterprise-enquiry-list">{myEnquiries.map((enquiry) => <article key={enquiry.id}><div><strong>{enquiry.supplierName}</strong><small>{enquiry.crop}{enquiry.quantity ? ` · ${enquiry.quantity} t requested` : ""}</small><p>{enquiry.message}</p></div><span className="enterprise-enquiry-status">{enquiry.status}</span></article>)}</div> : <p className="enterprise-no-enquiries">No enquiries sent yet. Contact a registered supplier to start a sourcing conversation.</p>}</section>
      <section className="enterprise-bottom-cta"><span className="bottom-cta-mark">✳</span><div><span className="enterprise-overline">FROM FIELD TO MARKET</span><h2>Find the supply you need.</h2><p>Review each listing’s location and production record before planning your next order.</p></div><a href="#supplier-list">Browse the network <span>↑</span></a></section>
      <footer className="enterprise-footer"><Link href="/" className="enterprise-brand"><span className="enterprise-brand-mark">✳</span><span><strong>Agri-Mart</strong><small>GROW TOGETHER</small></span></Link><span>Supplier visibility for a stronger food network.</span></footer>
      {selectedSupplier && <EnquiryModal supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} onSave={saveEnquiry} />}
      {subscriptionTier && <SubscriptionModal tier={subscriptionTier} onClose={() => setSubscriptionTier(null)} onSave={saveSubscriptionRequest} />}
      {showBusinessProfile && <BusinessProfileModal profile={businessProfile} onClose={() => setShowBusinessProfile(false)} onSave={saveBusinessProfile} />}
    </main>
  );
}
