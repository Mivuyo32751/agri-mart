"use client";

import { FormEvent, useEffect, useState } from "react";
import "./admin.css";

type AdminSnapshot = {
  users: Array<{ id: string; role: string; name: string; email: string; createdAt: string; active?: boolean }>;
  listings: Array<{ id: number; farmerId: string; farmerName: string; name: string; field: string; advertised: boolean }>;
  subscriptions: Array<{ id: string; enterpriseId: string; tier: string; status: string; updatedAt: string }>;
  enquiries: Array<{ id: string; enterpriseId: string; farmerId: string; crop: string; message: string; status: string; createdAt: string }>;
  listingReports: Array<{ id: string; enterpriseName: string; farmerName: string; cropId: number; reason: string; status: string; createdAt: string }>;
};

export default function AdminPage() {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadSnapshot() {
    const response = await fetch("/api/admin", { cache: "no-store" });
    if (!response.ok) { setSnapshot(null); return; }
    setSnapshot(await response.json() as AdminSnapshot);
  }

  useEffect(() => { void loadSnapshot(); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, role: "admin" }) });
    const result = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) { setError(result.error ?? "Administrator sign-in failed."); return; }
    await loadSnapshot();
  }

  async function adminAction(payload: Record<string, unknown>) {
    setBusy(true); setError("");
    const response = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) { setError(result.error ?? "That update could not be saved."); return; }
    await loadSnapshot();
  }

  async function signOut() { await fetch("/api/auth/logout", { method: "POST" }); setSnapshot(null); }

  if (!snapshot) return <main className="admin-shell"><form className="admin-login" onSubmit={login}><span className="admin-eyebrow">AGRI-MART ADMIN</span><h1>Administrator sign in</h1><p>Access requires the server credentials configured in your environment.</p><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="admin-error" role="alert">{error}</p>}<button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form></main>;

  return <main className="admin-shell"><header className="admin-header"><div><span className="admin-eyebrow">AGRI-MART ADMIN</span><h1>Platform management</h1><p>Manage accounts, advertised crop listings, subscriptions, and enquiries.</p></div><button onClick={signOut}>Sign out</button></header>{error && <p className="admin-error" role="alert">{error}</p>}
    <section className="admin-section"><h2>Accounts <span>{snapshot.users.length}</span></h2><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{snapshot.users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.active === false ? "Disabled" : "Active"}</td><td>{user.role !== "admin" && <button className="admin-action" disabled={busy} onClick={() => void adminAction({ type: "account", userId: user.id, active: user.active === false })}>{user.active === false ? "Enable account" : "Disable account"}</button>}</td></tr>)}</tbody></table></div></section>
    <section className="admin-section"><h2>Crop listings <span>{snapshot.listings.length}</span></h2>{snapshot.listings.length ? <div className="admin-table-wrap"><table><thead><tr><th>Farmer</th><th>Crop</th><th>Field</th><th>Listing</th><th>Action</th></tr></thead><tbody>{snapshot.listings.map((listing) => <tr key={`${listing.farmerId}-${listing.id}`}><td>{listing.farmerName}</td><td>{listing.name}</td><td>{listing.field}</td><td>{listing.advertised ? "Advertised" : "Hidden"}</td><td><button className="admin-action" disabled={busy} onClick={() => void adminAction({ type: "listing", farmerId: listing.farmerId, cropId: listing.id, advertised: !listing.advertised })}>{listing.advertised ? "Hide listing" : "Publish listing"}</button></td></tr>)}</tbody></table></div> : <p className="admin-empty">No farmer crop listings yet.</p>}</section>
    <section className="admin-section"><h2>Enterprise subscriptions <span>{snapshot.subscriptions.length}</span></h2>{snapshot.subscriptions.length ? <div className="admin-table-wrap"><table><thead><tr><th>Enterprise account</th><th>Tier</th><th>Status</th><th>Action</th></tr></thead><tbody>{snapshot.subscriptions.map((subscription) => <tr key={subscription.id}><td>{snapshot.users.find((user) => user.id === subscription.enterpriseId)?.email ?? subscription.enterpriseId}</td><td>{subscription.tier}</td><td>{subscription.status}</td><td><select value={subscription.status} disabled={busy} onChange={(event) => void adminAction({ type: "subscription", subscriptionId: subscription.id, status: event.target.value })}><option value="requested">Requested</option><option value="active">Active</option><option value="inactive">Inactive</option></select></td></tr>)}</tbody></table></div> : <p className="admin-empty">No subscription requests yet.</p>}</section>
    <section className="admin-section"><h2>Supplier enquiries <span>{snapshot.enquiries.length}</span></h2>{snapshot.enquiries.length ? <div className="admin-table-wrap"><table><thead><tr><th>Farmer ID</th><th>Enterprise</th><th>Crop</th><th>Message</th><th>Status</th></tr></thead><tbody>{snapshot.enquiries.map((enquiry) => <tr key={enquiry.id}><td>{snapshot.users.find((user) => user.id === enquiry.farmerId)?.name ?? "Example listing"}</td><td>{snapshot.users.find((user) => user.id === enquiry.enterpriseId)?.email ?? enquiry.enterpriseId}</td><td>{enquiry.crop}</td><td>{enquiry.message}</td><td>{enquiry.status === "reviewed" ? "Reviewed" : <button className="admin-action" onClick={() => void adminAction({ type: "enquiry", enquiryId: enquiry.id, status: "reviewed" })}>Mark reviewed</button>}</td></tr>)}</tbody></table></div> : <p className="admin-empty">No enquiries received yet.</p>}</section>
    <section className="admin-section"><h2>Listing reports <span>{snapshot.listingReports.length}</span></h2>{snapshot.listingReports.length ? <div className="admin-table-wrap"><table><thead><tr><th>Farmer</th><th>Enterprise reporter</th><th>Reason</th><th>Status</th></tr></thead><tbody>{snapshot.listingReports.map((report) => <tr key={report.id}><td>{report.farmerName}</td><td>{report.enterpriseName}</td><td>{report.reason}</td><td>{report.status === "reviewed" ? "Reviewed" : <button className="admin-action" onClick={() => void adminAction({ type: "report", reportId: report.id, status: "reviewed" })}>Mark reviewed</button>}</td></tr>)}</tbody></table></div> : <p className="admin-empty">No listing reports received.</p>}</section>
  </main>;
}
